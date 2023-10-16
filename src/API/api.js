// api.js

const BASE_URL = 'https://script.google.com/macros/s/AKfycbwFh-0-D5QFZbP8Coyso1AsPWRd2n9tw1QKp9kIfBKYjaRAJ3GUKRiYH5uo7TNTi9zb3Q/exec';

export const fetchData = async (action, payload) => {
    try {
        let url = BASE_URL + '?action=' + action
        if (payload) {
            url = url + payload;
        }
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
