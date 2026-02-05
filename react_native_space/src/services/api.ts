import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_BASE_URL = 'https://windsadventure.abacusai.app';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.clearToken();
        }
        return Promise.reject(error);
      }
    );
  }

  private async getToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem('authToken');
      }
      return await SecureStore.getItemAsync('authToken');
    } catch {
      return null;
    }
  }

  private async setToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem('authToken', token);
      } else {
        await SecureStore.setItemAsync('authToken', token);
      }
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  }

  private async clearToken(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('authToken');
      } else {
        await SecureStore.deleteItemAsync('authToken');
      }
    } catch (error) {
      console.error('Failed to clear token:', error);
    }
  }

  // Auth APIs
  async register(username: string, email: string, password: string) {
    const response = await this.api.post('/auth/register', { username, email, password });
    if (response.data.access_token) {
      await this.setToken(response.data.access_token);
    }
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      await this.setToken(response.data.access_token);
    }
    return response.data;
  }

  async logout() {
    await this.clearToken();
  }

  // Player APIs
  async getProfile() {
    const response = await this.api.get('/player/profile');
    return response.data;
  }

  async getStats() {
    const response = await this.api.get('/player/stats');
    return response.data;
  }

  async allocateStatPoint(stat: string) {
    const response = await this.api.post('/player/stats/allocate', { stat });
    return response.data;
  }

  // Skills APIs
  async getAvailableSkills() {
    const response = await this.api.get('/skills/available');
    return response.data;
  }

  async getPlayerSkills() {
    const response = await this.api.get('/skills/player');
    return response.data;
  }

  async unlockSkill(skillId: string) {
    const response = await this.api.post('/skills/unlock', { skillId });
    return response.data;
  }

  // Inventory APIs
  async getInventory() {
    const response = await this.api.get('/inventory');
    return response.data;
  }

  async equipItem(itemId: string) {
    const response = await this.api.post('/inventory/equip', { itemId });
    return response.data;
  }

  async unequipItem(itemId: string) {
    const response = await this.api.post('/inventory/unequip', { itemId });
    return response.data;
  }

  async useItem(itemId: string) {
    const response = await this.api.post('/inventory/use', { itemId });
    return response.data;
  }

  // Quests APIs
  async getActiveQuests() {
    const response = await this.api.get('/quests/active');
    return response.data;
  }

  async getAvailableQuests() {
    const response = await this.api.get('/quests/available');
    return response.data;
  }

  async acceptQuest(questId: string) {
    const response = await this.api.post('/quests/accept', { questId });
    return response.data;
  }

  async updateQuestProgress(questId: string, progress: number) {
    const response = await this.api.post('/quests/progress', { questId, progress });
    return response.data;
  }

  async completeQuest(questId: string) {
    const response = await this.api.post('/quests/complete', { questId });
    return response.data;
  }

  // Progress APIs
  async getProgress() {
    const response = await this.api.get('/progress');
    return response.data;
  }

  async updateProgress(data: any) {
    const response = await this.api.post('/progress/update', data);
    return response.data;
  }

  // Leaderboard APIs
  async getLeaderboard(limit: number = 10) {
    const response = await this.api.get(`/leaderboard?limit=${limit}`);
    return response.data;
  }
}

export default new ApiService();
