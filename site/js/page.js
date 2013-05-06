/**
 * Scripting for the demo page
 */

(function ($) {

	'use strict';

	// Set document class "js"
	document.documentElement.className += 'js';


	/*
	 * Set height for tabbed area
	 */
	$(document).on('click', '.content-tabbed > h3', function () {
		var height = $(this).next().height() + $(this).height();

		$(this).parent().height(height);

		$(this).parent().children('.is-active').removeClass('is-active');
		$(this).addClass('is-active');
	});


	/*
	 * On hash change
	 */
	$(window).on('hashchange', function () {
		var hash = location.hash.replace('!', '');

		if ($(hash).hasClass('tab-content-anchor')) {
			setTimeout(function () {
				$(hash).trigger('click');
			});
		}
	});

	if (location.hash) {
		$(window).trigger('hashchange');
	} else {
		$('.content-tabbed > h3:first').trigger('click');

		// Scroll to top
		window.scrollTo(0, 1);
	}

	/*
	 * On closing the modal, stop video
	 */

	$(document)
		.on('cssmodal:hide', function () {
			var $video = $('.semantic-content iframe');
			var source = $video.attr('src');

			$video.attr('src', '').attr('data-src', source);
		})

		.on('cssmodal:show', function () {
			var $video = $('.semantic-content iframe');
			if ($video.attr('data-src') !== '') {
				$video.attr('src', $video.attr('data-src')).attr('data-src', '');
			}
		});

}(jQuery));
