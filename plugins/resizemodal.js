/*
 * CSS Modal Plugin for dynamic modal resizing
 * Author: Anselm Hannemann
 * Date: 2014-02-07
 *
 * @TODO:
 * - Fix text modal and video modal centering
 * - Set styles properly
 * - Improve resizing animation
 * - matchMedia Fallback
 */

(function (global) {

	'use strict';

	var CSSModal = global.CSSModal;

	// If CSS Modal is still undefined, throw an error
	if (!CSSModal) {
		throw new Error('Error: CSSModal is not loaded.');
	}

	var matchMedia = function (media) {
		if (window.matchMedia && window.matchMedia('all').addListener) {
			console.log('matchMedia is supported');
			return false;
		}
		else {
			// window.innerWidth(event, callback);
			console.log('matchMedia is not supported');
			// return mediaQueryList;
		}
	};

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

	var fixCloseBtn = function () {
		var $modalClose = CSSModal.activeElement.querySelector('.modal-close');
		var $modalContent = CSSModal.activeElement.querySelector('.modal-content');

		var newClose = $modalClose.cloneNode();

		// @TODO: Set missing styles for .modal-close--inner
		var newCloseStyles = 'position: absolute; top: 0; right: 0; padding: 15px; font-size: 2em; line-height: 0.5; border-radius: 2px; background: #fff; color: #111; text-decoration: none;';

		newClose.className = 'modal-close--inner';
		newClose.setAttribute('style', newCloseStyles);
		newClose.innerHTML = '&#10799;';
		$modalContent.appendChild(newClose);
		$modalClose.parentNode.removeChild($modalClose);
	};

	var resizeModal = function (e) {
		// Only apply dynamic resize if modal is not in mobile view
		if (window.matchMedia('(max-width: 43em)').matches) {
			return;
		}

		var windowHeight = window.innerHeight;
		var windowWidth = window.innerWidth;
		var margin = 40;
		var $modalInner = CSSModal.activeElement.querySelector('.modal-inner');
		var $modalContent = $modalInner.querySelector('.modal-content');
		var innerHeight = $modalInner.scrollHeight;
		var innerWidth = $modalInner.scrollWidth;

		var contentHeight = $modalContent.scrollHeight;
		var contentWidth = $modalContent.scrollWidth;
		var ratio = (contentWidth / contentHeight);

		// If element is higher than viewport
		if (contentHeight > (innerHeight - (2 * margin))) {
			// Set height of .modal-inner and .modal-content
			var padding = 28; // padding in CSS is 15px

			var newHeight = (windowHeight - (2 * margin));
			var newWidth = parseInt((newHeight * ratio), 10);

			$modalInner.style.maxWidth = newWidth + 'px';
			$modalInner.style.width = 'auto';
			$modalInner.style.maxHeight = newHeight + 'px';
			$modalInner.style.marginLeft = ((newWidth) / 2)*-1 + 'px';
			$modalContent.style.maxHeight = newHeight + 'px';
		}
	};

	// Function to call the resizing throttled
	var resizeModalThrottled = throttle(resizeModal, 500);

	CSSModal.on('cssmodal:show', document, function (event) {
		fixCloseBtn();
		resizeModalThrottled();
	});

	CSSModal.on('resize', window, function (event) {
		resizeModalThrottled();
	});
}(window));
