import React from 'react';
import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';
import Menu from 'components/Menu';
import Typography from 'components/Typography';
import TextField from 'components/TextField';
import Button from 'components/Button';

const useStyles = createUseStyles({
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
});


function MoviesFilter({ anchorEl, onClose, values, onChange, onClear }) {
    const classes = useStyles();
    const { formatMessage } = useIntl();

    return (
        <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={onClose}
        >
            <div className={classes.filterMenuContent}>
                <Typography variant="subTitle">{formatMessage({ id: 'filterTitle' })}</Typography>

                <TextField
                    label={formatMessage({ id: 'filterDirector' })}
                    value={values.directorName || ''}
                    onChange={(e) => onChange('directorName', e.target.value)}
                />

                <div className={classes.filterRow}>
                    <TextField
                        label={formatMessage({ id: 'filterMinRating' })}
                        inputType="number"
                        value={values.minRating || ''}
                        onChange={(e) => onChange('minRating', e.target.value)}
                    />
                    <TextField
                        label={formatMessage({ id: 'filterMaxRating' })}
                        inputType="number"
                        value={values.maxRating || ''}
                        onChange={(e) => onChange('maxRating', e.target.value)}
                    />
                </div>

                <Button
                    variant="text"
                    onClick={onClear}
                >
                    {formatMessage({ id: 'filterClear' })}
                </Button>
            </div>
        </Menu>
    );
}

export default MoviesFilter;