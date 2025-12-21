import axios from 'misc/requests';
import config from 'config';
import {
    REQUEST_MOVIES,
    RECEIVE_MOVIES,
    ERROR_RECEIVE_MOVIES,
    GET_MOVIE_DETAILS_REQUEST,
    GET_MOVIE_DETAILS_SUCCESS,
    GET_MOVIE_DETAILS_ERROR,
    UPDATE_MOVIE_REQUEST,
    UPDATE_MOVIE_SUCCESS,
    UPDATE_MOVIE_ERROR,
} from '../constants/moviesActionTypes';

const requestMovies = () => ({ type: REQUEST_MOVIES });
const receiveMovies = (data) => ({ type: RECEIVE_MOVIES, payload: data });
const errorMovies = () => ({ type: ERROR_RECEIVE_MOVIES });

const moviesPerPage = 10;

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
            throw error;
        });
};

export const fetchMovieById = (id) => (dispatch) => {
    dispatch({ type: GET_MOVIE_DETAILS_REQUEST });

    return axios.get(`${config.SERVICE}/api/movie/${id}`)
        .then((data) => {
            dispatch({ type: GET_MOVIE_DETAILS_SUCCESS, payload: data });
        })
        .catch(() => {
            dispatch({ type: GET_MOVIE_DETAILS_ERROR });
        });
};

export const fetchUpdateMovie = (id, data) => (dispatch) => {
    dispatch({ type: UPDATE_MOVIE_REQUEST });
    return axios.put(`${config.SERVICE}/api/movie/${id}`, data)
        .then((response) => {
            dispatch({ type: UPDATE_MOVIE_SUCCESS, payload: response });
            return response;
        })
        .catch((error) => {
            dispatch({ type: UPDATE_MOVIE_ERROR });
            throw error;
        });
};

const exportFunctions = {
    fetchMovies,
    fetchDeleteMovie,
    fetchMovieById,
    fetchUpdateMovie
};

export default exportFunctions;