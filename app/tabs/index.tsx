import { ScrollView, StyleSheet, Text, View } from 'react-native';
import HomeAnimeAiring from '../../components/HomeAnimeAiring';
import ProfileMenu from '../../components/ProfileMenu';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      {/* Profile icon */}
      <ProfileMenu />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>This Week in Anime 
        </Text>

        {/* Popular currently airing anime */}
        <HomeAnimeAiring/>
      </ScrollView>
    </View>
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