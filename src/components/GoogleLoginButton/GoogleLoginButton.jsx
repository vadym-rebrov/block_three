import React from 'react';
import GoogleIcon from 'components/icons/Google';
import config from 'config';

const GoogleLoginButton = ({ label = 'Sign in with Google' }) => {

    const handleClick = () => {
        window.location.href = `${process.env.GOOGLE_AUTH_URL}/oauth2/authorization/google`;
    };

    const styles = {
        button: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            border: '1px solid #dadce0',
            borderRadius: '4px',
            color: '#3c4043',
            cursor: 'pointer',
            fontFamily: '"Google Sans", "Roboto", arial, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            height: '40px',
            padding: '0 12px 0 0',
            textDecoration: 'none',
            transition: 'background-color .3s, box-shadow .3s',
            boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
            outline: 'none',
        },
        iconWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            marginRight: '12px',
            backgroundColor: '#fff',
            borderRadius: '4px 0 0 4px',
        },
        text: {
            flexGrow: 1,
            textAlign: 'center',
        }
    };

    return (
        <button
            onClick={handleClick}
            style={styles.button}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f7fafe'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
        >
            <div style={styles.iconWrapper}>
                <GoogleIcon width={18} height={18} />
            </div>
            <span style={styles.text}>{label}</span>
        </button>
    );
};

export default GoogleLoginButton;