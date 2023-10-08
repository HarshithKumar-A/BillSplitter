// api.js

const BASE_URL = 'https://script.google.com/macros/s/AKfycbzuPpPiwZ9PbSBA_givcPuA690U22w_gYAU3louESGygH40JOQHY6F-I9PKTB3IEulg6A/exec';

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
