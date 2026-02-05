import { LeaderboardService } from './leaderboard.service';
export declare class LeaderboardController {
    private readonly leaderboardService;
    constructor(leaderboardService: LeaderboardService);
    getLeaderboard(limit?: number, sortBy?: string): Promise<{
        leaderboard: {
            rank: number;
            username: string;
            level: number;
            xp: number;
        }[];
    }>;
}
