import React from 'react';
import { useIntl } from 'react-intl';
import Typography from 'components/Typography';

function Movies() {
    const { formatMessage } = useIntl();

    return (
        <Typography variant="title">
            {formatMessage({ id: 'title' })}
        </Typography>
    );
}

export default Movies;