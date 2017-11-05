import $ from 'jquery';
import PageManager from '../PageManager';
import FacetedSearch from './components/FacetedSearch';
import ProductCompare from './components/ProductCompare';
import Loading from 'bc-loading';

export default class Search extends PageManager {
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
        product_results: {
          limit: this.context.productsPerPage,
        },
      },
      template: {
        productListing: 'search/product-listing',
        sidebar: 'search/sidebar',
      },
      scope: {
        productListing: '[data-search]',
        sidebar: '[data-search-sidebar]',
      },
      toggleFacet: (event) => this._toggleFacet(event),
      showMore: 'search/show-more',
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
