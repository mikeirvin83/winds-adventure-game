import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async getLeaderboard(limit: number = 10, sortBy: string = 'level') {
    const orderBy: any = {};
    
    if (sortBy === 'xp') {
      orderBy.xp = 'desc';
    } else {
      orderBy.level = 'desc';
      orderBy.xp = 'desc'; // Secondary sort by XP
    }

    const topPlayers = await this.prisma.playerstats.findMany({
      take: limit,
      orderBy,
      include: {
        player: {
          select: {
            username: true,
          },
        },
      },
    });

    return {
      leaderboard: topPlayers.map((stat, index) => ({
        rank: index + 1,
        username: stat.player.username,
        level: stat.level,
        xp: stat.xp,
      })),
    };
  }
}