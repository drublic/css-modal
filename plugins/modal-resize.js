/*
 * CSS Modal Plugin for dynamic modal resizing
 * Author: Anselm Hannemann
 * Date: 2014-04-15
 */
(function () {
	'use strict';

	/**
	 * Main modal object
	 */
	var CSSModal;

	/*
	 * Helper function to write CSS dynamically to modify pseudo-element styles
	 * @param styles {object} (requried)
	 */
	var _addCSSRule = (function (styles) {
		var sheet = document.head.appendChild(styles).sheet;
		var i = 0;

		return function (selector, css) {
			var propText = Object.keys(css).map(function (property) {
				return property + ': ' + css[property] + ';';
			});

			if (sheet.insertRule) {
				for (; i < propText.length; i++) {
					// 	console.log('true');
					sheet.insertRule(selector + ' { \n	' + propText[i] + '\n}', 0);
				}
			} else if (sheet.addRule) {
				// Internet Explorer <9
				for (; i < propText.length; i++) {
					sheet.addRule(selector, propText, 0);
				}
			}
		};
	})(document.createElement('style'));

	/*
	 * Basic helper function to evaluate width media queries
	 * @param breakpoint {int} number representing the media query breakpoint
	 * @param condition {string} media query condition, `max-width` or `min-width`
	 * @param unit {string} like `em` (default) or `px` to specify a unit
	 */
	var _mediaQueryHelper = function (breakpoint, condition, unit) {
		if (!breakpoint) {
			throw new Error('Error: No breakpoint provided');
		}

		if (!condition) {
			throw new Error('Error: No condition provided');
		}

		var calculatedBreakpoint = breakpoint;
		var baseFontSize = parseInt(window.getComputedStyle(document.body).getPropertyValue('font-size'), 10);

		if (!unit) {
			unit = 'em';

			calculatedBreakpoint = breakpoint * baseFontSize;
		} else {
			if (unit === 'em') {
				calculatedBreakpoint = breakpoint * baseFontSize;
			} else if (unit === 'px') {
				calculatedBreakpoint = breakpoint;
			}
		}

		if (window.matchMedia) {
			return window.matchMedia('(' + condition + ': ' + breakpoint + unit + ')').matches;

		// Basic Polyfill for window.matchMedia
		} else {
			if (window.innerWidth) {

				if (condition === 'max-width') {
					return window.innerWidth < calculatedBreakpoint;
				} else if (condition === 'min-width') {
					return window.innerWidth > calculatedBreakpoint;
				}

			// Polyfill window.innerWidth|innerHeight to fix IE8/9 Quirks Mode
			} else {
				window.innerHeight = document.body.clientHeight;
				window.innerWidth = document.body.clientWidth;
			}
		}
	};

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

		var contentPadding = {
			top: parseInt(window.getComputedStyle($modalContent).getPropertyValue('padding-top'), 10),
			left: parseInt(window.getComputedStyle($modalContent).getPropertyValue('padding-left'), 10),
			right: parseInt(window.getComputedStyle($modalContent).getPropertyValue('padding-right'), 10),
			bottom: parseInt(window.getComputedStyle($modalContent).getPropertyValue('padding-bottom'), 10)
		};

		// Calculate concatenated vertical and horizontal paddings
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

			if (_mediaQueryHelper('30', 'min-width')) {
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

				if (_mediaQueryHelper('30', 'min-width')) {
					$modalInner.style.marginLeft = newMarginLeft + 'px';
				}
			}
		}

		// Move close button to proper position
		var $closeButton = '.modal--fade .modal-close:after, .modal--plainscreen .modal-close:after, .modal--zoomin .modal-close:after, .modal--zoomout .modal-close:after, .modal--slidefromtop .modal-close:after, .modal--bouncefromtop .modal-close:after, .modal--bouncefromtopshaky .modal-close:after, .modal--show .modal-close:after, ._modal .modal-close:after';
		var closeButtonMarginLeft = 0;
		var closeButtonWidth = parseInt(window.getComputedStyle(CSSModal.activeElement.querySelector('.modal-close'), '::after').getPropertyValue('width'), 10);

		closeButtonMarginLeft = Math.abs((newWidth / 2) - closeButtonWidth - contentPaddingHorizontal);

		// Append unit
		closeButtonMarginLeft += 'px';

		_addCSSRule($closeButton, {
			'margin-left': closeButtonMarginLeft
		});
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
		if (_mediaQueryHelper('30', 'min-width')) {
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
		init(window.CSSModal);
	}

})();
