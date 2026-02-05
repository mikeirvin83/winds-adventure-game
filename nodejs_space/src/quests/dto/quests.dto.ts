import { IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartQuestDto {
  @ApiProperty({ example: 'welcome-to-the-journey', description: 'ID of the quest to start' })
  @IsString()
  questId: string;
}

export class UpdateQuestProgressDto {
  @ApiProperty({ example: 'welcome-to-the-journey', description: 'ID of the quest' })
  @IsString()
  questId: string;

  @ApiProperty({ 
    example: { objective_0: 3, objective_1: 1 }, 
    description: 'Progress updates for quest objectives' 
  })
  @IsObject()
  progress: Record<string, number>;
}

export class CompleteQuestDto {
  @ApiProperty({ example: 'welcome-to-the-journey', description: 'ID of the quest to complete' })
  @IsString()
  questId: string;
}