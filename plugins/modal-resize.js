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

	/**
	 * Include styles into the DOM
	 * @param  {string} rule Styles to inject into the DOM
	 */
	var _injectStyles = function (rule) {
		var element = document.createElement('style');

		element.innerHTML = '<style>' + rule + '</style>';

		document.head.appendChild(element);
	};

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

	/*
	 * Get natural dimensions of an image
	 * (can only handle 1 image)
	 * @param selector {QuerySelector} (required)
	 */
	var getNaturalImageDimensions = function (selector) {
		if (!selector) {
			throw new Error('getNaturalImageDimensions: Missing argument `selector`.');
		}

		var element = CSSModal.activeElement.querySelector(selector);

		// Polyfill IE 6/7/8
		if (typeof element.naturalWidth === 'undefined') {
			var image = new Image();

			image.src = selector.src;

			return {
				width: image.width,
				height: image.height
			};
		} else {
			return {
				width: element.naturalWidth,
				height: element.naturalHeight
			};
		}
	};

	/*
	 * Resize modal dynamically
	 */
	var resizeModalDynamically = function () {
		if (!CSSModal.activeElement) {
			throw new Error('Error: No active modal.');
		}

		var windowHeight = window.innerHeight;
		var windowWidth = window.innerWidth;
		var margin = 20;

		var $modalContent = CSSModal.activeElement.querySelector('.modal-content');
		var $modalInner = CSSModal.activeElement.querySelector('.modal-inner');

		var computedStyle = window.getComputedStyle($modalContent);

		var contentPadding = {
			top: parseInt(computedStyle.getPropertyValue('padding-top'), 10),
			left: parseInt(computedStyle.getPropertyValue('padding-left'), 10),
			right: parseInt(computedStyle.getPropertyValue('padding-right'), 10),
			bottom: parseInt(computedStyle.getPropertyValue('padding-bottom'), 10)
		};

		// Calculate commulated vertical and horizontal paddings
		var contentPaddingHorizontal = contentPadding.left + contentPadding.right;
		var contentPaddingVertical = contentPadding.top + contentPadding.bottom;

		// Set img to max-height: 100%;
		if ($modalContent.querySelector('img') === null) {
			return;
		}

		$modalContent.querySelector('img').style.maxHeight = '100%';

		var naturalImageWidth = getNaturalImageDimensions('img').width;
		var naturalImageHeight = getNaturalImageDimensions('img').height;
		var ratioWH = (naturalImageWidth / naturalImageHeight);

		var newMarginLeft;
		var newWidth;
		var newHeight;

		if (windowWidth < windowHeight) { // If width smaller than height
			newMarginLeft = 0;
			newHeight = 0;

			if (naturalImageWidth < windowWidth) {
				newWidth = naturalImageWidth;
				newHeight = ratioWH * newWidth;
			} else {

				// Portrait image
				if (naturalImageHeight > naturalImageWidth) {
					newHeight = windowHeight - (2 * margin) - contentPaddingVertical;

					if (naturalImageHeight < newHeight) {
						newHeight = naturalImageHeight;
					}

					newWidth = ratioWH * newHeight + margin;
				}

				// Landscape image
				if (naturalImageHeight < naturalImageWidth) {
					newWidth = windowWidth - (2 * margin) - contentPaddingHorizontal;
					newHeight = 'auto';

					if (naturalImageWidth < newWidth) {
						newWidth = naturalImageWidth;
					}
				}
			}

			newMarginLeft = (newWidth / 2)*-1;

			// Resize modal and images/video/iframe accordingly respecting aspect-ratio
			if (newWidth) {
				$modalInner.style.left = '50%'; // Force 50% to center
			}

			$modalInner.style.width = newWidth + 'px';
			$modalContent.style.maxHeight = '100%';

			if (newHeight === 'auto') {
				$modalInner.style.height = newHeight;
			} else {
				$modalInner.style.height = newHeight + 'px';
			}

			$modalInner.style.marginLeft = newMarginLeft + 'px';

		// If width wider than height
		} else {
			newHeight = (windowHeight - (2 * margin) + contentPaddingVertical);
			newWidth = ratioWH * (newHeight - (2 * margin) - contentPaddingVertical);

			// Reset height attribute (otherwise causes issues onresize)
			$modalInner.style.height = '';

			if ((naturalImageHeight < naturalImageWidth)) {
				// Landscape image
				if (naturalImageWidth < newWidth) {
					newWidth = naturalImageWidth - (2 * margin) - contentPaddingHorizontal;
				} else if (naturalImageHeight < newHeight) {
					newHeight = naturalImageHeight - (2 * margin) - contentPaddingVertical;
				}
			}

			// Portrait image
			if (naturalImageHeight > naturalImageWidth) {
				if ((newHeight + (2 * margin) + contentPaddingVertical) > windowHeight) {
					newHeight = windowHeight - (2 * margin) + contentPaddingVertical;
					newWidth = ratioWH * (newHeight - (2 * margin) - contentPaddingVertical);
				}
			}

			// Don’t build bigger box than the image itself is
			if (naturalImageWidth < newWidth) {
				newWidth = naturalImageWidth;
			} else if (naturalImageHeight < newHeight) {
				newHeight = naturalImageHeight;
			}

			newMarginLeft = (newWidth / 2)*-1;

			// Resize modal and images/video/iframe accordingly respecting aspect-ratio
			$modalContent.style.maxHeight = '100%';
			$modalInner.style.maxHeight = newHeight + 'px';

			if (window.matchMedia('(min-width: 30em)').matches) {
				$modalInner.style.left = '50%'; // Force 50% to center
			}

			if (windowWidth > newWidth) {
				$modalInner.style.width = newWidth + 'px';
				$modalInner.style.marginLeft = newMarginLeft + 'px';
			} else {
				newWidth = windowWidth - (2 * margin) - contentPaddingHorizontal;
				newMarginLeft = (newWidth / 2)*-1;

				$modalInner.style.width = newWidth + 'px';
				$modalInner.style.marginLeft = '';

				if (window.matchMedia('(min-width: 30em)').matches) {
					$modalInner.style.marginLeft = newMarginLeft + 'px';
				}
			}
		}

		// Move close button to proper position
		var closeButton = '.modal--fade .modal-close:after, .modal--plainscreen .modal-close:after, .modal--zoomin .modal-close:after, .modal--zoomout .modal-close:after, .modal--slidefromtop .modal-close:after, .modal--bouncefromtop .modal-close:after, .modal--bouncefromtopshaky .modal-close:after, .modal--show .modal-close:after, ._modal .modal-close:after';
		var closeButtonMarginLeft = 0;
		var closeButtonWidth = parseInt(window.getComputedStyle(CSSModal.activeElement.querySelector('.modal-close'), '::after').getPropertyValue('width'), 10);

		closeButtonMarginLeft = Math.abs((newWidth / 2) - closeButtonWidth - contentPaddingHorizontal);

		// Append unit
		closeButtonMarginLeft += 'px';

		_injectStyles(closeButton + '{ margin-left: ' + closeButtonMarginLeft + '}');
	};

	/*
	 * Reset modal from being dynamically resized and prepare for e.g. mobile view
	 * @param CSSModal {CSSModal} (required)
	 */
	var resetModal = function (CSSModal) {
		var $modalInner = CSSModal.activeElement.querySelector('.modal-inner');
		var $modalContent = CSSModal.activeElement.querySelector('.modal-content');
		var $modalContentImg = $modalContent.querySelector('img');

		if ($modalInner.style) {
			$modalInner.style.maxHeight = '';
			$modalInner.style.height = '';
			$modalInner.style.width = '';
			$modalInner.style.left = '';
			$modalInner.style.marginLeft = '';
			$modalContent.style.maxHeight = '';
			$modalContentImg.style.maxHeight = '';
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
		});

		CSSModal.on('cssmodal:show', document, function () {
			resizeModal();
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
