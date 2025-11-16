'use strict';

/**
 * @file techstack_wagtail.js
 * @description JavaScript functionality for the Techstack Wagtail project.
 * @author Jobet P. Casquejo
 * @version 1.0.0
 * @license MIT
 * @date 2025-11-16
 */

jQuery(document).ready(function($) {
    'use strict';

    /**
     * =================================================================================================
     * TechStackPH Global JavaScript (OOP Version)
     *
     * This file contains a fully Object-Oriented JavaScript architecture using jQuery for DOM
     * manipulation and AJAX. It is designed to be platform-agnostic (Next.js, Wagtail, WordPress).
     *
     * NOTE: This file is for demonstration purposes and should NOT be integrated directly into the
     *       existing Next.js/React application, as it would conflict with React's DOM management.
     *
     * Class Architecture:
     * - AjaxHandler:   Handles all API communication with retry logic and loading states.
     * - FormHandler:   Manages all forms with the class .ajax-form for validation and submission.
     * - UIInteractions: Controls global UI effects like mobile menus, modals, and carousels.
     * - DataFetcher:  Fetches and renders dynamic content for events, blog posts, and programs.
     * - GlobalApp:     Orchestrates the initialization of all modules.
     * =================================================================================================
     */

    /**
     * @class AjaxHandler
     * @description Core class for all API communication. Handles AJAX requests,
     * loading states, error handling, and retry logic.
     */
    class AjaxHandler {
        /**
         * @constructor
         */
        constructor() {
            /** @type {number} The maximum number of retries for a failed request. */
            this.retryLimit = 2;
            /** @type {number} Request timeout in milliseconds. */
            this.timeout = 15000; // 15 seconds
            /** @type {string} The CSS selector for the global loading indicator. */
            this.loadingSelector = '#global-loader';
        }

        /**
         * @description Displays the global loading indicator.
         */
        showLoader() {
            $(this.loadingSelector).css('display', 'flex').fadeIn();
        }

        /**
         * @description Hides the global loading indicator.
         */
        hideLoader() {
            $(this.loadingSelector).fadeOut();
        }

        /**
         * @description Handles and logs AJAX errors.
         * @param {Object} jqXHR - The jQuery XHR object.
         * @param {string} textStatus - A string describing the type of error that occurred.
         * @param {string} errorThrown - An optional exception object, if one occurred.
         */
        handleError(jqXHR, textStatus, errorThrown) {
            console.error('AJAX Error:', {
                status: textStatus,
                error: errorThrown,
                response: jqXHR.responseText,
            });
            // Here you could add a global UI notification for the error
        }

        /**
         * @description Makes a generic AJAX request with retry logic.
         * @param {string} method - The HTTP method (e.g., 'GET', 'POST').
         * @param {string} url - The URL to send the request to.
         * @param {Object|null} data - The data to send with the request.
         * @param {function(Object)} successCallback - Function to call on successful response.
         * @param {function(Object, string, string)} [errorCallback] - Optional function to call on error.
         */
        request(method, url, data, successCallback, errorCallback) {
            let retryCount = 0;
            const self = this;

            const makeRequest = () => {
                self.showLoader();
                $.ajax({
                    url: url,
                    method: method,
                    data: (method.toUpperCase() === 'GET') ? data : JSON.stringify(data),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    timeout: this.timeout,
                    success: (response) => {
                        self.hideLoader();
                        if (successCallback && typeof successCallback === 'function') {
                            successCallback(response);
                        }
                    },
                    error: (jqXHR, textStatus, errorThrown) => {
                        if ((textStatus === 'timeout' || jqXHR.status >= 500) && retryCount < this.retryLimit) {
                            retryCount++;
                            console.warn(`Request failed. Retrying... (${retryCount}/${this.retryLimit})`);
                            makeRequest();
                        } else {
                            self.hideLoader();
                            self.handleError(jqXHR, textStatus, errorThrown);
                            if (errorCallback && typeof errorCallback === 'function') {
                                errorCallback(jqXHR, textStatus, errorThrown);
                            }
                        }
                    }
                });
            };

            makeRequest();
        }

        /**
         * @description Performs a GET request.
         * @param {string} url - The URL to send the request to.
         * @param {function(Object)} success - Success callback.
         * @param {function(Object, string, string)} [error] - Error callback.
         */
        get(url, success, error) {
            this.request('GET', url, null, success, error);
        }

        /**
         * @description Performs a POST request.
         * @param {string} url - The URL to send the request to.
         * @param {Object} data - The data to send.
         * @param {function(Object)} success - Success callback.
         * @param {function(Object, string, string)} [error] - Error callback.
         */
        post(url, data, success, error) {
            this.request('POST', url, data, success, error);
        }

        /**
         * @description Performs a PUT request.
         * @param {string} url - The URL to send the request to.
         * @param {Object} data - The data to send.
         * @param {function(Object)} success - Success callback.
         * @param {function(Object, string, string)} [error] - Error callback.
         */
        put(url, data, success, error) {
            this.request('PUT', url, data, success, error);
        }

        /**
         * @description Performs a DELETE request.
         * @param {string} url - The URL to send the request to.
         * @param {function(Object)} success - Success callback.
         * @param {function(Object, string, string)} [error] - Error callback.
         */
        delete(url, success, error) {
            this.request('DELETE', url, null, success, error);
        }
    }


    /**
     * @class FormHandler
     * @description Handles validation and AJAX submission for all forms with the class .ajax-form.
     */
    class FormHandler {
        /**
         * @constructor
         * @param {AjaxHandler} ajaxHandler - An instance of the AjaxHandler class.
         */
        constructor(ajaxHandler) {
            this.ajaxHandler = ajaxHandler;
            this.formSelector = '.ajax-form';
        }

        /**
         * @description Binds the submit event listener to all designated forms.
         */
        bindForms() {
            const self = this;
            $(document).on('submit', this.formSelector, function(e) {
                e.preventDefault();
                const $form = $(this);
                if (self.validate($form)) {
                    self.submitForm($form);
                }
            });
        }

        /**
         * @description Validates required fields and email formats within a form.
         * @param {jQuery} $form - The jQuery object representing the form.
         * @returns {boolean} - True if the form is valid, otherwise false.
         */
        validate($form) {
            let isValid = true;
            $form.find('.is-invalid').removeClass('is-invalid');
            $form.find('.form-messages').remove();

            $form.find('[required]').each(function() {
                const $field = $(this);
                let hasError = false;

                if ($field.is('input[type="email"]')) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test($field.val())) hasError = true;
                } else if (!$field.val() || String($field.val()).trim() === '') {
                    hasError = true;
                }

                if (hasError) {
                    isValid = false;
                    $field.addClass('is-invalid');
                }
            });

            if (!isValid) {
                this.showError($form, 'Please fill out all required fields correctly.');
            }
            return isValid;
        }

        /**
         * @description Serializes form data into a key-value object.
         * @param {jQuery} $form - The form to serialize.
         * @returns {Object} - The serialized form data.
         */
        serializeForm($form) {
            const formData = {};
            $form.serializeArray().forEach(item => {
                formData[item.name] = item.value;
            });
            return formData;
        }

        /**
         * @description Submits the form data via AJAX.
         * @param {jQuery} $form - The form to submit.
         */
        submitForm($form) {
            const url = $form.attr('action');
            const method = $form.attr('method') || 'POST';
            const data = this.serializeForm($form);
            const self = this;

            this.showLoading($form);

            this.ajaxHandler.request(method.toUpperCase(), url, data,
                (response) => {
                    self.hideLoading($form);
                    self.showSuccess($form, response.message || 'Your submission was successful!');
                    $form[0].reset();
                },
                (jqXHR) => {
                    self.hideLoading($form);
                    const errorMsg = jqXHR.responseJSON?.message || 'An unexpected error occurred.';
                    self.showError($form, errorMsg);
                }
            );
        }

        /**
         * @description Internal method to display alerts (success or error) in the form.
         * @private
         * @param {jQuery} $form - The form where the alert should be displayed.
         * @param {string} message - The message to display.
         * @param {string} type - The alert type ('success' or 'danger').
         */
        _showAlert($form, message, type) {
            const alertHtml = `<div class="form-messages"><div class="notification is-${type}">${message}</div></div>`;
            $form.find('.form-messages').remove();
            $form.prepend(alertHtml);
        }

        /**
         * @description Shows a success message in the form.
         * @param {jQuery} $form - The target form.
         * @param {string} msg - The success message.
         */
        showSuccess($form, msg) {
            this._showAlert($form, msg, 'success');
        }

        /**
         * @description Shows an error message in the form.
         * @param {jQuery} $form - The target form.
         * @param {string} msg - The error message.
         */
        showError($form, msg) {
            this._showAlert($form, msg, 'danger');
        }

        /**
         * @description Shows a loading spinner on the form's submit button.
         * @param {jQuery} $form - The target form.
         */
        showLoading($form) {
            $form.find('[type="submit"]').addClass('is-loading').prop('disabled', true);
        }

        /**
         * @description Hides the loading spinner from the form's submit button.
         * @param {jQuery} $form - The target form.
         */
        hideLoading($form) {
             $form.find('[type="submit"]').removeClass('is-loading').prop('disabled', false);
        }
    }


    /**
     * @class UIInteractions
     * @description Manages all global UI effects and interactions.
     */
    class UIInteractions {
        /**
         * @constructor
         */
        constructor() {
            this.stickyHeaderSelector = '#sticky-header';
            this.mobileMenuButton = '#mobile-menu-toggle';
            this.mobileNav = '#navbarBasicExample';
            this.backToTopButton = '#back-to-top';
            this.smoothScrollSelector = 'a[href*="#"]:not([href="#"])';
            this.accordionTrigger = '.accordion-header';
            this.modalTrigger = '[data-toggle="modal"]'; // Bulma uses JS for modals
            this.carouselSelector = '.carousel'; // Placeholder for Bulma carousels (e.g. bulma-carousel)
        }

        /**
         * @description Initializes all UI interaction handlers.
         */
        initAll() {
            this.initMobileMenu();
            this.initStickyHeader();
            this.initSmoothScroll();
            this.initAccordion();
            this.initModals();
            this.initBackToTop();
            this.initCarousels();
        }

        /**
         * @description Initializes the mobile menu toggle functionality.
         */
        initMobileMenu() {
            $(this.mobileMenuButton).on('click', () => {
                $(this.mobileMenuButton).toggleClass('is-active');
                $(this.mobileNav).toggleClass('is-active');
            });
        }

        /**
         * @description Initializes the sticky header functionality.
         */
        initStickyHeader() {
            const $header = $(this.stickyHeaderSelector);
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
         * @description Initializes smooth scrolling for anchor links.
         */
        initSmoothScroll() {
            $(document).on('click', this.smoothScrollSelector, function(event) {
                if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
                    let target = $(this.hash);
                    target = target.length ? target : $(`[name=${this.hash.slice(1)}]`);
                    if (target.length) {
                        event.preventDefault();
                        $('html, body').animate({ scrollTop: target.offset().top }, 800);
                    }
                }
            });
        }
        
        /**
         * @description Initializes accordion functionality.
         */
        initAccordion() {
            $(document).on('click', this.accordionTrigger, function() {
                $(this).toggleClass('is-active').next('.accordion-content').slideToggle(300);
            });
        }
        
        /**
         * @description Initializes modal toggling. Assumes Bulma's modal structure.
         */
        initModals() {
            $(this.modalTrigger).on('click', function(e) {
                e.preventDefault();
                const targetModal = $(this).data('target');
                $(targetModal).addClass('is-active');
            });
            $('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button').on('click', function() {
                $(this).closest('.modal').removeClass('is-active');
            });
        }

        /**
         * @description Initializes the back-to-top button.
         */
        initBackToTop() {
            const $button = $(this.backToTopButton);
            if (!$button.length) return;
            $(window).on('scroll', () => $(window).scrollTop() > 300 ? $button.fadeIn() : $button.fadeOut());
            $button.on('click', () => $('html, body').animate({ scrollTop: 0 }, 'slow'));
        }
        
        /**
         * @description Placeholder for initializing carousels. Requires a library like bulma-carousel.
         */
        initCarousels() {
             if (typeof bulmaCarousel !== 'undefined') {
                bulmaCarousel.attach(this.carouselSelector, {
                    slidesToScroll: 1,
                    slidesToShow: 3,
                    loop: true,
                });
                console.log('Bulma carousels initialized.');
             }
        }
    }


    /**
     * @class DataFetcher
     * @description Fetches and renders dynamic data for various content sections.
     */
    class DataFetcher {
        /**
         * @constructor
         * @param {AjaxHandler} ajaxHandler - An instance of the AjaxHandler class.
         */
        constructor(ajaxHandler) {
            this.ajaxHandler = ajaxHandler;
            this.endpoints = {
                events: '/api/events/',
                blog: '/api/blog/',
                programs: '/api/programs/'
            };
            this.placeholders = {
                events: '#events-list',
                blog: '#blog-list',
                programs: '#programs-list',
            };
        }

        /**
         * @description Creates a string of skeleton loader cards.
         * @private
         * @param {number} [count=3] - The number of skeleton cards to generate.
         * @returns {string} - The HTML string for the skeleton loaders.
         */
        _createSkeletonLoader(count = 3) {
            const skeletonCard = `
                <div class="column is-one-third"><div class="card skeleton-loader" aria-hidden="true">
                    <div class="card-image"><figure class="image is-4by3 placeholder"></figure></div>
                    <div class="card-content">
                        <div class="media">
                            <div class="media-content">
                                <p class="title is-4 placeholder"></p>
                                <p class="subtitle is-6 placeholder"></p>
                            </div>
                        </div>
                    </div>
                </div></div>`;
            return Array(count).fill(skeletonCard).join('');
        }
        
        /**
         * @description Renders an empty state message in a target container.
         * @private
         * @param {string} selector - The CSS selector for the container.
         * @param {string} type - The type of content (e.g., 'events').
         */
        _renderEmptyState(selector, type) {
            $(selector).html(`<div class="column is-full"><div class="notification is-light has-text-centered">No ${type} found.</div></div>`);
        }

        /**
         * @description Fetches data from an endpoint and renders it into a placeholder.
         * @param {string} type - The type of content being fetched.
         * @param {string} endpoint - The API endpoint URL.
         * @param {function} renderMethod - The method to render a single item.
         * @param {string} placeholderSelector - The CSS selector for the container.
         */
        fetchAndRender(type, endpoint, renderMethod, placeholderSelector) {
            const $placeholder = $(placeholderSelector);
            if (!$placeholder.length) return;

            $placeholder.html(this._createSkeletonLoader());
            this.ajaxHandler.get(endpoint,
                (data) => {
                    $placeholder.empty();
                    if (data?.length) {
                        data.forEach(item => $placeholder.append(renderMethod(item)));
                    } else {
                       this._renderEmptyState(placeholderSelector, type);
                    }
                },
                () => {
                     const errorMessage = `Error loading ${type}. Please try again later.`;
                     $placeholder.html(`<div class="column is-full"><div class="notification is-danger has-text-centered">${errorMessage}</div></div>`);
                }
            );
        }

        /**
         * @description Initiates fetching for all data types.
         */
        fetchAll() {
            this.fetchEvents();
            this.fetchBlogPosts();
            this.fetchPrograms();
        }

        /**
         * @description Fetches and renders events.
         */
        fetchEvents() {
            this.fetchAndRender('events', this.endpoints.events, this.renderEvent, this.placeholders.events);
        }

        /**
         * @description Fetches and renders blog posts.
         */
        fetchBlogPosts() {
            this.fetchAndRender('blog posts', this.endpoints.blog, this.renderBlog, this.placeholders.blog);
        }

        /**
         * @description Fetches and renders programs.
         */
        fetchPrograms() {
            this.fetchAndRender('programs', this.endpoints.programs, this.renderProgram, this.placeholders.programs);
        }

        /**
         * @description Renders a single event card.
         * @param {Object} item - The event data object.
         * @returns {string} - The HTML string for the event card.
         */
        renderEvent(item) {
            return `
                <div class="column is-one-third"><div class="card">
                    <div class="card-image"><figure class="image is-4by3">
                        <img src="${item.imageUrl || 'https://placehold.co/600x400'}" alt="${item.title}">
                    </figure></div>
                    <div class="card-content">
                        <p class="title is-5">${item.title}</p>
                        <p class="subtitle is-6">${item.date} at ${item.location}</p>
                    </div>
                    <footer class="card-footer">
                        <a href="/events/${item.slug}" class="card-footer-item">Learn More</a>
                    </footer>
                </div></div>`;
        }

        /**
         * @description Renders a single blog post card.
         * @param {Object} item - The blog post data object.
         * @returns {string} - The HTML string for the blog card.
         */
        renderBlog(item) {
             return `
                <div class="column is-one-third"><div class="card">
                     <div class="card-image"><figure class="image is-4by3">
                        <img src="${item.imageUrl || 'https://placehold.co/600x400'}" alt="${item.title}">
                    </figure></div>
                    <div class="card-content">
                        <p class="title is-5">${item.title}</p>
                        <p class="subtitle is-6">By ${item.author} on ${item.date}</p>
                    </div>
                    <footer class="card-footer">
                        <a href="/news/${item.slug}" class="card-footer-item">Read More</a>
                    </footer>
                </div></div>`;
        }

        /**
         * @description Renders a single program card.
         * @param {Object} item - The program data object.
         * @returns {string} - The HTML string for the program card.
         */
        renderProgram(item) {
            return `
                <div class="column is-one-third"><div class="card">
                     <div class="card-image"><figure class="image is-4by3">
                        <img src="${item.imageUrl || 'https://placehold.co/600x400'}" alt="${item.title}">
                    </figure></div>
                    <div class="card-content">
                        <p class="title is-5">${item.title}</p>
                        <p>${item.description}</p>
                    </div>
                    <footer class="card-footer">
                        <a href="/programs/${item.slug}" class="card-footer-item">Details</a>
                    </footer>
                </div></div>`;
        }
    }


    /**
     * @class GlobalApp
     * @description Main orchestrator class to initialize all JavaScript modules.
     */
    class GlobalApp {
        /**
         * @constructor
         */
        constructor() {
            this.ajaxHandler = null;
            this.formHandler = null;
            this.ui = null;
            this.dataFetcher = null;
        }

        /**
         * @description Initializes all components of the application.
         */
        initialize() {
            this.initAjax();
            this.initForms();
            this.initUI();
            this.initDynamicData();
            console.log('TechStackPH GlobalApp Initialized (OOP Version).');
        }

        /**
         * @description Initializes the AjaxHandler.
         */
        initAjax() {
            this.ajaxHandler = new AjaxHandler();
        }

        /**
         * @description Initializes the FormHandler.
         */
        initForms() {
            this.formHandler = new FormHandler(this.ajaxHandler);
            this.formHandler.bindForms();
        }

        /**
         * @description Initializes the UIInteractions.
         */
        initUI() {
            this.ui = new UIInteractions();
            this.ui.initAll();
        }

        /**
         * @description Initializes the DataFetcher.
         */
        initDynamicData() {
            this.dataFetcher = new DataFetcher(this.ajaxHandler);
            this.dataFetcher.fetchAll();
        }
    }

    /**
     * 🚀 INITIALIZATION
     * Kicks everything off once the DOM is ready.
     */
    const app = new GlobalApp();
    app.initialize();

});
