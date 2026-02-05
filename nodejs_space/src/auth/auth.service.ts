import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    this.logger.log(`Registration attempt for email: ${dto.email}`);
    
    // Check if user already exists
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
        throw new ConflictException('Email already registered');
      }
      throw new ConflictException('Username already taken');
    }

    // Hash password
    const passwordhash = await bcrypt.hash(dto.password, 10);

    // Create player with stats and progress
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

  async login(dto: LoginDto) {
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
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, player.passwordhash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: player.id, email: player.email });

    const { passwordhash, ...playerData } = player;
    
    this.logger.log(`User logged in successfully: ${player.username}`);
    return { token, player: playerData };
  }

  async validateUser(userId: string) {
    return this.prisma.player.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
  }
}