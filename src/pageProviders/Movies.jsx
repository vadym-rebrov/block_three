import React from 'react';
import MoviesPage from 'pages/movies';
import PageContainer from './components/PageContainer';

const Movies = (props) => {
    return (
        <PageContainer>
            <MoviesPage {...props} />
        </PageContainer>
    );
};

export default Movies;