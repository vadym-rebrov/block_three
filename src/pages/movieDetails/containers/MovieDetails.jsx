import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import actionsMovies from 'app/actions/movies';
import { createUseStyles } from 'react-jss';

import Typography from 'components/Typography';
import Loading from 'components/Loading';
import Button from 'components/Button';
import Card from 'components/Card';
import CardContent from 'components/CardContent';
import IconButton from 'components/IconButton';
import TextField from 'components/TextField'; // Для редагування
import IconEdit from 'components/icons/Edit'; // Наша нова іконка

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
        gap: '10px',
        marginBottom: '15px',
        alignItems: 'center',
    },
    label: {
        minWidth: '150px',
        fontWeight: 'bold',
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
    }
});

function MovieDetails() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    // Redux State
    const { currentMovie, loadingDetails } = useSelector(({ movies }) => movies);

    // Local State
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

    // Завантаження даних при відкритті
    useEffect(() => {
        if (id) {
            dispatch(actionsMovies.fetchMovieById(id));
        }
    }, [dispatch, id]);

    // Синхронізація форми з даними Redux
    useEffect(() => {
        if (currentMovie) {
            setFormData({
                title: currentMovie.title || '',
                released: currentMovie.released || '',
                rating: currentMovie.rating || '',
                directorName: currentMovie.director.FullName || '', // Зверніть увагу на назву поля для BE
                country: currentMovie.country || '',
                genres: Array.isArray(currentMovie.genres) ? currentMovie.genres.join(', ') : '',
                // Додайте інші поля за потребою
            });
        }
    }, [currentMovie]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // Підготовка даних для відправки
        // Наприклад, жанри треба перетворити з рядка назад у масив, якщо бекенд цього вимагає
        // Або відправляти як є, якщо DTO приймає рядок.
        // Припустимо, бекенд чекає об'єкт схожий на той, що ми отримали.

        const dataToSend = {
            ...currentMovie, // Зберігаємо ID та інші незмінні поля
            ...formData,
            // Якщо бекенд чекає масив жанрів:
            genres: formData.genres.split(',').map(g => g.trim()).filter(g => g),
            // Якщо directorName очікується як окреме поле:
            directorName: formData.directorName
        };

        dispatch(actionsMovies.fetchUpdateMovie(id, dataToSend))
            .then(() => {
                setIsEditMode(false);
                setMessage({ type: 'success', text: 'Фільм успішно оновлено!' });
                // Прибираємо повідомлення через 3 секунди
                setTimeout(() => setMessage(null), 3000);
            })
            .catch((err) => {
                // Помилка залишається, режим редагування не вимикається
                setMessage({ type: 'error', text: 'Помилка при збереженні. Перевірте дані.' });
            });
    };

    const handleCancel = () => {
        setIsEditMode(false);
        setMessage(null);
        // Скидаємо форму назад до значень з Redux
        if (currentMovie) {
            setFormData({
                title: currentMovie.title || '',
                released: currentMovie.released || '',
                rating: currentMovie.rating || '',
                directorName: currentMovie.directorFullName || '',
                country: currentMovie.country || '',
                genres: Array.isArray(currentMovie.genres) ? currentMovie.genres.join(', ') : '',
            });
        }
    };

    if (loadingDetails) return <Loading />;
    if (!currentMovie) return <Typography>Фільм не знайдено</Typography>;

    return (
        <div className={classes.container}>
            {/* Повідомлення про успіх/помилку */}
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
                    {/* Поле: Назва */}
                    <div className={classes.detailsRow}>
                        <div className={classes.label}><Typography variant="subTitle">Назва:</Typography></div>
                        {isEditMode ? (
                            <TextField
                                value={formData.title}
                                onChange={e => handleInputChange('title', e.target.value)}
                            />
                        ) : (
                            <Typography>{currentMovie.title}</Typography>
                        )}
                    </div>

                    {/* Поле: Рік */}
                    <div className={classes.detailsRow}>
                        <div className={classes.label}><Typography variant="subTitle">Рік випуску:</Typography></div>
                        {isEditMode ? (
                            <TextField
                                inputType="number"
                                value={formData.released}
                                onChange={e => handleInputChange('released', e.target.value)}
                            />
                        ) : (
                            <Typography>{currentMovie.released}</Typography>
                        )}
                    </div>

                    {/* Поле: Рейтинг */}
                    <div className={classes.detailsRow}>
                        <div className={classes.label}><Typography variant="subTitle">Рейтинг:</Typography></div>
                        {isEditMode ? (
                            <TextField
                                inputType="number"
                                value={formData.rating}
                                onChange={e => handleInputChange('rating', e.target.value)}
                            />
                        ) : (
                            <Typography>{currentMovie.rating}</Typography>
                        )}
                    </div>

                    {/* Поле: Режисер */}
                    <div className={classes.detailsRow}>
                        <div className={classes.label}><Typography variant="subTitle">Режисер:</Typography></div>
                        {isEditMode ? (
                            <TextField
                                value={formData.directorName}
                                onChange={e => handleInputChange('directorName', e.target.value)}
                            />
                        ) : (
                            <Typography>{currentMovie.director.fullName}</Typography>
                        )}
                    </div>

                    {/* Поле: Країна */}
                    <div className={classes.detailsRow}>
                        <div className={classes.label}><Typography variant="subTitle">Країна:</Typography></div>
                        {isEditMode ? (
                            <TextField
                                value={formData.country}
                                onChange={e => handleInputChange('country', e.target.value)}
                            />
                        ) : (
                            <Typography>{currentMovie.country}</Typography>
                        )}
                    </div>

                    {/* Поле: Жанри */}
                    <div className={classes.detailsRow}>
                        <div className={classes.label}><Typography variant="subTitle">Жанри:</Typography></div>
                        {isEditMode ? (
                            <TextField
                                value={formData.genres}
                                onChange={e => handleInputChange('genres', e.target.value)}
                                placeholder="Drama, Action (через кому)"
                            />
                        ) : (
                            <Typography>
                                {Array.isArray(currentMovie.genres) ? currentMovie.genres.map(g => g.name).join(', ') : currentMovie.genres}
                            </Typography>
                        )}
                    </div>

                    <div className={classes.detailsRow}>
                        <div className={classes.label}><Typography variant="subTitle">Жанри:</Typography></div>
                        {isEditMode ? (
                            <TextField
                                value={formData.genres}
                                onChange={e => handleInputChange('genres', e.target.value)}
                                placeholder="Drama, Action (через кому)"
                            />
                        ) : (
                            <Typography>
                                {Array.isArray(currentMovie.awards) ? currentMovie.awards.join(', ') : currentMovie.awards}
                            </Typography>
                        )}
                    </div>

                    {/* Кнопки дій для режиму редагування */}
                    {isEditMode && (
                        <div className={classes.actions}>
                            <Button variant="secondary" onClick={handleCancel}>
                                Скасувати
                            </Button>
                            <Button variant="primary" onClick={handleSave}>
                                Зберегти
                            </Button>
                        </div>
                    )}

                    {/* Кнопка "Назад" для режиму перегляду */}
                    {!isEditMode && (
                        <div className={classes.actions}>
                            <Button variant="secondary" onClick={() => navigate(-1)}>
                                Назад до списку
                            </Button>
                        </div>
                    )}

                </CardContent>
            </Card>
        </div>
    );
}

export default MovieDetails;