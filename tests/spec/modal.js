/*global describe, it, expect, afterEach */
(function ($, CSSModal) {
	'use strict';

	// Testing if the modal works in general
	describe('Modal', function () {

		var $modal = $('#modal');

		// Reset location hash after each test
		afterEach(function () {
			window.location.hash = '';
		});

		it('exists', function () {
			expect($modal.length).toBeGreaterThan(0);
			expect(typeof CSSModal).toBe('object');
		});

		it('is hidden', function () {
			expect($modal.css('opacity')).toBe('0');
		});

		it('is hidden when hash is #!', function () {
			window.location.hash = '#!';

			expect($modal.css('opacity')).toBe('0');
		});

		it('is visible when hash is set', function () {
			window.location.hash = '#modal';

			expect($modal.css('opacity')).toBe('1');
		});

		it('has event listener stub', function () {
			expect(typeof CSSModal._addEventListener).toBe('function');
		});

		it('has event triggerer', function () {
			expect(typeof CSSModal._dispatchEvent).toBe('function');
		});

		it('is hidden after ESC key press', function () {
			window.location.hash = '#modal';

			var e = $.Event('keypress');
			e.which = 65; // ESC
			$(document).trigger(e);

			setTimeout(function () {
				expect($modal.css('opacity')).toBe('0');
			}, 0);
		});

		it('has correct scroll position', function () {
			var scrollTop = $(window).scrollTop();
			$('body').height(5555);

			window.location.hash = '#modal';

			setTimeout(function () {
				expect($(window).scrollTop()).toBe(scrollTop);
			}, 0);
			$('body').height('auto');
		});

		// Testing the event displatcher (triggerer)
		describe('dispatch event', function () {

			// Is it available and working?
			it('creates event', function () {
				var eventCalled;

				$(document).on('newEvent', function () {
					eventCalled = true;
				});

				CSSModal._dispatchEvent('newEvent', { 'id': 1 });

				expect(eventCalled).toBeTruthy();
			});

			// Is the data set as expected
			it('has event data', function () {
				var eventData;

				$(document).on('newEvent', function (e) {
					eventData = e.originalEvent.customData;
				});

				CSSModal._dispatchEvent('newEvent', { 'id': 1 });

				expect(typeof eventData.modal).toBe('object');
				expect(eventData.modal.id).toBe(1);
			});

			it('fires event when modal is shown', function () {
				var eventCalled;

				$(document).on('cssmodal:show', function () {
					eventCalled = true;
				});

				window.location.hash = '#modal';

				setTimeout(function () {
					expect(eventCalled).toBeTruthy();
				}, 0);
			});

			it('fires event when modal is hidden', function () {
				var eventCalled;

				$(document).on('cssmodal:hide', function () {
					eventCalled = true;
				});

				window.location.hash = '#modal';

				window.location.hash = '#!';

				setTimeout(function () {
					expect(eventCalled).toBeTruthy();
				}, 0);
			});
		});
	});

}(jQuery, window.CSSModal));
