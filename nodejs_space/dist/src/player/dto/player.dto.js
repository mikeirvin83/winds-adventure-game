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
exports.LevelUpDto = exports.AddXpDto = exports.UpdateStatsDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class UpdateStatsDto {
    health;
    stamina;
}
exports.UpdateStatsDto = UpdateStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 80, description: 'Current health', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateStatsDto.prototype, "health", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 60, description: 'Current stamina', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateStatsDto.prototype, "stamina", void 0);
class AddXpDto {
    amount;
}
exports.AddXpDto = AddXpDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 150, description: 'Amount of XP to add' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AddXpDto.prototype, "amount", void 0);
class StatAllocations {
    health;
    stamina;
    attackPower;
    defense;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Points to allocate to health', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], StatAllocations.prototype, "health", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Points to allocate to stamina', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], StatAllocations.prototype, "stamina", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Points to allocate to attack power', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], StatAllocations.prototype, "attackPower", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Points to allocate to defense', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], StatAllocations.prototype, "defense", void 0);
class LevelUpDto {
    statAllocations;
}
exports.LevelUpDto = LevelUpDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: StatAllocations, description: 'Stat allocations for level up' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => StatAllocations),
    __metadata("design:type", StatAllocations)
], LevelUpDto.prototype, "statAllocations", void 0);
//# sourceMappingURL=player.dto.js.map