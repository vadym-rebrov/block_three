import React from 'react';
import MovieContainer from './containers/Movie';

function MovieDetails(props) {
    return (
        <MovieContainer {...props} />
    );
}
export default MovieDetails;