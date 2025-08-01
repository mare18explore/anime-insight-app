import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { fetchAnimeDetails } from '../api/anilist';

// Inside the component
const router = useRouter();



type Episode = {
  season: number;
  episode: number;
  watched: boolean;
};

export default function EpisodeTrackerScreen() {
  // Get anime info and userId from route params (passed from Watchlist screen)
  const { userId, anime } = useLocalSearchParams();

  if (!userId || !anime) {
    return <Text>Missing anime or userId</Text>;
  }

  const parsedAnime = JSON.parse(anime as string) as {
    id: number;
    title: {
      romaji?: string;
      english?: string;
    };
    seasons: Record<number, number>;
  };

  const [progress, setProgress] = useState<Episode[]>([]);
  const [status, setStatus] = useState<'watching' | 'completed'>('watching');
  const [episodes, setEpisodes] = useState<number>(0);
  const [animeDetails, setAnimeDetails] = useState<any>(null);

  // Reset all state + fetch new data when anime changes
  useEffect(() => {
    setProgress([]);
    setStatus('watching');
    setEpisodes(0);
    setAnimeDetails(null);
    fetchDetails();
    fetchProgress();
  }, [anime]);
  // Fetch detailed anime info from AniList API
  const fetchDetails = async () => {

    try {
      const details = await fetchAnimeDetails(parsedAnime.id);
      setAnimeDetails(details);

      // use API episode count if available and valid
      const apiEp = typeof details?.episodes === 'number' && details.episodes > 0
        ? details.episodes
        : 0;

      // fallback to 1000 episodes for One Piece if nothing passed
      const fallbackEp = apiEp || 1000;

      const fallbackSeasons =
        parsedAnime.seasons && Object.keys(parsedAnime.seasons).length > 0
          ? parsedAnime.seasons
          : { 1: fallbackEp };

      const total = Object.values(fallbackSeasons).reduce((acc, cur) => acc + cur, 0);
      setEpisodes(total);
    } catch (err) {
      console.error('Error fetching anime info', err);
    }
  };
  // Fetch user's watch progress and status from backend
  const fetchProgress = async () => {
    try {
      const res = await fetch(`http://localhost:5055/api/watchlist/${userId}`);
      const data = await res.json();

      const item = data.find(
        (entry: any) => Number(entry.anime.id) === Number(parsedAnime.id)
      );

      if (item) {
        setProgress(item.progress || []);
        setStatus(item.status || 'watching');
      } else {
        setProgress([]);
        setStatus('watching');
      }
    } catch (err) {
      console.error('Failed to load progress', err);
    }
  };
  // Toggle episode as watched/unwatched in backend, then update local state
  const toggleEpisode = async (season: number, episode: number) => {
    const alreadyWatched = progress.find(
      (p) => p.season === season && p.episode === episode
    )?.watched;

    try {
      const res = await fetch(
        `http://localhost:5055/api/watchlist/progress/${userId}/${parsedAnime.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ season, episode, watched: !alreadyWatched }),
        }
      );

      const data = await res.json();
      setProgress(data.progress);
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };
  // mark the entire anime as completed in backend
  const markCompleted = async () => {
    try {
      console.log('Marking as completed...');
      const res = await fetch(
        `http://localhost:5055/api/watchlist/complete/${userId}/${parsedAnime.id}`,
        { method: 'POST' }
      );
      const data = await res.json();
      console.log('Response from server:', data);

      fetchProgress(); // reload progress after marking
    } catch (err) {
      console.error('Error marking completed:', err);
    }
  };

  const isWatched = (season: number, ep: number): boolean => {
    return (
      progress.find((p) => p.season === season && p.episode === ep)?.watched ?? false
    );
  };
// get next episode to watch based on what has already been watched
  const getCurrentEpisode = () => {
    const watched = progress.filter((p) => p.watched);
    if (watched.length === 0) return { season: 1, episode: 1 };

    const latest = watched.sort(
      (a, b) => b.season - a.season || b.episode - a.episode
    )[0];

    return { season: latest.season, episode: latest.episode + 1 };
  };

  const current = getCurrentEpisode();
  const totalWatched = progress.filter((p) => p.watched).length;
  const totalEpisodes = episodes;
  const progressPercent = totalEpisodes > 0 ? totalWatched / totalEpisodes : 0;
  // if seasons are missing, treat the anime as one season with all episodes
  const seasons =
    parsedAnime.seasons && Object.keys(parsedAnime.seasons).length > 0
      ? parsedAnime.seasons
      : { 1: episodes };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={router.back} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>
        {parsedAnime.title.english || parsedAnime.title.romaji || 'Untitled'}
      </Text>

      {status === 'completed' && (
        <Text style={styles.completedLabel}>✅ Completed</Text>
      )}

      <Text style={styles.subtitle}>
        You’re on: S{current.season} E{current.episode}
      </Text>
      <Text style={styles.subtitle}>
        {totalWatched} / {totalEpisodes} episodes watched
      </Text>

      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${progressPercent * 100}%` }]}
        />
      </View>

      {/* Render episodes grouped by season */}
      {Object.entries(seasons).map(([season, count]) => {
        const seasonNum = Number(season);
        const eps = Array.from({ length: count }, (_, i) => i + 1);

        return (
          <View key={seasonNum} style={styles.seasonBlock}>
            <Text style={styles.subtitle}>Season {seasonNum}</Text>
            <View style={styles.episodeGrid}>
              {eps.map((ep) => {
                const watched = isWatched(seasonNum, ep);
                return (
                  <TouchableOpacity
                    key={`${seasonNum}-${ep}`}
                    onPress={() => {
                      if (status === 'completed') return;
                      toggleEpisode(seasonNum, ep);
                    }}
                    style={[
                      styles.episodeBtn,
                      watched && styles.episodeWatched,
                    ]}
                  >
                    <Text style={styles.epText}>Ep {ep}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })}

      <Button title="Mark as Completed" onPress={markCompleted} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 8 },
  seasonBlock: { marginBottom: 24 },
  episodeGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  episodeBtn: {
    backgroundColor: '#444',
    padding: 6,
    borderRadius: 4,
    margin: 4,
  },
  episodeWatched: {
    backgroundColor: '#888',
  },
  epText: { color: 'white' },
  completedLabel: {
    fontSize: 16,
    color: 'green',
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  backBtn: {
  marginBottom: 12,
  },
  backText: {
    fontSize: 16,
    color: '#4af',
  },
});