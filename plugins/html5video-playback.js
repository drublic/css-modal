/*
 * CSS Modal Plugin for HTML5 Video (play/pause)
 * Author: Anselm Hannemann
 * Date: 2014-02-02
 */

(function (global) {

	'use strict';

	if (CSSModal.activeElement.querySelector('video')) {
		var activeVideo = CSSModal.activeElement.querySelector('video');

		// Stops video when closing modal
		CSSModal.on('cssmodal:hide', CSSModal, function (element) {
			if (activeVideo) {
				activeVideo.play();
			}
		});

		// Enables Auto-Play when calling modal
		CSSModal.on('cssmodal:show', CSSModal, function (element) {
			if (activeVideo) {
				activeVideo.play();
			}
		});
	}

}(window));
