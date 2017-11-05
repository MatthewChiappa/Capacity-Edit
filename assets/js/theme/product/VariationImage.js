import $ from 'jquery';
import ProductViewTemplates from './ProductViewTemplates';
import ProductImageSwitcher from './ProductImageSwitcher';
import imagesLoaded from 'imagesloaded';

export default function variationImgPreview(main, thumb, alt) {
  const productImages = '.product-images';

  // Only append if image doesn't already exist.
  if (! $(`img[src="${thumb}"]`).length) {

    const newThumb = ProductViewTemplates.variationThumbnail({
      mainImageUrl: main,
      thumbImageUrl: thumb,
    });

    const $newThumb = $(newThumb);

    imagesLoaded($newThumb[0], () => {
      $('.product-thumbnails').prepend($newThumb);
      new ProductImageSwitcher(productImages);
    });
  }

  // Set main image and add active class to matching thumbnail
  if (! $(`img[src="${main}"]`).length) {
    $('.product-main-image img').attr('src', main).attr('alt', alt);
    // Todo: make it so ProductImageSwitcher only needs to fire once
    new ProductImageSwitcher(productImages);
  }
}
