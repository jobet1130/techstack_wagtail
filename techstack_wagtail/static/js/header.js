jQuery(document).ready(function($) {
    'use strict';

    /**
     * =================================================================================================
     * TechStackPH Header-Specific JavaScript
     *
     * This file contains the JavaScript logic exclusively for the site header, including the
     * mobile menu toggle functionality.
     * =================================================================================================
     */

    const mobileMenuButton = '.navbar-burger';
    const mobileNav = '.navbar-menu';

    /**
     * @description Initializes the mobile menu toggle functionality.
     */
    function initMobileMenu() {
        // Close mobile menu on desktop view
        if ($(window).width() > 1023) {
            $(mobileMenuButton).removeClass('is-active');
            $(mobileNav).removeClass('is-active');
        }

        $(mobileMenuButton).on('click', function() {
            $(this).toggleClass('is-active');
            $(mobileNav).toggleClass('is-active');
        });

        // Close mobile menu when resizing to desktop
        $(window).on('resize', function() {
            if ($(window).width() > 1023) {
                $(mobileMenuButton).removeClass('is-active');
                $(mobileNav).removeClass('is-active');
            }
        });
    }

    /**
     * 🚀 INITIALIZATION
     * Kicks off all header-related scripts.
     */
    initMobileMenu();
    console.log('Header scripts initialized.');
});