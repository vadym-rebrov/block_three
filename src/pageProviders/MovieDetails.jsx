import React from 'react';
import PageContainer from './components/PageContainer';
import MovieDetails from "../pages/movieDetails";

const Movie = (props) => {
    return (
        <PageContainer>
            <MovieDetails {...props} />
        </PageContainer>
    );
};
export default Movie;