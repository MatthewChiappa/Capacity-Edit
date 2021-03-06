import $ from 'jquery';
import utils from '@bigcommerce/stencil-utils'
import Loading from 'bc-loading';

export default class CartPreview {
  constructor() {
    this.$cartPreviewContainer = $('[data-cart-preview]');
    this.$cartPreviewCount = $('[data-cart-preview-count]');

    this.cartChangeHooks = [
      'cart-item-add',
      'cart-item-update',
      'cart-item-remove',
    ];

    this.cartChangeRemoteHooks = [
      'cart-item-add-remote',
      'cart-item-update-remote',
      'cart-item-remove-remote',
    ];

    const loadingOptions = {
      loadingMarkup: '<div class="loading"></div>',
      visibleClass: 'visible',
      scrollLockClass: 'scroll-locked',
    };

    this.cartTotalsOverlay = new Loading(loadingOptions, true, '[data-cart-preview]');

    this.callbacks = {
      willUpdate: () => this._showOverlay(),
      didUpdate: () => this._hideOverlay(),
    };

    this._bindUtilHooks();
    this._bindEvents();
  }

  _bindEvents() {
    //remove item on click
    this.$cartPreviewContainer.on('click', '[data-cart-remove]', (evt) => {
      evt.preventDefault();
      const id = $(evt.currentTarget).data('product-id');
      this._removeItem(id);
    });
  }

  /**
   * Bind hook actions so cartPreview updates remotely.
   * cannot bind multple events in the standard space-separated way.
   * TODO: chance for errors here?
   */
  _bindUtilHooks() {
    // initial events: when an update button is clicked
    this.cartChangeHooks.forEach((hook) => {
      utils.hooks.on(hook, (event) => {
        this.callbacks.willUpdate();
      });
    })

    // remote events: when the proper response is sent
    // TODO: Add error handling back in
    this.cartChangeRemoteHooks.forEach((hook) => {
      utils.hooks.on(hook, (event) => {
        this._refreshcartPreview();
      });
    })
  }

  _removeItem(itemID) {
    utils.api.cart.itemRemove(itemID, () => {
      this._refreshcartPreview();
    });
  }

  _refreshcartPreview() {
    this.callbacks.willUpdate();
    utils.api.cart.getContent({template: 'cart/cart-preview'}, (err, response) => {
      this.$cartPreviewContainer.html(response);

      // get cart count from newly appended response
      const count = parseInt($('[data-cart-preview-body]').data('count'), 10);

      this.$cartPreviewCount.text(count || 0);
      $('.cart-preview-trigger').attr('data-cart-count', count);

      this._bindEvents();
      this.callbacks.didUpdate();
    });
  }

  _showOverlay() {
    this.cartTotalsOverlay.show();
  }

  _hideOverlay() {
    this.cartTotalsOverlay.hide();
  }
};
