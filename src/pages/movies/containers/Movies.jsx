
import Typography from 'components/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actionsMovies from 'app/actions/movies';
import Loading from 'components/Loading';

function Movies() {
    const dispatch = useDispatch();
    const { moviesList, loading } = useSelector(({ movies }) => movies);

    useEffect(() => {
        dispatch(actionsMovies.fetchMovies({
            page: 0,
            size: 20
        }));
    }, [dispatch]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <Typography variant="title">Список фільмів</Typography>
            {moviesList.map(movie => (
                <div key={movie.id}>
                    <Typography>{movie.title}</Typography>
                </div>
            ))}
        </div>
    );
}

export default Movies;