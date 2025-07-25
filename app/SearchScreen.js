import { useState } from 'react';
import { Button, FlatList, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { searchAnime } from '../api/anilist'; // adjust if your path is different

export default function SearchScreen() {
  // stores user search input then stores array of reutnred anime from api
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
	// updates results anime data frim API when search is pressed (dont froget to handle)
  const runSearch = async () => {
    const animeResults = await searchAnime(query);
    setResults(animeResults);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search anime..."
				// binds input into the query
        value={query}
				// updates state as user types
        onChangeText={setQuery}
        style={styles.input}
      />
		
      <Button title="Search" onPress={runSearch} />
			
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
				// each anime gets a card
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.coverImage.large }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title.romaji || item.title.english}</Text>
              <Text style={styles.genre}>{item.genres.join(', ')}</Text>
              <Text style={styles.score}>⭐ {item.averageScore}/100</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// 🔹 Basic styling
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    borderColor: '#aaa',
    borderWidth: 1,
    padding: 8,
    marginBottom: 12,
    borderRadius: 5,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  image: { width: 60, height: 80, marginRight: 10, borderRadius: 4 },
  title: { fontSize: 16, fontWeight: 'bold' },
  genre: { fontSize: 13, color: '#555' },
  score: { fontSize: 13, color: '#777' },
});