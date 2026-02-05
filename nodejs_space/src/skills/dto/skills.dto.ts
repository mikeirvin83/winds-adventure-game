import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UnlockSkillDto {
  @ApiProperty({ example: 'swift-strike', description: 'ID of the skill to unlock' })
  @IsString()
  skillId: string;
}