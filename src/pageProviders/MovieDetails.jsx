import React from 'react';
import PageContainer from './components/PageContainer';
import MovieDetails from "../pages/movieDetails";
import PageAccessValidator from "./components/PageAccessValidator";

const Movie = (props) => {
    return (
        <PageAccessValidator>
            <PageContainer>
                <MovieDetails {...props} />
            </PageContainer>
        </PageAccessValidator>
    );
};
export default Movie;