/*!
 * CSS Modal
 * http://drublic.github.com/css-modal
 *
 * @author Hans Christian Reinl - @drublic
 * @version 1.1.0alpha
 */

(function (global) {

	'use strict';

	/*
	 * Storage for functions and attributes
	 */
	var modal = {

		activeElement: undefined, // Store for currently active element
		lastActive: undefined, // Store for last active elemet
		stackedElements: [], // Store for stacked elements

		// All elements that can get focus, can be tabbed in a modal
		tabbableElements: 'a[href], area[href], input:not([disabled]),' +
			'select:not([disabled]), textarea:not([disabled]),' +
			'button:not([disabled]), iframe, object, embed, *[tabindex],' +
			'*[contenteditable]',

		/*
		 * Polyfill addEventListener for IE8 (only very basic)
		 * @param event {string} event type
		 * @param element {Node} node to fire event on
		 * @param callback {function} gets fired if event is triggered
		 */
		on: function (event, element, callback) {
			if (typeof event !== 'string') {
				throw new Error('Type error: `error` has to be a string');
			}

			if (typeof callback !== 'function') {
				throw new Error('Type error: `callback` has to be a function');
			}

			if (element.addEventListener) {
				element.addEventListener(event, callback, false);
			} else {
				element.attachEvent('on' + event, callback);
			}
		},

		/*
		 * Convenience function to trigger event
		 * @param event {string} event type
		 * @param modal {string} id of modal that the event is triggerd on
		 */
		trigger: function (event, modal) {
			var eventTrigger;

			if (!window.CustomEvent) {
				return;
			}

			eventTrigger = new CustomEvent(event, {
				detail: {
					'modal': modal
				}
			});

			document.dispatchEvent(eventTrigger);
		},

		/*
		 * Convenience function to add a class to an element
		 * @param element {Node} element to add class to
		 * @param className {string}
		 */
		addClass: function (element, className) {
			if (element && !element.className.match(className)) {
				element.className += ' ' + className;
			}
		},

		/*
		 * Convenience function to remove a class from an element
		 * @param element {Node} element to remove class off
		 * @param className {string}
		 */
		removeClass: function (element, className) {
			element.className = element.className.replace(className, '').replace('  ', ' ');
		},

		/*
		 * Focus modal
		 */
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

		/*
		 * Unfocus
		 */
		removeFocus: function () {
			if (modal.lastActive) {
				modal.lastActive.focus();
			}
		},

		/*
		 * Keep focus inside the modal
		 * @param element {node} element to keep focus in
		 */
		keepFocus: function (element) {
			var allTabbableElements = element.querySelectorAll(modal.tabbableElements);
			var firstTabbableElement = allTabbableElements[0];
			var lastTabbableElement = allTabbableElements[allTabbableElements.length - 1];

			var focusHandler = function (event) {
				var keyCode = event.which || event.keyCode;

				// TAB pressed
				if (keyCode !== 9) {
					return;
				}

				// Polyfill to prevent the default behavior of events
				event.preventDefault = event.preventDefault || function () {
					event.returnValue = false;
				};

				// Move focus to first element that can be tabbed if Shift isn't used
				if (event.target === lastTabbableElement && !event.shiftKey) {
					event.preventDefault();
					firstTabbableElement.focus();

				// Move focus to last element that can be tabbed if Shift is used
				} else if (event.target === firstTabbableElement && event.shiftKey) {
					event.preventDefault();
					lastTabbableElement.focus();
				}
			};

			modal.on('keydown', element, focusHandler);
		},

		/*
		 * Mark modal as active
		 * @param element {Node} element to set active
		 */
		setActive: function (element) {
			modal.addClass(element, 'is-active');
			modal.activeElement = element;

			// Update aria-hidden
			modal.activeElement.setAttribute('aria-hidden', 'false');

			// Set the focus to the modal
			modal.setFocus(element.id);

			// Fire an event
			modal.trigger('cssmodal:show', modal.activeElement);
		},

		/*
		 * Unset previous active modal
		 * @param isStacked {boolean} true if element is stacked above another
		 */
		unsetActive: function (isStacked) {
			if (modal.activeElement) {
				modal.removeClass(modal.activeElement, 'is-active');

				// Fire an event
				modal.trigger('cssmodal:hide', modal.activeElement);

				// Update aria-hidden
				modal.activeElement.setAttribute('aria-hidden', 'true');

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

		/*
		 * Stackable modal
		 * @param stackableModal {node} element to be stacked
		 */
		stackModal: function (stackableModal) {
			modal.addClass(stackableModal, 'is-stacked');

			// Set modal as stacked
			modal.stackedElements.push(modal.activeElement);
		},

		/*
		 * Reactivate stacked modal
		 */
		unstackModal: function () {
			var stackedCount = modal.stackedElements.length;
			var lastStacked = modal.stackedElements[stackedCount - 1];

			modal.removeClass(lastStacked, 'is-stacked');

			// Set hash to modal, activates the modal automatically
			window.location.hash = lastStacked.id;

			// Remove modal from stackedElements array
			modal.stackedElements.splice(stackedCount - 1, 1);
		},

		/*
		 * When displaying modal, prevent background from scrolling
		 */
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


	/*
	 * Hide overlay when ESC is pressed
	 */
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


	/*
	 * Trigger main handler on load and hashchange
	 */
	modal.on('hashchange', window, modal.mainHandler);
	modal.on('load', window, modal.mainHandler);

	/*
	 * AMD, module loader, global registration
	 */

	// Expose modal for loaders that implement the Node module pattern.
	if (typeof module === 'object' && module && typeof module.exports === 'object') {
		module.exports = modal;

	// Register as an AMD module
	} else if (typeof define === 'function' && define.amd) {
		define([], function () { return modal; });

	// Export CSSModal into global space
	} else if (typeof global === 'object' && typeof global.document === 'object') {
		global.CSSModal = modal;
	}

}(window));
