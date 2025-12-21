import {
    ERROR_RECEIVE_DIRECTORS,
    REQUEST_DIRECTORS,
    RECEIVE_DIRECTORS
} from '../constants/directorActionTypes';

const initialState = {
    list: [],
    loading: false,
};

export default function directorsReducer(state = initialState, action) {
    switch (action.type) {
        case REQUEST_DIRECTORS:
            return { ...state, loading: true };

        case RECEIVE_DIRECTORS:
            return { ...state, loading: false, list: action.payload };

        case ERROR_RECEIVE_DIRECTORS:
            return { ...state, loading: false, list: [] };

        default:
            return state;
    }
}