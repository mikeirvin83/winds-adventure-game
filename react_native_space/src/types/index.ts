// Game Types
export interface Player {
  id: string;
  username: string;
  email: string;
  level: number;
  experience: number;
  skillPoints: number;
  stats: PlayerStats;
}

export interface PlayerStats {
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  attack: number;
  defense: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  levelRequired: number;
  skillPointCost: number;
  damageMultiplier?: number;
  staminaCost?: number;
}

export interface PlayerSkill extends Skill {
  unlockedAt: Date;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'WEAPON' | 'ARMOR' | 'ACCESSORY' | 'CONSUMABLE';
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  price: number;
  statBonus?: {
    health?: number;
    stamina?: number;
    attack?: number;
    defense?: number;
  };
}

export interface InventoryItem extends Item {
  quantity: number;
  equipped: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'MAIN' | 'SIDE' | 'DAILY';
  objectives: string[];
  rewards: {
    experience: number;
    gold?: number;
    items?: string[];
  };
}

export interface PlayerQuest extends Quest {
  progress: number;
  completed: boolean;
  startedAt: Date;
  completedAt?: Date;
}

export interface GameProgress {
  currentArea: string;
  position: { x: number; y: number; z: number };
  checkpoints: string[];
  unlockedAreas: string[];
  playTime: number;
}

export interface LeaderboardEntry {
  username: string;
  level: number;
  experience: number;
}

export interface Enemy {
  id: string;
  type: 'BASIC' | 'ELITE' | 'BOSS';
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  position: { x: number; y: number; z: number };
  isAlive: boolean;
}

export interface CombatState {
  wave: number;
  enemiesDefeated: number;
  score: number;
  isActive: boolean;
}
