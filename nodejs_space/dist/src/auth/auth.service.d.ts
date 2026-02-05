import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        token: string;
        player: {
            id: string;
            username: string;
            email: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        player: {
            id: string;
            username: string;
            email: string;
        };
    }>;
    validateUser(userId: string): Promise<{
        id: string;
        username: string;
        email: string;
    } | null>;
}
