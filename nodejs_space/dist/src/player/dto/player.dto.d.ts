export declare class UpdateStatsDto {
    health?: number;
    stamina?: number;
}
export declare class AddXpDto {
    amount: number;
}
declare class StatAllocations {
    health?: number;
    stamina?: number;
    attackPower?: number;
    defense?: number;
}
export declare class LevelUpDto {
    statAllocations: StatAllocations;
}
export {};
