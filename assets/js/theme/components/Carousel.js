import $ from 'jquery';
import Flickity from 'flickity-imagesloaded';

export default class Carousel {
  constructor(context) {
    this.settings = context;

    if ($('[data-slideshow]').length) {
      this.flickity = new Flickity('[data-slideshow]', {
        cellSelector: '[data-slideshow-slide]',
        prevNextButtons: false,
        pageDots: true,
        wrapAround: true,
        accessibility: false,
        adaptiveHeight: true,
        autoPlay: this.settings.delay,
      });
    }
  }

  unload() {
    this.flickity.destroy();
  }
}
