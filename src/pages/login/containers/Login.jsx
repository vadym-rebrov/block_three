import React from 'react';
import { useIntl } from 'react-intl';
import Typography from 'components/Typography';
import GoogleLoginButton from 'components/GoogleLoginButton/GoogleLoginButton';

const Login = () => {
    const { formatMessage } = useIntl();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '24px',
            padding: '20px',
        }}>
            <Typography variant="title">
                {formatMessage({ id: 'login_title' })}
            </Typography>

            <Typography>
                {formatMessage({ id: 'login_subtitle'})}
            </Typography>

            <div style={{ marginTop: '10px' }}>
                <GoogleLoginButton
                    label={formatMessage({ id: 'login_google_button'})}
                />
            </div>
        </div>
    );
};

export default Login;