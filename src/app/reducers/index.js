import { combineReducers } from 'redux';

import user from './user';
import movies from './movies';
import director from './director';
import genre from './genre';


export default combineReducers({
  user,
  movies,
  director,
  genre
});
