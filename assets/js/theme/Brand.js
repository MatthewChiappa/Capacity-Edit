import $ from 'jquery';
import PageManager from '../PageManager';
import FacetedSearch from './components/FacetedSearch';
import ProductCompare from './components/ProductCompare';
import Loading from 'bc-loading';

export default class Brand extends PageManager {
  constructor() {
    super();
  }

  loaded(next) {
    if ($('.compare-enabled').length) {
      this.Compare = new ProductCompare();
    }

    if ($('[data-faceted-search]').length) {
      this._initializeFacetedSearch();
    }

    next();
  }

  _initializeFacetedSearch() {
    const facetedSearchOptions = {
      config: {
        brand: {
          products: {
            limit: this.context.productsPerPage,
          }
        },
      },
      template: {
        productListing: 'brand/product-listing',
        sidebar: 'brand/sidebar',
      },
      scope: {
        productListing: '[data-brand]',
        sidebar: '[data-brand-sidebar]',
      },
      showMore: 'brand/show-more',
      toggleFacet: (event) => this._toggleFacet(event),
      // callbacks: {
      //   willUpdate: () => {},
      //   didUpdate: () => {},
      // }
    };

    new FacetedSearch(facetedSearchOptions);
  }

  _toggleFacet(event) {
    const $target = $(event.currentTarget);

    $target
      .parents('[data-facet-filter]')
      .children('[data-facet-filter-wrapper]')
      .toggleClass('is-open');

    $target.toggleClass('is-open');
  }
}
