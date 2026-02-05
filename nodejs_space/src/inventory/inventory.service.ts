import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddItemDto, RemoveItemDto, EquipItemDto } from './dto/inventory.dto';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(private prisma: PrismaService) {}

  async getAllItems() {
    const items = await this.prisma.item.findMany({
      orderBy: [
        { rarity: 'asc' },
        { type: 'asc' },
      ],
    });

    return {
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        rarity: item.rarity,
        stats: item.stats,
        description: item.description,
        iconUrl: item.iconurl,
      })),
    };
  }

  async getInventory(playerId: string) {
    const inventory = await this.prisma.playerinventory.findMany({
      where: { playerid: playerId },
      include: {
        item: true,
      },
    });

    return {
      inventory: inventory.map(inv => ({
        itemId: inv.itemid,
        item: {
          id: inv.item.id,
          name: inv.item.name,
          type: inv.item.type,
          rarity: inv.item.rarity,
          stats: inv.item.stats,
          description: inv.item.description,
          iconUrl: inv.item.iconurl,
        },
        quantity: inv.quantity,
        equippedSlot: inv.equippedslot,
      })),
      totalWeight: inventory.length * 10, // Simple weight calculation
      maxWeight: 500,
    };
  }

  async addItem(playerId: string, dto: AddItemDto) {
    // Check if item exists
    const item = await this.prisma.item.findUnique({
      where: { id: dto.itemId },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    // Check if player already has this item
    const existingItem = await this.prisma.playerinventory.findFirst({
      where: {
        playerid: playerId,
        itemid: dto.itemId,
      },
    });

    if (existingItem) {
      // Update quantity
      await this.prisma.playerinventory.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + dto.quantity,
        },
      });
    } else {
      // Create new inventory entry
      await this.prisma.playerinventory.create({
        data: {
          playerid: playerId,
          itemid: dto.itemId,
          quantity: dto.quantity,
        },
      });
    }

    this.logger.log(`Added ${dto.quantity}x ${item.name} to player ${playerId} inventory`);
    return this.getInventory(playerId);
  }

  async removeItem(playerId: string, dto: RemoveItemDto) {
    const inventoryItem = await this.prisma.playerinventory.findFirst({
      where: {
        playerid: playerId,
        itemid: dto.itemId,
      },
    });

    if (!inventoryItem) {
      throw new NotFoundException('Item not found in inventory');
    }

    if (inventoryItem.quantity < dto.quantity) {
      throw new BadRequestException(
        `Not enough items (have: ${inventoryItem.quantity}, requested: ${dto.quantity})`,
      );
    }

    if (inventoryItem.quantity === dto.quantity) {
      // Remove completely
      await this.prisma.playerinventory.delete({
        where: { id: inventoryItem.id },
      });
    } else {
      // Reduce quantity
      await this.prisma.playerinventory.update({
        where: { id: inventoryItem.id },
        data: {
          quantity: inventoryItem.quantity - dto.quantity,
        },
      });
    }

    this.logger.log(`Removed ${dto.quantity}x item ${dto.itemId} from player ${playerId} inventory`);
    return this.getInventory(playerId);
  }

  async equipItem(playerId: string, dto: EquipItemDto) {
    const inventoryItem = await this.prisma.playerinventory.findFirst({
      where: {
        playerid: playerId,
        itemid: dto.itemId,
      },
      include: {
        item: true,
      },
    });

    if (!inventoryItem) {
      throw new NotFoundException('Item not found in inventory');
    }

    // Validate item type matches slot
    const validSlots = {
      weapon: ['weapon'],
      armor: ['armor'],
      accessory: ['accessory'],
    };

    if (!validSlots[dto.slot as keyof typeof validSlots]?.includes(inventoryItem.item.type)) {
      throw new BadRequestException(
        `Cannot equip ${inventoryItem.item.type} in ${dto.slot} slot`,
      );
    }

    if (dto.action === 'equip') {
      // Unequip any item in the same slot
      await this.prisma.playerinventory.updateMany({
        where: {
          playerid: playerId,
          equippedslot: dto.slot,
        },
        data: {
          equippedslot: null,
        },
      });

      // Equip the item
      await this.prisma.playerinventory.update({
        where: { id: inventoryItem.id },
        data: {
          equippedslot: dto.slot,
        },
      });

      this.logger.log(`Player ${playerId} equipped ${inventoryItem.item.name} in ${dto.slot} slot`);
    } else if (dto.action === 'unequip') {
      if (inventoryItem.equippedslot !== dto.slot) {
        throw new BadRequestException('Item not equipped in this slot');
      }

      await this.prisma.playerinventory.update({
        where: { id: inventoryItem.id },
        data: {
          equippedslot: null,
        },
      });

      this.logger.log(`Player ${playerId} unequipped ${inventoryItem.item.name} from ${dto.slot} slot`);
    }

    // Calculate stats bonus from all equipped items
    const equipped = await this.prisma.playerinventory.findMany({
      where: {
        playerid: playerId,
        equippedslot: { not: null },
      },
      include: {
        item: true,
      },
    });

    const statsBonus = this.calculateStatsBonus(equipped);

    return {
      success: true,
      equipped: equipped.map(e => ({
        slot: e.equippedslot,
        item: e.item.name,
        stats: e.item.stats,
      })),
      statsBonus,
    };
  }

  private calculateStatsBonus(equipped: any[]): any {
    const bonus = {
      attackPower: 0,
      defense: 0,
      health: 0,
      stamina: 0,
      critChance: 0,
      evasion: 0,
    };

    for (const inv of equipped) {
      const stats = inv.item.stats as any;
      if (stats.attackPower) bonus.attackPower += stats.attackPower;
      if (stats.defense) bonus.defense += stats.defense;
      if (stats.health) bonus.health += stats.health;
      if (stats.stamina) bonus.stamina += stats.stamina;
      if (stats.critChance) bonus.critChance += stats.critChance;
      if (stats.evasion) bonus.evasion += stats.evasion;
    }

    return bonus;
  }
}