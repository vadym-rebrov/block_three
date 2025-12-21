import React, { useEffect, useState, useRef } from 'react';
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
    const { list: directorsList } = useSelector(({ directors }) => directors);
    const { list: genresList } = useSelector(({ genres }) => genres);

    // --- Local State ---
    const [isEditMode, setIsEditMode] = useState(false);
    const [message, setMessage] = useState(null);

    // Форма даних
    const [formData, setFormData] = useState({
        title: '',
        released: '',
        rating: '',
        directorId: null,
        directorName: '', // Для відображення в інпуті
        country: '',
        selectedGenres: [], // Массив об'єктів {id, name}
        awards: [] // Масив строк
    });

    const [directorSearch, setDirectorSearch] = useState('');
    const [genreSearch, setGenreSearch] = useState('');

    const [directorAnchor, setDirectorAnchor] = useState(null);
    const [genreAnchor, setGenreAnchor] = useState(null);

    // Ref для input
    const directorInputRef = useRef(null);
    const genreInputRef = useRef(null);

    // --- Effects ---

    // 1. Завантаження фільму
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
                directorName: currentMovie.director?.name || currentMovie.directorFullName || '',
                country: currentMovie.country || '',
                selectedGenres: Array.isArray(currentMovie.genres)
                    ? currentMovie.genres.map(g => (typeof g === 'object' ? g : { name: g }))
                    : [],
                awards: currentMovie.awards || []
            });
            setDirectorSearch(currentMovie.director?.name || currentMovie.directorFullName || '');
        }
    }, [currentMovie]);

    // 3. Пошук Режисерів (Debounce)
    useEffect(() => {
        if (isEditMode) {
            const timer = setTimeout(() => {
                dispatch(actionsDirectors.fetchDirectors(directorSearch));
            }, 500); // Затримка 0.5с
            return () => clearTimeout(timer);
        }
    }, [dispatch, directorSearch, isEditMode]);

    // 4. Пошук Жанрів (Debounce)
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
        setFormData(prev => ({ ...prev, directorName: value })); // Просто текст, поки не вибрали
        setDirectorAnchor(directorInputRef.current); // Відкриваємо меню
    };

    const selectDirector = (director) => {
        setFormData(prev => ({
            ...prev,
            directorId: director.id,
            directorName: director.name
        }));
        setDirectorSearch(director.name);
        setDirectorAnchor(null); // Закриваємо меню
    };

    // -- Genre Logic --
    const handleGenreSearchChange = (e) => {
        setGenreSearch(e.target.value);
        setGenreAnchor(genreInputRef.current);
    };

    const addGenre = (genre) => {
        // Перевіряємо, чи жанр вже доданий
        const exists = formData.selectedGenres.find(g => g.id === genre.id);
        if (!exists) {
            setFormData(prev => ({
                ...prev,
                selectedGenres: [...prev.selectedGenres, genre]
            }));
        }
        setGenreSearch(''); // Очистити поле
        setGenreAnchor(null); // Закрити меню
    };

    const removeGenre = (genreId) => {
        setFormData(prev => ({
            ...prev,
            selectedGenres: prev.selectedGenres.filter(g => g.id !== genreId)
        }));
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
            awards: formData.awards
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
        // Скидання відбувається через useEffect(currentMovie), який спрацює при зміні isEditMode?
        // Ні, краще вручну або перезавантажити стейт.
        if(currentMovie) {
            setDirectorSearch(currentMovie.director?.name || '');
            // Інші поля скинуться при ререндері, бо вони залежать від currentMovie в useEffect,
            // але щоб спрацювало точно:
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
                            <TextField inputType="number" value={formData.released} onChange={e => handleInputChange('released', e.target.value)} />
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
                                <Menu
                                    anchorEl={directorAnchor}
                                    open={!!directorAnchor && directorsList.length > 0}
                                    onClose={() => setDirectorAnchor(null)}
                                    className={classes.searchResults}
                                >
                                    {directorsList.map(director => (
                                        <MenuItem key={director.id} onClick={() => selectDirector(director)}>
                                            {director.name}
                                        </MenuItem>
                                    ))}
                                    {directorsList.length === 0 && (
                                        <div style={{padding: 10}}>Нічого не знайдено</div>
                                    )}
                                </Menu>
                            </div>
                        ) : (
                            <Typography>{currentMovie.directorFullName || currentMovie.director?.name}</Typography>
                        )}
                    </div>

                    {/* Country */}
                    <div className={classes.detailsRow}>
                        <div className={classes.label}><Typography variant="subTitle">Країна</Typography></div>
                        {isEditMode ? (
                            <TextField value={formData.country} onChange={e => handleInputChange('country', e.target.value)} />
                        ) : (
                            <Typography>{currentMovie.country}</Typography>
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
                        <Typography>
                            {Array.isArray(currentMovie.awards) ? currentMovie.awards.join(', ') : ''}
                        </Typography>
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