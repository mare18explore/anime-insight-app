import axios from 'axios';

// Simple function to search anime by title
export const searchAnime = async (title) => {
  // GraphQL query to fetch anime data from AniList API
  const query = `
    query ($search: String) {
      Page(perPage: 10) {
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
          }
          description
          genres
          averageScore
          coverImage {
            large
          }
        }
      }
    }
  `;

  const variables = { search: title };

  try {
    // POST request to AniList 
    const response = await axios.post(
      'https://graphql.anilist.co',
      { query, variables },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Returns the list of anime found
    return response.data.data.Page.media;
  } catch (error) {
    console.error('Anime search failed:', error);
    return [];
  }
};