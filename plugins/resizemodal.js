/*
 * CSS Modal Plugin for dynamic modal resizing
 * Author: Anselm Hannemann
 * Date: 2014-04-15
 */

'use strict';

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
		var unit = 'em';

		calculatedBreakpoint = breakpoint * baseFontSize;
	} else {
		if (unit == 'em') {
			calculatedBreakpoint = breakpoint * baseFontSize;
		} else if (unit == 'px') {
			calculatedBreakpoint = breakpoint;
		}
	}

	if (window.matchMedia) {
		if (window.matchMedia('(' + condition + ': ' + breakpoint + unit + ')').matches) {
			return true;
		} else {
			return false;
		}
	} else {
		// Basic Polyfill for window.matchMedia
		if (window.innerWidth) {
			if (condition == 'max-width') {
				if (window.innerWidth < calculatedBreakpoint) {
					return true;
				} else {
					return false;
				}
			} else if (condition == 'min-width') {
				if (window.innerWidth > calculatedBreakpoint) {
					return true;
				} else {
					return false;
				}
			}
		} else {
			// Polyfill window.innerWidth|innerHeight to fix IE8/9 Quirks Mode
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
		throw new Error('No selector provided.');
	}
	selector = CSSModal.activeElement.querySelector(selector);

	if (typeof selector.naturalWidth === 'undefined') {
		// Polyfill IE 6/7/8
		var image = new Image();
		image.src = selector.src;

		return {
			width: image.width,
			height: image.height
		}
	} else {
		return {
			width: selector.naturalWidth,
			height: selector.naturalHeight
		}
	}
};

/*
 * Resize modal dynamically
 * @param CSSModal {CSSModal} (required)
 */

var resizeModalDynamically = function (CSSModal) {
	if (!CSSModal) {
		throw new Error('Error: CSSModal is not loaded.');
	}
	if (!CSSModal.activeElement) {
		throw new Error('Error: No active modal.');
	}

	var windowHeight = window.innerHeight;
	var windowWidth = window.innerWidth;
	var margin = 20;
	var $modalContent = CSSModal.activeElement.querySelector('.modal-content');
	var $modalInner = CSSModal.activeElement.querySelector('.modal-inner');
	var contentPadding = [];
	var contentPaddingHorizontal;
	var contentPaddingVertical;
	var contentPaddingTop = parseInt(window.getComputedStyle($modalContent).getPropertyValue('padding-top'), 10);
	var contentPaddingRight = parseInt(window.getComputedStyle($modalContent).getPropertyValue('padding-right'), 10);
	var contentPaddingBottom = parseInt(window.getComputedStyle($modalContent).getPropertyValue('padding-bottom'), 10);
	var contentPaddingLeft = parseInt(window.getComputedStyle($modalContent).getPropertyValue('padding-left'), 10);

	// Push contentPadding array
	contentPadding.push(contentPaddingTop, contentPaddingRight, contentPaddingBottom, contentPaddingLeft);
	// Calculate concatenated vertical and horizontal paddings
	contentPaddingHorizontal = contentPaddingLeft + contentPaddingRight;
	contentPaddingVertical = contentPaddingTop + contentPaddingBottom;
	// Set img to max-height: 100%;
	$modalContent.querySelector('img').style.maxHeight = '100%';

	var $imgSelector = $modalContent.querySelector('img');
	var naturalImageWidth = getNaturalImageDimensions('img').width;
	var naturalImageHeight = getNaturalImageDimensions('img').height;
	var ratioWH = (naturalImageWidth / naturalImageHeight);
	var ratioHW = (naturalImageHeight / naturalImageWidth);

	if (windowWidth < windowHeight) { // If width smaller than height
		var newMarginLeft = 0;
		var newHeight = 0;

		if (naturalImageWidth < windowWidth) {
			newWidth = naturalImageWidth;
			newHeight = ratioWH * newWidth;
		} else {
			if ((naturalImageHeight > naturalImageWidth)) {
				// Portrait image
				newHeight = windowHeight - (2 * margin) - contentPaddingVertical;

				if (naturalImageHeight < newHeight) {
					newHeight = naturalImageHeight;
				}

				newWidth = ratioWH * newHeight + margin;
			}

			if ((naturalImageHeight < naturalImageWidth)) {
				// Landscape image
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
	} else { // If width wider than height
		var newHeight = (windowHeight - (2 * margin) + contentPaddingVertical);
		var newWidth = ratioWH * (newHeight - (2 * margin) - contentPaddingVertical);
		var newMarginLeft;

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

		if ((naturalImageHeight > naturalImageWidth)) {
			// Portrait image
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
	// @TODO: .modal-close:after pseudo-element position margin-left (http://stackoverflow.com/questions/7330355/javascript-set-css-after-styles/7330454#7330454)
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
 * @param CSSModal {CSSModal} (required)
 */

var resizeModal = function (CSSModal) {
	if (_mediaQueryHelper('30', 'min-width')) {
		resizeModalDynamically(CSSModal);
	} else {
		resetModal(CSSModal);
	}
};

/*
 * Assign basic event handlers
 */

CSSModal.on('resize', window, function () {
	resizeModal(CSSModal);
});

CSSModal.on('cssmodal:show', document, function () {
	resizeModal(CSSModal);
});

/*
 * AMD, module loader, global registration
 */

// Expose modal for loaders that implement the Node module pattern.
if (typeof module === 'object' && module && typeof module.exports === 'object') {
	module.exports = {};

// Register as an AMD module
} else if (typeof define === 'function' && define.amd) {

define(['CSSModal'], function (CSSModal) {
	resizeModal(CSSModal);
});

// Export CSSModal into global space
} else if (typeof global === 'object' && typeof global.document === 'object') {
	resizeModal(CSSModal);
}
