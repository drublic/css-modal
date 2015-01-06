/*
 * CSS Modal Plugin for dynamic modal resizing
 *
 * @author Anselm Hannemann
 * @author Hans Christian Reinl
 * @date 2014-05-21
 *
 * Integration:
 * - Add modal-resize.js to your JS (via AMD you can easily require it)
 * - Add `data-cssmodal-resize` to the modal which should be resized
 */
(function (global) {
	'use strict';

	/**
	 * Main modal object
	 */
	var CSSModal;

	/*!
	 * matchMedia() polyfill - Test a CSS media type/query in JS.
	 * Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight.
	 * Dual MIT/BSD license
	 */
	global.matchMedia = global.matchMedia || (function() {

		// For browsers that support matchMedium api such as IE 9 and webkit
		var styleMedia = (global.styleMedia || global.media);

		// For those that don't support matchMedium
		if (!styleMedia) {
			var style = document.createElement('style');
			var script = document.getElementsByTagName('script')[0];
			var info = null;

			style.type = 'text/css';
			style.id = 'matchmediajs-test';

			script.parentNode.insertBefore(style, script);

			// 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
			info = ('getComputedStyle' in global) && global.getComputedStyle(style, null) || style.currentStyle;

			styleMedia = {
				matchMedium: function (media) {
					var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

					// 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
					if (style.styleSheet) {
						style.styleSheet.cssText = text;
					} else {
						style.textContent = text;
					}

					// Test if media query is true or false
					return info.width === '1px';
				}
			};
		}

		return function (media) {
			return {
				matches: styleMedia.matchMedium(media || 'all'),
				media: media || 'all'
			};
		};
	}());

	/**
	 * Polyfill for getComputedStyle
	 */
	global.getComputedStyle = global.getComputedStyle || function (element, pseudo) {
		this.element = element;
		this.pseudo = pseudo;

		// IE sometimes returns strings like "auto" for width and/or height
		this.specialProperties = {
			width: 'clientWidth',
			height: 'clientHeight'
		};

		this.getPropertyValue = function (property) {
			var re = /(\-([a-z]){1})/g;

			if (property === 'float') {
				property = 'styleFloat';
			}

			if (re.test(property)) {
				property = property.replace(re, function () {
					return arguments[2].toUpperCase();
				});
			}

			// Use the calculated value on the DOM node instead of the property
			if (this.specialProperties[property]) {
				return element[this.specialProperties[property]];
			}

			return element.currentStyle[property] ? element.currentStyle[property] : null;
		};

		return this;
	};

	/**
	 * Include styles into the DOM
	 * @param {string} rule Styles to inject into the DOM
	 * @param {string} id   Unique ID for styles
	 */
	var _injectStyles = function (rule, id) {
		id = 'modal__rule--' + (id || '');

		var head = document.querySelector('head');
		var existingStyleElement = document.getElementById(id);
		var styleElement = null;

		if (existingStyleElement) {
			styleElement = existingStyleElement;
		} else {
			styleElement = document.createElement('style');
			styleElement.id = id;

			// The element must be in the DOM before adding rules in IE8
			head.appendChild(styleElement);
		}

		if (styleElement.styleSheet) {
			// IE8 and other legacy browers
			styleElement.styleSheet.cssText = rule;
		} else {
			// modern browsers
			styleElement.innerHTML = rule;
		}
	};

	/**
	 * Get dimentions of a given element
	 * @param  {node}   element Element to find dimentions of
	 * @return {object}         Dimentions of object
	 */
	var getDimentions = function (element) {
		if (!element || element.length === 0) {
			return;
		}

		var computedStyles = global.getComputedStyle(element);

		var margin = {
			top: parseInt(computedStyles.getPropertyValue('margin-top'), 10),
			left: parseInt(computedStyles.getPropertyValue('margin-left'), 10),
			right: parseInt(computedStyles.getPropertyValue('margin-right'), 10),
			bottom: parseInt(computedStyles.getPropertyValue('margin-bottom'), 10)
		};

		var padding = {
			top: parseInt(computedStyles.getPropertyValue('padding-top'), 10),
			left: parseInt(computedStyles.getPropertyValue('padding-left'), 10),
			right: parseInt(computedStyles.getPropertyValue('padding-right'), 10),
			bottom: parseInt(computedStyles.getPropertyValue('padding-bottom'), 10)
		};

		return {
			width: element.offsetWidth,
			height: element.offsetHeight,
			margin: margin,
			padding: padding
		};
	};

	/*
	 * Resize modal dynamically
	 */
	var resizeModalDynamically = function () {
		if (!CSSModal.activeElement) {
			throw new Error('Error: No active modal.');
		}

		var element = CSSModal.activeElement.querySelector('.modal-inner');
		var elementContent = CSSModal.activeElement.querySelector('.modal-content');
		var headerContent = CSSModal.activeElement.querySelector('header');
		var captionContent = CSSModal.activeElement.querySelector('.modal--gallery-caption');
		var footerContent = CSSModal.activeElement.querySelector('footer');
		var containerDimentions;
		var headerDimentions;
		var captionDimentions;
		var footerDimentions;
		var offsetWidth = 0;
		var offsetHeight = 0;
		var elements;
		var i;

		// Margins for top and bottom of gallery in px
		var margins = 35 + 35;

		element.style.width = 'auto';
		elementContent.style.maxHeight = 'none';

		containerDimentions = getDimentions(elementContent);
		footerDimentions = getDimentions(footerContent);

		offsetWidth = containerDimentions.margin.left + containerDimentions.margin.right + containerDimentions.padding.left + containerDimentions.padding.right;
		offsetHeight = containerDimentions.margin.top + containerDimentions.margin.bottom + containerDimentions.padding.top + containerDimentions.padding.bottom;

		// Calculate offset from header, caption and footer
		if (headerContent) {
			headerDimentions = getDimentions(headerContent);
			offsetHeight += headerDimentions.margin.top + headerDimentions.margin.bottom + headerDimentions.padding.top + headerDimentions.padding.bottom + headerDimentions.height;
		}

		if (captionContent) {
			captionDimentions = getDimentions(captionContent);
			offsetHeight += captionDimentions.margin.top + captionDimentions.margin.bottom + captionDimentions.padding.top + captionDimentions.padding.bottom + captionDimentions.height;
		}

		if (footerContent) {
			footerDimentions = getDimentions(footerContent);
			offsetHeight += footerDimentions.margin.top + footerDimentions.margin.bottom + footerDimentions.padding.top + footerDimentions.padding.bottom + footerDimentions.height;
		}

		if (containerDimentions.width > global.innerWidth) {
			elements = CSSModal.activeElement.querySelectorAll('img, video, [data-iframe]');

			for (i = 0; i < elements.length; i++) {
				elements[i].style.maxWidth = (global.innerWidth - offsetWidth - margins) + 'px';
				elements[i].style.maxHeight = '100%';
			}
		}

		if (containerDimentions.height > global.innerHeight) {
			elements = CSSModal.activeElement.querySelectorAll('img, video, [data-iframe]');

			for (i = 0; i < elements.length; i++) {
				elements[i].style.maxHeight = (global.innerHeight - offsetHeight - margins) + 'px';
				elements[i].style.maxWidth = '100%';
			}
		}
	};

	/*
	 * Reset modal from being dynamically resized and prepare for e.g. mobile view
	 * @param CSSModal {CSSModal} (required)
	 */
	var resetModal = function (CSSModal) {
		var modalInner = CSSModal.activeElement.querySelector('.modal-inner');
		var modalImage = CSSModal.activeElement.querySelector('img');

		if (modalInner.style) {
			modalInner.style.top = '0';
			modalInner.style.left = '0';

			if (modalImage) {
				modalImage.style.maxWidth = '100%';
				modalImage.style.maxHeight = '100%';
			}
		}
	};

	/*
	 * Helper function to call resizeModalDynamically only under conditions
	 * @param modal {object} CSSModal object
	 */
	var resizeModal = function () {
		resetModal(CSSModal);

		if (window.matchMedia('(min-width: 30em)').matches) {
			resizeModalDynamically(CSSModal);
		}
	};

	var getHorizontalOffset = function () {
		var innerWidth = global.innerWidth || document.documentElement.clientWidth;
		var element = CSSModal.activeElement.querySelector('.modal-inner');
		var elementWidth = parseInt(global.getComputedStyle(element).getPropertyValue('width'), 10);
		var offset = (innerWidth - elementWidth) / 2;

		return offset;
	};

	var getVerticalOffset = function () {
		var innerHeight = global.innerHeight || document.documentElement.clientHeight;
		var element = CSSModal.activeElement.querySelector('.modal-inner');
		var elementHeight = parseInt(global.getComputedStyle(element).getPropertyValue('height'), 10);
		var offset = (innerHeight - elementHeight) / 2;

		return offset;
	};

	var positionModal = function () {
		var offset = {
			top: getVerticalOffset(),
			left: getHorizontalOffset()
		};

		var element = CSSModal.activeElement.querySelector('.modal-inner');
		var elementWidth = parseInt(global.getComputedStyle(element).getPropertyValue('width'), 10);
		var margin = 20;

		element.style.top = offset.top + 'px';
		element.style.left = (offset.left - margin) + 'px';
		element.style.marginLeft = margin + 'px';
		element.style.marginRight = margin + 'px';

		// Close button
		_injectStyles('[data-cssmodal-resize] .modal-close:after {' +
			'top: ' + (offset.top - 25) + 'px !important;' +
			'margin-right: -' + elementWidth / 2 + 'px !important;' +
		'}', element.id);
	};

	var _scale = function () {

		// Eject if no active element is set
		if (!CSSModal.activeElement) {
			return;
		}

		var resize = CSSModal.activeElement.getAttribute('data-cssmodal-resize');

		if (resize === 'true' || resize === '') {
			resizeModal();
			positionModal();
		}
	};

	/**
	 * Initial call
	 */
	var init = function (modal) {
		CSSModal = modal;

		/*
		 * Assign basic event handlers
		 */
		CSSModal.on('resize', window, _scale);
		CSSModal.on('cssmodal:show', document, _scale);
		CSSModal.on('cssmodal:resize', document, _scale);
	};

	/*
	 * AMD, module loader, global registration
	 */

	// Expose modal for loaders that implement the Node module pattern.
	if (typeof module === 'object' && module && typeof module.exports === 'object') {
		module.exports = {};

	// Register as an AMD module
	} else if (typeof define === 'function' && define.amd) {

		define(['CSSModal'], init);

	// Export CSSModal into global space
	} else if (typeof global === 'object' && typeof global.document === 'object') {
		init(global.CSSModal);
	}

}(window));
