import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';

import TextField from 'components/TextField';
import Button from 'components/Button';
import DirectorSelector from './DirectorSelector';
import GenreSelector from './GenreSelector';
import AwardsInput from './AwardsInput';

const useStyles = createUseStyles({
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '20px'
    },
    errorText: {
        color: 'red',
        fontSize: '12px',
        marginTop: '2px'
    }
});

function MovieForm({ initialData, isCreating, onSave, onCancel }) {
    const classes = useStyles();
    const intl = useIntl();
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        title: '',
        released: '',
        rating: '',
        directorId: null,
        directorName: '',
        selectedGenres: [],
        awards: []
    });

    useEffect(() => {
        if (initialData && !isCreating) {
            setFormData({
                title: initialData.title || '',
                released: initialData.released || '',
                rating: initialData.rating || '',
                directorId: initialData.director?.id || null,
                directorName: initialData.director?.name || initialData.director?.fullName || '',
                selectedGenres: Array.isArray(initialData.genres) ? initialData.genres : [],
                awards: initialData.awards || []
            });
        }
    }, [initialData, isCreating]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = intl.formatMessage({ id: 'errTitleReq' });
        }

        if (!formData.released) {
            newErrors.released = intl.formatMessage({ id: 'errYearReq' });
        } else {
            const year = new Date(formData.released).getFullYear();
            if (isNaN(year) || year < 1895 || year > 2100) {
                newErrors.released = intl.formatMessage({ id: 'errYearRange' });
            }
        }

        if (formData.rating === '' || formData.rating === null) {
            newErrors.rating = intl.formatMessage({ id: 'errRatingReq' });
        } else if (isNaN(formData.rating) || formData.rating < 0 || formData.rating > 10) {
            newErrors.rating = intl.formatMessage({ id: 'errRatingRange' });
        }

        if (!formData.directorId) {
            newErrors.director = intl.formatMessage({ id: 'errDirectorReq' });
        }
        if (formData.selectedGenres.length === 0) {
            newErrors.genres = intl.formatMessage({ id: 'errGenreReq' });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        onSave(formData);
    };

    return (
        <div className={classes.formContainer}>
            <div>
                <TextField
                    label={intl.formatMessage({ id: 'labelTitle' })}
                    value={formData.title}
                    onChange={e => handleInputChange('title', e.target.value)}
                    error={!!errors.title}
                />
                {errors.title && <div className={classes.errorText}>{errors.title}</div>}
            </div>

            <div>
                <TextField
                    inputType="date"
                    value={formData.released}
                    onChange={e => handleInputChange('released', e.target.value)}
                    error={!!errors.released}
                />
                {errors.released && <div className={classes.errorText}>{errors.released}</div>}
            </div>

            <div>
                <TextField
                    label={intl.formatMessage({ id: 'labelRating' })}
                    inputType="number"
                    value={formData.rating}
                    onChange={e => handleInputChange('rating', e.target.value)}
                    error={!!errors.rating}
                />
                {errors.rating && <div className={classes.errorText}>{errors.rating}</div>}
            </div>

            <DirectorSelector
                value={formData.directorId}
                displayValue={formData.directorName}
                onSelect={(id, name) => {
                    handleInputChange('directorId', id);
                    handleInputChange('directorName', name);
                    if(id) {
                        setErrors(prev => ({ ...prev, director: null }));
                    }
                }}
                error={errors.director}
            />

            <GenreSelector
                selectedGenres={formData.selectedGenres}
                onAdd={(genre) => {
                    const exists = formData.selectedGenres.find(g => g.id === genre.id);
                    if (!exists) {
                        handleInputChange('selectedGenres', [...formData.selectedGenres, genre]);
                        setErrors(prev => ({ ...prev, genres: null }));
                    }
                }}
                onRemove={(id) => {
                    handleInputChange('selectedGenres', formData.selectedGenres.filter(g => g.id !== id));
                }}
                error={errors.genres}
            />

            <AwardsInput
                awards={formData.awards}
                onChange={newAwards => handleInputChange('awards', newAwards)}
            />

            <div className={classes.actions}>
                <Button variant="secondary" onClick={onCancel}>
                    {intl.formatMessage({ id: 'btnCancel' })}
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    {isCreating ? intl.formatMessage({ id: 'btnCreate' }) : intl.formatMessage({ id: 'btnSave' })}
                </Button>
            </div>
        </div>
    );
}

export default MovieForm;