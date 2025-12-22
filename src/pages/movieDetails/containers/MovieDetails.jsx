import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createUseStyles } from 'react-jss';

import actionsMovies from 'app/actions/movies';
import actionsDirectors from 'app/actions/director';
import actionsGenres from 'app/actions/genre';

import Typography from 'components/Typography';
import Loading from 'components/Loading';
import Button from 'components/Button';
import Card from 'components/Card';
import CardContent from 'components/CardContent';
import IconButton from 'components/IconButton';
import TextField from 'components/TextField';
import Menu from 'components/Menu';
import MenuItem from 'components/MenuItem';

import IconEdit from 'components/icons/Edit';
import IconClose from 'components/icons/Close';

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
    detailsRow: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        marginBottom: '15px',
    },
    rowContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
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
    }
});

function MovieDetails() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    // --- Redux State ---
    const { currentMovie, loadingDetails } = useSelector(({ movies }) => movies);
    const { list: directorsList = [] } = useSelector(({ director }) => {
        console.log('SELECTOR: Full Director State:', director); // <--- LOG 4
        return director || {};
    });
    const { list: genresList = [] } = useSelector(({ genre }) => genre || {});

    // --- Local State ---
    const [isEditMode, setIsEditMode] = useState(false);
    const [message, setMessage] = useState(null);

    // Форма даних
    const [formData, setFormData] = useState({
        title: '',
        released: '',
        rating: '',
        directorId: null,
        directorName: '',
        selectedGenres: [],
        awards: []
    });

    const [directorSearch, setDirectorSearch] = useState('');
    const [genreSearch, setGenreSearch] = useState('');

    const [directorAnchor, setDirectorAnchor] = useState(null);
    const [genreAnchor, setGenreAnchor] = useState(null);

    const directorInputRef = useRef(null);
    const genreInputRef = useRef(null);

    useEffect(() => {
        if (id) {
            dispatch(actionsMovies.fetchMovieById(id));
        }
    }, [dispatch, id]);

    // 2. Ініціалізація форми даними фільму
    useEffect(() => {
        if (currentMovie) {
            setFormData({
                title: currentMovie.title || '',
                released: currentMovie.released || '',
                rating: currentMovie.rating || '',
                directorId: currentMovie.director?.id || null,
                directorName: currentMovie.director?.name || currentMovie.director?.fullName || '',
                selectedGenres: Array.isArray(currentMovie.genres)
                    ? currentMovie.genres
                    : [],
                awards: currentMovie.awards || []
            });
            setDirectorSearch(currentMovie.director?.name || currentMovie.director.fullName || '');
        }
    }, [currentMovie]);

    // 3. Пошук Режисерів
    useEffect(() => {
        if (isEditMode) {
            const timer = setTimeout(() => {
                dispatch(actionsDirectors.fetchDirectors(directorSearch));
            }, 500); // Затримка 0.5с
            return () => clearTimeout(timer);
        }
    }, [dispatch, directorSearch, isEditMode]);

    // 4. Пошук Жанрів
    useEffect(() => {
        if (isEditMode) {
            const timer = setTimeout(() => {
                dispatch(actionsGenres.fetchGenres(genreSearch));
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [dispatch, genreSearch, isEditMode]);


    // --- Handlers ---

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // -- Director Logic --
    const handleDirectorChange = (e) => {
        const value = e.target.value;
        setDirectorSearch(value);
        setFormData(prev => ({ ...prev, directorName: value }));
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
    };

    // -- Genre Logic --
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

    // -- Awards Logic --

    // Зміна тексту конкретної нагороди
    const handleAwardChange = (index, value) => {
        const newAwards = [...formData.awards];
        newAwards[index] = value;
        setFormData(prev => ({ ...prev, awards: newAwards }));
    };

    // Додавання нового порожнього поля
    const handleAddAward = () => {
        setFormData(prev => ({ ...prev, awards: [...prev.awards, ''] }));
    };

    // Видалення нагороди
    const handleRemoveAward = (index) => {
        const newAwards = formData.awards.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, awards: newAwards }));
    };

    // -- Save Logic --
    const handleSave = () => {
        const dataToSend = {
            id: currentMovie.id, // ID фільму
            title: formData.title,
            released: formData.released,
            rating: formData.rating,
            country: formData.country,
            directorId: formData.directorId,
            genresId: formData.selectedGenres.map(g => g.id),
            awards: formData.awards.filter(a => a.trim() !== '')
        };

        dispatch(actionsMovies.fetchUpdateMovie(id, dataToSend))
            .then(() => {
                setIsEditMode(false);
                setMessage({ type: 'success', text: 'Фільм успішно оновлено!' });
                setTimeout(() => setMessage(null), 3000);
                // Оновлюємо дані на сторінці
                dispatch(actionsMovies.fetchMovieById(id));
            })
            .catch(() => {
                setMessage({ type: 'error', text: 'Помилка при збереженні.' });
            });
    };

    const handleCancel = () => {
        setIsEditMode(false);
        setMessage(null);
        if(currentMovie) {
            setDirectorSearch(currentMovie.director?.name || '');
            dispatch(actionsMovies.fetchMovieById(id));
        }
    };

    if (loadingDetails) return <Loading />;
    if (!currentMovie) return <Typography>Фільм не знайдено</Typography>;

    return (
        <div className={classes.container}>
            {message && (
                <div className={message.type === 'success' ? classes.successMessage : classes.errorMessage}>
                    <Typography color="inherit">{message.text}</Typography>
                </div>
            )}

            <div className={classes.header}>
                <Typography variant="title">
                    {isEditMode ? 'Редагування фільму' : currentMovie.title}
                </Typography>
                {!isEditMode && (
                    <IconButton onClick={() => setIsEditMode(true)}>
                        <IconEdit />
                    </IconButton>
                )}
            </div>

            <Card>
                <CardContent>
                    {/* Title */}
                    <div className={classes.detailsRow}>
                        <div className={classes.label}><Typography variant="subTitle">Назва</Typography></div>
                        {isEditMode ? (
                            <TextField value={formData.title} onChange={e => handleInputChange('title', e.target.value)} />
                        ) : (
                            <Typography>{currentMovie.title}</Typography>
                        )}
                    </div>

                    {/* Released */}
                    <div className={classes.detailsRow}>
                        <div className={classes.label}><Typography variant="subTitle">Рік випуску</Typography></div>
                        {isEditMode ? (
                            <TextField inputType="date" value={formData.released} onChange={e => handleInputChange('released', e.target.value)} />
                        ) : (
                            <Typography>{currentMovie.released}</Typography>
                        )}
                    </div>

                    {/* Rating */}
                    <div className={classes.detailsRow}>
                        <div className={classes.label}><Typography variant="subTitle">Рейтинг</Typography></div>
                        {isEditMode ? (
                            <TextField inputType="number" value={formData.rating} onChange={e => handleInputChange('rating', e.target.value)} />
                        ) : (
                            <Typography>{currentMovie.rating}</Typography>
                        )}
                    </div>

                    {/* --- Director Search --- */}
                    <div className={classes.detailsRow}>
                        <div className={classes.label}><Typography variant="subTitle">Режисер</Typography></div>
                        {isEditMode ? (
                            <div ref={directorInputRef}>
                                <TextField
                                    value={directorSearch}
                                    onChange={handleDirectorChange}
                                    placeholder="Почніть вводити ім'я..."
                                />
                                {!directorsList.length && console.log(directorsList)}
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
                                    {directorsList.length === 0 && (
                                        <div style={{padding: 10}}>Нічого не знайдено</div>
                                    )}
                                </Menu>
                            </div>
                        ) : (
                            <Typography>{currentMovie.director.fullName || currentMovie.director?.fullName}</Typography>
                        )}
                    </div>


                    {/* --- Genres Search & Add --- */}
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
                                {/* Відображення вибраних жанрів */}
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
                                {Array.isArray(currentMovie.genres)
                                    ? currentMovie.genres.map(g => g.name || g).join(', ')
                                    : ''}
                            </Typography>
                        )}
                    </div>

                    {/* Awards */}
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
                                {Array.isArray(currentMovie.awards) ? currentMovie.awards.join(', ') : ''}
                            </Typography>
                        )}
                    </div>

                    {/* Actions */}
                    {isEditMode ? (
                        <div className={classes.actions}>
                            <Button variant="secondary" onClick={handleCancel}>Скасувати</Button>
                            <Button variant="primary" onClick={handleSave}>Зберегти</Button>
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