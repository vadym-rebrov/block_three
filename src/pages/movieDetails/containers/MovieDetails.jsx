import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Хуки для URL и навигации
import { useDispatch, useSelector } from 'react-redux';
import actionsMovies from 'app/actions/movies';
import { createUseStyles } from 'react-jss';

import Typography from 'components/Typography';
import Loading from 'components/Loading';
import Button from 'components/Button';
import Card from 'components/Card';
import CardContent from 'components/CardContent';

const useStyles = createUseStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '800px',
        margin: '0 auto', // По центру
        padding: '20px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    detailsRow: {
        display: 'flex',
        gap: '10px',
        marginBottom: '10px'
    }
});

function Movie() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();
    const { currentMovie, loadingDetails } = useSelector(({ movies }) => movies);
    useEffect(() => {
        if (id) {
            dispatch(actionsMovies.fetchMovieById(id));
        }
    }, [dispatch, id]);
    if (loadingDetails) {
        return <Loading />;
    }
    if (!currentMovie) {
        return (
            <div className={classes.container}>
                <Typography variant="title">Фільм не знайдено</Typography>
                <Button onClick={() => navigate(-1)}>Назад</Button>
            </div>
        );
    }

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <Typography variant="title">{currentMovie.title}</Typography>
                <Button variant="secondary" onClick={() => navigate(-1)}>
                    Назад до списку
                </Button>
            </div>

            <Card>
                <CardContent>
                    <div className={classes.detailsRow}>
                        <Typography variant="subTitle">Рік випуску:</Typography>
                        <Typography>{currentMovie.released}</Typography>
                    </div>

                    <div className={classes.detailsRow}>
                        <Typography variant="subTitle">Режисер:</Typography>
                        <Typography>{currentMovie.directorFullName}</Typography>
                    </div>

                    <div className={classes.detailsRow}>
                        <Typography variant="subTitle">Країна:</Typography>
                        <Typography>{currentMovie.country}</Typography>
                    </div>

                    <div className={classes.detailsRow}>
                        <Typography variant="subTitle">Рейтинг:</Typography>
                        <Typography>{currentMovie.rating}</Typography>
                    </div>

                    <div className={classes.detailsRow}>
                        <Typography variant="subTitle">Жанри:</Typography>
                        <Typography>{Array.isArray(currentMovie.genres) ? currentMovie.genres.join(', ') : ''}</Typography>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Movie;