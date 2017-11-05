import $ from 'jquery';
import PageManager from '../PageManager';
import FacetedSearch from './components/FacetedSearch';
import ProductCompare from './components/ProductCompare';

export default class Category extends PageManager {
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
      toggleFacet: (event) => this._toggleFacet(event),
      config: {
        category: {
          products: {
            limit: this.context.productsPerPage,
          }
        },
      },
      showMore: 'category/show-more',
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
