import $ from 'jquery';
import PageManager from '../PageManager';
import Alert from './components/Alert';
import ProductUtils from './product/ProductUtils';
import QuantityWidget from './components/QuantityWidget';
import ProductReviews from './product/reviews';
import ProductViewTemplates from './product/ProductViewTemplates';
import ProductImageSwitcher from './product/ProductImageSwitcher';
import VariationImage from './product/VariationImage'

export default class Product extends PageManager {
  constructor() {
    super();

    this.el = '[data-product-details]';
    this.$el = $(this.el);

    this.productImages = this.$el.find('.product-images');
  }

  loaded() {
    new QuantityWidget({scope: $('[data-cart-item-add]', this.$el)});

    new ProductReviews(this.context);

    this.ProductUtils = new ProductUtils(this.el, {
      priceWithoutTaxTemplate: ProductViewTemplates.priceWithoutTax,
      priceWithTaxTemplate: ProductViewTemplates.priceWithTax,
      priceSavedTemplate: ProductViewTemplates.priceSaved,
      tabSelector: '.tab-link',
      callbacks: {
        didUpdate: (isError, response) => {},
        willUpdate: (isError, response) => {},
        switchImage: VariationImage,
      },
    }).init(this.context);

    new ProductImageSwitcher(this.productImages);

    $(document.body).on('click', '[data-toggle-extra-reviews]', (event) => {
      this._toggleExtraReviews(event);
    });
  }

  // show/hide reviews beyond the ones initially visible
  _toggleExtraReviews(event) {
    const $button = $(event.currentTarget);
    const buttonText = $button.text();
    const toggleText = $button.data('toggle-text');

    $('.product-reviews').toggleClass('all-reviews-visible');

    $button
      .text(toggleText)
      .data('toggle-text', buttonText);
  }
}
