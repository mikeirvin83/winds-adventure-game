import { IsString, IsNumber, Min, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddItemDto {
  @ApiProperty({ example: 'iron-sword', description: 'ID of the item to add' })
  @IsString()
  itemId: string;

  @ApiProperty({ example: 1, description: 'Quantity to add', default: 1 })
  @IsNumber()
  @Min(1)
  quantity: number = 1;
}

export class RemoveItemDto {
  @ApiProperty({ example: 'iron-sword', description: 'ID of the item to remove' })
  @IsString()
  itemId: string;

  @ApiProperty({ example: 1, description: 'Quantity to remove' })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class EquipItemDto {
  @ApiProperty({ example: 'iron-sword', description: 'ID of the item to equip/unequip' })
  @IsString()
  itemId: string;

  @ApiProperty({ example: 'weapon', enum: ['weapon', 'armor', 'accessory'], description: 'Equipment slot' })
  @IsString()
  @IsIn(['weapon', 'armor', 'accessory'])
  slot: string;

  @ApiProperty({ example: 'equip', enum: ['equip', 'unequip'], description: 'Action to perform' })
  @IsString()
  @IsIn(['equip', 'unequip'])
  action: string;
}