
jQuery(document).ready(function($) {
    'use strict';

    /**
     * =================================================================================================
     * TechStackPH Footer-Specific JavaScript (OOP Version)
     *
     * This file contains a self-contained JavaScript module for all logic exclusive to the site footer.
     * It is designed to work alongside the global `techstack_wagtail.js` but can be extended with
     * footer-specific functionality like analytics or custom form handling.
     *
     * Class Architecture:
     * - FooterApp: Orchestrates all footer-related initializations.
     * =================================================================================================
     */

    /**
     * @class FooterApp
     * @description Manages all JavaScript functionalities within the site's footer.
     */
    class FooterApp {
        /**
         * @constructor
         */
        constructor() {
            /** @type {string} The CSS selector for the newsletter form within the footer. */
            this.newsletterFormSelector = '#newsletter-form';
        }

        /**
         * @description Initializes all footer-specific functionalities.
         */
        initialize() {
            this.handleNewsletterSubscription();
            console.log('FooterApp Initialized.');
        }

        /**
         * @description Handles the newsletter subscription form.
         * Note: The global `FormHandler` already manages `.ajax-form` submissions.
         * This method is a placeholder for any *additional* or *override* logic specific
         * to the newsletter form, such as custom analytics events.
         */
        handleNewsletterSubscription() {
            const $form = $(this.newsletterFormSelector);
            if (!$form.length) return;

            $form.on('submit', function(e) {
                // The default AJAX submission is handled by FormHandler.
                // We can add footer-specific logic here.
                console.log('Newsletter form submission tracked by FooterApp.');

                // Example for future analytics integration:
                // if (typeof ga !== 'undefined') {
                //     ga('send', 'event', 'Forms', 'Submit', 'Newsletter Subscription');
                // }
            });
        }
    }

    /**
     * 🚀 INITIALIZATION
     * Kicks off the FooterApp once the DOM is ready.
     */
    const footerApp = new FooterApp();
    footerApp.initialize();

});
