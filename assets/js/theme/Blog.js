import $ from 'jquery';
import PageManager from '../PageManager';
import 'vanilla-fitvids/jquery.fitvids';

export default class Blog extends PageManager {
  constructor() {
    super();
    $('.rte').fitVids();
  }
}
