import * as pages from './pages';
import config from 'config';

const result = {
  [pages.defaultPage]: `${config.UI_URL_PREFIX}/${pages.defaultPage}`,
  [pages.login]: `${config.UI_URL_PREFIX}/${pages.login}`,
  [pages.secretPage]: `${config.UI_URL_PREFIX}/${pages.secretPage}`,
  [pages.movies]: `${config.UI_URL_PREFIX}/${pages.movies}`,
  [pages.movieProfile]: `${config.UI_URL_PREFIX}/movies/:id`,
};

export default result;
