// api.js
import { getTrip } from "./localStorage";
import { TRIP_INFO } from "../constants/trip-info.const.tsx";


export const fetchData = async (action, payload) => {
    try {
        let url = TRIP_INFO[getTrip()].url + '?action=' + action
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
