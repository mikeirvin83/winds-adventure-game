import { IsString, IsNumber, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class Position {
  @ApiProperty({ example: 100.5 })
  @IsNumber()
  x: number;

  @ApiProperty({ example: 50.0 })
  @IsNumber()
  y: number;

  @ApiProperty({ example: 75.2 })
  @IsNumber()
  z: number;
}

export class SaveProgressDto {
  @ApiProperty({ example: 'Bamboo Forest', description: 'Current area name' })
  @IsString()
  currentArea: string;

  @ApiProperty({ type: Position, description: 'Player position coordinates' })
  @IsObject()
  @ValidateNested()
  @Type(() => Position)
  position: Position;

  @ApiProperty({ example: 'checkpoint_1', description: 'Checkpoint ID', required: false })
  @IsOptional()
  @IsString()
  checkpointId?: string;

  @ApiProperty({ example: 3600, description: 'Total play time in seconds' })
  @IsNumber()
  playTime: number;
}

export class UnlockAreaDto {
  @ApiProperty({ example: 'Mountain Path', description: 'Area ID to unlock' })
  @IsString()
  areaId: string;
}