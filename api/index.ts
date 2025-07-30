import Constants from 'expo-constants';

// pull from env
export const BASE_URL = Constants.expoConfig?.extra?.BASE_URL ?? 'http://localhost:5055';
