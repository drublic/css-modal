/*
 * CSS Modal Plugin for setting a max-width for modals
 *
 * @author Hans Christian Reinl
 * @date 2014-05-27
 *
 */
(function (global) {
	'use strict';

	/**
	 * Main modal object
	 */
	var CSSModal;

	/**
	 * Include styles into the DOM
	 * @param {string} rule Styles to inject into the DOM
	 * @param {string} id   Unique ID for styles
	 */
	var _injectStyles = function (rule, id) {
		var element = document.createElement('div');

		id = 'modal__rule' + (id || '');

		// Remove all current rules
		if (document.getElementById(id)) {
			document.getElementById(id).parentNode.removeChild(document.getElementById(id));
		}

		element.id = id;
		element.innerHTML = '<style>' + rule + '</style>';

		// Append a new rule
		document.body.appendChild(element);
	};

	/**
	 * Scale the modal according to its custom width
	 */
	var _scale = function () {
		var element = CSSModal.activeElement;
		var maxWidth = element.getAttribute('data-cssmodal-maxwidth');

		if (maxWidth) {
			_injectStyles('[data-cssmodal-maxwidth] .modal-inner {' +
				'max-width: ' + parseInt(maxWidth, 10) + 'px;' +
				'margin-left: -' + (parseInt(maxWidth, 10) / 2) + 'px;' +
			'}' +

			'[data-cssmodal-maxwidth] .modal-close:after {' +
				'margin-right: -' + (parseInt(maxWidth, 10) / 2) + 'px !important;' +
			'}', element.id);
		}
	};

	/**
	 * Plugin API
	 */
	var _api = {
		scaleMaxSize: _scale
	};

	/**
	 * Initial call
	 */
	var init = function (modal) {
		CSSModal = modal;

		/*
		 * Assign basic event handlers
		 */
		CSSModal.on('cssmodal:show', document, _scale);

		// Public API
		return _api;
	};

	/*
	 * AMD, module loader, global registration
	 */

	// Expose modal for loaders that implement the Node module pattern.
	if (typeof module === 'object' && module && typeof module.exports === 'object') {
		module.exports = _api;

	// Register as an AMD module
	} else if (typeof define === 'function' && define.amd) {

		define(['CSSModal'], init);

	// Export CSSModal into global space
	} else if (typeof global === 'object' && typeof global.document === 'object') {
		init(global.CSSModal);
	}

}(window));
