/*
 * CSS Modal Plugin for displaying an image gallery
 *
 * @author Jonathan Weiß
 * @date 2014-05-15
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
		var container = element.querySelectorAll('.modal-detail')[0];

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
	var _initNavigation = function (event, eventData) {
		if (arguments.length === 2) {
			_activeElement = eventData.detail.modal;
		} else {
			_activeElement = event.detail.modal;
		}

		if (_activeElement.querySelectorAll('.modal-detail').length === 0) {
			return;
		}

		// Bind events on the current modal element and set the currentItem to 0
		if (!_activeElement._galleryEventsBound) {
			_bindEvents(_activeElement);
			_activeElement._galleryEventsBound = true;
			_activeElement._currentItem = 0;
		}

		// If we have an incoming index, override the current item
		if ('index' in _activeElement) {
			_activeElement._currentItem = _activeElement.index;
		}

		_detailView = _getDetailView(_activeElement);
		_currentItem = _activeElement._currentItem;
		_items = _readContent(_activeElement);

		setActiveItem(_currentItem);
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
		_prev = element.querySelectorAll('.modal--gallery-navigation-prev')[0];
		_next = element.querySelectorAll('.modal--gallery-navigation-next')[0];

		for (; i < events.length; i++) {
			CSSModal.on(events[i], _prev, showPrevious);
			CSSModal.on(events[i], _next, showNext);
		}

		// Setup keyboard events
		CSSModal.on('keydown', document, _onKeyPress);

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
		var contentList = element.querySelectorAll('.modal-content-list')[0];

		return contentList.getElementsByTagName('li');
	};

	/**
	 * Set a caption for a given modal
	 * @param {String} caption Caption to insert
	 */
	var setCaption = function (caption) {
		var captionElement = _activeElement.querySelectorAll('.modal--gallery-caption')[0];

		if (!captionElement) {
			return;
		}

		captionElement.innerHTML = '';

		if (caption) {
			captionElement.innerHTML = '<p>' + caption + '</p>';
		}
	};

	/**
	 * Shows the full content of the designated item
	 * @param {Number} index The index of the item to show
	 */
	var setActiveItem = function (index) {
		if (!_items[index]) {
			throw new Error('Invalid index "' + index + '"!');
		}

		var content = _items[index].innerHTML;
		var img = new Image();
		var referenceImage;

		_detailView.innerHTML = content;

		// Position for loading indicator and hide content
		CSSModal.trigger('cssmodal:resize', _activeElement);
		CSSModal.removeClass(_detailView, 'is-active');

		// Set a caption for the modal
		setCaption(_items[index].getAttribute('data-caption'));

		// Load the original image, if we are in a gallery
		if (_activeElement.getAttribute('class').indexOf('modal--gallery') !== -1) {
			referenceImage = _detailView.getElementsByTagName('img')[0];

			if (referenceImage.parentNode.getAttribute('data-iframe') !== null) {
				img = document.createElement('iframe');
				img.src = referenceImage.getAttribute('data-src-fullsize');
				img.setAttribute('webkitallowfullscreen', true);
				img.setAttribute('mozallowfullscreen', true);
				img.setAttribute('allowfullscreen', true);

			} else {
				img.src = referenceImage.getAttribute('data-src-fullsize');
				img.alt = referenceImage.getAttribute('alt');
			}

			// Reposition and show
			CSSModal.on('load', img, function () {
				CSSModal.addClass(_detailView, 'is-active');
				CSSModal.trigger('cssmodal:resize', _activeElement);
			});

			referenceImage.parentNode.insertBefore(img, referenceImage);
			referenceImage.parentNode.removeChild(referenceImage);

			_detailView.style.width = 'auto';
			_detailView.style.height = 'auto';
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
		setActiveItem: setActiveItem,
		setCaption: setCaption
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
