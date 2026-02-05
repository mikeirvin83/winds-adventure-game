"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipItemDto = exports.RemoveItemDto = exports.AddItemDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class AddItemDto {
    itemId;
    quantity = 1;
}
exports.AddItemDto = AddItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'iron-sword', description: 'ID of the item to add' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddItemDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Quantity to add', default: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AddItemDto.prototype, "quantity", void 0);
class RemoveItemDto {
    itemId;
    quantity;
}
exports.RemoveItemDto = RemoveItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'iron-sword', description: 'ID of the item to remove' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RemoveItemDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Quantity to remove' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], RemoveItemDto.prototype, "quantity", void 0);
class EquipItemDto {
    itemId;
    slot;
    action;
}
exports.EquipItemDto = EquipItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'iron-sword', description: 'ID of the item to equip/unequip' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EquipItemDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'weapon', enum: ['weapon', 'armor', 'accessory'], description: 'Equipment slot' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['weapon', 'armor', 'accessory']),
    __metadata("design:type", String)
], EquipItemDto.prototype, "slot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'equip', enum: ['equip', 'unequip'], description: 'Action to perform' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['equip', 'unequip']),
    __metadata("design:type", String)
], EquipItemDto.prototype, "action", void 0);
//# sourceMappingURL=inventory.dto.js.map