export declare class StartQuestDto {
    questId: string;
}
export declare class UpdateQuestProgressDto {
    questId: string;
    progress: Record<string, number>;
}
export declare class CompleteQuestDto {
    questId: string;
}
