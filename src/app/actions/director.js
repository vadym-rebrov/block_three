import axios from 'axios';
import config from 'config';
import {
    ERROR_RECEIVE_DIRECTORS,
    REQUEST_DIRECTORS,
    RECEIVE_DIRECTORS
} from '../constants/directorActionTypes';

export const fetchDirectors = (searchName = '') => (dispatch) => {
    dispatch({ type: REQUEST_DIRECTORS });

    return axios.post(`${config.SERVICE}/api/director/_list`, {
        name: searchName
    })
        .then((response) => {
            console.log('ACTION: Data received from API:', response);
            dispatch({
                type: RECEIVE_DIRECTORS,
                payload: response
            });
            return response;
        })
        .catch((error) => {
            console.error('Error fetching directors:', error);
            dispatch({ type: ERROR_RECEIVE_DIRECTORS });
        });
};

export default { fetchDirectors };