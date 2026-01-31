import axios from 'misc/requests';
import config from 'config';
import storage, { keys } from 'misc/storage';
import {
  ERROR_SIGN_IN,
  ERROR_SIGN_UP,
  RECEIVE_USER,
  REQUEST_SIGN_IN,
  REQUEST_SIGN_OUT,
  REQUEST_SIGN_UP,
  REQUEST_USER,
  SUCCESS_SIGN_IN,
  SUCCESS_SIGN_UP,
} from '../constants/actionTypes';

const MOCK_USER_AUTH = {
  login: 'admin',
  password: '21232f297a57a5a743894a0e4a801fc3' // admin
};

const MOCK_USER_AUTH_RESPONSE = {
  user: {
    authorities: ['ENABLE_SEE_SECRET_PAGE'],
    email: 'adminMail@gmail.com',
    fullName: 'Адмiнич',
    id: '123',
    login: 'admin',
  },
  token: {
    expirationTimestamp: 1714304134,
    value: 'someJWTToken',
  }
};

const receiveUser = (user) => ({
  payload: user,
  type: RECEIVE_USER,
});

const requestUser = () => ({
  type: REQUEST_USER,
});

const errorSignIn = (errors) => ({
  payload: errors,
  type: ERROR_SIGN_IN,
});

const requestSignIn = () => ({
  type: REQUEST_SIGN_IN,
});

const successSignIn = (user) => ({
  payload: user,
  type: SUCCESS_SIGN_IN,
});

const errorSignUp = (errors) => ({
  payload: errors,
  type: ERROR_SIGN_UP,
});

const requestSignUp = () => ({
  type: REQUEST_SIGN_UP,
});

const successSignUp = () => ({
  type: SUCCESS_SIGN_UP,
});

const requestSignOut = () => ({
  type: REQUEST_SIGN_OUT,
});

const getUser = () => {
  const {
    API_URL,
  } = config;
  return axios.get(`${API_URL}/profile`);
};

const signIn = ({
  email,
  login,
  password,
}) => {
  const {
    API_URL,
  } = config;
  return axios.post(
    `${API_URL}/user/signIn`,
    {
      email,
      login,
      password,
    },
  );
};

const signUp = ({
  email,
  fullName,
  login,
  password,
}) => {
  const {
    API_URL,
  } = config;
  return axios.post(
    `${API_URL}/user/signUp`,
    {
      email,
      fullName,
      login,
      password,
    },
  );
};

const fetchRefreshToken = () => (dispatch) => {

};

const fetchSignIn = ({
  email,
  login,
  password,
}) => (dispatch) => {
  dispatch(requestSignIn());
  return signIn({
    email,
    login,
    password,
  }).catch(() => {
    // TODO: Mocked '.catch()' section
    if (login === MOCK_USER_AUTH.login && password === MOCK_USER_AUTH.password) {
      return MOCK_USER_AUTH_RESPONSE;
    }
    return Promise.reject([
      {
        code: 'WRONG_LOGIN_OR_PASSWORD',
      },
    ]);
  }).then(({ token, user }) => {
    storage.setItem(keys.TOKEN, token.value);
    storage.setItem(keys.TOKEN_EXPIRATION, token.expirationTimestamp);
    storage.setItem('USER', JSON.stringify(user)); // TODO: mocked code
    dispatch(successSignIn(user));
  }).catch((errors) => dispatch(errorSignIn(errors)));
};

const fetchSignOut = () => (dispatch) => {
  storage.removeItem(keys.TOKEN);
  storage.removeItem(keys.TOKEN_EXPIRATION);
  storage.removeItem('USER'); // TODO: Mocked code
  dispatch(requestSignOut());
};

const fetchSignUp = ({
  email,
  fullName,
  login,
  password,
}) => (dispatch) => {
  dispatch(requestSignUp());
  return signUp({
    email,
    fullName,
    login,
    password,
  }).then(() => dispatch(successSignUp()))
    .catch((errors) => dispatch(errorSignUp(errors)))
};

const fetchUser = () => (dispatch) => {
  dispatch(requestUser());

  return getUser()
      .then((response) => {
        const user = response.data || response;

        dispatch(receiveUser(user));
      })
      .catch((err) => {
        dispatch(receiveUser({ isAuthorized: false }))
      });
};

const exportFunctions = {
  fetchRefreshToken,
  fetchSignIn,
  fetchSignOut,
  fetchSignUp,
  fetchUser,
};

export default exportFunctions;
