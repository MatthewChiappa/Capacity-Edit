import $ from 'jquery';
import PageManager from '../PageManager';
import 'vanilla-fitvids/jquery.fitvids';

export default class Page extends PageManager {
  constructor() {
    super();
  }
  loaded() {
    $('.rte').fitVids();
  }
}
