import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import apiService from '../services/api';
import { InventoryItem } from '../types';

const InventoryScreen: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadInventory();
    }, [])
  );

  const loadInventory = async () => {
    try {
      const data = await apiService.getInventory();
      setInventory(data);
    } catch (error) {
      console.error('Failed to load inventory:', error);
    }
  };

  const handleEquip = async (itemId: string, equipped: boolean) => {
    setLoading(true);
    try {
      if (equipped) {
        await apiService.unequipItem(itemId);
      } else {
        await apiService.equipItem(itemId);
      }
      await loadInventory();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUse = async (itemId: string) => {
    setLoading(true);
    try {
      await apiService.useItem(itemId);
      await loadInventory();
      Alert.alert('Success', 'Item used!');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to use item');
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY': return '#ff00ff';
      case 'EPIC': return '#9c27b0';
      case 'RARE': return '#2196f3';
      default: return '#4caf50';
    }
  };

  const groupedInventory = inventory.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, InventoryItem[]>);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎒 INVENTORY</Text>
      </View>

      <ScrollView>
        {Object.entries(groupedInventory).map(([type, items]) => (
          <View key={type} style={styles.section}>
            <Text style={styles.sectionTitle}>{type}S</Text>
            {items.map((item) => (
              <View key={item.id} style={[styles.itemCard, { borderLeftColor: getRarityColor(item.rarity) }]}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, { color: getRarityColor(item.rarity) }]}>
                      {item.name} {item.equipped && '✓'}
                    </Text>
                    <Text style={styles.itemRarity}>{item.rarity}</Text>
                  </View>
                  {item.quantity > 1 && (
                    <Text style={styles.quantity}>x{item.quantity}</Text>
                  )}
                </View>

                <Text style={styles.itemDescription}>{item.description}</Text>

                {item.statBonus && (
                  <View style={styles.statBonuses}>
                    {Object.entries(item.statBonus).map(([stat, value]) => (
                      value && <Text key={stat} style={styles.statBonus}>+{value} {stat}</Text>
                    ))}
                  </View>
                )}

                <View style={styles.itemActions}>
                  {item.type !== 'CONSUMABLE' && (
                    <TouchableOpacity
                      style={[styles.actionButton, item.equipped && styles.unequipButton]}
                      onPress={() => handleEquip(item.id, item.equipped)}
                      disabled={loading}
                    >
                      <Text style={styles.actionButtonText}>
                        {item.equipped ? 'UNEQUIP' : 'EQUIP'}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {item.type === 'CONSUMABLE' && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleUse(item.id)}
                      disabled={loading}
                    >
                      <Text style={styles.actionButtonText}>USE</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        ))}
        {inventory.length === 0 && (
          <Text style={styles.emptyText}>Your inventory is empty</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#d32f2f',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffd700',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemRarity: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  quantity: {
    fontSize: 16,
    color: '#ffd700',
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  statBonuses: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  statBonus: {
    fontSize: 12,
    color: '#4caf50',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  unequipButton: {
    backgroundColor: '#757575',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
});

export default InventoryScreen;
