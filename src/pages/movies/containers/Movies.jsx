
import Typography from 'components/Typography';
import React, {use, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actionsMovies from 'app/actions/movies';
import Loading from 'components/Loading';

import Card from 'components/Card';
import CardTitle from 'components/CardTitle';
import CardContent from 'components/CardContent';
import IconDelete from 'components/icons/Delete';
import Button from 'components/Button'
import {createUseStyles} from "react-jss";
import IconButton from "../../../components/IconButton";

const useStyles = createUseStyles((theme) => ({
    cardWrapper:{
        maxWidth:'300px',
        width:'100%',
        maxHeight:'170px',
        position:'relative',
        height:'100%',
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
        background:'#888',
        visibility: 'hidden',
        transition: 'all 0.2s ease-in-out',
        zIndex: 10,
        '&:hover': {
            transform: 'scale(1.1)',
        }
    }
}));

function Movies() {
    const classes = useStyles();



    const dispatch = useDispatch();
    const { moviesList, loading } = useSelector(({ movies }) => movies);
    const [currentPage, setCurrentPage] = useState(0);
    const { movieList, totalPages } = useSelector(({ movies }) => movies);

    useEffect(() => {
        dispatch(actionsMovies.fetchMovies({ page: currentPage, size: 18 }));
    }, [dispatch, currentPage]);

    if (loading) {
        return <Loading />;
    }

    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 3);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    const isFirstPageHidden = startPage > 0;
    const isLastPageHidden = endPage < totalPages - 1;

    return (
        <div>
            <Typography variant="title">Список фільмів</Typography>
            <div style={{ display: 'flex', height: '100%', flexDirection: 'row', gap: '15px', marginTop: '15px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {moviesList.map(movie => (
                    <div className={classes.cardWrapper}>
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
                            <div className={classes.deleteBtn}>
                                <IconButton
                                    onClick={() => {}}
                                >
                                    <IconDelete color="error" size={24} />
                                </IconButton>
                            </div>
                        </Card>
                    </div>

                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '24px', paddingBottom: '24px',position:'relative' }}>
                <Button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    variant="text"
                >
                    {"<"}
                </Button>

                {isFirstPageHidden && (
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => setCurrentPage(0)}
                            style={{ minWidth: '40px' }}
                        >
                            <Typography>1</Typography>
                        </Button>
                        {startPage > 1 && <Typography>...</Typography>}
                    </>
                )}

                {pages.map((pageIndex) => (
                    <Button
                        key={pageIndex}
                        variant={currentPage === pageIndex ? "primary" : "secondary"}
                        colorVariant={currentPage === pageIndex ? "primary" : "secondary"}
                        onClick={() => setCurrentPage(pageIndex)}
                        style={{ minWidth: '40px' }}
                    >
                        <Typography color={currentPage === pageIndex ? "inherit" : "primary"}>
                            {pageIndex + 1}
                        </Typography>
                    </Button>
                ))}

                {isLastPageHidden && (
                    <>
                        {endPage < totalPages - 2 && <Typography>...</Typography>}
                        <Button
                            variant="secondary"
                            onClick={() => setCurrentPage(totalPages - 1)}
                            style={{ minWidth: '40px' }}
                        >
                            <Typography>{totalPages}</Typography>
                        </Button>
                    </>
                )}

                <Button
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    variant="text"
                >
                    {">"}
                </Button>
            </div>
            <Dialog
                open={!!movieToDelete}
                onClose={() => setMovieToDelete(null)}
            >
                <Card>
                    <CardTitle>
                        <Typography variant="title">Видалення фільму</Typography>
                    </CardTitle>
                    <CardContent>
                        <Typography>
                            Ви впевнені, що хочете видалити фільм <strong>"{movieToDelete?.title}"</strong>?
                        </Typography>

                        <div className={classes.dialogButtons}>
                            <Button
                                variant="secondary"
                                onClick={() => setMovieToDelete(null)}
                            >
                                Скасувати
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleConfirmDelete}
                            >
                                Видалити
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </Dialog>
        </div>
    );
}

export default Movies;