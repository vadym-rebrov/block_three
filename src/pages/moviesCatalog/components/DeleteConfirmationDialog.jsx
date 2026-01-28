import React from 'react';
import { createUseStyles } from 'react-jss';
import { useIntl, FormattedMessage } from 'react-intl';
import Dialog from 'components/Dialog';
import Card from 'components/Card';
import CardTitle from 'components/CardTitle';
import CardContent from 'components/CardContent';
import Typography from 'components/Typography';
import Button from 'components/Button';

const useStyles = createUseStyles({
    dialogButtons: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '20px'
    },
    btnDelete: {
        background: '#d90000',
    },
    errorBox: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#fdeded',
        borderRadius: '4px'
    }
});

function DeleteConfirmationDialog({ open, movieTitle, onClose, onConfirm, error }) {
    const classes = useStyles();
    const { formatMessage } = useIntl();


    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <Card>
                <CardTitle>
                    <Typography variant="title">{formatMessage({ id: 'deleteTitle' })}</Typography>
                </CardTitle>
                <CardContent>
                    <Typography>
                        <FormattedMessage
                            id="deleteConfirm"
                            values={{ title: <strong>"{movieTitle}"</strong> }}
                        />
                    </Typography>

                    {error && (
                        <div className={classes.errorBox}>
                            <Typography color="error">
                                {error}
                            </Typography>
                        </div>
                    )}

                    <div className={classes.dialogButtons}>
                        <Button
                            variant="secondary"
                            onClick={onClose}
                        >
                            {formatMessage({ id: 'btnCancel' })}
                        </Button>
                        <Button
                            className={classes.btnDelete}
                            variant="primary"
                            onClick={onConfirm}
                        >
                            {formatMessage({ id: 'btnDelete' })}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </Dialog>
    );
}

export default DeleteConfirmationDialog;