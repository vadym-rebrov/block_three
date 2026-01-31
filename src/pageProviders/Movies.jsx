import React from 'react';
import MoviesPage from 'pages/moviesCatalog';
import PageContainer from './components/PageContainer';
import PageAccessValidator from './components/PageAccessValidator';

const Movies = (props) => {
    return (
        <PageAccessValidator>
            <PageContainer>
                <MoviesPage {...props} />
            </PageContainer>
        </PageAccessValidator>
    );
};

export default Movies;