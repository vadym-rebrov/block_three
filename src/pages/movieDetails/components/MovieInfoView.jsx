import React from 'react';
import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';
import Typography from 'components/Typography';
import Button from 'components/Button';

const useStyles = createUseStyles({
    detailsRow: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        marginBottom: '15px',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: '4px',
    },
    actions: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'flex-end'
    }
});

function MovieInfoView({ movie, onBack }) {
    const classes = useStyles();
    const intl = useIntl();

    if (!movie) return null;

    return (
        <div>

            <div className={classes.detailsRow}>
                <div className={classes.label}><Typography variant="subTitle">{intl.formatMessage({ id: 'labelYear' })}</Typography></div>
                <Typography>{movie.released}</Typography>
            </div>

            <div className={classes.detailsRow}>
                <div className={classes.label}><Typography variant="subTitle">{intl.formatMessage({ id: 'labelRating' })}</Typography></div>
                <Typography>{movie.rating}</Typography>
            </div>

            <div className={classes.detailsRow}>
                <div className={classes.label}><Typography variant="subTitle">{intl.formatMessage({ id: 'labelDirector' })}</Typography></div>
                <Typography>{movie.director?.fullName || movie.director?.name}</Typography>
            </div>

            <div className={classes.detailsRow}>
                <div className={classes.label}><Typography variant="subTitle">{intl.formatMessage({ id: 'labelGenres' })}</Typography></div>
                <Typography>
                    {Array.isArray(movie.genres)
                        ? movie.genres.map(g => g.name || g).join(', ')
                        : ''}
                </Typography>
            </div>

            <div className={classes.detailsRow}>
                <div className={classes.label}><Typography variant="subTitle">{intl.formatMessage({ id: 'labelAwards' })}</Typography></div>
                <Typography>
                    {Array.isArray(movie.awards) ? movie.awards.join(', ') : ''}
                </Typography>
            </div>

            <div className={classes.actions}>
                <Button variant="secondary" onClick={onBack}>{intl.formatMessage({ id: 'btnBack' })}</Button>
            </div>
        </div>
    );
}

export default MovieInfoView;