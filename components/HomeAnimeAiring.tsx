import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

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
}

export default function HomeAnimeAiring() {
  const [loading, setLoading] = useState(true);
  const [airingList, setAiringList] = useState<AnimeItem[]>([]);

  // Run once when component mounts
  useEffect(() => {
    fetchAiringAnime();
  }, []);

  const fetchAiringAnime = async () => {
    setLoading(true);

    // AniList GraphQL query
    const query = `
      query {
        Page(page: 1, perPage: 10) {
          media(sort: POPULARITY_DESC, type: ANIME, status: RELEASING) {
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
        body: JSON.stringify({ query }),
      });

      const json = await res.json();

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
    <View style={styles.container}>
      <Text style={styles.heading}>🔥 Popular Airing Anime</Text>

      <FlatList
        data={airingList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.info}>Ep {item.episode} — {item.airingAt}</Text>
            <Text style={styles.remaining}>⏳ {item.timeRemaining}</Text>
          </View>
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
});