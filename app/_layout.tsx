import { Slot } from 'expo-router';
import { WatchlistProvider } from '../context/WatchlistContext'; // adjust path if needed

export default function RootLayout() {
  return (
    <WatchlistProvider>
      <Slot />
    </WatchlistProvider>
  );
}