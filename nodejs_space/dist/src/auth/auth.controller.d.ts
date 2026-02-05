import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
}
