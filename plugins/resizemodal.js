/*
 * CSS Modal Plugin for dynamic modal resizing
 * Author: Anselm Hannemann
 * Date: 2014-02-03
 */

var throttle = function(func, wait, immediate) {
	var timeout;

	return function() {
		var later = function() {
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
		CSSModal.activeElement.getElementsByClassName('modal-inner')[0].style.width = (windowWidth - margin) + 'px';
	}
	// If width wider than height (Landscape mode)
	else if (windowWidth > windowHeight) {
		// Resize modal and images/video/iframe accordingly respecting aspect-ratio
		CSSModal.activeElement.getElementsByClassName('modal-inner')[0].style.height = (windowHeight - (2 * margin)) + 'px';
	}
};

var resizeModalThrottled = throttle(resizeModal, 500);

// @TODO: MatchMedia to not affect mobile view

window.addEventListener('load', resizeModal);
window.addEventListener('resize', resizeModalThrottled);
