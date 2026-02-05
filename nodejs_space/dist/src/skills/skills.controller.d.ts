import { SkillsService } from './skills.service';
import { UnlockSkillDto } from './dto/skills.dto';
export declare class SkillsController {
    private readonly skillsService;
    constructor(skillsService: SkillsService);
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
    getPlayerSkills(req: any): Promise<{
        skills: {
            id: string;
            name: string;
            description: string;
            effects: import("@prisma/client/runtime/library").JsonValue;
            category: string;
            unlockedAt: Date;
        }[];
    }>;
    unlockSkill(req: any, dto: UnlockSkillDto): Promise<{
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
