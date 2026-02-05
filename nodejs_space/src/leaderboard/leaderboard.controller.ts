import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LeaderboardService } from './leaderboard.service';

@ApiTags('Leaderboard')
@Controller('api/leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of top players to return', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['level', 'xp'], description: 'Sort criteria', example: 'level' })
  @ApiOperation({ summary: 'Get top players leaderboard' })
  @ApiResponse({ status: 200, description: 'Leaderboard retrieved successfully' })
  async getLeaderboard(
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
  ) {
    const leaderboardLimit = limit ? parseInt(String(limit), 10) : 10;
    return this.leaderboardService.getLeaderboard(leaderboardLimit, sortBy || 'level');
  }
}