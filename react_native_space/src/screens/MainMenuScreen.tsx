import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { Button } from 'react-native-paper';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const MainMenuScreen: React.FC<Props> = ({ navigation }) => {
  const { player, logout } = useAuth();

  const MenuItem = ({ title, onPress, icon }: { title: string; onPress: () => void; icon: string }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={{ uri: 'https://cdn.abacus.ai/images/b807e121-7461-4952-8765-5b759c2c97e5.png' }}
      style={styles.background}
      blurRadius={2}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>WINDS ADVENTURE</Text>
          <Text style={styles.subtitle}>Combat Arena</Text>
          {player && (
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{player.username}</Text>
              <Text style={styles.playerLevel}>Level {player.level}</Text>
            </View>
          )}
        </View>

        <View style={styles.menuContainer}>
          <MenuItem
            title="ENTER ARENA"
            icon="⚔️"
            onPress={() => navigation.navigate('GameArena')}
          />
          <MenuItem
            title="CHARACTER"
            icon="🧘"
            onPress={() => navigation.navigate('Character')}
          />
          <MenuItem
            title="INVENTORY"
            icon="🎒"
            onPress={() => navigation.navigate('Inventory')}
          />
          <MenuItem
            title="QUESTS"
            icon="📜"
            onPress={() => navigation.navigate('Quests')}
          />
          <MenuItem
            title="LEADERBOARD"
            icon="🏆"
            onPress={() => navigation.navigate('Leaderboard')}
          />
          <MenuItem
            title="SETTINGS"
            icon="⚙️"
            onPress={() => navigation.navigate('Settings')}
          />
        </View>

        <Button
          mode="outlined"
          onPress={logout}
          style={styles.logoutButton}
          textColor="#ffd700"
        >
          LOGOUT
        </Button>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#d32f2f',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffd700',
    textShadowColor: '#d32f2f',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
  },
  playerInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  playerName: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  playerLevel: {
    fontSize: 14,
    color: '#ffd700',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(211, 47, 47, 0.2)',
    borderWidth: 2,
    borderColor: '#d32f2f',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  logoutButton: {
    margin: 24,
    borderColor: '#ffd700',
  },
});

export default MainMenuScreen;
