import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useWatchlist } from '../../context/WatchlistContext';

export default function WatchlistScreen() {
  // Grab the current watchlist and the function to remove anime,
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const router = useRouter();
  // If the list is empty, show a simple message
  if (watchlist.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your watchlist is empty.</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={watchlist}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/tabs/discover/details',
              params: { anime: JSON.stringify(item) }
            })
          }
        >
          <View style={styles.card}>
            <Image 
            source={{ uri: item.coverImage?.large }} 
            resizeMode='cover'
            style={{width:60, height:40}} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title.romaji || item.title.english}</Text>
              <Text style={styles.genre}>{item.genres?.join(', ')}</Text>
              <Text style={styles.score}>⭐ {item.averageScore}/100</Text>
              <TouchableOpacity onPress={() => removeFromWatchlist(item.id)}>
                <Text style={styles.remove}>Remove from Watchlist</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
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
    padding: 16
  },
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6
  },
  image: {
    width: 60,
    height: 80,
    marginRight: 10,
    borderRadius: 4
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  genre: {
    fontSize: 13,
    color: '#555'
  },
  score: {
    fontSize: 13,
    color: '#777'
  },
  remove: {
    color: 'red',
    marginTop: 4,
    fontSize: 12
  }
});