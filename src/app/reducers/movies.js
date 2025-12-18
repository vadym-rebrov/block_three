import {
    RECEIVE_MOVIES,
    ERROR_RECEIVE_MOVIES,
    REQUEST_MOVIES,
} from '../constants/moviesActionTypes';

const initialState = {
    moviesList: [],
    loading: false,
    totalPages:0,
    totalElements: 0,
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
        default:
            return state;
    }
}