import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StartQuestDto, UpdateQuestProgressDto, CompleteQuestDto } from './dto/quests.dto';

@Injectable()
export class QuestsService {
  private readonly logger = new Logger(QuestsService.name);

  constructor(private prisma: PrismaService) {}

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

  async getPlayerQuests(playerId: string, status?: string) {
    const where: any = { playerid: playerId };
    
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

  async startQuest(playerId: string, dto: StartQuestDto) {
    // Check if quest exists
    const quest = await this.prisma.quest.findUnique({
      where: { id: dto.questId },
    });

    if (!quest) {
      throw new NotFoundException('Quest not found');
    }

    // Check if player already has this quest
    const existingQuest = await this.prisma.playerquest.findFirst({
      where: {
        playerid: playerId,
        questid: dto.questId,
      },
    });

    if (existingQuest && existingQuest.status === 'active') {
      throw new ConflictException('Quest already active');
    }

    // Check level requirement
    const stats = await this.prisma.playerstats.findUnique({
      where: { playerid: playerId },
    });

    if (!stats) {
      throw new NotFoundException('Player stats not found');
    }

    if (stats.level < quest.requiredlevel) {
      throw new BadRequestException(
        `Level ${quest.requiredlevel} required for this quest (current: ${stats.level})`,
      );
    }

    // Initialize progress
    const objectives = quest.objectives as any[];
    const initialProgress = objectives.reduce((acc, obj, index) => {
      acc[`objective_${index}`] = 0;
      return acc;
    }, {});

    // Start quest
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

  async updateProgress(playerId: string, dto: UpdateQuestProgressDto) {
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
      throw new NotFoundException('Active quest not found');
    }

    // Merge progress
    const currentProgress = playerQuest.progress as any;
    const newProgress = { ...currentProgress, ...dto.progress };

    // Check if quest is completed
    const objectives = playerQuest.quest.objectives as any[];
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

  async completeQuest(playerId: string, dto: CompleteQuestDto) {
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
      throw new NotFoundException('Active quest not found');
    }

    // Verify quest is actually completed
    const objectives = playerQuest.quest.objectives as any[];
    const progress = playerQuest.progress as any;
    const completed = this.checkQuestCompletion(objectives, progress);

    if (!completed) {
      throw new BadRequestException('Quest objectives not completed yet');
    }

    // Mark quest as completed
    await this.prisma.playerquest.update({
      where: { id: playerQuest.id },
      data: {
        status: 'completed',
        completedat: new Date(),
      },
    });

    // Grant rewards
    const rewards = playerQuest.quest.rewards as any;
    const stats = await this.prisma.playerstats.findUnique({
      where: { playerid: playerId },
    });

    if (!stats) {
      throw new NotFoundException('Player stats not found');
    }

    // Update stats with rewards
    const xpGain = rewards.xp || 0;
    const skillPointsGain = rewards.skillPoints || 0;
    const newXp = stats.xp + xpGain;
    const xpRequired = this.calculateXpToNextLevel(stats.level);
    let newLevel = stats.level;
    let newSkillPoints = stats.skillpoints + skillPointsGain;

    if (newXp >= xpRequired) {
      newLevel = stats.level + 1;
      newSkillPoints += 2; // Level up bonus
    }

    const updatedStats = await this.prisma.playerstats.update({
      where: { playerid: playerId },
      data: {
        xp: newXp,
        level: newLevel,
        skillpoints: newSkillPoints,
      },
    });

    // Add reward items to inventory
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
        } else {
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

  private checkQuestCompletion(objectives: any[], progress: any): boolean {
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

  private calculateXpToNextLevel(level: number): number {
    return Math.floor(level * 100 * Math.pow(1.5, (level - 1) / 5));
  }
}