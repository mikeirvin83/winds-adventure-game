import { IsNumber, IsOptional, IsObject, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateStatsDto {
  @ApiProperty({ example: 80, description: 'Current health', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  health?: number;

  @ApiProperty({ example: 60, description: 'Current stamina', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stamina?: number;
}

export class AddXpDto {
  @ApiProperty({ example: 150, description: 'Amount of XP to add' })
  @IsNumber()
  @Min(1)
  amount: number;
}

class StatAllocations {
  @ApiProperty({ example: 2, description: 'Points to allocate to health', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  health?: number;

  @ApiProperty({ example: 1, description: 'Points to allocate to stamina', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stamina?: number;

  @ApiProperty({ example: 2, description: 'Points to allocate to attack power', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  attackPower?: number;

  @ApiProperty({ example: 1, description: 'Points to allocate to defense', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  defense?: number;
}

export class LevelUpDto {
  @ApiProperty({ type: StatAllocations, description: 'Stat allocations for level up' })
  @IsObject()
  @ValidateNested()
  @Type(() => StatAllocations)
  statAllocations: StatAllocations;
}