import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native';

import { fetchRecommendations } from '../api/anilist'; // helper function to fetch similar anime
import { useWatchlist } from '../context/WatchlistContext';

export default function SimilarAnimeScreen() {
	// basic type for each recommended anime
	type RecommendedAnime = {
		id: number;
		title: {
			english?: string;
			romaji?: string;
		};
		coverImage: {
			large: string;
		};
	};
	// get the anime ID passed from episode-tracker
  const { animeId } = useLocalSearchParams(); 
	
  const router = useRouter();
  const navigation = useNavigation();
	// context function to add anime to watchlist
  const { addToWatchlist } = useWatchlist(); 
	 // show spinner while loading
  const [loading, setLoading] = useState(true);
	const [recommendations, setRecommendations] = useState<RecommendedAnime[]>([]);

  useEffect(() => {
    // fetch similar anime based on the current animeId
    const load = async () => {
			 // call AniList API
      const data = await fetchRecommendations(animeId);
			// fallback to empty array if nothing returned
      setRecommendations(data || []); 
      // hide spinner
			setLoading(false); 
    };

    load();
  }, []);

  // if data is still loading, show spinner
  if (loading) {
    return (
      <ActivityIndicator size="large" style={{ marginTop: 40 }} />
    );
  }

  return (
		<ScrollView contentContainerStyle={styles.scrollContent}>
			<TouchableOpacity
				onPress={() => {
					if (navigation.canGoBack?.()) {
						router.back();
					} else {
						router.replace('/');
					}
				}}
				style={styles.backButton}
			>
				<Text style={styles.backText}>← Back</Text>
			</TouchableOpacity>

			{recommendations.map((item) => (
				<View key={item.id} style={styles.card}>
					<Image
						source={{ uri: item.coverImage.large }}
						style={styles.image}
						resizeMode="cover"
					/>
					<Text style={styles.title}>
						{item.title.english || item.title.romaji}
					</Text>
					<TouchableOpacity
						style={styles.addBtn}
						onPress={() => {
							addToWatchlist({
								...item,
								title: {
									english: item.title.english ?? '',
									romaji: item.title.romaji ?? '',
								},
								coverImage: {
									large: item.coverImage.large ?? '',
								},
							});
						}}
					>
						<Text style={styles.addBtnText}>Add to Watchlist</Text>
					</TouchableOpacity>
				</View>
			))}
		</ScrollView>
	);
}

// basic styles for the recommendation screen
const styles = StyleSheet.create({
  backButton: {
    marginBottom: 12,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  backText: {
    fontSize: 15,
    color: '#4af',
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 10,
  },
  image: {
    width: '25%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addBtn: {
    backgroundColor: '#4af',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  addBtnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});