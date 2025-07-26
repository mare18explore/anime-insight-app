import { Tabs } from 'expo-router';
import { WatchlistProvider } from './context/WatchlistContext';
export default function Layout() {
  return (
    // global state
     <WatchlistProvider>
      <Tabs>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="watchlist" options={{ title: 'Watchlist' }} />
        <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
        <Tabs.Screen name="news" options={{ title: 'News' }} />
      </Tabs>
    </WatchlistProvider>
  );
}