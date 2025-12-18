import {
    RECEIVE_MOVIES,
    ERROR_RECEIVE_MOVIES,
    REQUEST_MOVIES,
} from '../constants/moviesActionTypes';

const initialState = {
    movieList: [],
    loading: false,
    totalPages:0,
    totalElements: 0,
}