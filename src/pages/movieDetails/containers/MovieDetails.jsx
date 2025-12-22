import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createUseStyles } from 'react-jss';

// Actions
import actionsMovies from 'app/actions/movies';
import actionsDirectors from 'app/actions/director';
import actionsGenres from 'app/actions/genre';

// Components
import Typography from 'components/Typography';
import Loading from 'components/Loading';
import Button from 'components/Button';
import Card from 'components/Card';
import CardContent from 'components/CardContent';
import IconButton from 'components/IconButton';
import TextField from 'components/TextField';
import Menu from 'components/Menu';
import MenuItem from 'components/MenuItem';

// Icons
import IconEdit from 'components/icons/Edit';
import IconClose from 'components/icons/Close';
import IconArrowBack from 'components/icons/Home';

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
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '20px'
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
    },
    genresTagsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginTop: '8px',
    },
    genreTag: {
        display: 'flex',
        alignItems: 'center',
        background: '#e0e0e0',
        borderRadius: '16px',
        padding: '4px 10px',
        fontSize: '14px',
    },
    searchResults: {
        maxHeight: '200px',
        overflowY: 'auto',
    },
    errorText: {
        color: 'red',
        fontSize: '12px',
        marginTop: '2px'
    }
});

function MovieDetails({ isCreateMode = false }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const isCreating = isCreateMode;

    // --- Redux State ---
    const { currentMovie, loadingDetails } = useSelector(({ movies }) => movies);
    const { list: directorsList = [] } = useSelector(({ director }) => director || {});
    const { list: genresList = [] } = useSelector(({ genre }) => genre || {});

    // --- Local State ---
    const [isEditMode, setIsEditMode] = useState(isCreating);
    const [message, setMessage] = useState(null);
    const [errors, setErrors] = useState({}); // Для валідації

    const [formData, setFormData] = useState({
        title: '',
        released: '',
        rating: '',
        directorId: null,
        directorName: '',
        selectedGenres: [],
        awards: []
    });

    // States для пошуку
    const [directorSearch, setDirectorSearch] = useState('');
    const [genreSearch, setGenreSearch] = useState('');
    const [directorAnchor, setDirectorAnchor] = useState(null);
    const [genreAnchor, setGenreAnchor] = useState(null);

    const directorInputRef = useRef(null);
    const genreInputRef = useRef(null);

    // Функція скидання форми до значень з Redux ---
    const resetForm = useCallback(() => {
        if (currentMovie && !isCreating) {
            setFormData({
                title: currentMovie.title || '',
                released: currentMovie.released || '',
                rating: currentMovie.rating || '',
                directorId: currentMovie.director?.id || null,
                directorName: currentMovie.director?.name || currentMovie.director?.fullName || '',
                selectedGenres: Array.isArray(currentMovie.genres) ? currentMovie.genres : [],
                awards: currentMovie.awards || []
            });
            setDirectorSearch(currentMovie.director?.name || currentMovie.director?.fullName || '');
            setErrors({});
        }
    }, [currentMovie, isCreating]);

    // --- Effects ---

    // 1. Завантаження фільму (Тільки для перегляду/редагування)
    useEffect(() => {
        if (id && !isCreating) {
            dispatch(actionsMovies.fetchMovieById(id));
        }
    }, [dispatch, id, isCreating]);

    // 2. Ініціалізація форми (при завантаженні даних або вході в режим створення)
    useEffect(() => {
        if (isCreating) {
            setIsEditMode(true);
            setFormData({
                title: '',
                released: '',
                rating: '',
                directorId: null,
                directorName: '',
                selectedGenres: [],
                awards: []
            });
        } else {
            resetForm();
        }
    }, [currentMovie, isCreating, resetForm]);

    // 3. Пошук Режисерів
    useEffect(() => {
        if (isEditMode && directorSearch.trim().length >= 2) {
            const timer = setTimeout(() => {
                dispatch(actionsDirectors.fetchDirectors(directorSearch));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [dispatch, directorSearch, isEditMode]);

    // 4. Пошук Жанрів
    useEffect(() => {
        if (isEditMode && genreSearch.trim().length >= 2) {
            const timer = setTimeout(() => {
                dispatch(actionsGenres.fetchGenres(genreSearch));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [dispatch, genreSearch, isEditMode]);


    // --- Validation Logic ---
    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()){
            newErrors.title = 'Назва фільму обов\'язкова';
        }

        if (!formData.released) {
            newErrors.released = 'Дата випуску обов\'язкова';
        } else {
            const year = new Date(formData.released).getFullYear();
            if (isNaN(year) || year < 1895 || year > 2100) {
                newErrors.released = 'Рік має бути в межах 1895-2100';
            }
        }

        if (formData.rating === '' || formData.rating === null) {
            newErrors.rating = 'Рейтинг обов\'язковий';
        } else if (isNaN(formData.rating) || formData.rating < 0 || formData.rating > 10) {
            newErrors.rating = 'Рейтинг має бути від 0 до 10';
        }


        if (!formData.directorId){
            newErrors.director = 'Оберіть режисера зі списку';
        }

        if (formData.selectedGenres.length === 0){
            newErrors.genres = 'Додайте хоча б один жанр';
        }
        console.log(newErrors);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    // --- Handlers ---

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // При зміні поля прибираємо помилку для нього
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    // -- Directors --
    const handleDirectorChange = (e) => {
        const value = e.target.value;
        setDirectorSearch(value);
        setFormData(prev => ({ ...prev, directorName: value, directorId: null })); // Скидаємо ID при ручному вводі
        setDirectorAnchor(directorInputRef.current);
    };

    const selectDirector = (director) => {
        setFormData(prev => ({
            ...prev,
            directorId: director.id,
            directorName: director.fullName
        }));
        setDirectorSearch(director.fullName);
        setDirectorAnchor(null);
        setErrors(prev => ({ ...prev, director: null })); // Прибираємо помилку
    };

    // -- Genres --
    const handleGenreSearchChange = (e) => {
        setGenreSearch(e.target.value);
        setGenreAnchor(genreInputRef.current);
    };

    const addGenre = (genre) => {
        const exists = formData.selectedGenres.find(g => g.id === genre.id);
        if (!exists) {
            setFormData(prev => ({
                ...prev,
                selectedGenres: [...prev.selectedGenres, genre]
            }));
            setErrors(prev => ({ ...prev, genres: null })); // Прибираємо помилку
        }
        setGenreSearch('');
        setGenreAnchor(null);
    };

    const removeGenre = (genreId) => {
        setFormData(prev => ({
            ...prev,
            selectedGenres: prev.selectedGenres.filter(g => g.id !== genreId)
        }));
    };

    // -- Awards --
    const handleAwardChange = (index, value) => {
        const newAwards = [...formData.awards];
        newAwards[index] = value;
        setFormData(prev => ({ ...prev, awards: newAwards }));
    };

    const handleAddAward = () => {
        setFormData(prev => ({ ...prev, awards: [...prev.awards, ''] }));
    };

    const handleRemoveAward = (index) => {
        const newAwards = formData.awards.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, awards: newAwards }));
    };


    // --- Save Logic  ---
    const handleSave = () => {
        // 1. Валідація
        if (!validate()) {
            setMessage({ type: 'error', text: 'Будь ласка, виправте помилки у формі.' });
            return;
        }

        const dataToSend = {
            title: formData.title,
            released: formData.released,
            rating: formData.rating,
            directorId: formData.directorId,
            genresId: formData.selectedGenres.map(g => g.id),
            awards: formData.awards.filter(a => a.trim() !== '')
        };

        const successCallback = (newMovieId) => {
            setMessage({ type: 'success', text: isCreating ? 'Фільм успішно створено!' : 'Зміни успішно збережено!' });
            setTimeout(() => setMessage(null), 3000);

            if (isCreating) {
                navigate(newMovieId ? `/movies/${newMovieId}` : -1);
            } else {
                setIsEditMode(false);
                dispatch(actionsMovies.fetchMovieById(id));
            }
        };

        const errorCallback = () => {
            setMessage({ type: 'error', text: 'Помилка при збереженні даних.' });
        };

        if (isCreating) {
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


    // --- Cancel Logic ---
    const handleCancel = () => {
        if (isCreating) {
            navigate(-1);
        } else {
            resetForm();
            setIsEditMode(false);
            setMessage(null);
        }
    };

    // --- Loading & Error States ---
    if (loadingDetails && !isCreating) return <Loading />;
    if (!isCreating && !currentMovie) return <Typography>Фільм не знайдено</Typography>;

    // Заголовок сторінки
    const pageTitle = isCreating
        ? 'Створення нового фільму'
        : (isEditMode ? 'Редагування фільму' : currentMovie?.title);

    return (
        <div className={classes.container}>
            {/* Messages */}
            {message && (
                <div className={message.type === 'success' ? classes.successMessage : classes.errorMessage}>
                    <Typography color="inherit">{message.text}</Typography>
                </div>
            )}

            {/* Header */}
            <div className={classes.header}>
                <div className={classes.headerLeft}>
                    {/* 4.6: Кнопка Назад */}
                    <IconButton onClick={() => navigate(-1)}>
                        <IconArrowBack />
                    </IconButton>
                    <Typography variant="title">
                        {pageTitle}
                    </Typography>
                </div>

                {/* 4.2: Кнопка Редагувати (тільки для перегляду) */}
                {!isCreating && !isEditMode && (
                    <IconButton onClick={() => setIsEditMode(true)}>
                        <IconEdit />
                    </IconButton>
                )}
            </div>

            <Card>
                <CardContent>
                    {/* --- Title --- */}
                    <div className={classes.detailsRow}>
                        <div className={classes.label}><Typography variant="subTitle">Назва</Typography></div>
                        {isEditMode ? (
                            <>
                                <TextField
                                    value={formData.title}
                                    onChange={e => handleInputChange('title', e.target.value)}
                                    error={!!errors.title} // (якщо TextField підтримує цей проп)
                                />
                                {errors.title && <div className={classes.errorText}>{errors.title}</div>}
                            </>
                        ) : (
                            <Typography>{currentMovie?.title}</Typography>
                        )}
                    </div>

                    {/* --- Released --- */}
                    <div className={classes.detailsRow}>
                        <div className={classes.label}><Typography variant="subTitle">Рік випуску</Typography></div>
                        {isEditMode ? (
                            <>
                                <TextField
                                    inputType="date"
                                    value={formData.released}
                                    onChange={e => handleInputChange('released', e.target.value)}
                                />
                                {errors.released && <div className={classes.errorText}>{errors.released}</div>}
                            </>
                        ) : (
                            <Typography>{currentMovie?.released}</Typography>
                        )}
                    </div>

                    {/* --- Rating --- */}
                    <div className={classes.detailsRow}>
                        <div className={classes.label}><Typography variant="subTitle">Рейтинг (0-10)</Typography></div>
                        {isEditMode ? (
                            <>
                                <TextField
                                    inputType="number"
                                    value={formData.rating}
                                    onChange={e => handleInputChange('rating', e.target.value)}
                                />
                                {errors.rating && <div className={classes.errorText}>{errors.rating}</div>}
                            </>
                        ) : (
                            <Typography>{currentMovie?.rating}</Typography>
                        )}
                    </div>


                    {/* --- Director --- */}
                    <div className={classes.detailsRow}>
                        <div className={classes.label}><Typography variant="subTitle">Режисер</Typography></div>
                        {isEditMode ? (
                            <div ref={directorInputRef}>
                                <TextField
                                    value={directorSearch}
                                    onChange={handleDirectorChange}
                                    placeholder="Почніть вводити ім'я..."
                                />
                                {errors.director && <div className={classes.errorText}>{errors.director}</div>}

                                <Menu
                                    anchorEl={directorAnchor}
                                    open={!!directorAnchor && directorsList.length > 0}
                                    onClose={() => setDirectorAnchor(null)}
                                    className={classes.searchResults}
                                >
                                    {directorsList.map(director => (
                                        <MenuItem key={director.id} onClick={() => selectDirector(director)}>
                                            {director.fullName}
                                        </MenuItem>
                                    ))}
                                    {directorsList.length === 0 && directorSearch && (
                                        <div style={{padding: 10}}>Нічого не знайдено</div>
                                    )}
                                </Menu>
                            </div>
                        ) : (
                            <Typography>{currentMovie?.director?.fullName || currentMovie?.director?.name}</Typography>
                        )}
                    </div>

                    {/* --- Genres --- */}
                    <div className={classes.detailsRow}>
                        <div className={classes.label}><Typography variant="subTitle">Жанри</Typography></div>
                        {isEditMode ? (
                            <div>
                                <div ref={genreInputRef}>
                                    <TextField
                                        value={genreSearch}
                                        onChange={handleGenreSearchChange}
                                        placeholder="Додати жанр..."
                                    />
                                    <Menu
                                        anchorEl={genreAnchor}
                                        open={!!genreAnchor && genresList.length > 0}
                                        onClose={() => setGenreAnchor(null)}
                                        className={classes.searchResults}
                                    >
                                        {genresList.map(genre => (
                                            <MenuItem key={genre.id} onClick={() => addGenre(genre)}>
                                                {genre.name}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </div>
                                {errors.genres && <div className={classes.errorText}>{errors.genres}</div>}

                                <div className={classes.genresTagsContainer}>
                                    {formData.selectedGenres.map(genre => (
                                        <div key={genre.id} className={classes.genreTag}>
                                            <span style={{marginRight: 5}}>{genre.name}</span>
                                            <IconButton size={16} onClick={() => removeGenre(genre.id)}>
                                                <IconClose size={14} />
                                            </IconButton>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <Typography>
                                {Array.isArray(currentMovie?.genres)
                                    ? currentMovie.genres.map(g => g.name || g).join(', ')
                                    : ''}
                            </Typography>
                        )}
                    </div>

                    {/* --- Awards --- */}
                    <div className={classes.detailsRow}>
                        <div className={classes.label}><Typography variant="subTitle">Нагороди</Typography></div>
                        {isEditMode ? (
                            <div>
                                {formData.awards.map((award, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' }}>
                                        <TextField
                                            value={award}
                                            onChange={e => handleAwardChange(index, e.target.value)}
                                            placeholder="Введіть назву нагороди"
                                        />
                                        <IconButton onClick={() => handleRemoveAward(index)}>
                                            <IconClose size={20} />
                                        </IconButton>
                                    </div>
                                ))}
                                <Button variant="secondary" onClick={handleAddAward}>
                                    + Додати нагороду
                                </Button>
                            </div>
                        ) : (
                            <Typography>
                                {Array.isArray(currentMovie?.awards) ? currentMovie.awards.join(', ') : ''}
                            </Typography>
                        )}
                    </div>

                    {/* Actions Buttons */}
                    {isEditMode ? (
                        <div className={classes.actions}>
                            <Button variant="secondary" onClick={handleCancel}>
                                Скасувати
                            </Button>
                            <Button variant="primary" onClick={handleSave}>
                                {isCreating ? 'Створити' : 'Зберегти'}
                            </Button>
                        </div>
                    ) : (
                        <div className={classes.actions}>
                            <Button variant="secondary" onClick={() => navigate(-1)}>Назад до списку</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default MovieDetails;