import axios from 'axios';
import config from 'config';
import {
    ERROR_RECEIVE_GENRES,
    REQUEST_GENRES,
    RECEIVE_GENRES,
} from '../constants/genreActionTypes';

export const fetchGenres = (searchName = '') => (dispatch) => {
    dispatch({ type: REQUEST_GENRES });

    return axios.post(`${config.API_URL}/api/genre/_list`, {
        name: searchName
    })
    .then((response) => {
        dispatch({
            type: RECEIVE_GENRES,
            payload: response
        });
        return response;
    })
    .catch((error) => {
        console.error('Error fetching genres:', error);
        dispatch({ type: ERROR_RECEIVE_GENRES });
    });
};

export default { fetchGenres };