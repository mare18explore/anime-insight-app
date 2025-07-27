import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useWatchlist } from '../context/WatchlistContext';

export default function AnimeDetails() {
  const router = useRouter();
  const { anime } = useLocalSearchParams();
  
  const { addToWatchlist, watchlist} = useWatchlist();

	const [alreadyAdded, setAlreadyAdded] = useState(false);
  // Parse the anime object passed from previous screen
  const parsed = typeof anime === 'string' ? JSON.parse(anime) : anime;
  

  // Just in case description is missing or full object isn't passed
  const cleanDescription = parsed?.description
    ? parsed.description.replace(/<[^>]+>/g, '')
    : 'No description available.';

	useEffect(() => {
    const exists = watchlist.some((item) => item.id === parsed.id);
    setAlreadyAdded(exists);
  }, [watchlist]);

  const handleAdd = () => {
    if (alreadyAdded) 
      return;
    addToWatchlist(parsed);
    Alert.alert('Added to Watchlist');
    setAlreadyAdded(true);
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Smaller image */}
      <View style={styles.imageWrapper}>
         {/* router back lets me go back to prev screen, so im naviagting using router,
         back button with back test and inputted styles below */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: parsed.coverImage?.large }}
          style={styles.cover}
          resizeMode="contain"
        />
      </View>

      {/* title */}
      <Text style={styles.title}>
        {parsed.title?.romaji || parsed.title?.english || 'Untitled'}
      </Text>

      {/* Rating out of 100 */}
      <Text style={styles.info}>Rating: {parsed.averageScore ?? 'N/A'}/100</Text>

      {/* Genre list */}
      <Text style={styles.info}>
        Genres: {parsed.genres?.join(', ') || 'N/A'}
      </Text>

      {/* description */}
      <Text style={styles.description}>{cleanDescription}</Text>

      {/* Watchlist button NOT DONEEE!!*/}
      <Button title={alreadyAdded ? 'Added to Watchlist' : 'Add to Watchlist'} 
				onPress={handleAdd}
        disabled={alreadyAdded}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 12
  },
  cover: {
    width: 200,       
    height: 300,
    borderRadius: 8
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  info: {
    fontSize: 16,
    marginBottom: 4
  },
  description: {
    marginTop: 12,
    fontSize: 14,
    color: '#555'
  },
  backButton: {
  marginBottom: 12,
  paddingVertical: 6,
  paddingHorizontal: 12,
  alignSelf: 'flex-start',
  backgroundColor: '#eee',
  borderRadius: 6,
},

backText: {
  fontSize: 16,
  color: '#007aff',
}
});