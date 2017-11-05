import $ from 'jquery';
import debounce from '../utils/debouncer';
import MegaNav from './MegaNav';
import MegaNavLarge from './MegaNavLarge';

export default class Navigation {
  constructor() {
    this.$body = $(document.body);
    this.$el = $('.main-menu');
    this.$header = $('.main-header');
    this.$parentMenu = $('.nav-menu > .menu-dropdown');
    this.$parentMenuLink = $('.nav-menu > .menu-dropdown > a');
    this.$dropdown = $('.nav-menu-item > .dropdown');
    this.$mobileNavToggle = $('[data-navigation-toggle]');
    this.$cartTrigger = $('[data-cart-preview-toggle]');
    this.$cartPreviewWrap = $('[data-cart-preview-container]');
    this.$navItemMore = $('.nav-menu-item.more');
    this.$submenuTrigger = $('.nav-submenu-item [data-submenu-trigger]', this.$el);
    this.$submenuParent = $('.nav-submenu-item', this.$el);
    this.$submenu = $('> .nav-submenu', this.$submenuParent);
    this.$navToggle = this.$header.find('.navigation-toggle');
    this.$branding = $('.branding', '.main-header');
    this.$pageWrap = $('.page-wrap');
    this.isMegaNav = !!$('[data-menu-meganav]').length;
    this.isMegaNavLarge = !!$('[data-menu-meganav-large]').length;
    this.siteWidth = '';
    this.mobileWidth = 992;
    this.windowWidth = $(window).width();
    this.$primaryNavigation = $('.primary-navigation');

    if (this.isMegaNav) {this.megaNav = new MegaNav();}
    if (this.isMegaNavLarge) {this.megaNavLarge = new MegaNavLarge();}

    this._bindEvents();
    this._navigationResize();
    this._desktopNavPosition();

    $(window).resize();
  }

  _bindEvents() {
    $(window).on('resize', debounce(() => {
      //only do resize stuff if we've resized horizontally
      if (this.windowWidth === $(window).width()) { return;}
      this.windowWidth = $(window).width();

      this._navigationResize();
      this._desktopNavPosition();

      if ($(window).width() < this.mobileWidth) {
        this._mobileReset();
        if (this.isMegaNavLarge) {
          this.megaNavLarge.mobileReset();
        }
      } else {
        if (this.isMegaNavLarge) {
          this.megaNavLarge.mobileReset();
          this.megaNavLarge.megaNavHeight();
          this.megaNavLarge.megaNavWidth();
          this.megaNavLarge.megaNavPosition();
        }
      }
    }, 150));

    this.$mobileNavToggle.on('click', (e) => {
      e.preventDefault();
      this._toggleMobileNav(e);
    });

    this.$parentMenuLink.on('click', (e) => {
      e.preventDefault();
      this._toggleDropdown(e);
    });

    this.$cartTrigger.on('click', (e) => {
      this._toggleCartPreview(e);
    });

    this.$body.on('keyup', (e) => {
      if (e.keyCode == 27) {
        this._closeAllDropdowns();
      }
    });

    this.$parentMenu.on('click', (e) => {
      e.stopPropagation();
    });

    this.$submenuTrigger.on('click', (e) => {
      const $trigger = $(e.currentTarget);
      //prevent an empty third level on large meganavs
      if ($trigger.parents('.nav-menu-item').hasClass('menu-meganav-large')
        && $trigger.hasClass('active')
        && $(window).width >= this.mobileWidth) {
        return;
      }
      this._toggleSubmenu(e);
    });

    this.$body.on('click', () => {
      if (this.$parentMenu.find('ul.active')) {
        this._closeAllDropdowns();
      }
    });
  }

  _mobileReset() {
    $('.hide-anchor').removeClass('hide-anchor');

    this.$el.css({'top': ''});
    this.$branding.css({'top': ''});
  }

  _navigationResize() {
    this._closeAllDropdowns();
    this.$navItemMore.before($('.overflow > li'));
    $('.nav-menu > .nav-submenu-item').removeClass('nav-submenu-item').addClass('nav-menu-item');

    if($(window).width() <= 976){
      if (this.$navItemMore.hasClass('active')) {
        this.$navItemMore.removeClass('active');
        this.$el.removeClass('dropdown-displayed').css('width', '');
        this.$navItemMore.find('.dropdown').revealer();
      }
      return;
    }

    const $header = $('.main-header');

    const headerWidth = $header.width();
    const searchWidth = $('.search-form', $header).width();
    const headerToolsWidth = $('.header-tools', $header).width();
    const padding = 120;

    const navMaxWidth = headerWidth - (searchWidth + headerToolsWidth + padding);
    this.$el.css('width', navMaxWidth);

    $('.nav-menu').addClass('show-menu');
  }

