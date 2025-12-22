import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUseStyles } from "react-jss";
import { useSearchParams } from 'react-router-dom';

import actionsMovies from 'app/actions/movies';
import Typography from 'components/Typography';
import Loading from 'components/Loading';
import Button from 'components/Button';
import IconFilter from 'components/icons/Filter';
import Link from "components/Link";

import MovieCard from '../components/MovieCard';
import MoviesFilter from '../components/MoviesFilter';
import Pagination from '../components/Pagination';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import {useIntl} from "react-intl";

const useStyles = createUseStyles((theme) => ({
    headerContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap:'10px',
        alignItems: 'center',
        marginBottom: '40px',
        padding: '0 20px',
    },
    listContainer: {
        display: 'flex',
        height: '100%',
        flexDirection: 'row',
        gap: '15px',
        marginTop: '15px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));



function Movies() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();


    const [searchParams, setSearchParams] = useSearchParams();

    const queryParams = useMemo(() => {
        return {
            page: parseInt(searchParams.get('page') || '0', 10),
            directorName: searchParams.get('directorName') || '',
            minRating: searchParams.get('minRating') || '',
            maxRating: searchParams.get('maxRating') || '',
        };
    }, [searchParams]);


    const [localFilters, setLocalFilters] = useState(queryParams);

    const [movieToDelete, setMovieToDelete] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);

    const { loading, moviesList, totalPages } = useSelector(({ movies }) => movies);

    useEffect(() => {
        setLocalFilters(prev => ({
            ...prev,
            directorName: queryParams.directorName,
            minRating: queryParams.minRating,
            maxRating: queryParams.maxRating,
        }));
    }, [queryParams]);

    useEffect(() => {
        const isFilterChanged =
            localFilters.directorName !== queryParams.directorName ||
            localFilters.minRating !== queryParams.minRating ||
            localFilters.maxRating !== queryParams.maxRating;

        if (isFilterChanged) {
            const timer = setTimeout(() => {
                updateURL({ ...localFilters, page: 0 });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [localFilters, queryParams]);

    useEffect(() => {
        const filtersToSend = {
            directorName: queryParams.directorName,
            minRating: queryParams.minRating,
            maxRating: queryParams.maxRating,
        };

        Object.keys(filtersToSend).forEach(key => {
            if (filtersToSend[key] === ''){
                delete filtersToSend[key];
            }
        });

        dispatch(actionsMovies.fetchMovies({
            page: queryParams.page,
            size: 10,
            ...filtersToSend
        }));
    }, [dispatch, queryParams]);

    const updateURL = (newParams) => {
        const nextParams = {};
        const allKeys = new Set([...Object.keys(queryParams), ...Object.keys(newParams)]);

        allKeys.forEach(key => {
            const value = newParams.hasOwnProperty(key) ? newParams[key] : queryParams[key];
            if (value !== '' && value !== null && value !== undefined) {
                nextParams[key] = value;
            }
        });

        setSearchParams(nextParams);
    };

    const handleFilterChange = (field, value) => {
        setLocalFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleClearFilters = () => {
        const emptyFilters = {
            directorName: '',
            minRating: '',
            maxRating: '',
        };
        setLocalFilters(prev => ({ ...prev, ...emptyFilters }));
        updateURL({ ...emptyFilters, page: 0 });
    };

    const handlePageChange = (newPage) => {
        updateURL({ page: newPage });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleConfirmDelete = () => {
        if (movieToDelete) {
            setDeleteError(null);
            dispatch(actionsMovies.fetchDeleteMovie(movieToDelete.id))
                .then(() => {
                    setMovieToDelete(null);
                    setDeleteError(null);
                })
                .catch((error) => {
                    console.error("Delete error:", error);
                    const message = error?.response?.data?.message || error?.message || formatMessage({ id: 'errorDefault' });
                    setDeleteError(message);
                });
        }
    };

    const handleCloseDialog = () => {
        setMovieToDelete(null);
        setDeleteError(null);
    };

    return (
        <div>
            <div className={classes.headerContainer}>
                <Typography variant="title">{formatMessage({ id: 'pageTitle' })}</Typography>
                <Link href={"/movies/add"}>
                    <Button>{formatMessage({ id: 'btnAdd' })}</Button>
                </Link>
                <Button onClick={(e) => setFilterAnchorEl(e.currentTarget)}>
                    {formatMessage({ id: 'btnFilter' })} <IconFilter color="#fff" size={24} />
                </Button>
            </div>

            <MoviesFilter
                anchorEl={filterAnchorEl}
                onClose={() => setFilterAnchorEl(null)}
                values={localFilters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
            />

            {loading && <div style={{display:'flex', justifyContent:'center'}}><Loading variant="loading" /></div>}

            <div className={classes.listContainer}>
                {moviesList.map(movie => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        onDelete={setMovieToDelete}
                    />
                ))}
            </div>

            <Pagination
                currentPage={queryParams.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            <DeleteConfirmationDialog
                open={!!movieToDelete}
                movieTitle={movieToDelete?.title}
                onClose={handleCloseDialog}
                onConfirm={handleConfirmDelete}
                error={deleteError}
            />
        </div>
    );
}

export default Movies;