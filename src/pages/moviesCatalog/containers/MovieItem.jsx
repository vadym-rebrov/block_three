import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import Typography from 'components/Typography';
import IconButton from 'components/IconButton';
import IconDelete from 'components/icons/Close';
import Hover from 'components/Hover';

const useStyles = createUseStyles((theme) => ({
    itemContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(1),
        width: '100%',
    },
    deleteBtn: {
        visibility: 'hidden',
    },
    container: {
        '&:hover $deleteBtn': {
            visibility: 'visible',
        },
    },
}));

const MovieItem = ({ movie, onDeleteClick }) => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Hover>
                <div className={classes.itemContent}>
                    <div>
                        <Typography variant="subTitle"><strong>{movie.title}</strong></Typography>
                        <Typography color="secondary">Рік: {movie.released} | Рейтинг: {movie.rating}</Typography>
                    </div>
                    <div className={classes.deleteBtn}>
                        <IconButton onClick={() => onDeleteClick(movie)}>
                            <IconDelete size={20} color="error" />
                        </IconButton>
                    </div>
                </div>
            </Hover>
        </div>
    );
};