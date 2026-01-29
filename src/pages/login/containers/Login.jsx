import React from 'react';
import { useIntl } from 'react-intl';
import Typography from 'components/Typography';
import Button from 'components/Button';
import config from 'config'; // Імпортуємо наш конфіг

// Можна додати красиву іконку Google, якщо хочете
// import GoogleIcon from 'components/icons/Google';

const Login = () => {
  const { formatMessage } = useIntl();

  const handleGoogleLogin = () => {
    // Головна магія тут.
    // Ми просто змушуємо браузер перейти на адресу Gateway.
    // Gateway сам перекине на Google, а потім поверне назад.
    window.location.href = `${config.API_URL}/oauth2/authorization/google`;
  };

  return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '20px'
      }}>
        <Typography variant="title">
          {formatMessage({ id: 'login_title', defaultMessage: 'Sign in' })}
        </Typography>

        <Typography>
          {formatMessage({ id: 'login_subtitle', defaultMessage: 'Please sign in with Google to continue' })}
        </Typography>

        <Button onClick={handleGoogleLogin}>
          {/* Якщо є іконка: <GoogleIcon style={{ marginRight: 8 }} /> */}
          {formatMessage({ id: 'login_google_button', defaultMessage: 'Sign in with Google' })}
        </Button>
      </div>
  );
};

export default Login;