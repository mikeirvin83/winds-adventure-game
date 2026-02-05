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
exports.SkillsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const skills_service_1 = require("./skills.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const skills_dto_1 = require("./dto/skills.dto");
let SkillsController = class SkillsController {
    skillsService;
    constructor(skillsService) {
        this.skillsService = skillsService;
    }
    async getAllSkills() {
        return this.skillsService.getAllSkills();
    }
    async getPlayerSkills(req) {
        return this.skillsService.getPlayerSkills(req.user.id);
    }
    async unlockSkill(req, dto) {
        return this.skillsService.unlockSkill(req.user.id, dto);
    }
};
exports.SkillsController = SkillsController;
__decorate([
    (0, common_1.Get)('skills'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available skills with requirements' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Skills retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "getAllSkills", null);
__decorate([
    (0, common_1.Get)('player/skills'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Get player's unlocked skills" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Player skills retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "getPlayerSkills", null);
__decorate([
    (0, common_1.Post)('player/skills/unlock'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Unlock a skill' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Skill unlocked successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Insufficient points or level' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Skill already unlocked' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, skills_dto_1.UnlockSkillDto]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "unlockSkill", null);
exports.SkillsController = SkillsController = __decorate([
    (0, swagger_1.ApiTags)('Skills'),
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [skills_service_1.SkillsService])
], SkillsController);
//# sourceMappingURL=skills.controller.js.map