import { Controller, Get, Post, Delete, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddItemDto, RemoveItemDto, EquipItemDto } from './dto/inventory.dto';

@ApiTags('Inventory & Equipment')
@Controller('api')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('items')
  @ApiOperation({ summary: 'Get all available items' })
  @ApiResponse({ status: 200, description: 'Items retrieved successfully' })
  async getAllItems() {
    return this.inventoryService.getAllItems();
  }

  @Get('player/inventory')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get player inventory' })
  @ApiResponse({ status: 200, description: 'Inventory retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getInventory(@Request() req: any) {
    return this.inventoryService.getInventory(req.user.id);
  }

  @Post('player/inventory/add')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add item to inventory' })
  @ApiResponse({ status: 200, description: 'Item added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addItem(@Request() req: any, @Body() dto: AddItemDto) {
    return this.inventoryService.addItem(req.user.id, dto);
  }

  @Delete('player/inventory/remove')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove item from inventory' })
  @ApiResponse({ status: 200, description: 'Item removed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async removeItem(@Request() req: any, @Body() dto: RemoveItemDto) {
    return this.inventoryService.removeItem(req.user.id, dto);
  }

  @Put('player/equipment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Equip or unequip item' })
  @ApiResponse({ status: 200, description: 'Equipment updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async equipItem(@Request() req: any, @Body() dto: EquipItemDto) {
    return this.inventoryService.equipItem(req.user.id, dto);
  }
}