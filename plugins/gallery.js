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
	var CSSModal;

	/**
	 * Initial call
	 */
	var init = function (modal) {
		CSSModal = modal;
	};

	/*
	 * AMD, module loader, global registration
	 */

	// Expose modal for loaders that implement the Node module pattern.
	if (typeof module === 'object' && module && typeof module.exports === 'object') {
		module.exports = {};

	// Register as an AMD module
	} else if (typeof define === 'function' && define.amd) {

		define(['../modal.js'], init);

	// Export CSSModal into global space
	} else if (typeof global === 'object' && typeof global.document === 'object') {
		init(global.CSSModal);
	}

}(window));
