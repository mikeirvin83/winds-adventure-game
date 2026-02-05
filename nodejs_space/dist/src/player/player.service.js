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
var PlayerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PlayerService = PlayerService_1 = class PlayerService {
    prisma;
    logger = new common_1.Logger(PlayerService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(playerId) {
        const player = await this.prisma.player.findUnique({
            where: { id: playerId },
            include: {
                stats: true,
                skills: {
                    include: {
                        skill: true,
                    },
                },
                inventory: {
                    include: {
                        item: true,
                    },
                },
                quests: {
                    include: {
                        quest: true,
                    },
                },
                progress: true,
            },
        });
        if (!player) {
            throw new common_1.NotFoundException('Player not found');
        }
        const { passwordhash, ...playerData } = player;
        return playerData;
    }
    async getStats(playerId) {
        const stats = await this.prisma.playerstats.findUnique({
            where: { playerid: playerId },
        });
        if (!stats) {
            throw new common_1.NotFoundException('Player stats not found');
        }
        const xpToNextLevel = this.calculateXpToNextLevel(stats.level);
        return {
            ...stats,
            xpToNextLevel,
        };
    }
    async updateStats(playerId, dto) {
        const currentStats = await this.prisma.playerstats.findUnique({
            where: { playerid: playerId },
        });
        if (!currentStats) {
            throw new common_1.NotFoundException('Player stats not found');
        }
        if (dto.health !== undefined && (dto.health < 0 || dto.health > currentStats.maxhealth)) {
            throw new common_1.BadRequestException(`Health must be between 0 and ${currentStats.maxhealth}`);
        }
        if (dto.stamina !== undefined && (dto.stamina < 0 || dto.stamina > currentStats.maxstamina)) {
            throw new common_1.BadRequestException(`Stamina must be between 0 and ${currentStats.maxstamina}`);
        }
        const updatedStats = await this.prisma.playerstats.update({
            where: { playerid: playerId },
            data: {
                health: dto.health ?? currentStats.health,
                stamina: dto.stamina ?? currentStats.stamina,
            },
        });
        this.logger.log(`Stats updated for player ${playerId}`);
        return updatedStats;
    }
    async addXp(playerId, dto) {
        if (dto.amount <= 0) {
            throw new common_1.BadRequestException('XP amount must be positive');
        }
        const stats = await this.prisma.playerstats.findUnique({
            where: { playerid: playerId },
        });
        if (!stats) {
            throw new common_1.NotFoundException('Player stats not found');
        }
        const newXp = stats.xp + dto.amount;
        const xpRequired = this.calculateXpToNextLevel(stats.level);
        let leveledUp = false;
        let newLevel = stats.level;
        let newSkillPoints = stats.skillpoints;
        if (newXp >= xpRequired) {
            leveledUp = true;
            newLevel = stats.level + 1;
            newSkillPoints += 2;
            this.logger.log(`Player ${playerId} leveled up to ${newLevel}!`);
        }
        const updatedStats = await this.prisma.playerstats.update({
            where: { playerid: playerId },
            data: {
                xp: newXp,
                level: newLevel,
                skillpoints: newSkillPoints,
            },
        });
        return {
            leveledUp,
            newLevel,
            stats: updatedStats,
        };
    }
    async levelUp(playerId, dto) {
        const stats = await this.prisma.playerstats.findUnique({
            where: { playerid: playerId },
        });
        if (!stats) {
            throw new common_1.NotFoundException('Player stats not found');
        }
        const { statAllocations } = dto;
        const totalPoints = Object.values(statAllocations).reduce((sum, val) => sum + val, 0);
        if (totalPoints > stats.skillpoints) {
            throw new common_1.BadRequestException('Not enough skill points');
        }
        if (Object.values(statAllocations).some(val => val < 0)) {
            throw new common_1.BadRequestException('Stat allocations must be non-negative');
        }
        const updatedStats = await this.prisma.playerstats.update({
            where: { playerid: playerId },
            data: {
                maxhealth: stats.maxhealth + (statAllocations.health || 0) * 10,
                health: stats.health + (statAllocations.health || 0) * 10,
                maxstamina: stats.maxstamina + (statAllocations.stamina || 0) * 10,
                stamina: stats.stamina + (statAllocations.stamina || 0) * 10,
                attackpower: stats.attackpower + (statAllocations.attackPower || 0),
                defense: stats.defense + (statAllocations.defense || 0),
                skillpoints: stats.skillpoints - totalPoints,
            },
        });
        this.logger.log(`Player ${playerId} allocated ${totalPoints} skill points`);
        return {
            level: updatedStats.level,
            stats: updatedStats,
            skillPoints: updatedStats.skillpoints,
        };
    }
    calculateXpToNextLevel(level) {
        return Math.floor(level * 100 * Math.pow(1.5, (level - 1) / 5));
    }
};
exports.PlayerService = PlayerService;
exports.PlayerService = PlayerService = PlayerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlayerService);
//# sourceMappingURL=player.service.js.map