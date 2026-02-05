import { Controller, Get, Put, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SaveProgressDto, UnlockAreaDto } from './dto/progress.dto';

@ApiTags('Game Progress')
@Controller('api/player/progress')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  @ApiOperation({ summary: 'Get game progress' })
  @ApiResponse({ status: 200, description: 'Progress retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProgress(@Request() req: any) {
    return this.progressService.getProgress(req.user.id);
  }

  @Put()
  @ApiOperation({ summary: 'Save game progress' })
  @ApiResponse({ status: 200, description: 'Progress saved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async saveProgress(@Request() req: any, @Body() dto: SaveProgressDto) {
    return this.progressService.saveProgress(req.user.id, dto);
  }

  @Post('unlock-area')
  @ApiOperation({ summary: 'Unlock new area' })
  @ApiResponse({ status: 200, description: 'Area unlocked successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async unlockArea(@Request() req: any, @Body() dto: UnlockAreaDto) {
    return this.progressService.unlockArea(req.user.id, dto);
  }
}