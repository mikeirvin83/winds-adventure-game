import { PrismaService } from '../prisma/prisma.service';
import { AddItemDto, RemoveItemDto, EquipItemDto } from './dto/inventory.dto';
export declare class InventoryService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getAllItems(): Promise<{
        items: {
            id: string;
            name: string;
            type: string;
            rarity: string;
            stats: import("@prisma/client/runtime/library").JsonValue;
            description: string;
            iconUrl: string;
        }[];
    }>;
    getInventory(playerId: string): Promise<{
        inventory: {
            itemId: string;
            item: {
                id: string;
                name: string;
                type: string;
                rarity: string;
                stats: import("@prisma/client/runtime/library").JsonValue;
                description: string;
                iconUrl: string;
            };
            quantity: number;
            equippedSlot: string | null;
        }[];
        totalWeight: number;
        maxWeight: number;
    }>;
    addItem(playerId: string, dto: AddItemDto): Promise<{
        inventory: {
            itemId: string;
            item: {
                id: string;
                name: string;
                type: string;
                rarity: string;
                stats: import("@prisma/client/runtime/library").JsonValue;
                description: string;
                iconUrl: string;
            };
            quantity: number;
            equippedSlot: string | null;
        }[];
        totalWeight: number;
        maxWeight: number;
    }>;
    removeItem(playerId: string, dto: RemoveItemDto): Promise<{
        inventory: {
            itemId: string;
            item: {
                id: string;
                name: string;
                type: string;
                rarity: string;
                stats: import("@prisma/client/runtime/library").JsonValue;
                description: string;
                iconUrl: string;
            };
            quantity: number;
            equippedSlot: string | null;
        }[];
        totalWeight: number;
        maxWeight: number;
    }>;
    equipItem(playerId: string, dto: EquipItemDto): Promise<{
        success: boolean;
        equipped: {
            slot: string | null;
            item: string;
            stats: import("@prisma/client/runtime/library").JsonValue;
        }[];
        statsBonus: any;
    }>;
    private calculateStatsBonus;
}
