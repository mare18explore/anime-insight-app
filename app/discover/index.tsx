import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	Button,
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';

import { searchAnime } from '../../api/anilist';
import type { AnimeResult } from '../../app/types';

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
    <View style={styles.container}>
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
                pathname: '/discover/details',
                params: { anime: JSON.stringify(item) }
              })
            }
          >
            <Text style={styles.result}>
              {item.title?.romaji || 'No Title'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  }
});