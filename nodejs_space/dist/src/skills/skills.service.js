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
var SkillsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SkillsService = SkillsService_1 = class SkillsService {
    prisma;
    logger = new common_1.Logger(SkillsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllSkills() {
        const skills = await this.prisma.skill.findMany({
            orderBy: [
                { requiredlevel: 'asc' },
                { cost: 'asc' },
            ],
        });
        return {
            skills: skills.map(skill => ({
                id: skill.id,
                name: skill.name,
                description: skill.description,
                cost: skill.cost,
                requiredLevel: skill.requiredlevel,
                effects: skill.effects,
                iconUrl: skill.iconurl,
                category: skill.category,
            })),
        };
    }
    async getPlayerSkills(playerId) {
        const playerSkills = await this.prisma.playerskill.findMany({
            where: { playerid: playerId },
            include: {
                skill: true,
            },
            orderBy: {
                unlockedat: 'asc',
            },
        });
        return {
            skills: playerSkills.map(ps => ({
                id: ps.skill.id,
                name: ps.skill.name,
                description: ps.skill.description,
                effects: ps.skill.effects,
                category: ps.skill.category,
                unlockedAt: ps.unlockedat,
            })),
        };
    }
    async unlockSkill(playerId, dto) {
        const skill = await this.prisma.skill.findUnique({
            where: { id: dto.skillId },
        });
        if (!skill) {
            throw new common_1.NotFoundException('Skill not found');
        }
        const existingSkill = await this.prisma.playerskill.findFirst({
            where: {
                playerid: playerId,
                skillid: dto.skillId,
            },
        });
        if (existingSkill) {
            throw new common_1.ConflictException('Skill already unlocked');
        }
        const stats = await this.prisma.playerstats.findUnique({
            where: { playerid: playerId },
        });
        if (!stats) {
            throw new common_1.NotFoundException('Player stats not found');
        }
        if (stats.level < skill.requiredlevel) {
            throw new common_1.BadRequestException(`Level ${skill.requiredlevel} required to unlock this skill (current: ${stats.level})`);
        }
        if (stats.skillpoints < skill.cost) {
            throw new common_1.BadRequestException(`Not enough skill points (required: ${skill.cost}, available: ${stats.skillpoints})`);
        }
        const [playerSkill, updatedStats] = await this.prisma.$transaction([
            this.prisma.playerskill.create({
                data: {
                    playerid: playerId,
                    skillid: dto.skillId,
                },
            }),
            this.prisma.playerstats.update({
                where: { playerid: playerId },
                data: {
                    skillpoints: stats.skillpoints - skill.cost,
                },
            }),
        ]);
        this.logger.log(`Player ${playerId} unlocked skill: ${skill.name}`);
        return {
            success: true,
            skill: {
                id: skill.id,
                name: skill.name,
                description: skill.description,
                effects: skill.effects,
            },
            remainingSkillPoints: updatedStats.skillpoints,
        };
    }
};
exports.SkillsService = SkillsService;
exports.SkillsService = SkillsService = SkillsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SkillsService);
//# sourceMappingURL=skills.service.js.map