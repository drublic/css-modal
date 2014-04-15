/*
 * CSS Modal Plugin for dynamic modal resizing
 * Author: Anselm Hannemann
 * Date: 2014-04-15
 */

'use strict';

var resizeModalDynamically = function (CSSModal) {

	// If CSS Modal is still undefined, throw an error
	if (!CSSModal) {
		throw new Error('Error: CSSModal is not loaded.');
	}

	var throttle = function (func, wait, immediate) {
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

	var resizeModal = function () {
		var windowHeight = window.innerHeight;
		var windowWidth = window.innerWidth;
		var margin = 40;

		if (windowWidth < windowHeight) { // If width smaller than height
			// Resize modal and images/video/iframe accordingly respecting aspect-ratio
			CSSModal.activeElement.querySelector('.modal-inner').style.width = (windowWidth - (2 * margin)) + 'px';
			CSSModal.activeElement.querySelector('.modal-inner').style.marginLeft = ((windowWidth - (2 * margin)) / 2)*-1 + 'px';
		} else if (windowWidth > windowHeight) { // If width wider than height
			// Resize modal and images/video/iframe accordingly respecting aspect-ratio
			CSSModal.activeElement.getElementsByClassName('modal-inner')[0].style.maxHeight = (windowHeight - (2 * margin)) + 'px';
		}
	};

	var resizeModalThrottled = throttle(resizeModal, 500);

	// @TODO: MatchMedia to not affect mobile view (<690px vw)
	// @TODO: .modal-close:after pseudo-element position margin-left (http://stackoverflow.com/questions/7330355/javascript-set-css-after-styles/7330454#7330454)
};

CSSModal.on('readystatechange', document, function (event) {
	resizeModalDynamically();
});

CSSModal.on('resize', document, function (event) {
	resizeModalDynamically();
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
	resizeModalDynamically(CSSModal);
});

// Export CSSModal into global space
} else if (typeof global === 'object' && typeof global.document === 'object') {
	resizeModalDynamically(CSSModal);
}
