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
exports.UnlockAreaDto = exports.SaveProgressDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class Position {
    x;
    y;
    z;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100.5 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Position.prototype, "x", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50.0 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Position.prototype, "y", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 75.2 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Position.prototype, "z", void 0);
class SaveProgressDto {
    currentArea;
    position;
    checkpointId;
    playTime;
}
exports.SaveProgressDto = SaveProgressDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bamboo Forest', description: 'Current area name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaveProgressDto.prototype, "currentArea", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Position, description: 'Player position coordinates' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Position),
    __metadata("design:type", Position)
], SaveProgressDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'checkpoint_1', description: 'Checkpoint ID', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaveProgressDto.prototype, "checkpointId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3600, description: 'Total play time in seconds' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaveProgressDto.prototype, "playTime", void 0);
class UnlockAreaDto {
    areaId;
}
exports.UnlockAreaDto = UnlockAreaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mountain Path', description: 'Area ID to unlock' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UnlockAreaDto.prototype, "areaId", void 0);
//# sourceMappingURL=progress.dto.js.map