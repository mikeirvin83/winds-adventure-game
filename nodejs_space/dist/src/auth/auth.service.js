"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        this.logger.log(`Registration attempt for email: ${dto.email}`);
        const existingUser = await this.prisma.player.findFirst({
            where: {
                OR: [
                    { email: dto.email },
                    { username: dto.username },
                ],
            },
        });
        if (existingUser) {
            if (existingUser.email === dto.email) {
                throw new common_1.ConflictException('Email already registered');
            }
            throw new common_1.ConflictException('Username already taken');
        }
        const passwordhash = await bcrypt.hash(dto.password, 10);
        const player = await this.prisma.player.create({
            data: {
                username: dto.username,
                email: dto.email,
                passwordhash,
                stats: {
                    create: {
                        level: 1,
                        xp: 0,
                        health: 100,
                        maxhealth: 100,
                        stamina: 100,
                        maxstamina: 100,
                        attackpower: 10,
                        defense: 5,
                        skillpoints: 0,
                    },
                },
                progress: {
                    create: {
                        currentarea: 'Starting Village',
                        position: { x: 0, y: 0, z: 0 },
                        checkpoints: [],
                        unlockedareas: ['Starting Village'],
                        playtime: 0,
                    },
                },
            },
            select: {
                id: true,
                username: true,
                email: true,
            },
        });
        const token = this.jwtService.sign({ sub: player.id, email: player.email });
        this.logger.log(`User registered successfully: ${player.username}`);
        return { token, player };
    }
    async login(dto) {
        this.logger.log(`Login attempt for email: ${dto.email}`);
        const player = await this.prisma.player.findUnique({
            where: { email: dto.email },
            select: {
                id: true,
                username: true,
                email: true,
                passwordhash: true,
            },
        });
        if (!player) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, player.passwordhash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = this.jwtService.sign({ sub: player.id, email: player.email });
        const { passwordhash, ...playerData } = player;
        this.logger.log(`User logged in successfully: ${player.username}`);
        return { token, player: playerData };
    }
    async validateUser(userId) {
        return this.prisma.player.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
            },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map