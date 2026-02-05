import { PlayerService } from './player.service';
import { UpdateStatsDto, AddXpDto, LevelUpDto } from './dto/player.dto';
export declare class PlayerController {
    private readonly playerService;
    constructor(playerService: PlayerService);
    getProfile(req: any): Promise<{
        stats: {
            id: string;
            defense: number;
            health: number;
            stamina: number;
            xp: number;
            level: number;
            maxhealth: number;
            maxstamina: number;
            attackpower: number;
            skillpoints: number;
            playerid: string;
        } | null;
        skills: ({
            skill: {
                id: string;
                name: string;
                description: string;
                cost: number;
                requiredlevel: number;
                effects: import("@prisma/client/runtime/library").JsonValue;
                iconurl: string;
                category: string;
            };
        } & {
            id: string;
            playerid: string;
            skillid: string;
            unlockedat: Date;
        })[];
        inventory: ({
            item: {
                id: string;
                name: string;
                description: string;
                iconurl: string;
                type: string;
                rarity: string;
                stats: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            playerid: string;
            itemid: string;
            quantity: number;
            equippedslot: string | null;
        })[];
        quests: ({
            quest: {
                id: string;
                name: string;
                description: string;
                requiredlevel: number;
                type: string;
                objectives: import("@prisma/client/runtime/library").JsonValue;
                rewards: import("@prisma/client/runtime/library").JsonValue;
                area: string;
            };
        } & {
            id: string;
            progress: import("@prisma/client/runtime/library").JsonValue;
            playerid: string;
            questid: string;
            status: string;
            startedat: Date;
            completedat: Date | null;
        })[];
        progress: {
            id: string;
            currentarea: string;
            position: import("@prisma/client/runtime/library").JsonValue;
            checkpoints: import("@prisma/client/runtime/library").JsonValue;
            unlockedareas: import("@prisma/client/runtime/library").JsonValue;
            playtime: number;
            lastsaved: Date;
            playerid: string;
        } | null;
        id: string;
        username: string;
        email: string;
        createdat: Date;
        updatedat: Date;
    }>;
    getStats(req: any): Promise<{
        xpToNextLevel: number;
        id: string;
        defense: number;
        health: number;
        stamina: number;
        xp: number;
        level: number;
        maxhealth: number;
        maxstamina: number;
        attackpower: number;
        skillpoints: number;
        playerid: string;
    }>;
    updateStats(req: any, dto: UpdateStatsDto): Promise<{
        id: string;
        defense: number;
        health: number;
        stamina: number;
        xp: number;
        level: number;
        maxhealth: number;
        maxstamina: number;
        attackpower: number;
        skillpoints: number;
        playerid: string;
    }>;
    addXp(req: any, dto: AddXpDto): Promise<{
        leveledUp: boolean;
        newLevel: number;
        stats: {
            id: string;
            defense: number;
            health: number;
            stamina: number;
            xp: number;
            level: number;
            maxhealth: number;
            maxstamina: number;
            attackpower: number;
            skillpoints: number;
            playerid: string;
        };
    }>;
    levelUp(req: any, dto: LevelUpDto): Promise<{
        level: number;
        stats: {
            id: string;
            defense: number;
            health: number;
            stamina: number;
            xp: number;
            level: number;
            maxhealth: number;
            maxstamina: number;
            attackpower: number;
            skillpoints: number;
            playerid: string;
        };
        skillPoints: number;
    }>;
}
