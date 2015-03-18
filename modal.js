/*!
 * CSS Modal
 * http://drublic.github.com/css-modal
 *
 * @author Hans Christian Reinl - @drublic
 */

(function (global, $) {

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
		on: function (event, elements, callback) {
			var i = 0;

			if (typeof event !== 'string') {
				throw new Error('Type error: `event` has to be a string');
			}

			if (typeof callback !== 'function') {
				throw new Error('Type error: `callback` has to be a function');
			}

			if (!elements) {
				return;
			}

			// Make elements an array and attach event listeners
			if (!elements.length) {
				elements = [elements];
			}

			for (; i < elements.length; i++) {

				// If jQuery is supported
				if ($) {
					$(elements[i]).on(event, callback);

				// Default way to support events
				} else if ('addEventListener' in elements[i]) {
					elements[i].addEventListener(event, callback, false);
				}

			}
		},

		/*
		 * Convenience function to trigger event
		 * @param event {string} event type
		 * @param modal {string} id of modal that the event is triggered on
		 */
		trigger: function (event, modal) {
			var eventTrigger;
			var eventParams = {
				detail: {
					'modal': modal
				}
			};

			// Use jQuery to fire the event if it is included
			if ($) {
				$(document).trigger(event, eventParams);

			// Use createEvent if supported (that's mostly the case)
			} else if (document.createEvent) {
				eventTrigger = document.createEvent('CustomEvent');

				eventTrigger.initCustomEvent(event, false, false, {
					'modal': modal
				});

				document.dispatchEvent(eventTrigger);

			// Use CustomEvents if supported
			} else {
				eventTrigger = new CustomEvent(event, eventParams);

				document.dispatchEvent(eventTrigger);
			}
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

		/**
		 * Convenience function to check if an element has a class
		 * @param  {Node}    element   Element to check classname on
		 * @param  {string}  className Class name to check for
		 * @return {Boolean}           true, if class is available on modal
		 */
		hasClass: function (element, className) {
			return !!element.className.match(className);
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
			var allTabbableElements = [];

			// Don't keep the focus if the browser is unable to support
			// CSS3 selectors
			try {
				allTabbableElements = element.querySelectorAll(modal.tabbableElements);
			} catch (ex) {
				return;
			}

			var firstTabbableElement = modal.getFirstElementVisible(allTabbableElements);
			var lastTabbableElement = modal.getLastElementVisible(allTabbableElements);

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
		 * Return the first visible element of a nodeList
		 *
		 * @param nodeList The nodelist to parse
		 * @return {Node|null} Returns a specific node or null if no element found
		 */
		getFirstElementVisible: function (nodeList) {
			var nodeListLength = nodeList.length;

			// If the first item is not visible
			if (!modal.isElementVisible(nodeList[0])) {
				for (var i = 1; i < nodeListLength - 1; i++) {

					// Iterate elements in the NodeList, return the first visible
					if (modal.isElementVisible(nodeList[i])) {
						return nodeList[i];
					}
				}
			} else {
				return nodeList[0];
			}

			return null;
		},

		/*
		 * Return the last visible element of a nodeList
		 *
		 * @param nodeList The nodelist to parse
		 * @return {Node|null} Returns a specific node or null if no element found
		 */
		getLastElementVisible: function (nodeList) {
			var nodeListLength = nodeList.length;
			var lastTabbableElement = nodeList[nodeListLength - 1];

			// If the last item is not visible
			if (!modal.isElementVisible(lastTabbableElement)) {
				for (var i = nodeListLength - 1; i >= 0; i--) {

					// Iterate elements in the NodeList, return the first visible
					if (modal.isElementVisible(nodeList[i])) {
						return nodeList[i];
					}
				}
			} else {
				return lastTabbableElement;
			}

			return null;
		},

		/*
		 * Convenience function to check if an element is visible
		 *
		 * Test idea taken from jQuery 1.3.2 source code
		 *
		 * @param element {Node} element to test
		 * @return {boolean} is the element visible or not
		 */
		isElementVisible: function (element) {
			return !(element.offsetWidth === 0 && element.offsetHeight === 0);
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
		 * @param isStacked          {boolean} `true` if element is stacked above another
		 * @param shouldNotBeStacked {boolean} `true` if next element should be stacked
		 */
		unsetActive: function (isStacked, shouldNotBeStacked) {
			modal.removeClass(document.documentElement, 'has-overlay');

			if (modal.activeElement) {
				modal.removeClass(modal.activeElement, 'is-active');

				// Fire an event
				modal.trigger('cssmodal:hide', modal.activeElement);

				// Update aria-hidden
				modal.activeElement.setAttribute('aria-hidden', 'true');

				// Unfocus
				modal.removeFocus();

				// Make modal stacked if needed
				if (isStacked && !shouldNotBeStacked) {
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
			global.location.hash = lastStacked.id;

			// Remove modal from stackedElements array
			modal.stackedElements.splice(stackedCount - 1, 1);
		},

		/*
		 * When displaying modal, prevent background from scrolling
		 * @param  {Object} event The incoming hashChange event
		 * @return {void}
		 */
		mainHandler: function (event, noHash) {
			var hash = global.location.hash.replace('#', '');
			var index = 0;
			var tmp = [];
			var modalElement;
			var modalChild;

			// JS-only: no hash present
			if (noHash) {
				hash = event.currentTarget.getAttribute('href').replace('#', '');
			}

			modalElement = document.getElementById(hash);

			// Check if the hash contains an index
			if (hash.indexOf('/') !== -1) {
				tmp = hash.split('/');
				index = tmp.pop();
				hash = tmp.join('/');

				// Remove the index from the hash...
				modalElement = document.getElementById(hash);

				// ... and store the index as a number on the element to
				// make it accessible for plugins
				if (!modalElement) {
					throw new Error('ReferenceError: element "' + hash + '" does not exist!');
				}

				modalElement.index = (1 * index);
			}

			// If the hash element exists
			if (modalElement) {

				// Polyfill to prevent the default behavior of events
				try {
					event.preventDefault();
				} catch (ex) {
					event.returnValue = false;
				}

				// Get first element in selected element
				modalChild = modalElement.children[0];

				// When we deal with a modal and body-class `has-overlay` is not set
				if (modalChild && modalChild.className.match(/modal-inner/)) {

					// Make previous element stackable if it is not the same modal
					modal.unsetActive(
						!modal.hasClass(modalElement, 'is-active'),
						(modalElement.getAttribute('data-stackable') === 'false')
					);

					// Set an html class to prevent scrolling
					modal.addClass(document.documentElement, 'has-overlay');

					// Set scroll position for modal
					modal._currentScrollPositionY = global.scrollY;
					modal._currentScrollPositionX = global.scrollX;

					// Mark the active element
					modal.setActive(modalElement);
					modal.activeElement._noHash = noHash;
				}
			} else {

				// If activeElement is already defined, delete it
				modal.unsetActive();
			}

			return true;
		},

		/**
		 * Inject iframes
		 */
		injectIframes: function () {
			var iframes = document.querySelectorAll('[data-iframe-src]');
			var iframe;
			var i = 0;

			for (; i < iframes.length; i++) {
				iframe = document.createElement('iframe');

				iframe.src = iframes[i].getAttribute('data-iframe-src');
				iframe.setAttribute('webkitallowfullscreen', true);
				iframe.setAttribute('mozallowfullscreen', true);
				iframe.setAttribute('allowfullscreen', true);

				iframes[i].appendChild(iframe);
			}
		},

		/**
		 * Listen to all relevant events
		 * @return {void}
		 */
		init: function () {

			/*
			 * Hide overlay when ESC is pressed
			 */
			this.on('keyup', document, function (event) {
				var hash = global.location.hash.replace('#', '');

				// If key ESC is pressed
				if (event.keyCode === 27) {
					if (modal.activeElement && hash === modal.activeElement.id) {
						global.location.hash = '!';
					} else {
						modal.unsetActive();
					}

					if (modal.lastActive) {
						return false;
					}

					// Unfocus
					modal.removeFocus();
				}
			}, false);

			/**
			 * Trigger main handler on click if hash is deactivated
			 */
			this.on('click', document.querySelectorAll('[data-cssmodal-nohash]'), function (event) {
				modal.mainHandler(event, true);
			});

			// And close modal without hash
			this.on('click', document.querySelectorAll('.modal-close'), function (event) {
				if (modal.activeElement._noHash){
					modal.mainHandler(event, true);
				}
			});

			/*
			 * Trigger main handler on load and hashchange
			 */
			this.on('hashchange', global, modal.mainHandler);
			this.on('load', global, modal.mainHandler);

			/**
			 * Prevent scrolling when modal is active
			 * @return {void}
			 */
			global.onscroll = global.onmousewheel = function () {
				if (document.documentElement.className.match(/has-overlay/)) {
					global.scrollTo(modal._currentScrollPositionX, modal._currentScrollPositionY);
				}
			};

			/**
			 * Inject iframes
			 */
			modal.injectIframes();
		}
	};

	/*
	 * AMD, module loader, global registration
	 */

	// Expose modal for loaders that implement the Node module pattern.
	if (typeof module === 'object' && module && typeof module.exports === 'object') {
		module.exports = modal;

	// Register as an AMD module
	} else if (typeof define === 'function' && define.amd) {
		define('CSSModal', [], function () {

			// We use jQuery if the browser doesn't support CustomEvents
			if (!global.CustomEvent && !$) {
				throw new Error('This browser doesn\'t support CustomEvent - please include jQuery.');
			}

			modal.init();

			return modal;
		});

	// Export CSSModal into global space
	} else if (typeof global === 'object' && typeof global.document === 'object') {
		global.CSSModal = modal;
		modal.init();
	}

}(window, window.jQuery));
