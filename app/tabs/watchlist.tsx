import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useWatchlist } from '../../context/WatchlistContext';
type WatchlistEntry = {
  _id: string;
  userId: string;
  anime: {
    id: number;
    title: {
      english?: string;
      romaji?: string;
    };
    coverImage: {
      large: string;
    };
    seasons?: Record<number, number>;
  };
  status: 'watching' | 'completed';
  progress: {
    season: number;
    episode: number;
    watched: boolean;
  }[];
};

export default function WatchlistScreen() {
  // Grab the current watchlist and the function to remove anime,
  // access the watchlist and the remove function from context
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [selectedAnimeId, setSelectedAnimeId] = useState<string | null>(null);
  const router = useRouter();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  
  // If the list is empty, show a simple message
  if (watchlist.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your watchlist is empty.</Text>
      </View>
    );
  }
    // Remove anime from the watchlist by ID
    const handleRemove = (id: number | undefined) => {
    if (!id) {
      console.warn('Tried to delete anime with no ID');
      return;
    }
    removeFromWatchlist(id);
  };

  return (
    <ScrollView contentContainerStyle={styles.grid}>
        {watchlist
          .filter((item) => item.anime && item.anime.coverImage)
          .map((item: WatchlistEntry) => (
          <View key={item._id} style={styles.cardWrapper}>
            <TouchableOpacity
              onPress={() => {
                if (!userId) {
                  alert('You must be logged in');
                  return;
                }
                // Go to the episode tracker screen with userId and anime info
                router.push({
                  pathname: '/episode-tracker',
                  params: {
                    userId,
                    anime: JSON.stringify({
                      id: item.anime.id,
                      title: item.anime.title,
                      seasons: item.anime.seasons || {},
                    }),
                  },
                });
              }}
              onLongPress={() => {
                setSelectedAnimeId(selectedAnimeId === item._id ? null : item._id);
              }}
              style={styles.card}
            >
              <Image
                source={{ uri: item.anime.coverImage?.large }}
                resizeMode='cover'
                style={styles.image}
              />

              <Text style={styles.title} numberOfLines={2}>
                {item.anime.title?.romaji || item.anime.title?.english || 'Untitled'}
              </Text>

              {item.status === 'completed' && (
                <Text style={styles.completed}>✅ Completed</Text>
              )}

              {selectedAnimeId === item._id && (
                <TouchableOpacity
                  onPress={() => handleRemove(item.anime.id)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#777'
  },
  container: {
    padding: 16,
    flex: 1
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: 12,
  },
  cardWrapper: {
    width: '20%',
    padding: 5,
  },
  card: {
    alignItems: 'center',
    marginRight: 15,
    padding: 8,
    backgroundColor: '#aec9caff',
    borderRadius: 15,
    width: 160,
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 10
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom : 5,
    textAlign: 'center',
    height: 40,
  },
  completed: {
    color: '#4caf50',
    fontSize: 12,
    marginBottom: 4,
  },
  removeButton: {
    marginTop: 8,
    backgroundColor: '#ff4d4d',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6
  },

  removeText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center'
  },
});