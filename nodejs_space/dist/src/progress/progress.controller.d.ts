import { ProgressService } from './progress.service';
import { SaveProgressDto, UnlockAreaDto } from './dto/progress.dto';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    getProgress(req: any): Promise<{
        currentArea: string;
        position: import("@prisma/client/runtime/library").JsonValue;
        checkpoints: import("@prisma/client/runtime/library").JsonValue;
        unlockedAreas: import("@prisma/client/runtime/library").JsonValue;
        playTime: number;
        lastSaved: Date;
    }>;
    saveProgress(req: any, dto: SaveProgressDto): Promise<{
        success: boolean;
        progress: {
            currentArea: string;
            position: import("@prisma/client/runtime/library").JsonValue;
            checkpoints: import("@prisma/client/runtime/library").JsonValue;
            playTime: number;
            lastSaved: Date;
        };
    }>;
    unlockArea(req: any, dto: UnlockAreaDto): Promise<{
        success: boolean;
        unlockedAreas: string[];
        message: string;
    } | {
        success: boolean;
        unlockedAreas: string[];
        message?: undefined;
    }>;
}
