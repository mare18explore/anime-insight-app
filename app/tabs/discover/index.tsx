import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { searchAnime } from '../../../api/anilist';
import type { AnimeResult } from '../../../utils/types';

export default function AnimeSearch() {
  const router = useRouter();

  // Holds what user types into the search box
  const [query, setQuery] = useState('');

  // stores anime returned from AniList
  const [results, setResults] = useState<AnimeResult[]>([]);

  // Auto search as user types (when query is at least 3 characters)
  useEffect(() => {
    const fetchData = async () => {
      if (query.length >= 3) {
        const data = await searchAnime(query);
        setResults(data);
      }
    };

    fetchData();
  }, [query]);

  // Manual search if user taps button
  const handleSearch = async () => {
    if (!query) return;
    const data = await searchAnime(query);
    setResults(data);
  };

  return (
    <View style={styles.wrapper}>
      {/* Search input */}
      <TextInput
        placeholder="Search anime..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      {/* Button for manual search */}
      <Button title="Search" onPress={handleSearch} />
			
      {/* List of anime results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            // Navigate to details screen with serialized anime object
            onPress={() =>
              router.push({
                pathname: '../details',
                params: { anime: JSON.stringify(item) }
              })
            }
          >	
            <View style={styles.card}>
							<Image source={{ uri: item.coverImage?.large }} style={styles.image} />
							<View style={{ flex: 1 }}>
								<Text style={styles.title}>{item.title.romaji || item.title.english}</Text>
								<Text style={styles.genre}>{item.genres?.join(', ')}</Text>
								<Text style={styles.score}>⭐ {item.averageScore}/100</Text>
							</View>
						</View>
          </TouchableOpacity>
        )}
				contentContainerStyle={styles.container}
    		keyboardShouldPersistTaps="handled"
      />
			
			{results.length === 0 && query.length >= 3 && (
				<Text style={{ textAlign: 'center', marginTop: 20 }}>No results found.</Text>
			)}
    </View>
  );
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1, // allows full height
		backgroundColor: '#fff',
	},
  container: {
    padding: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4
  },
  result: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
	card: {
    flexDirection: 'row',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  image: {
    width: 60,
    height: 80,
    marginRight: 10,
    borderRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  genre: {
    fontSize: 13,
    color: '#555',
  },
  score: {
    fontSize: 13,
    color: '#777',
  },
});