  _toggleMobileNav() {
    // scrolls the page so the mobile nav is flush with the top of the window
    const headerTop = this.$header.offset().top;

    if (headerTop !== this.$body.scrollTop()) {
      this.$body.animate({scrollTop: headerTop}, 250, () => {
        this.$el.revealer();
        this.$body.toggleClass('scroll-locked-medium');
        this.$primaryNavigation.toggleClass('primary-navigation-fixed');
      });
    } else {
      this.$el.revealer();
      this.$body.toggleClass('scroll-locked-medium');
      this.$primaryNavigation.toggleClass('primary-navigation-fixed');
    }
  }

  _toggleDropdown(e) {
    // there should only be one dropdown visible at a time
    if (!$(e.currentTarget).parent(this.$parentMenu).hasClass('active')){
      this.$dropdown.revealer('hide');
      this.$el.removeClass('dropdown-displayed');
      this.$parentMenu.removeClass('active');
    }

    this._setDropdownHeight(e);

    this.$el.toggleClass('dropdown-displayed');
    $(e.currentTarget).parent().find(this.$dropdown).revealer().one('revealer-animating', () => {
      this.siteWidth = this.$pageWrap.width();

      if (this.isMegaNav && this.siteWidth >= this.mobileWidth) {
        this.megaNav.resizeNav(this.siteWidth);
        this.megaNav.positionNav(this.siteWidth);
      }
    });
    $(e.currentTarget).parent(this.$parentMenu).toggleClass('active');
  }

  _toggleSubmenu(e) {
    const $trigger = $(e.currentTarget);
    const $submenu = $trigger.siblings('.nav-submenu');
    const headerTop = this.$header.offset().top;
    $submenu.toggleClass('active').children().removeClass('hide');

    this.$submenu.each(function() {
      //close adjacent menus
      const $val = $(this);
      const isParent = $submenu.parents().is($val);
      let closeMenu = !$val.is($submenu) && !isParent;

      $val.removeClass('current');

      if (closeMenu) {
        $val.revealer('hide').siblings('.submenu-trigger').removeClass('active');
      }
    });

    $trigger.parent().toggleClass('blurred').toggleClass('active').siblings().addClass('blurred').toggleClass('hide');
    $trigger.parent().parent().parent('.active').toggleClass('hide-anchor');
    $trigger.toggleClass('active');
    $submenu.revealer().addClass('current');

    if ($(window).width() < this.mobileWidth) {
      this.$body.animate({scrollTop: headerTop}, 250);
    }
  }

  _toggleCartPreview(e) {
    if ($('body').css('content').match(/desktop/)) {
      e.preventDefault();
      this.$cartTrigger.toggleClass('active');
      this.$cartPreviewWrap.revealer();
    }
  }

  _closeAllDropdowns() {
    this.$dropdown.revealer('hide');
    this.$el.removeClass('dropdown-displayed');
    this.$parentMenu.removeClass('active');
    this.$submenuTrigger.removeClass('active');
    this.$submenu.revealer('hide');
    $('.nav-submenu-item').removeClass('hide active').parent().addClass('blurred');
  }

  _setDropdownHeight(e) {
    //only run on desktop
    if ( this.$navToggle.is(":visible") ) { return; }

    const $window = $(window);
    const $dropdown = $(e.currentTarget).parent().find(this.$dropdown);
    const scrollTop = $window.scrollTop();
    const dropdownOffset = $(e.currentTarget).offset().top + 90;
    const maxHeight = $window.height() - (dropdownOffset - scrollTop);

    if (! $dropdown.hasClass('meganav-submenu')) { $dropdown.css('max-height', maxHeight) };
  }

  _desktopNavPosition() {
    // Since the elements in the header are absolutely positioned I have to calculate what to do to the header to
    // accommodate extra categories in top level
    const navHeight = this.$el.height();
    const headerHeight = 380; // hardcoded
    const navOffsetTop = navHeight / 3;

    if (navHeight > 110) { // greater than 3 levels
      this.$el.css({'top': 'calc(50% + ' + navOffsetTop + 'px)' });
      //20px is to account for spacing between header and top of viewport
      this.$branding.css({'top': 'calc(50% + ' + (navOffsetTop + 20) + 'px)'});
    } else {
      this.$el.css({'top': ''});
      this.$branding.css({'top': ''});
    }
  }
}
