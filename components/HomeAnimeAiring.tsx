import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Converts seconds into "Xd Xh Xm" format
const formatTime = (seconds: number) => {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
};

interface AnimeItem {
  id: number;
  title: string;
  episode: number | string;
  airingAt: string;
  timeRemaining: string;
  coverImage: {
    large: string;
  };
}

export default function HomeAnimeAiring() {
  // Genres user can choose from (used for filtering)
  const genres = ['All', 'Action','Adventure', 'Comedy', 'Romance', 'Mystery', 'Sports', 'Fantasy', 'Psychological', 'Thriller'];
  const [loading, setLoading] = useState(true);
  const [airingList, setAiringList] = useState<AnimeItem[]>([]);
  const router = useRouter();
  // Run once when component mounts
  // changes for each slected genre, rerun everytime genre changes 
  const [selectedGenre, setSelectedGenre] = useState('All');
  useEffect(() => {
    fetchAiringAnime();
  }, [selectedGenre]);

  const fetchAiringAnime = async () => {
    setLoading(true);

    // AniList GraphQL query
    const query = `
      query ($genre: [String]) {
        Page(page: 1, perPage: 10) {
          media(
            sort: POPULARITY_DESC,
            type: ANIME,
            status: RELEASING,
            genre_in: $genre
          ) {
            id
            title {
              romaji
              english
            }
            nextAiringEpisode {
              episode
              airingAt
              timeUntilAiring
            }
            coverImage {
              large
            }
            description
            averageScore
            genres
          }
        }
      }
    `;

    try {
      const res = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {
            genre: selectedGenre === 'All' ? null : selectedGenre
          }
        })
      });

      const json = await res.json();
      if (!json?.data?.Page?.media) {
        console.error('AniList error:', JSON.stringify(json, null, 2));
        setAiringList([]);
        setLoading(false);
        return;
      }

      // Format the response
      const formatted: AnimeItem[] = json.data.Page.media.map((anime: any) => {
        const title = anime.title.english || anime.title.romaji;
        const ep = anime.nextAiringEpisode?.episode ?? 'N/A';
        const airingTime = anime.nextAiringEpisode?.airingAt
          ? new Date(anime.nextAiringEpisode.airingAt * 1000).toLocaleString()
          : 'Unknown';
        const timeLeft = anime.nextAiringEpisode?.timeUntilAiring
          ? formatTime(anime.nextAiringEpisode.timeUntilAiring)
          : 'N/A';
        
        return {
          id: anime.id,
          title,
          episode: ep,
          airingAt: airingTime,
          timeRemaining: timeLeft,
          coverImage: anime.coverImage,
          description: anime.description,
          averageScore: anime.averageScore,
          genres: anime.genres

        };
      });

      setAiringList(formatted);
    } catch (err) {
      console.log('Error fetching airing anime:', err);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <View style={{ padding: 16 }}>
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  return (
    // RETURNS LIST OF CURRENT AIRING ANIME BUT ADDED IMAGE TO IT THAT REDIRECTS TO DETAILS WHEN PRESSED
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genreScroll}>
          {genres.map((genre) => (
            <TouchableOpacity
              key={genre}
              onPress={() => setSelectedGenre(genre)}
              style={[
                styles.genreButton,
                selectedGenre === genre && styles.selectedGenre
              ]}
            >
              <Text style={styles.genreText}>{genre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.heading}>
          {selectedGenre === 'All' ? '🔥 Popular Airing Anime' : `🎯 Top ${selectedGenre} Anime`}
        </Text>

      <FlatList
        data={airingList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '../details', // adjust this path if needed
                params: { anime: JSON.stringify(item) }
              })
            }
        >
          
          <View style={styles.card}>
            <Image
              source={{ uri: item.coverImage?.large || 'https://placehold.co/100x150' }}
              style={styles.cover}
              resizeMode="cover"
            />
            <View style={{flex:1}}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.info}>Ep {item.episode} — {item.airingAt}</Text>
              <Text style={styles.remaining}>⏳ {item.timeRemaining}</Text>
            </View>
         </View>
        </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  cover: {
    width: 100,
    height: 150,
    borderRadius:10 ,
    marginRight: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 13,
    color: '#555',
  },
  remaining: {
    fontSize: 13,
    color: '#007aff',
    marginTop: 4,
  },
   genreScroll: {
  flexDirection: 'row',
  marginBottom: 10
},
genreButton: {
  paddingHorizontal: 12,
  paddingVertical: 6,
  backgroundColor: '#eee',
  borderRadius: 20,
  marginRight: 8
},
selectedGenre: {
  backgroundColor: '#007aff'
},
genreText: {
  color: '#000'
}
});