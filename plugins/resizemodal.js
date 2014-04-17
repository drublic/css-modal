/*
 * CSS Modal Plugin for dynamic modal resizing
 * Author: Anselm Hannemann
 * Date: 2014-04-15
 */

'use strict';

/*
 * Basic helper function to throttle execution of events
 * @param func {string} specifiying the function to throttle
 * @param wait {int} time to wait between execution
 * @param immediate {bool}
 */

var _throttle = function (func, wait, immediate) {
	var timeout;

	return function() {
		var later = function () {
			timeout = null;

			if (!immediate) {
				func.apply(this, arguments);
			}
		};

		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);

		if (callNow) {
			func.apply(this, arguments);
		}
	};
};

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
}

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

	// Wait for img[max-height:100%] to be applied to calc imgSizes
	var imgWidth = parseInt(window.getComputedStyle($modalContent.querySelector('img')).getPropertyValue('width'), 10);
	var imgHeight = parseInt(window.getComputedStyle($modalContent.querySelector('img')).getPropertyValue('height'), 10);

	var ratio = (imgWidth / imgHeight);

	if (windowWidth < windowHeight) { // If width smaller than height
		var newWidth;
		var newMarginLeft;

		if (imgWidth < windowWidth) {
			if (!$modalInner.style.width) {
				newWidth = imgWidth;
			}
		} else {
			//maybe obsolete due to CSS max-height: 100%;
			newWidth = (windowWidth - (2 * margin) + contentPaddingHorizontal);
		}

		newMarginLeft = (newWidth / 2)*-1;

		// Resize modal and images/video/iframe accordingly respecting aspect-ratio
		if (newWidth) {
			$modalInner.style.left = '50%'; // Force 50% to center
		}

		$modalInner.style.width = newWidth + 'px';
		$modalInner.style.marginLeft = newMarginLeft + 'px';
	} else if (windowWidth > windowHeight) { // If width wider than height
		var newWidth;
		var newMarginLeft;
		var newHeight = (windowHeight - (2 * margin) - contentPaddingVertical);

		if (!$modalInner.style.width) {
			newWidth = ratio * (newHeight - (2 * margin) - contentPaddingVertical);
		}
		newMarginLeft = (newWidth / 2)*-1;

		// Resize modal and images/video/iframe accordingly respecting aspect-ratio
		$modalContent.style.maxHeight = '100%';
		$modalInner.style.maxHeight = newHeight + 'px';
		if (windowWidth > newWidth) {
			$modalInner.style.width = newWidth + 'px';
			$modalInner.style.marginLeft = newMarginLeft + 'px';
		} else {
			$modalInner.style.width = (windowWidth - contentPaddingHorizontal - (2 * margin)) + 'px';
			$modalInner.style.marginLeft = '';
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
