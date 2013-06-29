/*!
 * CSS Modal
 * http://drublic.github.com/css-modal
 *
 * @author Hans Christian Reinl - @drublic
 * @version 1.1.0
 */

(function (global) {

	'use strict';

	// Storage variable
	var modal = {};

	// Store for currently active element
	modal.lastActive = undefined;
	modal.activeElement = undefined;

	// Polyfill addEventListener for IE8 (only very basic)
	modal._addEventListener = function (element, event, callback) {
		if (element.addEventListener) {
			element.addEventListener(event, callback, false);
		} else {
			element.attachEvent('on' + event, callback);
		}
	};

	// Hide overlay when ESC is pressed
	modal._addEventListener(document, 'keyup', function (event) {
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

	// Convenience function to trigger event
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

	// Convenience function to add a class to an element
	modal.addClass = function (element, className) {
		element.className += className;
	};

	// Convenience function to remove a class from an element
	modal.removeClass = function (element, className) {
		element.className = element.className.replace(className, '');
	};

	// Mark modal as active
	modal.setActive = function (element) {
		modal.addClass(element, 'is-active');
		modal.activeElement = element;
	};

	// Unset previous active modal
	modal.unsetActive = function () {
		if (modal.activeElement) {
			modal.removeClass(modal.activeElement, 'is-active');
		}
	};

	// When showing overlay, prevent background from scrolling
	modal.mainHandler = function () {
		var htmlClasses = document.documentElement.className;
		var hash = window.location.hash.replace('#', '');
		var modalElement = document.getElementById(hash);
		var modalChild;

		// If the hash element exists
		if (modalElement) {

			// Get first element in selected element
			modalChild = modalElement.children[0];

			// When we deal with a modal and body-class `has-overlay` is not set
			if (modalChild && modalChild.className.match(/modal-inner/)) {
				if (!htmlClasses.match(/has-overlay/)) {

					// Set an html class to prevent scrolling
					modal.addClass(document.documentElement, 'has-overlay');
				}

				// Unmark previous active element
				modal.unsetActive(modalElement);

				// Mark the active element
				modal.setActive(modalElement);

				// Set the focus to the modal
				modal.setFocus(hash);

				// Fire an event
				modal._dispatchEvent('cssmodal:show', modal.activeElement);
			}
		} else {
			modal.removeClass(document.documentElement, 'has-overlay');

			// If activeElement is already defined, delete it
			if (modal.activeElement) {
				modal.removeClass(modal.activeElement, 'is-active');

				// Fire an event
				modal._dispatchEvent('cssmodal:hide', modal.activeElement);

				// Reset active element
				modal.activeElement = null;

				// Unfocus
				modal.removeFocus();
			}
		}
	};

	// Trigger main handler on load and hashchange
	modal._addEventListener(window, 'hashchange', modal.mainHandler);
	modal._addEventListener(window, 'load', modal.mainHandler);

	/*
	 * Accessibility
	 */

	// Focus modal
	modal.setFocus = function () {
		if (modal.activeElement) {

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

	// Export CSSModal into global space
	global.CSSModal = modal;

}(window));
