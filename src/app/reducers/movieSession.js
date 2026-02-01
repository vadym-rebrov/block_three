import {
    ERROR_MOVIE_SESSIONS,
    RECEIVE_MOVIE_SESSIONS,
    REQUEST_MOVIE_SESSIONS,
} from 'app/constants/movieSessionActionTypes';

const initialState = {
    isFetching: false,
    errors: [],
    movieSessions: [],
    totalElements: 0
};

export default function movieSessionReducer(state = initialState, action) {
    switch (action.type) {
        case REQUEST_MOVIE_SESSIONS: {
            return {
                ...state,
                isFetching: true,
                errors: [],
            };
        }

        case RECEIVE_MOVIE_SESSIONS: {
            return {
                ...state,
                isFetching: false,
                movieSessions: action.payload.list,
                totalElements: action.payload.totalElements
            };
        }

        case ERROR_MOVIE_SESSIONS: {
            return {
                ...state,
                isFetching: false,
                errors: action.payload,
            };
        }

        default:
            return state;
    }
}