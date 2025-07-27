import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { BASE_URL } from '../api';
import type { AnimeResult } from '../utils/types';

const router = useRouter();
// Define what our Watchlist context should provide to components 
// whta context this should provide 
type WatchlistContextType = {
  watchlist: AnimeResult[];
  addToWatchlist: (anime: AnimeResult) => void;
  removeFromWatchlist: (id: number) => void;
};

// Create the actual context object
const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

// This component wraps around our app and provides watchlist data to all children
export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<AnimeResult[]>([]);
	// Function to add anime to watchlist

  // grab Firebase user
  const [userId, setUserId] = useState<string | null>(null);

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
        const data = await res.json();
        setWatchlist(data);
      } catch (err) {
        console.error('Failed to load watchlist:', err);
      }
    };

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
    setWatchlist((prev) => {
      // Prevent duplicates
      if (prev.find((item) => item.id === anime.id)) 
				return prev;
			// Add the new anime to the list
      return [...prev, anime];
    });
    try {
      await fetch(`${BASE_URL}/api/watchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, anime })
      });
    } catch (err) {
      console.error('Failed to save to backend:', err);
    }
  };
	// Function to remove anime from watchlist by id
  const removeFromWatchlist = async (id: number) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id));
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