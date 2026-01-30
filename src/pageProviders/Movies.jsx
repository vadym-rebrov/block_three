import React, { useEffect } from 'react';
import useUser from 'misc/hooks/useUser';
import useChangePage from 'misc/hooks/useChangePage';
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages'
import MoviesPage from 'pages/moviesCatalog';
import PageAccessValidator from './components/PageAccessValidator';

const Movies = () => {
    const { isLogined, isLoaded } = useUser();
    const changePage = useChangePage();

    useEffect(() => {
        if (isLoaded && !isLogined) {
            changePage({ path: `/${pageURLs[pages.defaultPage]}` });
        }
    }, [isLoaded, isLogined, changePage]);

    if (!isLogined) {
        return null;
    }

    return (
        <PageAccessValidator>
            <MoviesPage />
        </PageAccessValidator>
    );
};

export default Movies;