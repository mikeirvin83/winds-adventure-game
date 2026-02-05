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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const quests_service_1 = require("./quests.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const quests_dto_1 = require("./dto/quests.dto");
let QuestsController = class QuestsController {
    questsService;
    constructor(questsService) {
        this.questsService = questsService;
    }
    async getAllQuests() {
        return this.questsService.getAllQuests();
    }
    async getPlayerQuests(req, status) {
        return this.questsService.getPlayerQuests(req.user.id, status);
    }
    async startQuest(req, dto) {
        return this.questsService.startQuest(req.user.id, dto);
    }
    async updateProgress(req, dto) {
        return this.questsService.updateProgress(req.user.id, dto);
    }
    async completeQuest(req, dto) {
        return this.questsService.completeQuest(req.user.id, dto);
    }
};
exports.QuestsController = QuestsController;
__decorate([
    (0, common_1.Get)('quests'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available quests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Quests retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuestsController.prototype, "getAllQuests", null);
__decorate([
    (0, common_1.Get)('player/quests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['active', 'completed', 'all'], description: 'Filter by quest status' }),
    (0, swagger_1.ApiOperation)({ summary: "Get player's quests" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Player quests retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], QuestsController.prototype, "getPlayerQuests", null);
__decorate([
    (0, common_1.Post)('player/quests/start'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Start a quest' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Quest started successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Level requirement not met' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Quest already active' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, quests_dto_1.StartQuestDto]),
    __metadata("design:returntype", Promise)
], QuestsController.prototype, "startQuest", null);
__decorate([
    (0, common_1.Put)('player/quests/progress'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update quest progress' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Progress updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, quests_dto_1.UpdateQuestProgressDto]),
    __metadata("design:returntype", Promise)
], QuestsController.prototype, "updateProgress", null);
__decorate([
    (0, common_1.Post)('player/quests/complete'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Complete quest and claim rewards' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Quest completed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Quest not completed' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, quests_dto_1.CompleteQuestDto]),
    __metadata("design:returntype", Promise)
], QuestsController.prototype, "completeQuest", null);
exports.QuestsController = QuestsController = __decorate([
    (0, swagger_1.ApiTags)('Quests'),
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [quests_service_1.QuestsService])
], QuestsController);
//# sourceMappingURL=quests.controller.js.map