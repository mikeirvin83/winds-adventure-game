import { QuestsService } from './quests.service';
import { StartQuestDto, UpdateQuestProgressDto, CompleteQuestDto } from './dto/quests.dto';
export declare class QuestsController {
    private readonly questsService;
    constructor(questsService: QuestsService);
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
    getPlayerQuests(req: any, status?: string): Promise<{
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
    startQuest(req: any, dto: StartQuestDto): Promise<{
        success: boolean;
        quest: {
            id: string;
            name: string;
            objectives: import("@prisma/client/runtime/library").JsonValue;
            progress: import("@prisma/client/runtime/library").JsonValue;
        };
    }>;
    updateProgress(req: any, dto: UpdateQuestProgressDto): Promise<{
        success: boolean;
        quest: {
            id: string;
            name: string;
            progress: import("@prisma/client/runtime/library").JsonValue;
        };
        completed: boolean;
    }>;
    completeQuest(req: any, dto: CompleteQuestDto): Promise<{
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
}
