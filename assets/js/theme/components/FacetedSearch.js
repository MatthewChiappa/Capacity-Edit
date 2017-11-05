import { hooks, api } from '@bigcommerce/stencil-utils';
import $ from 'jquery';
import Url from 'url';
import 'history.js/scripts/bundled/html4+html5/jquery.history';
import SelectWrapper from './SelectWrapper';
import ProductCompare from './ProductCompare';
import Loading from 'bc-loading';

export default class FacetedSearch {
  constructor(options, callback) {
    this.callback = callback;
    this.$body = $(document.body);

    this.options = $.extend(true, {
      config: {
        category: {
          shop_by_price: true,
        },
        shop_by_brand: {
          limit: 12,
        }
      },
      template: {
        productListing: 'category/product-listing',
        sidebar: 'category/sidebar'
      },
      scope: {
        productListing: '[data-category]',
        sidebar: '[data-category-sidebar]',
      },
      facetToggle: '[data-facet-toggle]',
      moreToggle: '[data-facet-more]',
      moreFacets: '[data-show-more-facets]',
      toggleFacet: () => console.log('Facet toggled.'),
    }, options);

    const loadingOptions = {
      loadingMarkup: '<div class="loading"></div>',
      visibleClass: 'visible',
      scrollLockClass: 'scroll-locked',
    };

    this.facetedSearchOverlay = new Loading(loadingOptions, true, '[data-faceted-search]');

    this.callbacks = $.extend({
      willUpdate: () => this._showOverlay(),
      didUpdate: () => this._hideOverlay(),
    }, options.callbacks);

    this._bindEvents();
  }

  _bindEvents() {
    this.$body.on('click', this.options.facetToggle, (event) => {
      this._toggleFacet(event);
    });

    this.$body.on('click', this.options.moreToggle, (event) => {
      this._showAdditionalFilters(event);
    });

    this.$body.on('click', this.options.moreFacets, (event) => {
      this._showMoreFacets(event);
    });

    $(window).on('statechange', this._onStateChange.bind(this));
    hooks.on('facetedSearch-facet-clicked', this._onFacetClick.bind(this));
    hooks.on('facetedSearch-range-submitted', this._onRangeSubmit.bind(this));
    hooks.on('sortBy-submitted', this._onSortBySubmit.bind(this));
  }

  _showMoreFacets(event) {
    //Show/hide extra facets based on settings for product filtering
    this.callbacks.willUpdate();
    event.preventDefault();

    const $toggle = $(event.currentTarget);
    const $navList = $($toggle.attr('href'));
    const facet = $navList.data('facet');
    const facetUrl = History.getState().url;

    if ($toggle.siblings('.faceted-search-option-columns').length == 0) {
      if (this.options.showMore) {
        api.getPage(facetUrl, {
          template: this.options.showMore,
          params: {
            list_all: facet,
          },
        }, (err, response) => {
          if (err) {
            throw new Error(err);
          }
          $(response).insertAfter($navList);
          $('.faceted-search-option-columns').toggle();
          this.callbacks.didUpdate();
        });
      }
    } else {
      $('.faceted-search-option-columns').toggle();
      this.callbacks.didUpdate();
    }

    $navList.toggle();

    //toggle more/less link
    $toggle.children().toggle();

    return false;
  }

  _showAdditionalFilters(event) {
    event.preventDefault();

    $(event.currentTarget)
      .addClass('hidden')
      .parent('li')
      .siblings('li')
      .removeClass('hidden');
  }

  _toggleFacet(event) {
    this.options.toggleFacet(event);
  }

  _onFacetClick(event) {
    event.preventDefault();

    const $target = $(event.currentTarget);
    const url = $target.attr('href');

    $target.parent('[data-facet-item]').toggleClass('facet-selected');

    this._goToUrl(url);
  }

  _onRangeSubmit(event) {
    event.preventDefault();

    const url = Url.parse(location.href);
    let queryParams = $(event.currentTarget).serialize();

    if (this.$body.hasClass('template-search')) {
      const currentSearch = `search_query=${$('[data-faceted-search]').data('search-query')}` || '';
      queryParams = `${queryParams}&${currentSearch}`;
    }

    this._goToUrl(Url.format({ pathname: url.pathname, search: '?' + queryParams }));
  }

  _onSortBySubmit(event) {
    event.preventDefault();

    const url = Url.parse(location.href, true);
    const queryParams = $(event.currentTarget).serialize().split('=');

    url.query[queryParams[0]] = queryParams[1];
    delete url.query['page'];

    this._goToUrl(Url.format({ pathname: url.pathname, query: url.query }));
  }

  _onStateChange(event) {
    this.callbacks.willUpdate();

    api.getPage(History.getState().url, this.options, (err, content) => {
      if (err) {
        throw new Error(err);
        this.callbacks.didUpdate();
        return;
      }

      if (content) {
        $(this.options.scope.productListing).html(content.productListing);
        $(this.options.scope.sidebar).html(content.sidebar);
        this.callbacks.didUpdate();

        new SelectWrapper($('[data-sort-by] select'));
      }
    });

    if ($('.compare-enabled').length) {
      this.Compare = new ProductCompare();
    }
  }

  _showOverlay() {
    this.facetedSearchOverlay.show();
  }

  _hideOverlay() {
    this.facetedSearchOverlay.hide();
  }

  _goToUrl(url) {
    History.pushState({}, document.title, url);
  }
}
