import { ScrollView, StyleSheet, Text } from 'react-native';
import HomeAnimeAiring from '../../components/HomeAnimeAiring';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>This Week in Anime 
      </Text>

      {/* Popular currently airing anime */}
      <HomeAnimeAiring/>

      {/* Later: genre filters, top anime, etc */}
      {/* <GenreExploreSection /> */}
      {/* <TopAnimeSection /> */}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});