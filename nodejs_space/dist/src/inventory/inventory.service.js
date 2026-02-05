"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var InventoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InventoryService = InventoryService_1 = class InventoryService {
    prisma;
    logger = new common_1.Logger(InventoryService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async getInventory(playerId) {
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
            totalWeight: inventory.length * 10,
            maxWeight: 500,
        };
    }
    async addItem(playerId, dto) {
        const item = await this.prisma.item.findUnique({
            where: { id: dto.itemId },
        });
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        const existingItem = await this.prisma.playerinventory.findFirst({
            where: {
                playerid: playerId,
                itemid: dto.itemId,
            },
        });
        if (existingItem) {
            await this.prisma.playerinventory.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + dto.quantity,
                },
            });
        }
        else {
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
    async removeItem(playerId, dto) {
        const inventoryItem = await this.prisma.playerinventory.findFirst({
            where: {
                playerid: playerId,
                itemid: dto.itemId,
            },
        });
        if (!inventoryItem) {
            throw new common_1.NotFoundException('Item not found in inventory');
        }
        if (inventoryItem.quantity < dto.quantity) {
            throw new common_1.BadRequestException(`Not enough items (have: ${inventoryItem.quantity}, requested: ${dto.quantity})`);
        }
        if (inventoryItem.quantity === dto.quantity) {
            await this.prisma.playerinventory.delete({
                where: { id: inventoryItem.id },
            });
        }
        else {
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
    async equipItem(playerId, dto) {
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
            throw new common_1.NotFoundException('Item not found in inventory');
        }
        const validSlots = {
            weapon: ['weapon'],
            armor: ['armor'],
            accessory: ['accessory'],
        };
        if (!validSlots[dto.slot]?.includes(inventoryItem.item.type)) {
            throw new common_1.BadRequestException(`Cannot equip ${inventoryItem.item.type} in ${dto.slot} slot`);
        }
        if (dto.action === 'equip') {
            await this.prisma.playerinventory.updateMany({
                where: {
                    playerid: playerId,
                    equippedslot: dto.slot,
                },
                data: {
                    equippedslot: null,
                },
            });
            await this.prisma.playerinventory.update({
                where: { id: inventoryItem.id },
                data: {
                    equippedslot: dto.slot,
                },
            });
            this.logger.log(`Player ${playerId} equipped ${inventoryItem.item.name} in ${dto.slot} slot`);
        }
        else if (dto.action === 'unequip') {
            if (inventoryItem.equippedslot !== dto.slot) {
                throw new common_1.BadRequestException('Item not equipped in this slot');
            }
            await this.prisma.playerinventory.update({
                where: { id: inventoryItem.id },
                data: {
                    equippedslot: null,
                },
            });
            this.logger.log(`Player ${playerId} unequipped ${inventoryItem.item.name} from ${dto.slot} slot`);
        }
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
    calculateStatsBonus(equipped) {
        const bonus = {
            attackPower: 0,
            defense: 0,
            health: 0,
            stamina: 0,
            critChance: 0,
            evasion: 0,
        };
        for (const inv of equipped) {
            const stats = inv.item.stats;
            if (stats.attackPower)
                bonus.attackPower += stats.attackPower;
            if (stats.defense)
                bonus.defense += stats.defense;
            if (stats.health)
                bonus.health += stats.health;
            if (stats.stamina)
                bonus.stamina += stats.stamina;
            if (stats.critChance)
                bonus.critChance += stats.critChance;
            if (stats.evasion)
                bonus.evasion += stats.evasion;
        }
        return bonus;
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = InventoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map