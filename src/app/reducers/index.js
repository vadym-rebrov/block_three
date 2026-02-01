import { combineReducers } from 'redux';

import user from './user';
import movies from './movies';
import director from './director';
import genre from './genre';
import movieSession from './movieSession';

export default combineReducers({
  user,
  movies,
  director,
  genre,
  movieSession
});
