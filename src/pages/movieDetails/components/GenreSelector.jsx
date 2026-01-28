import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { createUseStyles } from 'react-jss';

import actionsGenres from 'app/actions/genre';
import TextField from 'components/TextField';
import Menu from 'components/Menu';
import MenuItem from 'components/MenuItem';
import IconButton from 'components/IconButton';
import IconClose from 'components/icons/Close';

const useStyles = createUseStyles({
    searchResults: {
        maxHeight: '200px',
        overflowY: 'auto',
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
    errorText: {
        color: 'red',
        fontSize: '12px',
        marginTop: '2px'
    }
});

function GenreSelector({ selectedGenres = [], onAdd, onRemove, error }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const intl = useIntl();

    const [search, setSearch] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const inputRef = useRef(null);

    const { list: genresList = [] } = useSelector(({ genre }) => genre || {});

    useEffect(() => {
        if (search.trim().length >= 2) {
            const timer = setTimeout(() => {
                dispatch(actionsGenres.fetchGenres(search));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [dispatch, search]);

    const handleChange = (e) => {
        setSearch(e.target.value);
        setAnchorEl(inputRef.current);
    };

    const handleSelect = (genre) => {
        onAdd(genre);
        setSearch('');
        setAnchorEl(null);
    };

    return (
        <div>
            <div ref={inputRef}>
                <TextField
                    label={intl.formatMessage({ id: 'labelGenres' })}
                    value={search}
                    onChange={handleChange}
                    placeholder={intl.formatMessage({ id: 'phGenre' })}
                    error={!!error}
                />

                <Menu
                    anchorEl={anchorEl}
                    open={!!anchorEl && genresList.length > 0}
                    onClose={() => setAnchorEl(null)}
                    className={classes.searchResults}
                >
                    {genresList.map(genre => (
                        <MenuItem key={genre.id} onClick={() => handleSelect(genre)}>
                            {genre.name}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
            {error && <div className={classes.errorText}>{error}</div>}

            <div className={classes.genresTagsContainer}>
                {selectedGenres.map(genre => (
                    <div key={genre.id} className={classes.genreTag}>
                        <span style={{ marginRight: 5 }}>{genre.name}</span>
                        <IconButton size={16} onClick={() => onRemove(genre.id)}>
                            <IconClose size={14} />
                        </IconButton>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GenreSelector;