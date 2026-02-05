import { Controller, Get, Put, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PlayerService } from './player.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateStatsDto, AddXpDto, LevelUpDto } from './dto/player.dto';

@ApiTags('Player')
@Controller('api/player')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get complete player profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req: any) {
    return this.playerService.getProfile(req.user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get character stats' })
  @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStats(@Request() req: any) {
    return this.playerService.getStats(req.user.id);
  }

  @Put('stats')
  @ApiOperation({ summary: 'Update stats (health/stamina)' })
  @ApiResponse({ status: 200, description: 'Stats updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateStats(@Request() req: any, @Body() dto: UpdateStatsDto) {
    return this.playerService.updateStats(req.user.id, dto);
  }

  @Post('add-xp')
  @ApiOperation({ summary: 'Add experience points' })
  @ApiResponse({ status: 200, description: 'XP added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addXp(@Request() req: any, @Body() dto: AddXpDto) {
    return this.playerService.addXp(req.user.id, dto);
  }

  @Post('level-up')
  @ApiOperation({ summary: 'Process level up and allocate stat points' })
  @ApiResponse({ status: 200, description: 'Level up processed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async levelUp(@Request() req: any, @Body() dto: LevelUpDto) {
    return this.playerService.levelUp(req.user.id, dto);
  }
}