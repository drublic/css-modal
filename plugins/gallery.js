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
	var _prev;
	var _next;
	var _detailView;
	var _activeElement;
	var _items = [];
	var _currentItem = 0;
	var _api = {};

	/**
	 * Decreases the counter for the active item regarding the "endless"
	 * setting.
	 * @return {void}
	 */
	var _setPreviousItem = function () {
		if (_currentItem === 0) {
			_currentItem = (_items.length - 1);
		} else {
			_currentItem--;
		}
	};

	/**
	 * Shows the content previous to the current item
	 * @param  {Object} event The incoming touch/click event
	 * @return {void}
	 */
	var showPrevious = function (event) {
		event.preventDefault();
		event.stopPropagation();

		_setPreviousItem();

		setActiveItem(_currentItem);
	};

	/**
	 * Increases the counter for the active item regarding the "endless"
	 * setting.
	 * @return {void}
	 */
	var _setNextItem = function () {
		if (_currentItem === (_items.length - 1)) {
			_currentItem = 0;
		} else {
			_currentItem++;
		}
	};

	/**
	 * Shows the content next to the current item
	 * @param  {Object} event The incoming touch/click event
	 * @return {void}
	 */
	var showNext = function (event) {
		event.preventDefault();
		event.stopPropagation();

		_setNextItem();

		setActiveItem(_currentItem);
	};

	/**
	 * Returns the detail image element
	 * @param  {Object} element The current CSS Modal instance
	 * @return {Object} The detail image
	 */
	var _getDetailView = function (element) {
		var container = element.getElementsByClassName('modal-detail')[0];
		if (!container) {
			throw new Error('".modal-detail" not found!');
		}
		return container;
	};

	/**
	 * Registers the listerns on the previous / next buttons to enable gallery
	 * navigation
	 * @return {void}
	 */
	var _initNavigation = function (event) {
		_activeElement = event.detail.modal;

		if (!_activeElement._galleryEventsBound) {
			_bindEvents(_activeElement);
			_activeElement._galleryEventsBound = true;
			_activeElement._currentItem = 0;
		}

		_detailView = _getDetailView(_activeElement);
		_currentItem = _activeElement._currentItem;
		_items = _readContent(_activeElement);

		setActiveItem(0);
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
	 * @param  {Object} element The CSSModal to set up
	 * @return {void}
	 */
	var _bindEvents = function (element) {
		var events = ['click', 'touch'];
		var i = 0;

		// Setup touch / click events
		_prev = element.getElementsByClassName('modal--gallery-navigation-prev')[0];
		_next = element.getElementsByClassName('modal--gallery-navigation-next')[0];

		for (; i < events.length; i++) {
			CSSModal.on(events[i], _prev, showPrevious);
			CSSModal.on(events[i], _next, showNext);
		}

		// Setup keyboard events
		CSSModal.on('keydown', window, _onKeyPress);

		// Setup swipe events
		CSSModal.on('touch:swipe-left', element, showPrevious);
		CSSModal.on('touch:swipe-right', element, showNext);
	};

	/**
	 * Gathers information about the gallery content and stores it.
	 * @param  {Object} element The CSSModal to receive the content from
	 * @return {void}
	 */
	var _readContent = function (element) {
		var contentList = element.getElementsByClassName('modal-content-list')[0];
		return contentList.getElementsByTagName('li');
	};

	/**
	 * Shows the full content of the designated item
	 * @param {Number} index The index of the item to show
	 */
	var setActiveItem = function (index) {
		var content = _items[index].innerHTML;
		var img = null;

		_detailView.innerHTML = content;

		// Position for loading indicator and hide content
		CSSModal.trigger('cssmodal:resize', _activeElement);
		CSSModal.removeClass(_detailView, 'is-active');

		// Load the original image, if we are in a gallery
		if (_activeElement.getAttribute('class').indexOf('modal--gallery') !== -1) {
			img = _detailView.getElementsByTagName('img')[0];
			img.src = img.getAttribute('data-src-fullsize');

			// Reposition and show
			img.addEventListener('load', function () {
				CSSModal.trigger('cssmodal:resize', _activeElement);
				CSSModal.addClass(_detailView, 'is-active');
			}, false);
		}
	};

	/**
	 * Store the index of the currently active item on the gallery instance
	 * @param  {Number} item The index to store
	 * @return {void}
	 */
	var _storeActiveItem = function () {
		_activeElement._currentItem = _currentItem;
	};

	/**
	 * Initial call
	 */
	var init = function (modal) {
		CSSModal = modal;

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
		showPrevious: showPrevious,
		setActiveItem: setActiveItem
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
