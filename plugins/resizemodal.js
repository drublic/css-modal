/*
 * CSS Modal Plugin for dynamic modal resizing
 * Author: Anselm Hannemann
 * Date: 2014-02-04
 */

(function (global) {

	'use strict';

	var CSSModal = global.CSSModal;

	// If CSS Modal is still undefined, throw an error
	if (!CSSModal) {
		throw new Error('Error: CSSModal is not loaded.');
	}

	var throttle = function(func, wait, immediate) {
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

	var resizeModal = function(e) {
		var windowHeight = window.innerHeight;
		var windowWidth = window.innerWidth;
		var margin = 40;

		// If width smaller than height (Portrait mode)
		if (windowWidth < windowHeight) {
			// Resize modal and images/video/iframe accordingly respecting aspect-ratio
			CSSModal.activeElement.querySelector('.modal-inner').style.width = (windowWidth - (2 * margin)) + 'px';
			CSSModal.activeElement.querySelector('.modal-inner').style.marginLeft = ((windowWidth - (2 * margin)) / 2)*-1 + 'px';
		}
		// If width wider than height (Landscape mode)
		else if (windowWidth > windowHeight) {
			// Resize modal and images/video/iframe accordingly respecting aspect-ratio
			CSSModal.activeElement.getElementsByClassName('modal-inner')[0].style.maxHeight = (windowHeight - (2 * margin)) + 'px';
		}
	};

	var resizeModalThrottled = throttle(resizeModal, 500);

	// @TODO: MatchMedia to not affect mobile view (<690px vw)
	// @TODO: .modal-close:after pseudo-element position margin-left (http://stackoverflow.com/questions/7330355/javascript-set-css-after-styles/7330454#7330454)

	CSSModal.on('readystatechange', document, function (event) {
		resizeModal();
	});

	CSSModal.on('resize', document, function (event) {
		resizeModalThrottled();
	});

}(window));
