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
      horizontal={true}
      keyExtractor={(item) => item.id.toString()}

      renderItem={({ item }) => (
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/details',
                params: { anime: JSON.stringify(item) }
              })
            }
          >  
            <Text style={styles.title}  numberOfLines={2}>
                {item.title?.romaji || item.title?.english || 'Untitled'}
           
            </Text>
            <Image 
              source={{ uri: item.coverImage?.large }} 
              resizeMode='cover'
              style={styles.image}
            />
          </TouchableOpacity>
              
          <TouchableOpacity 
            style={styles.removeButton} 
            onPress={() => removeFromWatchlist(item.id)}
          >
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
            
        </View>
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
    padding: 16,
    flex: 1
  },
  card: {
    alignItems: 'center',
    marginRight: 16,
    padding: 8,
    backgroundColor: '#blue',
    borderRadius: 10,
    width: 140,
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