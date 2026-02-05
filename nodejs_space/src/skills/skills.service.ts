import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UnlockSkillDto } from './dto/skills.dto';

@Injectable()
export class SkillsService {
  private readonly logger = new Logger(SkillsService.name);

  constructor(private prisma: PrismaService) {}

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

  async getPlayerSkills(playerId: string) {
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

  async unlockSkill(playerId: string, dto: UnlockSkillDto) {
    // Check if skill exists
    const skill = await this.prisma.skill.findUnique({
      where: { id: dto.skillId },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    // Check if player already has this skill
    const existingSkill = await this.prisma.playerskill.findFirst({
      where: {
        playerid: playerId,
        skillid: dto.skillId,
      },
    });

    if (existingSkill) {
      throw new ConflictException('Skill already unlocked');
    }

    // Get player stats
    const stats = await this.prisma.playerstats.findUnique({
      where: { playerid: playerId },
    });

    if (!stats) {
      throw new NotFoundException('Player stats not found');
    }

    // Check level requirement
    if (stats.level < skill.requiredlevel) {
      throw new BadRequestException(
        `Level ${skill.requiredlevel} required to unlock this skill (current: ${stats.level})`,
      );
    }

    // Check skill points
    if (stats.skillpoints < skill.cost) {
      throw new BadRequestException(
        `Not enough skill points (required: ${skill.cost}, available: ${stats.skillpoints})`,
      );
    }

    // Unlock skill and deduct skill points
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
}