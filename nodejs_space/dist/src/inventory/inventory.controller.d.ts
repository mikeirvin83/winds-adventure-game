import { InventoryService } from './inventory.service';
import { AddItemDto, RemoveItemDto, EquipItemDto } from './dto/inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
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
    getInventory(req: any): Promise<{
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
    addItem(req: any, dto: AddItemDto): Promise<{
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
    removeItem(req: any, dto: RemoveItemDto): Promise<{
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
    equipItem(req: any, dto: EquipItemDto): Promise<{
        success: boolean;
        equipped: {
            slot: string | null;
            item: string;
            stats: import("@prisma/client/runtime/library").JsonValue;
        }[];
        statsBonus: any;
    }>;
}
