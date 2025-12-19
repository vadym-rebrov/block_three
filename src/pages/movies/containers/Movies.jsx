
import Typography from 'components/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actionsMovies from 'app/actions/movies';
import Loading from 'components/Loading';

import Card from 'components/Card';
import CardTitle from 'components/CardTitle';
import CardContent from 'components/CardContent';

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
            <div style={{ display: 'flex', height: '100%', flexDirection: 'row', gap: '15px', marginTop: '15px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {moviesList.map(movie => (
                    <div style={{maxWidth:'300px',width:'100%',maxHeight:'170px', height:'100%'}}>
                        <Card key={movie.id}>
                            <CardTitle>
                                <Typography variant="subTitle">
                                    <strong>{movie.title}</strong>
                                </Typography>
                            </CardTitle>

                            <CardContent>
                                <Typography color="secondary">Рік: {movie.released}</Typography>
                                <Typography color="secondary">Рейтинг: {movie.rating}</Typography>
                                <Typography color="secondary">Режисер: {movie.directorFullName}</Typography>
                                <Typography color="secondary">Жанри: {movie.genres.join(', ')}</Typography>
                            </CardContent>
                        </Card>
                    </div>

                ))}
            </div>
        </div>
    );
}

export default Movies;