import React from 'react';
import MovieContainer from './containers/MovieDetails';
function MovieDetails(props) {
    return (
        <MovieContainer {...props} />
    );
}
export default MovieDetails;