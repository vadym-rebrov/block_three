import {
    RECEIVE_MOVIES,
    ERROR_RECEIVE_MOVIES,
    REQUEST_MOVIES,
    GET_MOVIE_DETAILS_REQUEST,
    GET_MOVIE_DETAILS_SUCCESS,
    GET_MOVIE_DETAILS_ERROR,
    UPDATE_MOVIE_REQUEST,
    UPDATE_MOVIE_SUCCESS,
    UPDATE_MOVIE_ERROR,
    CREATE_MOVIE_REQUEST,
    CREATE_MOVIE_SUCCESS,
    CREATE_MOVIE_ERROR
} from '../constants/moviesActionTypes';

const initialState = {
    moviesList: [],
    loading: false,
    totalPages:0,
    totalElements: 0,
    currentMovie: null,
    loadingDetails: false,
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case REQUEST_MOVIES: {
            return {
                ...state,
                loading: true,
            };
        }
        case RECEIVE_MOVIES: {
            return {
                ...state,
                moviesList: action.payload.list || [],
                totalPages: action.payload.totalPages || 0,
                totalElements: action.payload.totalElements || 0,
                loading: false,
            };
        }
        case ERROR_RECEIVE_MOVIES: {
            return {
                ...state,
                loading: false,
            };
        }
        case GET_MOVIE_DETAILS_REQUEST: {
            return {
                ...state,
                loadingDetails: true,
                currentMovie: null
            };
        }
        case GET_MOVIE_DETAILS_SUCCESS: {
            return {
                ...state,
                loadingDetails: false,
                currentMovie: action.payload
            };
        }
        case GET_MOVIE_DETAILS_ERROR: {
            return {
                ...state,
                loadingDetails: false,
                currentMovie: null
            };
        }
        case UPDATE_MOVIE_REQUEST: {
            return { ...state, loadingDetails: true };
        }
        case UPDATE_MOVIE_SUCCESS: {
            return {
                ...state,
                loadingDetails: false,
                currentMovie: action.payload
            };
        }
        case UPDATE_MOVIE_ERROR: {
            return { ...state, loadingDetails: false };
        }
        case CREATE_MOVIE_REQUEST: {
            return { ...state, loadingDetails: true };
        }
        case CREATE_MOVIE_SUCCESS: {
            return {
                ...state,
                loadingDetails: false,
                currentMovie: action.payload
            };
        }
        case CREATE_MOVIE_ERROR: {
            return { ...state, loadingDetails: false };
        }
        default:
            return state;
    }
}