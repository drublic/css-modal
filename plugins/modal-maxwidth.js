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
	var _currentMaxWidth;

	// Config: margin for modal when too narrow to show max width
	// can be overwritten with `data-cssmodal-margin` attribute
	var _margin = 20;

	var MODAL_SMALL_BREAKPOINT = 480;

	/**
	 * Include styles into the DOM
	 * @param {string} rule Styles to inject into the DOM
	 * @param {string} id   Unique ID for styles
	 */
	var _injectStyles = function (rule, id) {
		id = 'modal__rule--' + (id || '');

		var head = document.querySelector('head');
		var existingStyleElement = document.getElementById(id);
		var styleElement = null;

		if (existingStyleElement) {
			styleElement = existingStyleElement;
		} else {
			styleElement = document.createElement('style');
			styleElement.id = id;

			// The element must be in the DOM before adding rules in IE8
			head.appendChild(styleElement);
		}

		if (styleElement.styleSheet) {
			// IE8 and other legacy browers
			styleElement.styleSheet.cssText = rule;
		} else {
			// modern browsers
			styleElement.innerHTML = rule;
		}
	};

	/**
	 * Scale the modal according to its custom width
	 */
	var _scale = function () {
		var element = CSSModal.activeElement;

		// Eject if no active element is set
		if (!element) {
			return;
		}

		_currentMaxWidth = element.getAttribute('data-cssmodal-maxwidth');
		_currentMaxWidth = parseInt(_currentMaxWidth, 10);

		if (_currentMaxWidth) {
			_injectStyles('[data-cssmodal-maxwidth] .modal-inner {' +
				'max-width: ' + _currentMaxWidth + 'px;' +
				'margin-left: -' + (_currentMaxWidth / 2) + 'px;' +
			'}' +

			'[data-cssmodal-maxwidth] .modal-close:after {' +
				'margin-right: -' + (_currentMaxWidth / 2) + 'px !important;' +
			'}', element.id);
		}
	};

	var _scaleLower = function () {
		var innerWidth = global.innerWidth || document.documentElement.clientWidth;
		var element = CSSModal.activeElement;
		var closeButtonMarginRight = 10;

		// Skip if there is no max width or the window is wider
		if (!element || !_currentMaxWidth || innerWidth > _currentMaxWidth) {
			return;
		}

		// Window width minus margin left and right
		_margin = parseInt(element.getAttribute('data-cssmodal-margin'), 10) || _margin;
		_currentMaxWidth = innerWidth - (_margin * 2);

		if (innerWidth > MODAL_SMALL_BREAKPOINT) {
			closeButtonMarginRight = '-' + Math.floor(_currentMaxWidth / 2);
		}

		_injectStyles('[data-cssmodal-maxwidth] .modal-inner {' +
			'max-width: ' + _currentMaxWidth + 'px;' +
			'margin-left: -' + (_currentMaxWidth / 2) + 'px;' +
		'}' +

		'[data-cssmodal-maxwidth] .modal-close:after {' +
			'margin-right: ' + closeButtonMarginRight + 'px !important;' +
		'}', element.id);
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
		CSSModal.on('cssmodal:show', document, function () {
			_scale();
			_scaleLower();
		});

		CSSModal.on('resize', window, function () {
			_scale();
			_scaleLower();
		});

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
