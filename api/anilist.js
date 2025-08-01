import axios from 'axios';
// This module uses the AniList GraphQL API to fetch anime search results and details
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
// Fetch full anime details by ID
export const fetchAnimeDetails = async (id) => {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
        }
        episodes
        status
        format
        season
        seasonYear
        nextAiringEpisode {
          episode
          timeUntilAiring
        }
        coverImage {
          large
        }
        description
        genres
        averageScore
      }
    }
  `;

  const variables = { id };

  try {
    const response = await axios.post(
      'https://graphql.anilist.co',
      { query, variables },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data.Media;
  } catch (error) {
    console.error('Failed to fetch anime details:', error);
    return null;
  }
};