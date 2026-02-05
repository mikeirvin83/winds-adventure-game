import { PrismaService } from '../prisma/prisma.service';
import { SaveProgressDto, UnlockAreaDto } from './dto/progress.dto';
export declare class ProgressService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getProgress(playerId: string): Promise<{
        currentArea: string;
        position: import("@prisma/client/runtime/library").JsonValue;
        checkpoints: import("@prisma/client/runtime/library").JsonValue;
        unlockedAreas: import("@prisma/client/runtime/library").JsonValue;
        playTime: number;
        lastSaved: Date;
    }>;
    saveProgress(playerId: string, dto: SaveProgressDto): Promise<{
        success: boolean;
        progress: {
            currentArea: string;
            position: import("@prisma/client/runtime/library").JsonValue;
            checkpoints: import("@prisma/client/runtime/library").JsonValue;
            playTime: number;
            lastSaved: Date;
        };
    }>;
    unlockArea(playerId: string, dto: UnlockAreaDto): Promise<{
        success: boolean;
        unlockedAreas: string[];
        message: string;
    } | {
        success: boolean;
        unlockedAreas: string[];
        message?: undefined;
    }>;
}
