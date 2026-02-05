import { PrismaService } from '../prisma/prisma.service';
import { StartQuestDto, UpdateQuestProgressDto, CompleteQuestDto } from './dto/quests.dto';
export declare class QuestsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getAllQuests(): Promise<{
        quests: {
            id: string;
            name: string;
            description: string;
            type: string;
            objectives: import("@prisma/client/runtime/library").JsonValue;
            rewards: import("@prisma/client/runtime/library").JsonValue;
            requiredLevel: number;
            area: string;
        }[];
    }>;
    getPlayerQuests(playerId: string, status?: string): Promise<{
        quests: {
            questId: string;
            quest: {
                id: string;
                name: string;
                description: string;
                type: string;
                objectives: import("@prisma/client/runtime/library").JsonValue;
                rewards: import("@prisma/client/runtime/library").JsonValue;
                area: string;
            };
            status: string;
            progress: import("@prisma/client/runtime/library").JsonValue;
            startedAt: Date;
            completedAt: Date | null;
        }[];
    }>;
    startQuest(playerId: string, dto: StartQuestDto): Promise<{
        success: boolean;
        quest: {
            id: string;
            name: string;
            objectives: import("@prisma/client/runtime/library").JsonValue;
            progress: import("@prisma/client/runtime/library").JsonValue;
        };
    }>;
    updateProgress(playerId: string, dto: UpdateQuestProgressDto): Promise<{
        success: boolean;
        quest: {
            id: string;
            name: string;
            progress: import("@prisma/client/runtime/library").JsonValue;
        };
        completed: boolean;
    }>;
    completeQuest(playerId: string, dto: CompleteQuestDto): Promise<{
        success: boolean;
        rewards: {
            xp: any;
            items: any;
            gold: any;
            skillPoints: any;
        };
        newStats: {
            level: number;
            xp: number;
            skillpoints: number;
        };
    }>;
    private checkQuestCompletion;
    private calculateXpToNextLevel;
}
