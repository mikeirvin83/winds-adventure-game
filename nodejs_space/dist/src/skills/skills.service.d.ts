import { PrismaService } from '../prisma/prisma.service';
import { UnlockSkillDto } from './dto/skills.dto';
export declare class SkillsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getAllSkills(): Promise<{
        skills: {
            id: string;
            name: string;
            description: string;
            cost: number;
            requiredLevel: number;
            effects: import("@prisma/client/runtime/library").JsonValue;
            iconUrl: string;
            category: string;
        }[];
    }>;
    getPlayerSkills(playerId: string): Promise<{
        skills: {
            id: string;
            name: string;
            description: string;
            effects: import("@prisma/client/runtime/library").JsonValue;
            category: string;
            unlockedAt: Date;
        }[];
    }>;
    unlockSkill(playerId: string, dto: UnlockSkillDto): Promise<{
        success: boolean;
        skill: {
            id: string;
            name: string;
            description: string;
            effects: import("@prisma/client/runtime/library").JsonValue;
        };
        remainingSkillPoints: number;
    }>;
}
