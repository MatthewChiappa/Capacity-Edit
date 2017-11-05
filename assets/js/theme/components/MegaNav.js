import $ from 'jquery';
import debounce from '../utils/debouncer';

export default class MegaNav {
  constructor() {
    this.$el = $('[data-menu-meganav]');
    this.$megaNav = $('> .meganav-submenu', this.$el);
    this.$topLevel = this.$megaNav.parent();
    this.mobileWidth = 992;
    this.isDesktop = window.innerWidth >= this.mobileWidth;
    this.$pageWrap = $('.page-wrap');
    this.siteWidth = '';

    this._bindEvents();
  }

  _bindEvents() {
    $(window).on('resize', debounce(() => {
      this._reset();
      if ($(window).width() < this.mobileWidth) {
        this.isDesktop = false;
      } else {
        this.isDesktop = true;
      }
    }, 150));

    $(window).resize();
  }

  _reset() {
    this.$megaNav.css({'width': '', 'left': ''});
  }

  resizeNav(siteWidth) {
    if (this.$megaNav.outerWidth() >= siteWidth) {
      this.$megaNav.css('width', siteWidth);
    } else {
      this.$megaNav.css('width', '');
    }
  }

  positionNav(siteWidth) {
    const megaNavWidth = this.$megaNav.outerWidth();
    const megaNavOffsetLeft = this.$topLevel.offset().left;
    const pageWidth = this.$pageWrap.width();
    const innerOffsetLeft = this.$pageWrap.offset().left - megaNavOffsetLeft;
    const pageWrapOffsetRight = this.$pageWrap.offset().left + this.$pageWrap.outerWidth();
    const megaNavOffsetRight = this.$megaNav.offset().left + megaNavWidth;

    const sitePadding = 30;

    if ((pageWidth + 60) < $(window).width() && megaNavWidth == siteWidth) {
      const difference = megaNavOffsetLeft - this.$pageWrap.offset().left;

      this.$megaNav.css('left', `-${difference}px`);
    }  else if (megaNavWidth == siteWidth) {
      this.$megaNav.css('left', `-${megaNavOffsetLeft - sitePadding}px`);
      // if nav is smaller than site but so big it would flow out to the right
    } else if (megaNavOffsetRight > pageWrapOffsetRight) {
      const difference = (megaNavOffsetRight - pageWrapOffsetRight + 10); //account for the -10 in scss

      this.$megaNav.css('left', `-${difference}px`);
    } else {
      this.$megaNav.css('left', '');
    }
  }
}
