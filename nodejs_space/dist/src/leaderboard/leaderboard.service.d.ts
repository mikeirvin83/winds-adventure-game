import { PrismaService } from '../prisma/prisma.service';
export declare class LeaderboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getLeaderboard(limit?: number, sortBy?: string): Promise<{
        leaderboard: {
            rank: number;
            username: string;
            level: number;
            xp: number;
        }[];
    }>;
}
