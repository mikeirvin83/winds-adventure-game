import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Skills (15 martial arts skills)
  const skills = [
    {
      name: 'Swift Strike',
      description: 'A lightning-fast attack that catches enemies off guard',
      cost: 1,
      requiredlevel: 1,
      effects: { damage: 15, speed: 1.2, critChance: 0.05 },
      iconurl: '/icons/skills/swift-strike.png',
      category: 'offensive'
    },
    {
      name: 'Iron Defense',
      description: 'Harden your body to reduce incoming damage',
      cost: 1,
      requiredlevel: 1,
      effects: { defenseBonus: 10, damageReduction: 0.1 },
      iconurl: '/icons/skills/iron-defense.png',
      category: 'defensive'
    },
    {
      name: 'Flowing Water Stance',
      description: 'Adopt a fluid stance that increases evasion',
      cost: 2,
      requiredlevel: 3,
      effects: { evasion: 0.15, staminaRegen: 5 },
      iconurl: '/icons/skills/flowing-water.png',
      category: 'utility'
    },
    {
      name: 'Dragon Fist',
      description: 'Channel inner energy into a devastating punch',
      cost: 2,
      requiredlevel: 5,
      effects: { damage: 35, knockback: 3, staminaCost: 20 },
      iconurl: '/icons/skills/dragon-fist.png',
      category: 'offensive'
    },
    {
      name: 'Phoenix Recovery',
      description: 'Meditative technique to restore health over time',
      cost: 2,
      requiredlevel: 4,
      effects: { healAmount: 50, duration: 10, staminaCost: 15 },
      iconurl: '/icons/skills/phoenix-recovery.png',
      category: 'healing'
    },
    {
      name: 'Shadow Step',
      description: 'Dash through shadows to evade and reposition',
      cost: 3,
      requiredlevel: 7,
      effects: { dashDistance: 10, invulnerability: 0.5, staminaCost: 25 },
      iconurl: '/icons/skills/shadow-step.png',
      category: 'mobility'
    },
    {
      name: 'Tiger Claw',
      description: 'Fierce slashing attack with high critical rate',
      cost: 2,
      requiredlevel: 6,
      effects: { damage: 28, critChance: 0.25, bleedChance: 0.2 },
      iconurl: '/icons/skills/tiger-claw.png',
      category: 'offensive'
    },
    {
      name: 'Mountain Fortitude',
      description: 'Become unmovable like a mountain, greatly increasing defense',
      cost: 3,
      requiredlevel: 8,
      effects: { defenseBonus: 30, damageReduction: 0.25, movementSpeed: 0.7 },
      iconurl: '/icons/skills/mountain-fortitude.png',
      category: 'defensive'
    },
    {
      name: 'Wind Blade',
      description: 'Slash the air to send a cutting wave at distant enemies',
      cost: 3,
      requiredlevel: 9,
      effects: { damage: 32, range: 15, projectileSpeed: 20 },
      iconurl: '/icons/skills/wind-blade.png',
      category: 'offensive'
    },
    {
      name: 'Serpent Coil',
      description: 'Grappling technique to immobilize and damage enemies',
      cost: 3,
      requiredlevel: 10,
      effects: { damage: 25, stunDuration: 2, dotDamage: 5 },
      iconurl: '/icons/skills/serpent-coil.png',
      category: 'control'
    },
    {
      name: 'Thunderous Palm',
      description: 'Strike with the force of thunder, dealing area damage',
      cost: 4,
      requiredlevel: 12,
      effects: { damage: 45, aoeRadius: 5, stunChance: 0.3 },
      iconurl: '/icons/skills/thunderous-palm.png',
      category: 'offensive'
    },
    {
      name: 'Crane Wings',
      description: 'Graceful movements that increase attack and movement speed',
      cost: 3,
      requiredlevel: 11,
      effects: { attackSpeed: 1.3, movementSpeed: 1.2, duration: 15 },
      iconurl: '/icons/skills/crane-wings.png',
      category: 'buff'
    },
    {
      name: 'Earth Shaker',
      description: 'Stomp the ground to damage and knock down nearby enemies',
      cost: 4,
      requiredlevel: 14,
      effects: { damage: 40, aoeRadius: 8, knockdown: true },
      iconurl: '/icons/skills/earth-shaker.png',
      category: 'offensive'
    },
    {
      name: 'Celestial Meditation',
      description: 'Enter a state of enlightenment to rapidly regenerate',
      cost: 4,
      requiredlevel: 15,
      effects: { healthRegen: 15, staminaRegen: 20, duration: 10 },
      iconurl: '/icons/skills/celestial-meditation.png',
      category: 'healing'
    },
    {
      name: 'Final Stand',
      description: 'When near death, temporarily gain immense power',
      cost: 5,
      requiredlevel: 18,
      effects: { damageBonus: 2.0, defenseBonus: 50, trigger: 0.2, duration: 10 },
      iconurl: '/icons/skills/final-stand.png',
      category: 'ultimate'
    }
  ];

  for (const skillData of skills) {
    await prisma.skill.upsert({
      where: { id: skillData.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: skillData.name.toLowerCase().replace(/\s+/g, '-'),
        ...skillData
      }
    });
  }
  console.log('✅ Skills seeded');

  // Seed Items (30 items)
  const items = [
    // Weapons (10)
    {
      name: 'Bamboo Staff',
      type: 'weapon',
      rarity: 'common',
      stats: { attackPower: 5, attackSpeed: 1.1 },
      description: 'A simple wooden staff for training',
      iconurl: '/icons/items/bamboo-staff.png'
    },
    {
      name: 'Iron Sword',
      type: 'weapon',
      rarity: 'common',
      stats: { attackPower: 12, critChance: 0.05 },
      description: 'Standard iron blade',
      iconurl: '/icons/items/iron-sword.png'
    },
    {
      name: 'Steel Spear',
      type: 'weapon',
      rarity: 'rare',
      stats: { attackPower: 18, range: 2, piercing: 0.1 },
      description: 'Long reach weapon with piercing capability',
      iconurl: '/icons/items/steel-spear.png'
    },
    {
      name: 'Jade Daggers',
      type: 'weapon',
      rarity: 'rare',
      stats: { attackPower: 15, attackSpeed: 1.4, critChance: 0.15 },
      description: 'Twin daggers carved from jade',
      iconurl: '/icons/items/jade-daggers.png'
    },
    {
      name: 'Dragon Blade',
      type: 'weapon',
      rarity: 'epic',
      stats: { attackPower: 35, critChance: 0.2, lifesteal: 0.1 },
      description: 'Legendary sword forged by dragon fire',
      iconurl: '/icons/items/dragon-blade.png'
    },
    {
      name: 'Phoenix Bow',
      type: 'weapon',
      rarity: 'epic',
      stats: { attackPower: 30, range: 20, fireChance: 0.25 },
      description: 'Bow blessed by the phoenix spirit',
      iconurl: '/icons/items/phoenix-bow.png'
    },
    {
      name: 'Tiger Fang Gauntlets',
      type: 'weapon',
      rarity: 'rare',
      stats: { attackPower: 20, attackSpeed: 1.3, critDamage: 1.5 },
      description: 'Gauntlets adorned with tiger fangs',
      iconurl: '/icons/items/tiger-gauntlets.png'
    },
    {
      name: 'Celestial Staff',
      type: 'weapon',
      rarity: 'legendary',
      stats: { attackPower: 45, magicPower: 30, manaRegen: 5 },
      description: 'Staff containing celestial energy',
      iconurl: '/icons/items/celestial-staff.png'
    },
    {
      name: 'Shadowstrike Blades',
      type: 'weapon',
      rarity: 'epic',
      stats: { attackPower: 32, attackSpeed: 1.5, stealthBonus: 0.2 },
      description: 'Twin blades that blend with shadows',
      iconurl: '/icons/items/shadowstrike-blades.png'
    },
    {
      name: 'Thunderbolt Hammer',
      type: 'weapon',
      rarity: 'rare',
      stats: { attackPower: 28, stunChance: 0.2, aoe: 3 },
      description: 'Hammer that channels lightning',
      iconurl: '/icons/items/thunderbolt-hammer.png'
    },
    // Armor (10)
    {
      name: 'Cloth Tunic',
      type: 'armor',
      rarity: 'common',
      stats: { defense: 3, stamina: 10 },
      description: 'Basic cloth protection',
      iconurl: '/icons/items/cloth-tunic.png'
    },
    {
      name: 'Leather Armor',
      type: 'armor',
      rarity: 'common',
      stats: { defense: 8, evasion: 0.05 },
      description: 'Light leather armor for mobility',
      iconurl: '/icons/items/leather-armor.png'
    },
    {
      name: 'Iron Plate',
      type: 'armor',
      rarity: 'rare',
      stats: { defense: 18, health: 50 },
      description: 'Heavy iron plate armor',
      iconurl: '/icons/items/iron-plate.png'
    },
    {
      name: 'Silk Robes',
      type: 'armor',
      rarity: 'rare',
      stats: { defense: 12, manaRegen: 3, spellPower: 15 },
      description: 'Elegant robes imbued with magic',
      iconurl: '/icons/items/silk-robes.png'
    },
    {
      name: 'Dragon Scale Armor',
      type: 'armor',
      rarity: 'epic',
      stats: { defense: 35, health: 100, fireResist: 0.3 },
      description: 'Armor crafted from dragon scales',
      iconurl: '/icons/items/dragon-scale-armor.png'
    },
    {
      name: 'Shadow Cloak',
      type: 'armor',
      rarity: 'epic',
      stats: { defense: 20, evasion: 0.2, stealthBonus: 0.3 },
      description: 'Cloak that bends light and shadow',
      iconurl: '/icons/items/shadow-cloak.png'
    },
    {
      name: 'Jade Battle Vest',
      type: 'armor',
      rarity: 'rare',
      stats: { defense: 22, stamina: 30, healthRegen: 2 },
      description: 'Vest reinforced with jade plates',
      iconurl: '/icons/items/jade-vest.png'
    },
    {
      name: 'Phoenix Mail',
      type: 'armor',
      rarity: 'legendary',
      stats: { defense: 45, health: 150, rebirthChance: 0.1 },
      description: 'Armor blessed with phoenix rebirth',
      iconurl: '/icons/items/phoenix-mail.png'
    },
    {
      name: 'Tiger Stripes',
      type: 'armor',
      rarity: 'rare',
      stats: { defense: 20, attackPower: 10, critChance: 0.1 },
      description: 'Armor bearing the strength of tigers',
      iconurl: '/icons/items/tiger-stripes.png'
    },
    {
      name: 'Celestial Garb',
      type: 'armor',
      rarity: 'legendary',
      stats: { defense: 40, allStats: 20, holyPower: 25 },
      description: 'Divine garments from the heavens',
      iconurl: '/icons/items/celestial-garb.png'
    },
    // Accessories (5)
    {
      name: 'Healing Ring',
      type: 'accessory',
      rarity: 'common',
      stats: { healthRegen: 1 },
      description: 'Simple ring that speeds recovery',
      iconurl: '/icons/items/healing-ring.png'
    },
    {
      name: 'Swift Boots',
      type: 'accessory',
      rarity: 'rare',
      stats: { movementSpeed: 1.15, evasion: 0.1 },
      description: 'Boots that enhance agility',
      iconurl: '/icons/items/swift-boots.png'
    },
    {
      name: 'Dragon Amulet',
      type: 'accessory',
      rarity: 'epic',
      stats: { attackPower: 15, defense: 10, health: 50 },
      description: 'Amulet containing dragon essence',
      iconurl: '/icons/items/dragon-amulet.png'
    },
    {
      name: 'Mystic Bracers',
      type: 'accessory',
      rarity: 'rare',
      stats: { magicPower: 20, manaRegen: 5 },
      description: 'Bracers that amplify magical abilities',
      iconurl: '/icons/items/mystic-bracers.png'
    },
    {
      name: 'Legendary Belt',
      type: 'accessory',
      rarity: 'legendary',
      stats: { allStats: 15, critChance: 0.1, critDamage: 1.5 },
      description: 'Belt worn by legendary warriors',
      iconurl: '/icons/items/legendary-belt.png'
    },
    // Consumables (5)
    {
      name: 'Health Potion',
      type: 'consumable',
      rarity: 'common',
      stats: { instantHeal: 50 },
      description: 'Restores 50 health instantly',
      iconurl: '/icons/items/health-potion.png'
    },
    {
      name: 'Stamina Elixir',
      type: 'consumable',
      rarity: 'common',
      stats: { instantStamina: 50 },
      description: 'Restores 50 stamina instantly',
      iconurl: '/icons/items/stamina-elixir.png'
    },
    {
      name: 'Greater Health Potion',
      type: 'consumable',
      rarity: 'rare',
      stats: { instantHeal: 150 },
      description: 'Restores 150 health instantly',
      iconurl: '/icons/items/greater-health-potion.png'
    },
    {
      name: 'Strength Tonic',
      type: 'consumable',
      rarity: 'rare',
      stats: { attackBonus: 20, duration: 300 },
      description: 'Increases attack power for 5 minutes',
      iconurl: '/icons/items/strength-tonic.png'
    },
    {
      name: 'Divine Elixir',
      type: 'consumable',
      rarity: 'epic',
      stats: { fullHeal: true, allBonus: 10, duration: 600 },
      description: 'Fully restores health and buffs all stats',
      iconurl: '/icons/items/divine-elixir.png'
    }
  ];

  for (const itemData of items) {
    await prisma.item.upsert({
      where: { id: itemData.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: itemData.name.toLowerCase().replace(/\s+/g, '-'),
        ...itemData
      }
    });
  }
  console.log('✅ Items seeded');

  // Seed Quests (15 quests)
  const quests = [
    {
      name: 'Welcome to the Journey',
      description: 'Complete your first training session',
      type: 'main',
      objectives: [
        { type: 'defeat', target: 'Training Dummy', count: 3, current: 0 }
      ],
      rewards: { xp: 100, gold: 50, items: ['bamboo-staff'] },
      requiredlevel: 1,
      area: 'Starting Village'
    },
    {
      name: 'Gathering Herbs',
      description: 'Collect medicinal herbs for the village healer',
      type: 'side',
      objectives: [
        { type: 'collect', target: 'Healing Herb', count: 10, current: 0 }
      ],
      rewards: { xp: 150, gold: 75, items: ['health-potion', 'health-potion'] },
      requiredlevel: 1,
      area: 'Starting Village'
    },
    {
      name: 'Bandit Trouble',
      description: 'Defeat the bandits threatening the village',
      type: 'main',
      objectives: [
        { type: 'defeat', target: 'Bandit', count: 5, current: 0 },
        { type: 'defeat', target: 'Bandit Leader', count: 1, current: 0 }
      ],
      rewards: { xp: 300, gold: 200, items: ['iron-sword', 'leather-armor'] },
      requiredlevel: 3,
      area: 'Bamboo Forest'
    },
    {
      name: 'Ancient Scroll',
      description: 'Retrieve the ancient martial arts scroll',
      type: 'main',
      objectives: [
        { type: 'explore', target: 'Hidden Temple', current: 0 },
        { type: 'collect', target: 'Ancient Scroll', count: 1, current: 0 }
      ],
      rewards: { xp: 500, gold: 300, skillPoints: 2 },
      requiredlevel: 5,
      area: 'Mountain Path'
    },
    {
      name: 'Daily Combat Training',
      description: 'Complete daily combat training exercises',
      type: 'daily',
      objectives: [
        { type: 'defeat', target: 'Any Enemy', count: 10, current: 0 }
      ],
      rewards: { xp: 200, gold: 100, items: ['stamina-elixir'] },
      requiredlevel: 1,
      area: 'Any'
    },
    {
      name: 'The Lost Artifact',
      description: 'Find the legendary artifact hidden in ruins',
      type: 'side',
      objectives: [
        { type: 'explore', target: 'Ancient Ruins', current: 0 },
        { type: 'defeat', target: 'Ruins Guardian', count: 1, current: 0 },
        { type: 'collect', target: 'Lost Artifact', count: 1, current: 0 }
      ],
      rewards: { xp: 800, gold: 500, items: ['jade-daggers', 'dragon-amulet'] },
      requiredlevel: 8,
      area: 'Desert Ruins'
    },
    {
      name: 'Tiger Hunt',
      description: 'Hunt the fierce tiger terrorizing travelers',
      type: 'side',
      objectives: [
        { type: 'defeat', target: 'Wild Tiger', count: 1, current: 0 }
      ],
      rewards: { xp: 600, gold: 350, items: ['tiger-fang-gauntlets'] },
      requiredlevel: 6,
      area: 'Tiger Valley'
    },
    {
      name: 'Tournament Qualifier',
      description: 'Win matches to qualify for the grand tournament',
      type: 'main',
      objectives: [
        { type: 'defeat', target: 'Tournament Fighter', count: 3, current: 0 }
      ],
      rewards: { xp: 1000, gold: 600, skillPoints: 3 },
      requiredlevel: 10,
      area: 'Imperial City'
    },
    {
      name: 'Spirit Realm Gateway',
      description: 'Investigate the mysterious gateway to spirit realm',
      type: 'main',
      objectives: [
        { type: 'explore', target: 'Spirit Gateway', current: 0 },
        { type: 'defeat', target: 'Spirit Guardian', count: 2, current: 0 }
      ],
      rewards: { xp: 1200, gold: 700, items: ['phoenix-bow', 'mystic-bracers'] },
      requiredlevel: 12,
      area: 'Spirit Forest'
    },
    {
      name: 'Dragon Mountain Ascent',
      description: 'Climb Dragon Mountain and face the trials',
      type: 'main',
      objectives: [
        { type: 'explore', target: 'Dragon Peak', current: 0 },
        { type: 'defeat', target: 'Mountain Beast', count: 5, current: 0 },
        { type: 'survive', target: 'Blizzard Trial', current: 0 }
      ],
      rewards: { xp: 1500, gold: 900, items: ['dragon-scale-armor'] },
      requiredlevel: 14,
      area: 'Dragon Mountain'
    },
    {
      name: 'Shadow Clan Infiltration',
      description: 'Infiltrate the Shadow Clan hideout',
      type: 'side',
      objectives: [
        { type: 'stealth', target: 'Shadow Hideout', current: 0 },
        { type: 'defeat', target: 'Shadow Assassin', count: 3, current: 0 }
      ],
      rewards: { xp: 1300, gold: 800, items: ['shadow-cloak', 'shadowstrike-blades'] },
      requiredlevel: 13,
      area: 'Shadow Valley'
    },
    {
      name: 'The Grand Tournament',
      description: 'Compete in the grand martial arts tournament',
      type: 'main',
      objectives: [
        { type: 'defeat', target: 'Tournament Champion', count: 3, current: 0 },
        { type: 'defeat', target: 'Grand Master', count: 1, current: 0 }
      ],
      rewards: { xp: 2000, gold: 1500, items: ['dragon-blade'], skillPoints: 5 },
      requiredlevel: 15,
      area: 'Imperial Arena'
    },
    {
      name: 'Phoenix Temple Trials',
      description: 'Complete the legendary Phoenix Temple trials',
      type: 'main',
      objectives: [
        { type: 'complete', target: 'Fire Trial', current: 0 },
        { type: 'complete', target: 'Rebirth Trial', current: 0 },
        { type: 'defeat', target: 'Phoenix Guardian', count: 1, current: 0 }
      ],
      rewards: { xp: 2500, gold: 2000, items: ['phoenix-mail', 'divine-elixir'] },
      requiredlevel: 18,
      area: 'Phoenix Temple'
    },
    {
      name: 'Celestial Ascension',
      description: 'Transcend mortal limits and reach celestial realm',
      type: 'main',
      objectives: [
        { type: 'collect', target: 'Celestial Fragment', count: 7, current: 0 },
        { type: 'defeat', target: 'Celestial Warden', count: 1, current: 0 }
      ],
      rewards: { xp: 3000, gold: 2500, items: ['celestial-staff', 'celestial-garb'] },
      requiredlevel: 20,
      area: 'Celestial Peaks'
    },
    {
      name: 'Daily Meditation',
      description: 'Practice daily meditation to refine your skills',
      type: 'daily',
      objectives: [
        { type: 'meditate', target: 'Training Grounds', count: 1, current: 0 }
      ],
      rewards: { xp: 150, skillPoints: 1 },
      requiredlevel: 1,
      area: 'Any'
    }
  ];

  for (const questData of quests) {
    await prisma.quest.upsert({
      where: { id: questData.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: questData.name.toLowerCase().replace(/\s+/g, '-'),
        ...questData
      }
    });
  }
  console.log('✅ Quests seeded');

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });