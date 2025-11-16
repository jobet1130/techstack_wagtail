
jQuery(document).ready(function($) {
    'use strict';

    /**
     * =================================================================================================
     * TechStackPH Header-Specific JavaScript
     *
     * This file contains the JavaScript logic exclusively for the site header, including the
     * mobile menu toggle and the sticky header functionality.
     * =================================================================================================
     */

    const stickyHeaderSelector = '#sticky-header';
    const mobileMenuButton = '#mobile-menu-toggle';
    const mobileNav = '#navbarBasicExample';

    /**
     * @description Initializes the mobile menu toggle functionality.
     */
    function initMobileMenu() {
        $(mobileMenuButton).on('click', () => {
            $(mobileMenuButton).toggleClass('is-active');
            $(mobileNav).toggleClass('is-active');
        });
    }

    /**
     * @description Initializes the sticky header functionality.
     */
    function initStickyHeader() {
        const $header = $(stickyHeaderSelector);
        if (!$header.length) return;
        const offset = $header.hasClass('is-fixed-top') ? 0 : $header.offset().top;
        
        $(window).on('scroll', () => {
            if ($(window).scrollTop() > offset) {
                 if(!$header.hasClass('is-fixed-top')) $header.addClass('is-sticky');
            } else {
                $header.removeClass('is-sticky');
            }
        });
    }

    /**
     * 🚀 INITIALIZATION
     * Kicks off all header-related scripts.
     */
    initMobileMenu();
    initStickyHeader();
    console.log('Header scripts initialized.');

});
