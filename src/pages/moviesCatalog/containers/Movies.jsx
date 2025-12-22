
import Typography from 'components/Typography';
import React, {use, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actionsMovies from 'app/actions/movies';
import Loading from 'components/Loading';

import Card from 'components/Card';
import CardTitle from 'components/CardTitle';
import CardContent from 'components/CardContent';
import IconDelete from 'components/icons/Delete';
import IconFilter from 'components/icons/Filter';

import Button from 'components/Button'
import {createUseStyles} from "react-jss";
import IconButton from "../../../components/IconButton";
import Dialog from "../../../components/Dialog";
import Menu from "../../../components/Menu";
import TextField from "../../../components/TextField";
import Link from "../../../components/Link";

const STORAGE_KEY = 'movies_page_state_v1';

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
    },

    btnDelete:{
        background:'#d90000',
    },

    moviePageLink:{
        textDecoration:"none",
    },

    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        padding: '0 20px',
    },

    filterMenuContent: {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        minWidth: '280px',
        outline: 'none',
    },
    filterRow: {
        display: 'flex',
        gap: '10px',
    }


}));

const getSavedState = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        console.error("Error parsing local storage", e);
        return null;
    }
};

function Movies() {
    const classes = useStyles();
    const dispatch = useDispatch();

    const savedState = getSavedState();

    const defaultFilters = {
        country: '',
        directorName: '',
        minRating: '',
        maxRating: '',
        minYear: '',
        maxYear: '',
    };

    const [currentPage, setCurrentPage] = useState(savedState?.page || 0);

    const [appliedFilters, setAppliedFilters] = useState({
        ...defaultFilters,
        ...(savedState?.filters || {})
    });

    const [localFilters, setLocalFilters] = useState({
        ...defaultFilters,
        ...(savedState?.filters || {})
    });

    const [movieToDelete, setMovieToDelete] = useState(null);
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);

    const { loading, moviesList, totalPages } = useSelector(({ movies }) => movies);

    useEffect(() => {
        const stateToSave = {
            page: currentPage,
            filters: appliedFilters
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }, [currentPage, appliedFilters]);

    useEffect(() => {
        const isChanged = JSON.stringify(localFilters) !== JSON.stringify(appliedFilters);

        if (isChanged) {
            const timer = setTimeout(() => {
                setAppliedFilters(localFilters);
                setCurrentPage(0); // При смене фильтра - всегда на первую страницу
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [localFilters, appliedFilters]);

    useEffect(() => {
        // Чистим пустые фильтры перед отправкой
        const filtersToSend = Object.fromEntries(
            Object.entries(appliedFilters).filter(([_, v]) => v !== '')
        );

        dispatch(actionsMovies.fetchMovies({
            page: currentPage,
            size: 10,
            ...filtersToSend
        }));
    }, [dispatch, currentPage, appliedFilters]);


    const handleFilterChange = (field, value) => {
        setLocalFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleClearFilters = () => {
        setLocalFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
        setCurrentPage(0);
    };

    const handleConfirmDelete = () => {
        if (movieToDelete) {
            dispatch(actionsMovies.fetchDeleteMovie(movieToDelete.id))
                .then(() => setMovieToDelete(null));
        }
    };

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




            <div className={classes.headerContainer}>
                <Typography variant="title">Список фільмів</Typography>
                <Link href={"/movies/add"}>
                    <Button>
                        Додати фільм
                    </Button>
                </Link>

                <Button
                    onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                >
                    Фільтр <IconFilter color="#fff" size={24} />
                </Button>
            </div>

            <Menu
                anchorEl={filterAnchorEl}
                open={!!filterAnchorEl}
                onClose={() => setFilterAnchorEl(null)}
            >
                <div className={classes.filterMenuContent}>
                    <Typography variant="subTitle">Фільтр</Typography>

                    <TextField
                        label="Режисер"
                        value={localFilters.directorName || ''}
                        onChange={(e) => handleFilterChange('directorName', e.target.value)}
                    />

                    <div className={classes.filterRow}>
                        <TextField
                            label="Мін. рейтинг"
                            inputType="number"
                            value={localFilters.minRating || ''}
                            onChange={(e) => handleFilterChange('minRating', e.target.value)}
                        />
                        <TextField
                            label="Макс. рейтинг"
                            inputType="number"
                            value={localFilters.maxRating || ''}
                            onChange={(e) => handleFilterChange('maxRating', e.target.value)}
                        />
                    </div>

                    <Button
                        variant="text"
                        onClick={handleClearFilters}
                    >
                        Очистити фільтр
                    </Button>
                </div>
            </Menu>

            {loading && <div style={{display:'flex', justifyContent:'center'}}><Loading variant="loading" /></div>}

            <div style={{ display: 'flex', height: '100%', flexDirection: 'row', gap: '15px', marginTop: '15px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {moviesList.map(movie => (
                    <div className={classes.cardWrapper}>
                        <a href={'./movies/' + movie.id} className={classes.moviePageLink}>
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
                        </a>
                        <div className={classes.deleteBtn}>
                            <IconButton
                                onClick={() => setMovieToDelete(movie)}
                            >
                                <IconDelete color="error" size={24} />
                            </IconButton>
                        </div>
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
                                className ={classes.btnDelete}
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