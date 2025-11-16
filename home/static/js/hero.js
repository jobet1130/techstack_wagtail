
jQuery(document).ready(function($) {
    'use strict';

    /**
     * =================================================================================================
     * TechStackPH Hero Block JavaScript
     *
     * This file contains advanced and professional JavaScript enhancements for the Hero Block,
     * specifically focusing on a parallax scrolling effect.
     * =================================================================================================
     */

    /**
     * @class HeroBlock
     * @description Manages interactive behaviors for the Hero Block component.
     */
    class HeroBlock {
        /**
         * @constructor
         */
        constructor() {
            /** @type {string} The selector for the hero block's background image element. */
            this.heroBackgroundSelector = '.hero-background-image';
            /** @type {jQuery} A jQuery object representing the hero background element. */
            this.$heroBackground = $(this.heroBackgroundSelector);
            /** @type {number} The parallax effect intensity. A higher number means a more subtle effect. */
            this.parallaxFactor = 3;
        }

        /**
         * @description Initializes the hero block functionalities.
         */
        initialize() {
            if (this.$heroBackground.length) {
                this.initParallax();
                console.log('HeroBlock Initialized with Parallax Effect.');
            }
        }

        /**
         * @description Binds the scroll event to create a parallax effect on the hero background.
         * The function is throttled to improve performance by limiting how often it can be called.
         */
        initParallax() {
            const self = this;
            let isThrottled = false;
            const throttleDuration = 16; // Roughly 60 FPS

            $(window).on('scroll', function() {
                if (!isThrottled) {
                    isThrottled = true;
                    window.requestAnimationFrame(function() {
                        const scrolled = $(window).scrollTop();
                        // Apply a vertical transform to the background image at a fraction of the scroll speed.
                        self.$heroBackground.css('transform', `translateY(${scrolled / self.parallaxFactor}px)`);
                        isThrottled = false;
                    });
                }
            });
        }
    }

    /**
     * 🚀 INITIALIZATION
     * Kicks off the HeroBlock functionalities once the DOM is ready.
     */
    const heroBlock = new HeroBlock();
    heroBlock.initialize();

});
