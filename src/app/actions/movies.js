import axios from 'misc/requests';
import config from 'config';
import {
    REQUEST_MOVIES,
    RECEIVE_MOVIES,
    ERROR_RECEIVE_MOVIES,
} from '../constants/moviesActionTypes';

const requestMovies = () => ({ type: REQUEST_MOVIES });
const receiveMovies = (data) => ({ type: RECEIVE_MOVIES, payload: data });
const errorMovies = () => ({ type: ERROR_RECEIVE_MOVIES });

const moviesPerPage = 18;

export const fetchMovies = (filters = {}) => (dispatch) => {
    dispatch(requestMovies());
    const queryDto = {
        page: 0,
        size: moviesPerPage,
        ...filters,
    };

    return axios.post(
        `${config.SERVICE}/api/movie/_list`,
        queryDto
    )
        .then((response) => {
            dispatch(receiveMovies(response));
        })
        .catch(() => dispatch(errorMovies()));
};

export const fetchDeleteMovie = (id) => (dispatch) => {
    return axios.delete(`${config.SERVICE}/api/movie/${id}`)
        .then(() => {
            dispatch(fetchMovies());
            return { success: true };
        })
        .catch((error) => {
            // Повертаємо помилку для відображення в діалозі
            throw error;
        });
};

const exportFunctions = {
    fetchMovies,
    fetchDeleteMovie
};

export default exportFunctions;