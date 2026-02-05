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
exports.CompleteQuestDto = exports.UpdateQuestProgressDto = exports.StartQuestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class StartQuestDto {
    questId;
}
exports.StartQuestDto = StartQuestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'welcome-to-the-journey', description: 'ID of the quest to start' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StartQuestDto.prototype, "questId", void 0);
class UpdateQuestProgressDto {
    questId;
    progress;
}
exports.UpdateQuestProgressDto = UpdateQuestProgressDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'welcome-to-the-journey', description: 'ID of the quest' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateQuestProgressDto.prototype, "questId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { objective_0: 3, objective_1: 1 },
        description: 'Progress updates for quest objectives'
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateQuestProgressDto.prototype, "progress", void 0);
class CompleteQuestDto {
    questId;
}
exports.CompleteQuestDto = CompleteQuestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'welcome-to-the-journey', description: 'ID of the quest to complete' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteQuestDto.prototype, "questId", void 0);
//# sourceMappingURL=quests.dto.js.map