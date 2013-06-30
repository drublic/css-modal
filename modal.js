/*!
 * CSS Modal
 * http://drublic.github.com/css-modal
 *
 * @author Hans Christian Reinl - @drublic
 * @version 1.1.0
 */

(function (global) {

	'use strict';

	// Storage for functions and attributes
	var modal = {

		activeElement: undefined, // Store for currently active element
		lastActive: undefined, // Store for last active elemet
		stackedElements: [], // Store for stacked elements

		// All elements that can get focus, can be tabbed in a modal
		tabbableElements: 'a[href], area[href], input:not([disabled]),' +
			'select:not([disabled]), textarea:not([disabled]),' +
			'button:not([disabled]), iframe, object, embed, *[tabindex],' +
			'*[contenteditable]',

		// Polyfill addEventListener for IE8 (only very basic)
		on: function (event, element, callback) {
			if (element.addEventListener) {
				element.addEventListener(event, callback, false);
			} else {
				element.attachEvent('on' + event, callback);
			}
		},

		// Convenience function to trigger event
		trigger: function (event, modal) {
			var eventTigger;

			if (!document.createEvent) {
				return;
			}

			eventTigger = document.createEvent('Event');

			eventTigger.initEvent(event, true, true);
			eventTigger.customData = { 'modal': modal };

			document.dispatchEvent(eventTigger);
		},

		// Convenience function to add a class to an element
		addClass: function (element, className) {
			if (element && !element.className.match(/className/)) {
				element.className += ' ' + className;
			}
		},

		// Convenience function to remove a class from an element
		removeClass: function (element, className) {
			element.className = element.className.replace(' ' + className, '');
		},

		// Focus modal
		setFocus: function () {
			if (modal.activeElement) {

				// Set element with last focus
				modal.lastActive = document.activeElement;

				// New focussing
				modal.activeElement.focus();

				// Add handler to keep the focus
				modal.keepFocus(modal.activeElement);
			}
		},

		// Unfocus
		removeFocus: function () {
			if (modal.lastActive) {
				modal.lastActive.focus();
			}
		},

		// Keep focus inside the modal
		keepFocus: function (element) {
			var allTabbableElements = element.querySelectorAll(modal.tabbableElements);
			var firstTabbableElement = allTabbableElements[0];
			var lastTabbableElement = allTabbableElements[allTabbableElements.length - 1];

			var focusHandler = function (event) {
				var keyCode = event.which || event.keyCode;

				// TAB pressed
				if (keyCode === 9) {
					if (event.preventDefault) {
						event.preventDefault();
					} else {
						event.returnValue = false;
					}

					firstTabbableElement.focus();
				}
			};

			modal.on('keydown', lastTabbableElement, focusHandler);
		},

		// Mark modal as active
		setActive: function (element) {
			modal.addClass(element, 'is-active');
			modal.activeElement = element;

			// Set the focus to the modal
			modal.setFocus(element.id);

			// Fire an event
			modal.trigger('cssmodal:show', modal.activeElement);
		},

		// Unset previous active modal
		unsetActive: function (isStacked) {
			if (modal.activeElement) {
				modal.removeClass(modal.activeElement, 'is-active');

				// Fire an event
				modal.trigger('cssmodal:hide', modal.activeElement);

				// Unfocus
				modal.removeFocus();

				// Make modal stacked if needed
				if (isStacked) {
					modal.stackModal(modal.activeElement);
				}

				// If there are any stacked elements
				if (!isStacked && modal.stackedElements.length > 0) {
					modal.unstackModal();
				}

				// Reset active element
				modal.activeElement = null;
			}
		},

		// Stackable modal
		stackModal: function (stackableModal) {
			modal.addClass(stackableModal, 'is-stacked');

			// Set modal as stacked
			modal.stackedElements.push(modal.activeElement);
		},

		// Reactivate stacked modal
		unstackModal: function () {
			var stackedCount = modal.stackedElements.length;
			var lastStacked = modal.stackedElements[stackedCount - 1];

			modal.removeClass(lastStacked, 'is-stacked');

			// Set hash to modal, activates the modal automatically
			window.location.hash = lastStacked.id;

			// Remove modal from stackedElements array
			modal.stackedElements.splice(stackedCount - 1, 1);
		},

		// When showing overlay, prevent background from scrolling
		mainHandler: function () {
			var hash = window.location.hash.replace('#', '');
			var modalElement = document.getElementById(hash);
			var modalChild;

			// If the hash element exists
			if (modalElement) {

				// Get first element in selected element
				modalChild = modalElement.children[0];

				// When we deal with a modal and body-class `has-overlay` is not set
				if (modalChild && modalChild.className.match(/modal-inner/)) {

					// Set an html class to prevent scrolling
					modal.addClass(document.documentElement, 'has-overlay');

					// Make previous element stackable
					modal.unsetActive(true);

					// Mark the active element
					modal.setActive(modalElement);
				}
			} else {
				modal.removeClass(document.documentElement, 'has-overlay');

				// If activeElement is already defined, delete it
				modal.unsetActive();
			}
		}
	};


	// Hide overlay when ESC is pressed
	modal.on('keyup', document, function (event) {
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


	// Trigger main handler on load and hashchange
	modal.on('hashchange', window, modal.mainHandler);
	modal.on('load', window, modal.mainHandler);


	// Export CSSModal into global space
	global.CSSModal = modal;

}(window));
