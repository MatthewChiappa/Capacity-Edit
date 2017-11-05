import $ from 'jquery';
import PageManager from '../PageManager';

export default class Home extends PageManager {
  constructor() {
    super();
  }

  loaded(next) {
    next();
  }
}
