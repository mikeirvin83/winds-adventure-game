import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveProgressDto, UnlockAreaDto } from './dto/progress.dto';

@Injectable()
export class ProgressService {
  private readonly logger = new Logger(ProgressService.name);

  constructor(private prisma: PrismaService) {}

  async getProgress(playerId: string) {
    const progress = await this.prisma.gameprogress.findUnique({
      where: { playerid: playerId },
    });

    if (!progress) {
      throw new NotFoundException('Game progress not found');
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

  async saveProgress(playerId: string, dto: SaveProgressDto) {
    const progress = await this.prisma.gameprogress.findUnique({
      where: { playerid: playerId },
    });

    if (!progress) {
      throw new NotFoundException('Game progress not found');
    }

    const checkpoints = progress.checkpoints as any[];
    const updatedCheckpoints = dto.checkpointId 
      ? [...checkpoints, { id: dto.checkpointId, area: dto.currentArea, timestamp: new Date() }]
      : checkpoints;

    const updatedProgress = await this.prisma.gameprogress.update({
      where: { playerid: playerId },
      data: {
        currentarea: dto.currentArea,
        position: dto.position as any,
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

  async unlockArea(playerId: string, dto: UnlockAreaDto) {
    const progress = await this.prisma.gameprogress.findUnique({
      where: { playerid: playerId },
    });

    if (!progress) {
      throw new NotFoundException('Game progress not found');
    }

    const unlockedAreas = progress.unlockedareas as string[];
    
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
}