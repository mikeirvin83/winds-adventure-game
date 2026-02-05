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
exports.PlayerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const player_service_1 = require("./player.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const player_dto_1 = require("./dto/player.dto");
let PlayerController = class PlayerController {
    playerService;
    constructor(playerService) {
        this.playerService = playerService;
    }
    async getProfile(req) {
        return this.playerService.getProfile(req.user.id);
    }
    async getStats(req) {
        return this.playerService.getStats(req.user.id);
    }
    async updateStats(req, dto) {
        return this.playerService.updateStats(req.user.id, dto);
    }
    async addXp(req, dto) {
        return this.playerService.addXp(req.user.id, dto);
    }
    async levelUp(req, dto) {
        return this.playerService.levelUp(req.user.id, dto);
    }
};
exports.PlayerController = PlayerController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get complete player profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get character stats' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Stats retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getStats", null);
__decorate([
    (0, common_1.Put)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Update stats (health/stamina)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Stats updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, player_dto_1.UpdateStatsDto]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "updateStats", null);
__decorate([
    (0, common_1.Post)('add-xp'),
    (0, swagger_1.ApiOperation)({ summary: 'Add experience points' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'XP added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, player_dto_1.AddXpDto]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "addXp", null);
__decorate([
    (0, common_1.Post)('level-up'),
    (0, swagger_1.ApiOperation)({ summary: 'Process level up and allocate stat points' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Level up processed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, player_dto_1.LevelUpDto]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "levelUp", null);
exports.PlayerController = PlayerController = __decorate([
    (0, swagger_1.ApiTags)('Player'),
    (0, common_1.Controller)('api/player'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [player_service_1.PlayerService])
], PlayerController);
//# sourceMappingURL=player.controller.js.map