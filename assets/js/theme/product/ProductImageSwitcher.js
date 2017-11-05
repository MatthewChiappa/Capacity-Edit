import $ from 'jquery';
import baguetteBox from 'baguettebox.js';

export default class ProductImageSwitcher {
  constructor(el) {
    this.$el = $(el);

    this._bindEvents();
    this._cacheImages();
    this._setInitialImage();
  }

  _bindEvents() {
    this.$el.on('click', '.product-thumbnail', (event) => {
      event.preventDefault();
      this._switchMainImage(event);
    });
  }

  _setInitialImage() {
    const initialImageSrc = this.$el.find('.product-image img').attr('src').split('/').pop();

    $('.product-thumbnail').each((i) => {
      const $thumbnail = $('.product-thumbnail').eq(i);
      const thumbnailSrc = $thumbnail.find('img').attr('src').split('/').pop();

      if (thumbnailSrc === initialImageSrc) {
        $thumbnail
          .addClass('active')
          .siblings().removeClass('active');
      }
    });
    baguetteBox.run('.product-main-image', {});
  }

  _switchMainImage(event) {
    baguetteBox.destroy();
    const $target = $(event.currentTarget);
    const largeImage = $target.data('high-res');
    const imageDescription = $target.find('img').attr('title');

    $target
      .addClass('active')
      .siblings().removeClass('active');

    this.$el.find('.product-main-image img').attr('src', largeImage);
    this.$el.find('.product-main-image img').attr('alt', imageDescription);
    this.$el.find('.product-main-image img').attr('title', imageDescription);
    this.$el.find('.product-main-image .product-image').attr('href', largeImage);
    baguetteBox.run('.product-main-image', {});
  }

  _cacheImages() {
    const $thumbnail = this.$el.find('.product-thumbnail');
    $thumbnail.each((i) => {
      let cachedImage = new Image();
      cachedImage.src = $thumbnail.eq(i).data('high-res');
    });
  }
}
