import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStatsDto, AddXpDto, LevelUpDto } from './dto/player.dto';

@Injectable()
export class PlayerService {
  private readonly logger = new Logger(PlayerService.name);

  constructor(private prisma: PrismaService) {}

  async getProfile(playerId: string) {
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
      throw new NotFoundException('Player not found');
    }

    const { passwordhash, ...playerData } = player;
    return playerData;
  }

  async getStats(playerId: string) {
    const stats = await this.prisma.playerstats.findUnique({
      where: { playerid: playerId },
    });

    if (!stats) {
      throw new NotFoundException('Player stats not found');
    }

    const xpToNextLevel = this.calculateXpToNextLevel(stats.level);

    return {
      ...stats,
      xpToNextLevel,
    };
  }

  async updateStats(playerId: string, dto: UpdateStatsDto) {
    const currentStats = await this.prisma.playerstats.findUnique({
      where: { playerid: playerId },
    });

    if (!currentStats) {
      throw new NotFoundException('Player stats not found');
    }

    // Validate updates
    if (dto.health !== undefined && (dto.health < 0 || dto.health > currentStats.maxhealth)) {
      throw new BadRequestException(`Health must be between 0 and ${currentStats.maxhealth}`);
    }

    if (dto.stamina !== undefined && (dto.stamina < 0 || dto.stamina > currentStats.maxstamina)) {
      throw new BadRequestException(`Stamina must be between 0 and ${currentStats.maxstamina}`);
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

  async addXp(playerId: string, dto: AddXpDto) {
    if (dto.amount <= 0) {
      throw new BadRequestException('XP amount must be positive');
    }

    const stats = await this.prisma.playerstats.findUnique({
      where: { playerid: playerId },
    });

    if (!stats) {
      throw new NotFoundException('Player stats not found');
    }

    const newXp = stats.xp + dto.amount;
    const xpRequired = this.calculateXpToNextLevel(stats.level);
    let leveledUp = false;
    let newLevel = stats.level;
    let newSkillPoints = stats.skillpoints;

    // Check if player leveled up
    if (newXp >= xpRequired) {
      leveledUp = true;
      newLevel = stats.level + 1;
      newSkillPoints += 2; // Award 2 skill points per level
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

  async levelUp(playerId: string, dto: LevelUpDto) {
    const stats = await this.prisma.playerstats.findUnique({
      where: { playerid: playerId },
    });

    if (!stats) {
      throw new NotFoundException('Player stats not found');
    }

    const { statAllocations } = dto;
    const totalPoints = Object.values(statAllocations).reduce((sum, val) => sum + val, 0);

    if (totalPoints > stats.skillpoints) {
      throw new BadRequestException('Not enough skill points');
    }

    // Validate allocations are non-negative
    if (Object.values(statAllocations).some(val => val < 0)) {
      throw new BadRequestException('Stat allocations must be non-negative');
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

  private calculateXpToNextLevel(level: number): number {
    // Exponential curve: xpToNextLevel = level * 100 * 1.5
    return Math.floor(level * 100 * Math.pow(1.5, (level - 1) / 5));
  }
}