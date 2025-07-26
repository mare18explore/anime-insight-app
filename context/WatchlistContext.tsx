import React, { createContext, ReactNode, useContext, useState } from 'react';
import type { AnimeResult } from '../utils/types';

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
  const addToWatchlist = (anime: AnimeResult) => {
    setWatchlist((prev) => {
      // Prevent duplicates
      if (prev.find((item) => item.id === anime.id)) 
				return prev;
			// Add the new anime to the list
      return [...prev, anime];
    });
  };
	// Function to remove anime from watchlist by id
  const removeFromWatchlist = (id: number) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id));
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