import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { BASE_URL } from '../api';
import type { AnimeResult } from '../utils/types';

// Define what our Watchlist context should provide to components 
// whta context this should provide 
type WatchlistContextType = {
  watchlist: WatchlistEntry[];
  addToWatchlist: (anime: AnimeResult) => void;
  removeFromWatchlist: (id: number) => void;
};

type WatchlistEntry = {
  _id: string;
  userId: string;
  anime: {
    id: number;
    title: { english?: string; romaji?: string };
    coverImage: { large: string };
    seasons?: Record<number, number>;
  };
  status: 'watching' | 'completed';
  progress: { season: number; episode: number; watched: boolean }[];
};

interface WatchlistContextValue {
  watchlist: WatchlistEntry[];
  removeFromWatchlist: (id: number) => void;
  // any other context values
}
// Create the actual context object
const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

// This component wraps around our app and provides watchlist data to all children
export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
	// Function to add anime to watchlist

  // grab Firebase user
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // listen for auth state changes once
  useEffect(() => {
    // Firebase will call this whenever the user's login state changes
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      // if user is logged in, save their UID
      if (user?.uid) {
        setUserId(user.uid);
      }
    });
    // clean up listener when component unmounts
    return unsubscribe;
  }, []);

  // load saved watchlist from backend when the component mounts
  useEffect(() => {
    if (!userId) return;

    const fetchWatchlist = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/watchlist/${userId}`);

        if (!res.ok) {
          throw new Error(`Server responded with status ${res.status}`);
        }

        const data = await res.json();
        // extract anime object from each item
        const cleaned = data
          .map((entry: { anime: AnimeResult }) => entry.anime)
          .filter((anime: AnimeResult | undefined): anime is AnimeResult => anime !== undefined);
        setWatchlist(data);
      } catch (err) {
        console.error('Failed to load watchlist:', err);
      }
    }

    fetchWatchlist();
  }, [userId]);
  // add anime locally and send to backend
  const addToWatchlist = async (anime: AnimeResult) => {
    // Cant add to watchlist if not logged in or registered 
    if (!userId) {
      Alert.alert('Not Logged In', 'You need to log in to use the watchlist.',
        [
        {text: 'Cancel', style: 'cancel',},
        // update this route if your login screen is in a different path
        {text: 'Go to Login', onPress: () => router.push('/authentifcation/login')}
        ]
      );
      return;
    }
    try {
      await fetch(`${BASE_URL}/api/watchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, anime }),
      });

      //fetch full updated list from backend again
      const res = await fetch(`${BASE_URL}/api/watchlist/${userId}`);
      const data = await res.json();
      setWatchlist(data);
    } catch (err) {
      console.error('Failed to add to watchlist:', err);
    }
  };
	// Function to remove anime from watchlist by id, made edits to get rid of error
  const removeFromWatchlist = async (id: number | undefined) => {
    if (typeof id !== 'number') {
      console.warn('removeFromWatchlist called with invalid id:', id);
      return;
    }

    setWatchlist((prev) => prev.filter((item) => item.anime.id !== id));

    try {
      await fetch(`${BASE_URL}/api/watchlist/${userId}/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Failed to delete from backend:', err);
    }
  };
  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};
// Custom hook to access the context (makes things easier in components)
export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
	// If this is used outside of the provider, throw an error
  if (!context) 
		throw new Error('useWatchlist must be used inside WatchlistProvider');
  return context;
};