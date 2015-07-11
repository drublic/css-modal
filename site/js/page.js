/**
 * Scripting for the demo page
 */

(function ($) {

	'use strict';

	// Set document class "js"
	document.documentElement.className += 'js';

	/*
	 * On closing the modal, stop video
	 */

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


	/*
	 * Gallery
	 */
	$(document).on('click', '.gallery a', function (e) {
		e.preventDefault();

		var $newImage = $(this).html();
		var $oldImage = $('.gallery .big-image').html();

		$('.gallery .big-image').html($newImage);
		$(this).html($oldImage);
	});

}(jQuery));
