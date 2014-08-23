/*
 * CSS Modal Plugin for HTML5 Video (play/pause)
 *
 * @author Anselm Hannemann
 * @date 2014-02-04
 */
(function (global) {

	'use strict';

	/**
	 * Main modal object
	 */
	var CSSModal;

	var videos;

	/**
	 * Show modal
	 */
	var _show = function () {

		// Fetch all video elements in active modal
		videos = CSSModal.activeElement.querySelectorAll('video');

		// Play first video in modal
		if (videos.length > 0) {
			videos[0].play();
		}
	};

	/**
	 * Hide modal
	 */
	var _hide = function () {
		var i = 0;

		// Pause all videos in active modal
		if (videos.length > 0) {
			for (; i < videos.length; i++) {
				videos[i].pause();
			}
		}
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

		// Enables Auto-Play when calling modal
		CSSModal.on('cssmodal:show', document, _show);

		// If modal is closed, pause all videos
		CSSModal.on('cssmodal:hide', document, _hide);

		return {};
	};

	/*
	 * AMD, module loader, global registration
	 */

	// Expose modal for loaders that implement the Node module pattern.
	if (typeof module === 'object' && module && typeof module.exports === 'object') {
		module.exports = {};

	// Register as an AMD module
	} else if (typeof define === 'function' && define.amd) {

		define(['CSSModal'], init);

	// Export CSSModal into global space
	} else if (typeof global === 'object' && typeof global.document === 'object') {
		init(global.CSSModal);
	}
}(window));
