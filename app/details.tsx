import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
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
  // loggedIn Boolean is true if user signed in the firebase auth
  const user = getAuth().currentUser;
  const isLoggedIn = !!user;
  const navigation = useNavigation();
  const router = useRouter();
  // grab the anime object passed in the route params
  const { anime } = useLocalSearchParams();
  
  const { addToWatchlist, watchlist} = useWatchlist();
  // track if this anime is already in the user's watchlist
	const [alreadyAdded, setAlreadyAdded] = useState(false);
  // Set default values for the watchlist button
  let buttonTitle = 'Login to Add';
  let isDisabled = true;
  // update button label and disabled state based on conditions
  if (alreadyAdded) {
    buttonTitle = 'Added to Watchlist';
  } else if (isLoggedIn) {
    buttonTitle = 'Add to Watchlist';
    isDisabled = false;
  }
  // Parse the anime object passed from previous screen
  const parsed = anime && typeof anime === 'string' ? JSON.parse(anime) : anime;
  

  // Just in case description is missing or full object isn't passed
  const cleanDescription = parsed?.description
    ? parsed.description.replace(/<[^>]+>/g, '')
    : 'No description available.';

	useEffect(() => {
    // putting checker b/c i assumed valdiity ealier 
    if (!parsed?.id) 
      return;
    const exists = watchlist.some((item) => item?.anime?.id === parsed?.id);
    setAlreadyAdded(exists);
  }, [watchlist]);
  // confriming if anime is doubplicated 
  useEffect(() => {
     if (!Array.isArray(watchlist)) {
      console.warn('Watchlist is not an array yet:', watchlist);
      return;
    }

    const safeIds = watchlist
      .map((a) => (a && a.anime && a.anime.id !== undefined ? a.anime.id : null))
      .filter((id) => id !== null);
    console.log('Watchlist updated (safe IDs):', safeIds);
    console.log('Checking for anime ID:', parsed?.id);
  }, [watchlist])

  const handleAdd = () => {
    // early validation
    if (!parsed || !parsed.id) {
      console.warn('Parsed anime is invalid:', parsed);
      return;
    }
    if (alreadyAdded) 
      return;

    // msg when not logged in to redirect 
    if (!isLoggedIn) {
      Alert.alert('Login Required', 'Please login to add anime to your watchlist.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => router.push('/authentifcation/login') }
      ]);
      return;
    }
    addToWatchlist(parsed);
    Alert.alert('Added to Watchlist');
    setAlreadyAdded(true);
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => router.replace('/tabs/watchlist')}
        style={styles.backButton}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.imageWrapper}>
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

      {!isLoggedIn ? (
        <TouchableOpacity onPress={handleAdd} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login to Add</Text>
        </TouchableOpacity>
      ) : (
        <Button title={buttonTitle} onPress={handleAdd} disabled={alreadyAdded} />
      )}

      {/* Rating out of 100 */}
      <Text style={styles.info}>Rating: {parsed.averageScore ?? 'N/A'}/100</Text>

      {/* Genre list */}
      <Text style={styles.info}>
        Genres: {parsed.genres?.join(', ') || 'N/A'}
      </Text>

      {/* description */}
      <Text style={styles.description}>{cleanDescription}</Text>
          
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
    marginTop: 30, 
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
    borderRadius: 10
  },

  backText: {
    fontSize: 16,
    color: '#007aff',
  },
  loginButton: {
    backgroundColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 10
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16
  }
});