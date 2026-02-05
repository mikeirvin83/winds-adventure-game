import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UnlockSkillDto } from './dto/skills.dto';

@ApiTags('Skills')
@Controller('api')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get('skills')
  @ApiOperation({ summary: 'Get all available skills with requirements' })
  @ApiResponse({ status: 200, description: 'Skills retrieved successfully' })
  async getAllSkills() {
    return this.skillsService.getAllSkills();
  }

  @Get('player/skills')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get player's unlocked skills" })
  @ApiResponse({ status: 200, description: 'Player skills retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPlayerSkills(@Request() req: any) {
    return this.skillsService.getPlayerSkills(req.user.id);
  }

  @Post('player/skills/unlock')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unlock a skill' })
  @ApiResponse({ status: 200, description: 'Skill unlocked successfully' })
  @ApiResponse({ status: 400, description: 'Insufficient points or level' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Skill already unlocked' })
  async unlockSkill(@Request() req: any, @Body() dto: UnlockSkillDto) {
    return this.skillsService.unlockSkill(req.user.id, dto);
  }
}