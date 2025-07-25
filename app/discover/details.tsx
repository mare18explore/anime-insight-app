import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    Button,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function AnimeDetails() {
  const { anime } = useLocalSearchParams();

  // Parse the anime object passed from previous screen
  const parsed = typeof anime === 'string' ? JSON.parse(anime) : anime;

  // Just in case description is missing or full object isn't passed
  const cleanDescription = parsed?.description
    ? parsed.description.replace(/<[^>]+>/g, '')
    : 'No description available.';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Smaller image */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: parsed.coverImage?.large }}
          style={styles.cover}
          resizeMode="contain"
        />
      </View>

      {/* title */}
      <Text style={styles.title}>{parsed.title?.romaji}</Text>

      {/* Rating out of 100 */}
      <Text style={styles.info}>Rating: {parsed.averageScore ?? 'N/A'}/100</Text>

      {/* Genre list */}
      <Text style={styles.info}>
        Genres: {parsed.genres?.join(', ') || 'N/A'}
      </Text>

      {/* description */}
      <Text style={styles.description}>{cleanDescription}</Text>

      {/* Watchlist button NOT DONEEE!!*/}
      <Button title="Add to Watchlist" onPress={() => {}} />
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
  }
});