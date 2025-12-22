import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';
import actionsMovies from 'app/actions/movies';

import Typography from 'components/Typography';
import Loading from 'components/Loading';
import Card from 'components/Card';
import CardContent from 'components/CardContent';
import IconButton from 'components/IconButton';
import IconEdit from 'components/icons/Edit';
import IconArrowBack from 'components/icons/Home';

import MovieInfoView from '../components/MovieInfoView';
import MovieForm from '../components/MovieForm';

const useStyles = createUseStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    successMessage: {
        padding: '10px',
        backgroundColor: '#d4edda',
        color: '#155724',
        borderRadius: '4px',
        marginBottom: '10px',
        textAlign: 'center'
    },
    errorMessage: {
        padding: '10px',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderRadius: '4px',
        marginBottom: '10px',
        textAlign: 'center'
    }
});

function MovieDetails({ isCreateMode = false }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const intl = useIntl();

    const { currentMovie, loadingDetails } = useSelector(({ movies }) => movies);

    // UI State
    const [isEditMode, setIsEditMode] = useState(isCreateMode);
    const [message, setMessage] = useState(null);

    // Завантаження даних
    useEffect(() => {
        if (id && !isCreateMode) {
            dispatch(actionsMovies.fetchMovieById(id));
        }
    }, [dispatch, id, isCreateMode]);

    // Якщо це режим створення, відразу вмикаємо редагування
    useEffect(() => {
        if (isCreateMode) {
            setIsEditMode(true);
        }
    }, [isCreateMode]);

    const handleSaveData = (formData) => {
        const dataToSend = {
            title: formData.title,
            released: formData.released,
            rating: formData.rating,
            directorId: formData.directorId,
            genresId: formData.selectedGenres.map(g => g.id),
            awards: formData.awards.filter(a => a.trim() !== '')
        };

        const successCallback = (newMovieId) => {
            const successMessage = isCreateMode
                ? intl.formatMessage({ id: 'successCreated' })
                : intl.formatMessage({ id: 'successUpdated' });
            setMessage({ type: 'success', text: successMessage });
            setTimeout(() => setMessage(null), 3000);

            if (isCreateMode) {
                navigate(newMovieId ? `/movies/${newMovieId}` : -1);
            } else {
                setIsEditMode(false);
                dispatch(actionsMovies.fetchMovieById(id));
            }
        };

        const errorCallback = (error) => {
            const errorText = error?.response?.data?.message || error?.message || intl.formatMessage({ id: 'errorDefault' });
            setMessage({ type: 'error', text: errorText });
        };

        if (isCreateMode) {
            dispatch(actionsMovies.fetchCreateMovie(dataToSend))
                .then((res) => successCallback(res?.id))
                .catch(errorCallback);
        } else {
            const updateData = { ...dataToSend, id: currentMovie.id };
            dispatch(actionsMovies.fetchUpdateMovie(id, updateData))
                .then(() => successCallback())
                .catch(errorCallback);
        }
    };

    const handleCancel = () => {
        if (isCreateMode) {
            navigate(-1);
        } else {
            setIsEditMode(false);
            setMessage(null);
        }
    };

    if (loadingDetails && !isCreateMode){
        return <Loading />;
    }
    if (!isCreateMode && !currentMovie){
        return <Typography>{intl.formatMessage({ id: 'notFound' })}</Typography>;
    }

    const pageTitle = isCreateMode
        ? intl.formatMessage({ id: 'pageTitleCreate' })
        : (isEditMode ? intl.formatMessage({ id: 'pageTitleEdit' }) : currentMovie?.title);

    return (
        <div className={classes.container}>
            {message && (
                <div className={message.type === 'success' ? classes.successMessage : classes.errorMessage}>
                    <Typography color="inherit">{message.text}</Typography>
                </div>
            )}

            <div className={classes.header}>
                <div className={classes.headerLeft}>
                    <Typography variant="title">
                        {pageTitle}
                    </Typography>
                </div>

                {!isCreateMode && !isEditMode && (
                    <IconButton onClick={() => setIsEditMode(true)}>
                        <IconEdit />
                    </IconButton>
                )}
            </div>

            <Card>
                <CardContent>
                    {isEditMode ? (
                        <MovieForm
                            initialData={currentMovie}
                            isCreating={isCreateMode}
                            onSave={handleSaveData}
                            onCancel={handleCancel}
                        />
                    ) : (
                        <MovieInfoView
                            movie={currentMovie}
                            onBack={() => navigate(-1)}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default MovieDetails;