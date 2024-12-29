// api.js
import { getTrip } from "./localStorage";

const BASE_URL = [
    'https://script.google.com/macros/s/AKfycbxcUwY54G5RraEfAcM5OedToG8xREMIkf84-KGkAjo-UB_S57l0KSX8djVT2GIyooFYRQ/exec',
    'https://script.google.com/macros/s/AKfycbxRs84pGXVe5h-TKqf4XnNA_WJt9lx5z6cPQuOV6wEkRHv13E6Y5PILf2CQ6gMrCqU7nQ/exec',
    'https://script.google.com/macros/s/AKfycbwLOEASu83cZdri7fcYDR8xP4yGqlJJp2qzJUxXHGTgcFu5TK5_VApKqCJkeIxDpCgMxA/exec',
]

export const fetchData = async (action, payload) => {
    try {
        let url = (getTrip() === 'Vrindavan' ? BASE_URL[0] : getTrip() === 'Go goa' ? BASE_URL[2] : BASE_URL[1]) + '?action=' + action
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
