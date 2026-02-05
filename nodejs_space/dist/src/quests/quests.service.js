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
var QuestsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuestsService = QuestsService_1 = class QuestsService {
    prisma;
    logger = new common_1.Logger(QuestsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllQuests() {
        const quests = await this.prisma.quest.findMany({
            orderBy: [
                { requiredlevel: 'asc' },
                { type: 'asc' },
            ],
        });
        return {
            quests: quests.map(quest => ({
                id: quest.id,
                name: quest.name,
                description: quest.description,
                type: quest.type,
                objectives: quest.objectives,
                rewards: quest.rewards,
                requiredLevel: quest.requiredlevel,
                area: quest.area,
            })),
        };
    }
    async getPlayerQuests(playerId, status) {
        const where = { playerid: playerId };
        if (status && status !== 'all') {
            where.status = status;
        }
        const quests = await this.prisma.playerquest.findMany({
            where,
            include: {
                quest: true,
            },
            orderBy: {
                startedat: 'desc',
            },
        });
        return {
            quests: quests.map(pq => ({
                questId: pq.questid,
                quest: {
                    id: pq.quest.id,
                    name: pq.quest.name,
                    description: pq.quest.description,
                    type: pq.quest.type,
                    objectives: pq.quest.objectives,
                    rewards: pq.quest.rewards,
                    area: pq.quest.area,
                },
                status: pq.status,
                progress: pq.progress,
                startedAt: pq.startedat,
                completedAt: pq.completedat,
            })),
        };
    }
    async startQuest(playerId, dto) {
        const quest = await this.prisma.quest.findUnique({
            where: { id: dto.questId },
        });
        if (!quest) {
            throw new common_1.NotFoundException('Quest not found');
        }
        const existingQuest = await this.prisma.playerquest.findFirst({
            where: {
                playerid: playerId,
                questid: dto.questId,
            },
        });
        if (existingQuest && existingQuest.status === 'active') {
            throw new common_1.ConflictException('Quest already active');
        }
        const stats = await this.prisma.playerstats.findUnique({
            where: { playerid: playerId },
        });
        if (!stats) {
            throw new common_1.NotFoundException('Player stats not found');
        }
        if (stats.level < quest.requiredlevel) {
            throw new common_1.BadRequestException(`Level ${quest.requiredlevel} required for this quest (current: ${stats.level})`);
        }
        const objectives = quest.objectives;
        const initialProgress = objectives.reduce((acc, obj, index) => {
            acc[`objective_${index}`] = 0;
            return acc;
        }, {});
        const playerQuest = await this.prisma.playerquest.upsert({
            where: {
                playerid_questid: {
                    playerid: playerId,
                    questid: dto.questId,
                },
            },
            update: {
                status: 'active',
                progress: initialProgress,
                startedat: new Date(),
                completedat: null,
            },
            create: {
                playerid: playerId,
                questid: dto.questId,
                status: 'active',
                progress: initialProgress,
            },
            include: {
                quest: true,
            },
        });
        this.logger.log(`Player ${playerId} started quest: ${quest.name}`);
        return {
            success: true,
            quest: {
                id: playerQuest.quest.id,
                name: playerQuest.quest.name,
                objectives: playerQuest.quest.objectives,
                progress: playerQuest.progress,
            },
        };
    }
    async updateProgress(playerId, dto) {
        const playerQuest = await this.prisma.playerquest.findFirst({
            where: {
                playerid: playerId,
                questid: dto.questId,
                status: 'active',
            },
            include: {
                quest: true,
            },
        });
        if (!playerQuest) {
            throw new common_1.NotFoundException('Active quest not found');
        }
        const currentProgress = playerQuest.progress;
        const newProgress = { ...currentProgress, ...dto.progress };
        const objectives = playerQuest.quest.objectives;
        const completed = this.checkQuestCompletion(objectives, newProgress);
        const updatedQuest = await this.prisma.playerquest.update({
            where: { id: playerQuest.id },
            data: {
                progress: newProgress,
            },
            include: {
                quest: true,
            },
        });
        this.logger.log(`Updated progress for quest ${dto.questId}, player ${playerId}`);
        return {
            success: true,
            quest: {
                id: updatedQuest.quest.id,
                name: updatedQuest.quest.name,
                progress: updatedQuest.progress,
            },
            completed,
        };
    }
    async completeQuest(playerId, dto) {
        const playerQuest = await this.prisma.playerquest.findFirst({
            where: {
                playerid: playerId,
                questid: dto.questId,
                status: 'active',
            },
            include: {
                quest: true,
            },
        });
        if (!playerQuest) {
            throw new common_1.NotFoundException('Active quest not found');
        }
        const objectives = playerQuest.quest.objectives;
        const progress = playerQuest.progress;
        const completed = this.checkQuestCompletion(objectives, progress);
        if (!completed) {
            throw new common_1.BadRequestException('Quest objectives not completed yet');
        }
        await this.prisma.playerquest.update({
            where: { id: playerQuest.id },
            data: {
                status: 'completed',
                completedat: new Date(),
            },
        });
        const rewards = playerQuest.quest.rewards;
        const stats = await this.prisma.playerstats.findUnique({
            where: { playerid: playerId },
        });
        if (!stats) {
            throw new common_1.NotFoundException('Player stats not found');
        }
        const xpGain = rewards.xp || 0;
        const skillPointsGain = rewards.skillPoints || 0;
        const newXp = stats.xp + xpGain;
        const xpRequired = this.calculateXpToNextLevel(stats.level);
        let newLevel = stats.level;
        let newSkillPoints = stats.skillpoints + skillPointsGain;
        if (newXp >= xpRequired) {
            newLevel = stats.level + 1;
            newSkillPoints += 2;
        }
        const updatedStats = await this.prisma.playerstats.update({
            where: { playerid: playerId },
            data: {
                xp: newXp,
                level: newLevel,
                skillpoints: newSkillPoints,
            },
        });
        if (rewards.items && Array.isArray(rewards.items)) {
            for (const itemId of rewards.items) {
                const existingItem = await this.prisma.playerinventory.findFirst({
                    where: {
                        playerid: playerId,
                        itemid: itemId,
                    },
                });
                if (existingItem) {
                    await this.prisma.playerinventory.update({
                        where: { id: existingItem.id },
                        data: { quantity: existingItem.quantity + 1 },
                    });
                }
                else {
                    await this.prisma.playerinventory.create({
                        data: {
                            playerid: playerId,
                            itemid: itemId,
                            quantity: 1,
                        },
                    });
                }
            }
        }
        this.logger.log(`Player ${playerId} completed quest: ${playerQuest.quest.name}`);
        return {
            success: true,
            rewards: {
                xp: xpGain,
                items: rewards.items || [],
                gold: rewards.gold || 0,
                skillPoints: skillPointsGain,
            },
            newStats: {
                level: updatedStats.level,
                xp: updatedStats.xp,
                skillpoints: updatedStats.skillpoints,
            },
        };
    }
    checkQuestCompletion(objectives, progress) {
        for (let i = 0; i < objectives.length; i++) {
            const objective = objectives[i];
            const currentProgress = progress[`objective_${i}`] || 0;
            if (objective.count && currentProgress < objective.count) {
                return false;
            }
            if (objective.current !== undefined && currentProgress === 0) {
                return false;
            }
        }
        return true;
    }
    calculateXpToNextLevel(level) {
        return Math.floor(level * 100 * Math.pow(1.5, (level - 1) / 5));
    }
};
exports.QuestsService = QuestsService;
exports.QuestsService = QuestsService = QuestsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuestsService);
//# sourceMappingURL=quests.service.js.map