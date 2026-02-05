import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { Enemy, CombatState, PlayerStats } from '../types';
import CombatArena3D from '../components/CombatArena3D';
import apiService from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const GameArenaScreen: React.FC<Props> = ({ navigation }) => {
  const { player, refreshProfile } = useAuth();
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [combatState, setCombatState] = useState<CombatState>({
    wave: 1,
    enemiesDefeated: 0,
    score: 0,
    isActive: false,
  });
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [currentHealth, setCurrentHealth] = useState(100);
  const [currentStamina, setCurrentStamina] = useState(100);
  const [isAttacking, setIsAttacking] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadPlayerStats();
    }, [])
  );

  const loadPlayerStats = async () => {
    try {
      const stats = await apiService.getStats();
      setPlayerStats(stats);
      setCurrentHealth(stats.health);
      setCurrentStamina(stats.stamina);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const startCombat = () => {
    setCombatState({ wave: 1, enemiesDefeated: 0, score: 0, isActive: true });
    spawnWave(1);
  };

  const spawnWave = (wave: number) => {
    const enemyCount = Math.min(2 + wave, 5);
    const newEnemies: Enemy[] = [];

    for (let i = 0; i < enemyCount; i++) {
      const angle = (Math.PI * 2 * i) / enemyCount;
      const distance = 8;
      
      let type: 'BASIC' | 'ELITE' | 'BOSS' = 'BASIC';
      let health = 50;
      let attack = 10;
      let defense = 5;

      if (wave > 3 && i === 0) {
        type = 'ELITE';
        health = 100;
        attack = 20;
        defense = 10;
      }
      if (wave > 5 && i === 0) {
        type = 'BOSS';
        health = 200;
        attack = 30;
        defense = 15;
      }

      newEnemies.push({
        id: `enemy_${wave}_${i}`,
        type,
        health,
        maxHealth: health,
        attack,
        defense,
        position: {
          x: Math.cos(angle) * distance,
          y: 1,
          z: Math.sin(angle) * distance,
        },
        isAlive: true,
      });
    }

    setEnemies(newEnemies);
  };

  const performAttack = (type: 'light' | 'heavy' | 'special') => {
    if (!playerStats || isAttacking || currentStamina < 10) return;

    setIsAttacking(true);
    let staminaCost = 10;
    let damageMultiplier = 1;

    if (type === 'heavy') {
      staminaCost = 20;
      damageMultiplier = 1.5;
    } else if (type === 'special') {
      staminaCost = 30;
      damageMultiplier = 2;
    }

    setCurrentStamina(Math.max(0, currentStamina - staminaCost));

    // Find closest enemy and damage it
    const aliveEnemies = enemies.filter((e) => e.isAlive);
    if (aliveEnemies.length > 0) {
      const target = aliveEnemies[0];
      const damage = Math.floor(playerStats.attack * damageMultiplier);
      handleEnemyHit(target.id, damage);
    }

    setTimeout(() => setIsAttacking(false), 500);
  };

  const handleEnemyHit = (enemyId: string, damage: number) => {
    setEnemies((prev) =>
      prev.map((enemy) => {
        if (enemy.id === enemyId) {
          const newHealth = Math.max(0, enemy.health - damage);
          const isAlive = newHealth > 0;

          if (!isAlive) {
            setCombatState((state) => ({
              ...state,
              enemiesDefeated: state.enemiesDefeated + 1,
              score: state.score + (enemy.type === 'BOSS' ? 100 : enemy.type === 'ELITE' ? 50 : 20),
            }));
          }

          return { ...enemy, health: newHealth, isAlive };
        }
        return enemy;
      })
    );
  };

  const dodge = () => {
    if (currentStamina < 15) return;
    setCurrentStamina(Math.max(0, currentStamina - 15));
    // Dodge animation/effect could be added
  };

  const endCombat = async () => {
    Alert.alert(
      'Combat Ended',
      `Wave: ${combatState.wave}\nEnemies Defeated: ${combatState.enemiesDefeated}\nScore: ${combatState.score}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setCombatState({ wave: 1, enemiesDefeated: 0, score: 0, isActive: false });
            setEnemies([]);
            refreshProfile();
          },
        },
      ]
    );
  };

  // Check if all enemies defeated
  useEffect(() => {
    if (combatState.isActive && enemies.length > 0 && enemies.every((e) => !e.isAlive)) {
      setTimeout(() => {
        const nextWave = combatState.wave + 1;
        Alert.alert('Wave Complete!', `Prepare for Wave ${nextWave}`, [
          { text: 'Continue', onPress: () => {
            setCombatState((prev) => ({ ...prev, wave: nextWave }));
            spawnWave(nextWave);
          }},
          { text: 'End Combat', onPress: endCombat },
        ]);
      }, 1000);
    }
  }, [enemies, combatState]);

  // Stamina regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStamina((prev) => Math.min((playerStats?.maxStamina || 100), prev + 1));
    }, 500);
    return () => clearInterval(interval);
  }, [playerStats]);

  // Enemy attacks
  useEffect(() => {
    if (!combatState.isActive) return;

    const interval = setInterval(() => {
      const aliveEnemies = enemies.filter((e) => e.isAlive);
      if (aliveEnemies.length > 0) {
        const damage = Math.floor(Math.random() * 5) + 3;
        setCurrentHealth((prev) => {
          const newHealth = Math.max(0, prev - damage);
          if (newHealth === 0) {
            endCombat();
          }
          return newHealth;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [combatState.isActive, enemies]);

  if (!playerStats) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 3D Arena */}
      <View style={styles.arenaContainer}>
        <CombatArena3D
          enemies={enemies}
          playerHealth={currentHealth}
          onEnemyHit={handleEnemyHit}
        />
      </View>

      {/* Top HUD */}
      <View style={styles.topHUD}>
        <View style={styles.statBar}>
          <Text style={styles.statLabel}>HP</Text>
          <View style={styles.barContainer}>
            <View
              style={[styles.barFill, { width: `${(currentHealth / playerStats.maxHealth) * 100}%`, backgroundColor: '#4caf50' }]}
            />
          </View>
          <Text style={styles.statText}>{Math.floor(currentHealth)}/{playerStats.maxHealth}</Text>
        </View>

        <View style={styles.statBar}>
          <Text style={styles.statLabel}>SP</Text>
          <View style={styles.barContainer}>
            <View
              style={[styles.barFill, { width: `${(currentStamina / playerStats.maxStamina) * 100}%`, backgroundColor: '#2196f3' }]}
            />
          </View>
          <Text style={styles.statText}>{Math.floor(currentStamina)}/{playerStats.maxStamina}</Text>
        </View>

        {combatState.isActive && (
          <View style={styles.waveInfo}>
            <Text style={styles.waveText}>Wave {combatState.wave}</Text>
            <Text style={styles.scoreText}>Score: {combatState.score}</Text>
          </View>
        )}
      </View>

      {/* Combat Controls */}
      {combatState.isActive ? (
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.dodgeButton]}
            onPress={dodge}
            disabled={currentStamina < 15}
          >
            <Text style={styles.controlButtonText}>DODGE</Text>
            <Text style={styles.controlButtonCost}>15 SP</Text>
          </TouchableOpacity>

          <View style={styles.attackButtons}>
            <TouchableOpacity
              style={[styles.controlButton, styles.lightAttackButton]}
              onPress={() => performAttack('light')}
              disabled={isAttacking || currentStamina < 10}
            >
              <Text style={styles.controlButtonText}>LIGHT</Text>
              <Text style={styles.controlButtonCost}>10 SP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.heavyAttackButton]}
              onPress={() => performAttack('heavy')}
              disabled={isAttacking || currentStamina < 20}
            >
              <Text style={styles.controlButtonText}>HEAVY</Text>
              <Text style={styles.controlButtonCost}>20 SP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.specialAttackButton]}
              onPress={() => performAttack('special')}
              disabled={isAttacking || currentStamina < 30}
            >
              <Text style={styles.controlButtonText}>SPECIAL</Text>
              <Text style={styles.controlButtonCost}>30 SP</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.controlButton, styles.endButton]}
            onPress={endCombat}
          >
            <Text style={styles.controlButtonText}>END</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.startContainer}>
          <TouchableOpacity style={styles.startButton} onPress={startCombat}>
            <Text style={styles.startButtonText}>START COMBAT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>BACK TO MENU</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  arenaContainer: {
    flex: 1,
  },
  topHUD: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
  },
  statBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    width: 30,
  },
  barContainer: {
    flex: 1,
    height: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  barFill: {
    height: '100%',
  },
  statText: {
    color: '#fff',
    fontSize: 12,
    width: 60,
    textAlign: 'right',
  },
  waveInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(211, 47, 47, 0.7)',
    borderRadius: 8,
  },
  waveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scoreText: {
    color: '#ffd700',
    fontSize: 14,
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  controlButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  dodgeButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.8)',
  },
  attackButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  lightAttackButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
  },
  heavyAttackButton: {
    backgroundColor: 'rgba(255, 152, 0, 0.8)',
  },
  specialAttackButton: {
    backgroundColor: 'rgba(156, 39, 176, 0.8)',
  },
  endButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  controlButtonCost: {
    color: '#fff',
    fontSize: 10,
    marginTop: 2,
  },
  startContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#d32f2f',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default GameArenaScreen;
