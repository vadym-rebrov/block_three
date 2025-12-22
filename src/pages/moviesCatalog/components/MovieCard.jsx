import React from 'react';
import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';
import Card from 'components/Card';
import CardTitle from 'components/CardTitle';
import CardContent from 'components/CardContent';
import Typography from 'components/Typography';
import IconButton from 'components/IconButton';
import IconDelete from 'components/icons/Delete';
import Link from "components/Link";


const useStyles = createUseStyles({
    cardWrapper: {
        maxWidth: '300px',
        width: '100%',
        maxHeight: '170px',
        position: 'relative',
        height: '100%',
        textDecoration:'none',
        '&:hover $deleteBtn': {
            opacity: 1,
            visibility: 'visible',
        },
    },
    deleteBtn: {
        position: 'absolute',
        top: -10,
        right: -10,
        borderRadius: '50%',
        opacity: 0,
        background: '#888',
        visibility: 'hidden',
        transition: 'all 0.2s ease-in-out',
        zIndex: 10,
        '&:hover': {
            transform: 'scale(1.1)',
        }
    },
    moviePageLink: {
        textDecoration: "none !important",
        color: 'inherit',
        display: 'block',
        height: '100%',
    }
});

function MovieCard({ movie, onDelete }) {
    const classes = useStyles();
    const { formatMessage } = useIntl();


    return (
        <div className={classes.cardWrapper}>
            {/*Використав <a> тому що, чомусь підтягується Material UI Link замість визначеного у компонентах і у ньому стоїть підкреслення тексту*/}
            <a href={`/movies/${movie.id}`} className={classes.moviePageLink}>
                <Card>
                    <CardTitle>
                        <Typography variant="subTitle">
                            <strong>{movie.title}</strong>
                        </Typography>
                    </CardTitle>
                    <CardContent>
                        <Typography color="secondary">{formatMessage({ id: 'cardYear' })} {movie.released}</Typography>
                        <Typography color="secondary">{formatMessage({ id: 'cardRating' })} {movie.rating}</Typography>
                        <Typography color="secondary">{formatMessage({ id: 'cardDirector' })} {movie.directorFullName}</Typography>
                        <Typography color="secondary">{formatMessage({ id: 'cardGenres' })} {movie.genres.join(', ')}</Typography>
                    </CardContent>
                </Card>
            </a>
            <div className={classes.deleteBtn}>
                <IconButton onClick={(e) => {
                    e.preventDefault();
                    onDelete(movie);
                }}>
                    <IconDelete color="error" size={24} />
                </IconButton>
            </div>
        </div>
    );
}

export default MovieCard;