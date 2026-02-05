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
var ProgressService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProgressService = ProgressService_1 = class ProgressService {
    prisma;
    logger = new common_1.Logger(ProgressService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProgress(playerId) {
        const progress = await this.prisma.gameprogress.findUnique({
            where: { playerid: playerId },
        });
        if (!progress) {
            throw new common_1.NotFoundException('Game progress not found');
        }
        return {
            currentArea: progress.currentarea,
            position: progress.position,
            checkpoints: progress.checkpoints,
            unlockedAreas: progress.unlockedareas,
            playTime: progress.playtime,
            lastSaved: progress.lastsaved,
        };
    }
    async saveProgress(playerId, dto) {
        const progress = await this.prisma.gameprogress.findUnique({
            where: { playerid: playerId },
        });
        if (!progress) {
            throw new common_1.NotFoundException('Game progress not found');
        }
        const checkpoints = progress.checkpoints;
        const updatedCheckpoints = dto.checkpointId
            ? [...checkpoints, { id: dto.checkpointId, area: dto.currentArea, timestamp: new Date() }]
            : checkpoints;
        const updatedProgress = await this.prisma.gameprogress.update({
            where: { playerid: playerId },
            data: {
                currentarea: dto.currentArea,
                position: dto.position,
                checkpoints: updatedCheckpoints,
                playtime: dto.playTime,
                lastsaved: new Date(),
            },
        });
        this.logger.log(`Game progress saved for player ${playerId} at ${dto.currentArea}`);
        return {
            success: true,
            progress: {
                currentArea: updatedProgress.currentarea,
                position: updatedProgress.position,
                checkpoints: updatedProgress.checkpoints,
                playTime: updatedProgress.playtime,
                lastSaved: updatedProgress.lastsaved,
            },
        };
    }
    async unlockArea(playerId, dto) {
        const progress = await this.prisma.gameprogress.findUnique({
            where: { playerid: playerId },
        });
        if (!progress) {
            throw new common_1.NotFoundException('Game progress not found');
        }
        const unlockedAreas = progress.unlockedareas;
        if (unlockedAreas.includes(dto.areaId)) {
            return {
                success: true,
                unlockedAreas,
                message: 'Area already unlocked',
            };
        }
        const updatedUnlockedAreas = [...unlockedAreas, dto.areaId];
        await this.prisma.gameprogress.update({
            where: { playerid: playerId },
            data: {
                unlockedareas: updatedUnlockedAreas,
            },
        });
        this.logger.log(`Player ${playerId} unlocked area: ${dto.areaId}`);
        return {
            success: true,
            unlockedAreas: updatedUnlockedAreas,
        };
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = ProgressService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map