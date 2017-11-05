import $ from 'jquery';
import 'jquery-trend';
import 'jquery-revealer';

import PageManager from '../PageManager';
import CurrencySelector from './components/CurrencySelector';
import SelectWrapper from './components/SelectWrapper';
import Navigation from './components/Navigation';
import MegaNav from './components/MegaNav';
import MegaNavLarge from './components/MegaNavLarge';
import FormValidator from './utils/FormValidator';
import initFormSwatchFields from './core/formSelectedValue';
import CartPreview from './cart/CartPreview';
import QuickShop from './components/QuickShop';
import initAlertDismissable from './core/alertDismissable';

// global scope jQuery plugins
/* eslint-disable no-unused-vars */
import validetta from 'validetta';
import imagesLoaded from 'imagesloaded';

export default class Global extends PageManager {
  constructor() {
    super();

    this.navigation = new Navigation();

    new CurrencySelector($('[data-currency-selector]'));

    const $select = $('select');
    if ($select.length) {
      $select.each((i, el) => {
        new SelectWrapper(el);
      });
    }
  }

  loaded(next) {
    initFormSwatchFields();
    initAlertDismissable();
    new CartPreview();

    // QuickShop
    if ($('[data-quick-shop]').length) {
      new QuickShop(this.context);
    }

    // global form validation
    this.validator = new FormValidator(this.context);
    this.validator.initGlobal();
  }
}
