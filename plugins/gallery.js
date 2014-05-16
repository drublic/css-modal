/*
 * CSS Modal Plugin for displaying an image gallery
 * Author: Jonathan Weiß
 * Date: 2014-05-15
 */

(function (global) {
	'use strict';

	/**
	 * Main modal object
	 */
	var CSSModal = global.CSSModal;
	var _$prev, _$next, _$detailView, _$activeElement;
	var _items = [];
	var _currentItem = 0;
	var _api = {};
	var _options = {};
	var _defaultOptions = {
		endless: true
	};

	/**
	 * Shows the content previous to the current item
	 * @param  {Object} event The incoming touch/click event
	 * @return {void}
	 */
	var showPrevious = function (event) {
		event.preventDefault();
		event.stopPropagation();

		if (_currentItem === 0) {
			if(_options.endless) {
				_currentItem = (_items.length - 1);
			} else {
				_currentItem = 0;
			}
		} else {
			_currentItem--;
		}

		setActiveItem(_currentItem);
	};

	/**
	 * Shows the content next to the current item
	 * @param  {Object} event The incoming touch/click event
	 * @return {void}
	 */
	var showNext = function (event) {
		event.preventDefault();
		event.stopPropagation();

		if (_currentItem === (_items.length - 1)) {
			if(_options.endless) {
				_currentItem = 0;
			}
		} else {
			_currentItem++;
		}

		setActiveItem(_currentItem);
	};

	/**
	 * Returns the detail image element
	 * @param  {Object} $element The current CSS Modal instance
	 * @return {Object} The detail image
	 */
	var _getDetailView = function ($element) {
		var $container = $element.getElementsByClassName('big-image')[0];
		var $img = $container.getElementsByTagName('img')[0];

		return $img;
	};

	/**
	 * Overrides the options based on the data-attribute on the CSSModal
	 * instance
	 * @return {void}
	 */
	var _readOptions = function () {
		var optionsString = _$activeElement.getAttribute('data-options');
		var options = {};
		var entry;

		if (optionsString && optionsString.length > 0) {
			if (window.JSON) {
				try {
					options = JSON.parse(optionsString);
				} catch (ex) { }
			}
			for (entry in options) {
				if (_options[entry]) {
					_options[entry] = options[entry];
				}
			}
		} else {
			_options = {};
			for (entry in _defaultOptions) {
				_options[entry] = _defaultOptions[entry];
			}
		}
	};

	/**
	 * Registers the listerns on the previous / next buttons to enable gallery
	 * navigation
	 * @return {void}
	 */
	var _initNavigation = function () {
		_$activeElement = CSSModal.activeElement;

		if (!_$activeElement._galleryEventsBound) {
			_bindEvents(_$activeElement);
			_$activeElement._galleryEventsBound = true;
			_$activeElement._currentItem = 0;
		}

		_readOptions();
		_$detailView = _getDetailView(_$activeElement);
		_currentItem = _$activeElement._currentItem;
		_items = _readContent(_$activeElement);
	};

	/**
	 * Reacts to specific keyboard commands to enable viewing a differnt item
	 * in the gallery
	 * @param  {Object} event The incoming keypress event
	 * @return {void}
	 */
	var _onKeyPress = function (event) {
		if (event.keyCode === 39) {
			showNext(event);
		} else if (event.keyCode === 37) {
			showPrevious(event);
		}
	};

	/**
	 * Wires the previous / next button to the function to navigation through
	 * the gallery
	 * @param  {Object} $element The CSSModal to set up
	 * @return {void}
	 */
	var _bindEvents = function ($element) {
		var events = ['click', 'touch'];
		var i = 0;

		// Setup touch / click events
		_$prev = $element.getElementsByClassName('modal-prev')[0];
		_$next = $element.getElementsByClassName('modal-next')[0];

		for (; i < events.length; i++) {
			CSSModal.on(events[i], _$prev, showPrevious);
			CSSModal.on(events[i], _$next, showNext);
		}

		// Setup keyboard events
		CSSModal.on('keydown', window, _onKeyPress);
	};

	/**
	 * Gathers information about the gallery content and stores it.
	 * @param  {Object} $element The CSSModal to receive the content from
	 * @return {void}
	 */
	var _readContent = function ($element) {
		var contentList = $element.getElementsByClassName('small-images')[0];

		return contentList.getElementsByTagName('a');
	};

	/**
	 * Shows the full content of the designated item
	 * @param {Number} index The index of the item to show
	 */
	var setActiveItem = function (index) {
		var img = _items[index].getElementsByTagName('img')[0];
		var fullImage = img.getAttribute('data-src-fullsize');

		_$detailView.src = fullImage;
	};

	/**
	 * Store the index of the currently active item on the gallery instance
	 * @param  {Number} item The index to store
	 * @return {void}
	 */
	var _storeActiveItem = function () {
		_$activeElement._currentItem = _currentItem;
	};

	/**
	 * Initial call
	 */
	var init = function () {
		// If CSS Modal is still undefined, throw an error
		if (!CSSModal) {
			throw new Error('Error: CSSModal is not loaded.');
		}

		CSSModal.on('cssmodal:show', document, _initNavigation);
		CSSModal.on('cssmodal:hide', document, _storeActiveItem);

		return _api;
	};

	_api = {
		showNext: showNext,
		showPrevious: showPrevious
	};

	/*
	 * AMD, module loader, global registration
	 */

	// Expose modal for loaders that implement the Node module pattern.
	if (typeof module === 'object' && module && typeof module.exports === 'object') {
		module.exports = _api;

	// Register as an AMD module
	} else if (typeof define === 'function' && define.amd) {

		define(['../modal.js'], init);

	// Export CSSModal into global space
	} else if (typeof global === 'object' && typeof global.document === 'object') {
		init(global.CSSModal);
	}

}(window));
