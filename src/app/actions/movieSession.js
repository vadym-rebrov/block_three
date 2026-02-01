import axios from 'misc/requests';
import {
    ERROR_MOVIE_SESSIONS,
    RECEIVE_MOVIE_SESSIONS,
    REQUEST_MOVIE_SESSIONS,
} from 'app/constants/movieSessionActionTypes';
import config from 'config';


const requestMovieSessions = () => ({
    type: REQUEST_MOVIE_SESSIONS,
});

const receiveMovieSessions = (data) => ({
    payload: data,
    type: RECEIVE_MOVIE_SESSIONS,
});

const errorMovieSessions = (errors) => ({
    payload: errors,
    type: ERROR_MOVIE_SESSIONS,
});

const fetchMovieSessions = ({ movieId }) => (dispatch) => {
    dispatch(requestMovieSessions());
    return axios.get(`${config.API_URL}/api/movie-session`, { params: { movieId } })
        .then((response) => {
            console.log(response);
            const sessionsList = response.data;
            dispatch(receiveMovieSessions(sessionsList));
        })
        .catch((error) => {
            dispatch(errorMovieSessions(error));
        });
};

export default {
    fetchMovieSessions,
};