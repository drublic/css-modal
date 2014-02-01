/*
 * On closing the modal, stop video
 */
(function () {
	'use strict';

	$(document)
		.on('cssmodal:hide', function () {
			var $video = $('.semantic-content iframe');
			var source;

			if ($video.length > 0) {
				source = $video.attr('src');

				$video.attr('src', '').attr('data-src', source);
			}
		})

		.on('cssmodal:show', function () {
			var $video = $('.semantic-content iframe');
			var dataSource = $video.attr('data-src');
			if ($video.length > 0 && dataSource !== '') {
				$video.attr('src', dataSource).attr('data-src', '');
			}
		});
})
