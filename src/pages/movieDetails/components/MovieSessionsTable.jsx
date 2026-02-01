import React from 'react';
import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';
import Typography from 'components/Typography';
import Card from 'components/Card';
import CardContent from 'components/CardContent';

const useStyles = createUseStyles((theme) => ({
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: theme.spacing(2),
    },
    th: {
        textAlign: 'left',
        padding: theme.spacing(1),
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
    },
    td: {
        padding: theme.spacing(1),
        borderBottom: `1px solid ${theme.palette.grey[200]}`,
    },
    noData: {
        padding: theme.spacing(2),
        textAlign: 'center',
    }
}));

const MovieSessionsTable = ({ sessions = [] }) => {
    const classes = useStyles();
    const { formatMessage, formatDate, formatTime } = useIntl();

    if (!sessions.length) {
        return (
            <Typography className={classes.noData}>
                {formatMessage({ id: 'noSessionsAvailable', defaultMessage: 'No sessions available' })}
            </Typography>
        );
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="title">
                    {formatMessage({ id: 'sessions', defaultMessage: 'Sessions' })}
                </Typography>
                <table className={classes.table}>
                    <thead>
                    <tr>
                        <th className={classes.th}>
                            <Typography variant="subtitle">Date</Typography>
                        </th>
                        <th className={classes.th}>
                            <Typography variant="subtitle">Room</Typography>
                        </th>
                        <th className={classes.th}>
                            <Typography variant="subtitle">Price</Typography>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {sessions.map((session) => (
                        <tr key={session.id}>
                            <td className={classes.td}>
                                <Typography>
                                    {formatDate(session.date)} {formatTime(session.date)}
                                </Typography>
                            </td>
                            <td className={classes.td}>
                                <Typography>
                                    {session.roomName}
                                </Typography>
                            </td>
                            <td className={classes.td}>
                                <Typography>
                                    {session.price} UAH
                                </Typography>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
};

export default MovieSessionsTable;