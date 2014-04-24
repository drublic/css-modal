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

		element.id = 'modal__rule' + id;
		element.innerHTML = '<style>' + rule + '</style>';

		// Append a new rule
		document.body.appendChild(element);
	};

	/*
	 * Get natural dimensions of an image
	 */
	var getNaturalImageDimensions = function (element) {
		if (!element) {
			return;
		}

		// Polyfill IE 6/7/8
		if (typeof element.naturalWidth === 'undefined') {
			var image = new Image();

			image.src = selector.src;

			return {
				width: image.width,
				height: image.height
			};
		}

		return {
			width: element.naturalWidth,
			height: element.naturalHeight
		};
	};

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

		var imageDimentions = getNaturalImageDimensions(CSSModal.activeElement.querySelector('img'));
		var containerDimentions = getDimentions(element);

		element.style.width = 'auto';
		elementContent.style.maxHeight = 'none';

		console.log(containerDimentions);

		if (containerDimentions.width > global.innerWidth) {
			console.log('zu breit');
		}

		if (containerDimentions.height > global.innerHeight) {
			console.log('zu hoch');
		}
	};

	/*
	 * Reset modal from being dynamically resized and prepare for e.g. mobile view
	 * @param CSSModal {CSSModal} (required)
	 */
	var resetModal = function (CSSModal) {
		var $modalInner = CSSModal.activeElement.querySelector('.modal-inner');

		if ($modalInner.style) {
			$modalInner.style.top = '';
			$modalInner.style.left = '';
		}
	};

	/*
	 * Helper function to call resizeModalDynamically only under conditions
	 * @param modal {object} CSSModal object
	 */
	var resizeModal = function () {
		if (window.matchMedia('(min-width: 30em)').matches) {
			resizeModalDynamically(CSSModal);
		} else {
			resetModal(CSSModal);
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

		// Close button
		_injectStyles('.modal-close:after {' +
			'top: ' + (offset.top - 28) + 'px !important;' +
			'margin-right: -' + elementWidth / 2 + 'px !important;' +
		'}', element.id);
	};


	/**
	 * Initial call
	 */
	var init = function (modal) {
		CSSModal = modal;

		/*
		 * Assign basic event handlers
		 */
		CSSModal.on('resize', window, function () {
			resizeModal();
			positionModal();
		});

		CSSModal.on('cssmodal:show', document, function () {
			resizeModal();
			positionModal();
		});

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
