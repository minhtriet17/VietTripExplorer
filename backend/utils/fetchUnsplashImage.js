import axios from 'axios';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export const fetchUnsplashImage = async (query) => {
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        per_page: 1,
        orientation: 'landscape',
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (response.data.results.length > 0) {
      const photo = response.data.results[0];
      return {
        url: photo.urls.regular,
        alt: photo.alt_description,
        author: photo.user.name,
        author_link: photo.user.links.html,
      };
    }

    return null;
  } catch (error) {
    console.error('Unsplash fetch error:', error.message);
    return null;
  }
};