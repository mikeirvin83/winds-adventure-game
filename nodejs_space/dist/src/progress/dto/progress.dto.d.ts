declare class Position {
    x: number;
    y: number;
    z: number;
}
export declare class SaveProgressDto {
    currentArea: string;
    position: Position;
    checkpointId?: string;
    playTime: number;
}
export declare class UnlockAreaDto {
    areaId: string;
}
export {};
