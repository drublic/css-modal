/*
 * CSS Modal Plugin for the Vimeo Player (play/pause)
 * Author: Anselm Hannemann
 * Date: 2014-02-02
 */

(function (global) {

	'use strict';

	if (CSSModal.activeElement.querySelector('video')) {
		var activeVideo = CSSModal.activeElement.querySelector('video');

		CSSModal.on('cssmodal:hide', CSSModal, function (element) {
			activeVideo.api('pause');
		});

		// Enables Auto-Play when calling modal
		CSSModal.on('cssmodal:hide', CSSModal, function (element) {
			activeVideo.api('play');
		});
	}
}(window));
