import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import apiService from '../services/api';
import { PlayerStats, PlayerSkill, Skill } from '../types';
import { useAuth } from '../contexts/AuthContext';

const CharacterScreen: React.FC = () => {
  const { player, refreshProfile } = useAuth();
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [playerSkills, setPlayerSkills] = useState<PlayerSkill[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const [statsData, playerSkillsData, availableSkillsData] = await Promise.all([
        apiService.getStats(),
        apiService.getPlayerSkills(),
        apiService.getAvailableSkills(),
      ]);
      setStats(statsData);
      setPlayerSkills(playerSkillsData);
      setAvailableSkills(availableSkillsData);
    } catch (error) {
      console.error('Failed to load character data:', error);
    }
  };

  const allocateStat = async (stat: string) => {
    if (!player || player.skillPoints === 0) return;
    
    setLoading(true);
    try {
      await apiService.allocateStatPoint(stat);
      await refreshProfile();
      await loadData();
      Alert.alert('Success', `${stat} increased!`);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to allocate stat');
    } finally {
      setLoading(false);
    }
  };

  const unlockSkill = async (skillId: string) => {
    setLoading(true);
    try {
      await apiService.unlockSkill(skillId);
      await refreshProfile();
      await loadData();
      Alert.alert('Success', 'Skill unlocked!');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to unlock skill');
    } finally {
      setLoading(false);
    }
  };

  if (!player || !stats) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{player.username}</Text>
          <Text style={styles.level}>Level {player.level}</Text>
          <Text style={styles.exp}>XP: {player.experience}</Text>
          <Text style={styles.skillPoints}>Skill Points: {player.skillPoints}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚔️ STATS</Text>
          {[
            { name: 'Health', value: stats.maxHealth, key: 'health' },
            { name: 'Stamina', value: stats.maxStamina, key: 'stamina' },
            { name: 'Attack', value: stats.attack, key: 'attack' },
            { name: 'Defense', value: stats.defense, key: 'defense' },
          ].map((stat) => (
            <View key={stat.key} style={styles.statRow}>
              <Text style={styles.statName}>{stat.name}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <TouchableOpacity
                style={[styles.allocateButton, player.skillPoints === 0 && styles.disabledButton]}
                onPress={() => allocateStat(stat.key)}
                disabled={loading || player.skillPoints === 0}
              >
                <Text style={styles.allocateButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Unlocked Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🥋 UNLOCKED SKILLS</Text>
          {playerSkills.length === 0 ? (
            <Text style={styles.emptyText}>No skills unlocked yet</Text>
          ) : (
            playerSkills.map((skill) => (
              <View key={skill.id} style={styles.skillCard}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.skillDescription}>{skill.description}</Text>
                <View style={styles.skillDetails}>
                  <Text style={styles.skillDetail}>Category: {skill.category}</Text>
                  {skill.damageMultiplier && (
                    <Text style={styles.skillDetail}>Damage: {skill.damageMultiplier}x</Text>
                  )}
                  {skill.staminaCost && (
                    <Text style={styles.skillDetail}>Cost: {skill.staminaCost} SP</Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        {/* Available Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📜 AVAILABLE SKILLS</Text>
          {availableSkills.length === 0 ? (
            <Text style={styles.emptyText}>No skills available to unlock</Text>
          ) : (
            availableSkills.map((skill) => (
              <View key={skill.id} style={styles.skillCard}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.skillDescription}>{skill.description}</Text>
                <View style={styles.skillDetails}>
                  <Text style={styles.skillDetail}>Level Required: {skill.levelRequired}</Text>
                  <Text style={styles.skillDetail}>Cost: {skill.skillPointCost} SP</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.unlockButton,
                    (player.level < skill.levelRequired || player.skillPoints < skill.skillPointCost) && styles.disabledButton,
                  ]}
                  onPress={() => unlockSkill(skill.id)}
                  disabled={loading || player.level < skill.levelRequired || player.skillPoints < skill.skillPointCost}
                >
                  <Text style={styles.unlockButtonText}>UNLOCK</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#d32f2f',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffd700',
  },
  level: {
    fontSize: 20,
    color: '#fff',
    marginTop: 8,
  },
  exp: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 4,
  },
  skillPoints: {
    fontSize: 18,
    color: '#4caf50',
    marginTop: 8,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  statName: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    color: '#ffd700',
    fontWeight: 'bold',
    marginRight: 16,
  },
  allocateButton: {
    backgroundColor: '#4caf50',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allocateButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#555',
    opacity: 0.5,
  },
  skillCard: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  skillName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  skillDescription: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  skillDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  skillDetail: {
    fontSize: 12,
    color: '#ffd700',
  },
  unlockButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  unlockButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default CharacterScreen;
