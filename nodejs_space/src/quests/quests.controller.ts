import { Controller, Get, Post, Put, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { QuestsService } from './quests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StartQuestDto, UpdateQuestProgressDto, CompleteQuestDto } from './dto/quests.dto';

@ApiTags('Quests')
@Controller('api')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Get('quests')
  @ApiOperation({ summary: 'Get all available quests' })
  @ApiResponse({ status: 200, description: 'Quests retrieved successfully' })
  async getAllQuests() {
    return this.questsService.getAllQuests();
  }

  @Get('player/quests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'completed', 'all'], description: 'Filter by quest status' })
  @ApiOperation({ summary: "Get player's quests" })
  @ApiResponse({ status: 200, description: 'Player quests retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPlayerQuests(@Request() req: any, @Query('status') status?: string) {
    return this.questsService.getPlayerQuests(req.user.id, status);
  }

  @Post('player/quests/start')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start a quest' })
  @ApiResponse({ status: 200, description: 'Quest started successfully' })
  @ApiResponse({ status: 400, description: 'Level requirement not met' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Quest already active' })
  async startQuest(@Request() req: any, @Body() dto: StartQuestDto) {
    return this.questsService.startQuest(req.user.id, dto);
  }

  @Put('player/quests/progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update quest progress' })
  @ApiResponse({ status: 200, description: 'Progress updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProgress(@Request() req: any, @Body() dto: UpdateQuestProgressDto) {
    return this.questsService.updateProgress(req.user.id, dto);
  }

  @Post('player/quests/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete quest and claim rewards' })
  @ApiResponse({ status: 200, description: 'Quest completed successfully' })
  @ApiResponse({ status: 400, description: 'Quest not completed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async completeQuest(@Request() req: any, @Body() dto: CompleteQuestDto) {
    return this.questsService.completeQuest(req.user.id, dto);
  }
}