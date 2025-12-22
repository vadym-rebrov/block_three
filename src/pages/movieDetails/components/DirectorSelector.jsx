import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { createUseStyles } from 'react-jss';

import actionsDirectors from 'app/actions/director';
import TextField from 'components/TextField';
import Menu from 'components/Menu';
import MenuItem from 'components/MenuItem';
import Typography from 'components/Typography';

const useStyles = createUseStyles({
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

function DirectorSelector({ value, displayValue, onSelect, error }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const intl = useIntl();

    const [search, setSearch] = useState(displayValue || '');
    const [anchorEl, setAnchorEl] = useState(null);
    const inputRef = useRef(null);

    const { list: directorsList = [] } = useSelector(({ director }) => director || {});

    useEffect(() => {
        setSearch(displayValue || '');
    }, [displayValue]);

    useEffect(() => {
        if (search.trim().length >= 2) {
            const timer = setTimeout(() => {
                dispatch(actionsDirectors.fetchDirectors(search));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [dispatch, search]);

    const handleChange = (e) => {
        setSearch(e.target.value);
        setAnchorEl(inputRef.current);
        onSelect(null, e.target.value);
    };

    const handleSelect = (director) => {
        setSearch(director.fullName);
        setAnchorEl(null);
        onSelect(director.id, director.fullName);
    };

    return (
        <div ref={inputRef}>
            <TextField
                label={intl.formatMessage({ id: 'labelDirector' })}
                value={search}
                onChange={handleChange}
                placeholder={intl.formatMessage({ id: 'phDirector' })}
                error={!!error}
            />
            {error && <div className={classes.errorText}>{error}</div>}

            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl && directorsList.length > 0}
                onClose={() => setAnchorEl(null)}
                className={classes.searchResults}
            >
                {directorsList.map(director => (
                    <MenuItem key={director.id} onClick={() => handleSelect(director)}>
                        {director.fullName}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}

export default DirectorSelector;