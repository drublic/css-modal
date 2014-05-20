/*
 * CSS Modal Plugin for dynamic modal resizing
 * Author: Anselm Hannemann
 * Date: 2014-04-15
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
				matchMedium: function(media) {
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
		var element = document.createElement('div');

		id = 'modal__rule' + (id || '');

		// Remove all current rules
		if (document.getElementById(id)) {
			document.getElementById(id).parentNode.removeChild(document.getElementById(id));
		}

		element.id = id;
		element.innerHTML = '<style>' + rule + '</style>';

		// Append a new rule
		document.body.appendChild(element);
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

		return {
			width: element.offsetWidth,
			height: element.offsetHeight
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
		var containerDimentions;

		element.style.width = 'auto';
		elementContent.style.maxHeight = 'none';

		containerDimentions = getDimentions(element);

		if (containerDimentions.width > global.innerWidth - 120) {
			CSSModal.activeElement.querySelector('img').style.maxWidth = (global.innerWidth - 120) + 'px';
			CSSModal.activeElement.querySelector('img').style.maxHeight = '100%';
		}

		if (containerDimentions.height > global.innerHeight - 120) {
			CSSModal.activeElement.querySelector('img').style.maxWidth = '100%';
			CSSModal.activeElement.querySelector('img').style.maxHeight = (global.innerHeight - 120) + 'px';
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
			modalImage.style.maxWidth = '100%';
			modalImage.style.maxHeight = '100%';
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
		var element = CSSModal.activeElement.querySelector('.modal-inner');
		var elementWidth = parseInt(global.getComputedStyle(element).getPropertyValue('width'), 10);
		var offset = (global.innerWidth - elementWidth) / 2;

		return offset;
	};

	var getVerticalOffset = function () {
		var element = CSSModal.activeElement.querySelector('.modal-inner');
		var elementHeight = parseInt(global.getComputedStyle(element).getPropertyValue('height'), 10);
		var offset = (global.innerHeight - elementHeight) / 2;

		return offset;
	};

	var positionModal = function () {
		var offset = {
			top: getVerticalOffset(),
			left: getHorizontalOffset()
		};

		var element = CSSModal.activeElement.querySelector('.modal-inner');
		var elementWidth = parseInt(global.getComputedStyle(element).getPropertyValue('width'), 10);

		element.style.top = offset.top + 'px';
		element.style.left = offset.left + 'px';
		element.style.marginLeft = 0;
		element.style.marginRight = 0;

		// Close button
		_injectStyles('.modal-close:after {' +
			'top: ' + (offset.top - 25) + 'px !important;' +
			'margin-right: -' + elementWidth / 2 + 'px !important;' +
		'}', element.id);
	};

	var _scale = function () {
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
	};

	/*
	 * AMD, module loader, global registration
	 */

	// Expose modal for loaders that implement the Node module pattern.
	if (typeof module === 'object' && module && typeof module.exports === 'object') {
		module.exports = {};

	// Register as an AMD module
	} else if (typeof define === 'function' && define.amd) {

		define(['../modal.js'], init);

	// Export CSSModal into global space
	} else if (typeof global === 'object' && typeof global.document === 'object') {
		init(global.CSSModal);
	}

}(window));
