/*!
 * CSS Modal
 * http://drublic.github.com/css-modal
 *
 * @author Hans Christian Reinl - @drublic
 * @version 1.0.0
 */

(function (global) {

	'use strict';

	// Storage variable
	var modal = {};

	// Store for currently active element
	modal.lastActive = undefined;
	modal.activeElement = undefined;

	// Polyfill addEventListener for IE8 (only very basic)
	document._addEventListener = document.addEventListener || function (event, callback) {
		document.attachEvent('on' + event, callback);
	};

	// Hide overlay when ESC is pressed
	document._addEventListener('keyup', function (event) {
		var hash = window.location.hash.replace('#', '');

		// If hash is not set
		if (hash === '' || hash === '!') {
			return;
		}

		// If key ESC is pressed
		if (event.keyCode === 27) {
			window.location.hash = '!';

			if (modal.lastActive) {
				return false;
			}

			// Unfocus
			modal.removeFocus();
		}
	}, false);

	// Conveniance function to trigger event
	modal._dispatchEvent = function (event, modal) {
		var eventTigger;

		if (!document.createEvent) {
			return;
		}

		eventTigger = document.createEvent('Event');

		eventTigger.initEvent(event, true, true);
		eventTigger.customData = { 'modal': modal };

		document.dispatchEvent(eventTigger);
	};


	// When showing overlay, prevent background from scrolling
	window.onhashchange = function () {
		var hash = window.location.hash.replace('#', '');
		var modalChild;

		// If hash is set
		if (hash !== '' && hash !== '!') {

			// Get first element in selected element
			modalChild = document.getElementById(hash).children[0];

			// When we deal with a modal and class `has-overlay` is not set on html yet
			if (modalChild && modalChild.className.match(/modal-inner/) && !document.documentElement.className.match(/has-overlay/)) {

				// Set an html class to prevent scrolling
				document.documentElement.className += ' has-overlay';

				// Mark modal as active
				document.getElementById(hash).className += ' is-active';
				modal.activeElement = document.getElementById(hash);

				// Set the focus to the modal
				modal.setFocus(hash);

				// Fire an event
				modal._dispatchEvent('cssmodal:show', modal.activeElement);
			}
		} else {
			document.documentElement.className = document.documentElement.className.replace(' has-overlay', '');

			// If activeElement is already defined, delete it
			if (modal.activeElement) {
				modal.activeElement.className = modal.activeElement.className.replace(' is-active', '');

				// Fire an event
				modal._dispatchEvent('cssmodal:hide', modal.activeElement);

				// Reset active element
				modal.activeElement = null;

				// Unfocus
				modal.removeFocus();
			}
		}
	};


	/*
	 * Accessibility
	 */

	// Focus modal
	modal.setFocus = function (hash) {
		if (modal.activeElement &&
				typeof modal.activeElement.contains === 'function' &&
				!modal.activeElement.contains(hash)) {

			// Set element with last focus
			modal.lastActive = document.activeElement;

			// New focussing
			modal.activeElement.focus();
		}
	};

	// Unfocus
	modal.removeFocus = function () {
		if (modal.lastActive) {
			modal.lastActive.focus();
		}
	};


	global.CSSModal = modal;

}(window));
