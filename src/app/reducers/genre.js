import {
    ERROR_RECEIVE_GENRES,
    REQUEST_GENRES,
    RECEIVE_GENRES,
} from '../constants/genreActionTypes';

const initialState = {
    list: [],
    loading: false,
};

export default function genresReducer(state = initialState, action) {
    switch (action.type) {
        case REQUEST_GENRES:
            return {
                ...state,
                loading: true
            };

        case RECEIVE_GENRES:
            return {
                ...state,
                loading: false,
                list: action.payload
            };

        case ERROR_RECEIVE_GENRES:
            return {
                ...state,
                loading: false,
                list: []
            };

        default:
            return state;
    }
}