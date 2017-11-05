import $ from 'jquery';
import debounce from '../utils/debouncer';

export default class MegaNavLarge {
  constructor() {
    this.$el = $('[data-menu-meganav-large]');
    this.$dropdownTrigger = $('> a', this.$el);
    this.$megaNav = $('> .meganav-submenu', this.$el);
    this.$topLevel = this.$megaNav.parent();
    this.$backButton = $('[data-meganav-back]', this.$el);
    this.$submenuParent = $('.nav-submenu-item', this.$el);
    this.$submenu = $('> .nav-submenu', this.$submenuParent);
    this.$submenuTrigger = $('[data-submenu-trigger]', this.$el);
    this.$firstSubmenuTrigger = $('> ul:first-of-type > li:first-of-type > a', this.$el);
    this.mobileWidth = 992;
    this.isDesktop = window.innerWidth >= this.mobileWidth;

    $(window).on('resize', debounce(() => {
      this.isDesktop = !$(window).width() < this.mobileWidth;
      if ($(window).width() < this.mobileWidth) {
        this.isDesktop = false;
      } else {
        this.isDesktop = true;
      }
    }, 50));

    this.$backButton.on('click', (event) => {
      if (this.isDesktop) {
        const $trigger = $(event.currentTarget);
        const $submenu = $trigger.parent().parent('.nav-submenu');
        this._backOneLevel($submenu);
      }
    });

    this.$dropdownTrigger.on('click', () => {
     if (this.isDesktop) {
       this._selectFirstItem();
     }
    });
  }

  _backOneLevel($submenu) {
    $submenu
      .revealer('hide').one('revealer-hide', () => {
        $submenu.removeClass('active current').parent().removeClass('active')
          .parent('.nav-submenu').addClass('current')
          .children().removeClass('hide')
          .children('a').removeClass('active');
    });
  }

  megaNavHeight() {
    // 100 = Faked padding, above and below the nav
    $('.meganav-submenu', this.$megaNav).css('height', this.$megaNav.height() - 100);
  }

  megaNavWidth() {
    const $pageWrap = $('.page-wrap');
    this.$megaNav.css('width', $pageWrap.width());
  }

  megaNavPosition() {
    const megaNavOffset = this.$topLevel.offset().left;
    const $pageWrap = $('.page-wrap');
    const pageWidth = $pageWrap.width();
    const sitePadding = 30;

    if ((pageWidth + (sitePadding * 2)) == $(window).width()) {
      const offset = megaNavOffset - sitePadding;
      this.$megaNav.css('left', `-${offset}px`);
    } else {
      const offset = megaNavOffset - $pageWrap.offset().left;
      this.$megaNav.css('left', `-${offset}px`);
    }
  }

  _selectFirstItem() {
    if (this.$firstSubmenuTrigger.parent().hasClass('dropdown') &&
     !this.$firstSubmenuTrigger.parent().hasClass('active')) {
      this.$firstSubmenuTrigger.click().parent();
    }
  }

  mobileReset() {
    this.$submenu.css({'max-height': '', 'width': ''});
    this.$megaNav.css({'left': '', 'width': ''});
  }
}