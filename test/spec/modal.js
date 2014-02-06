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

		it('has class is-active when hash is set', function () {
			window.location.hash = '#modal';

			setTimeout(function () {
				expect($modal.hasClass('is-active')).toBe(true);
			}, 0);
		});

		it('has not class is-active when hash is #!', function () {
			window.location.hash = '#!';

			setTimeout(function () {
				expect($modal.hasClass('is-active')).not.toBe(true);
			}, 0);
		});

		// aria-hidden values tests
		describe('aria-hidden', function () {
			it('has aria-hidden true when is hidden', function () {
				setTimeout(function () {
					expect($modal.attr('aria-hidden')).toBe('true');
				}, 0);
			});

			it('has aria-hidden false when is visible when hash is set', function () {
				window.location.hash = '#modal';

				setTimeout(function () {
					expect($modal.attr('aria-hidden')).toBe('false');
				}, 0);
			});

			it('has aria-hidden true when is hidden when hash is #!', function () {
				window.location.hash = '#!';
				setTimeout(function () {
					expect($modal.attr('aria-hidden')).toBe('true');
				}, 0);
			});
		});

		// Class helper functions
		describe('classes', function () {

			it('adds class to an element', function () {
				var docClasses;

				CSSModal.addClass(document.documentElement, 'test-class');

				docClasses = document.documentElement.className;
				expect(docClasses).toMatch(' test-class');
			});

			it('removes class on element', function () {
				var docClasses;

				CSSModal.removeClass(document.documentElement, 'test-class');

				docClasses = document.documentElement.className;
				expect(docClasses).not.toMatch(' test-class');
			});
		});


		// All functions for events
		describe('event functions', function () {

			it('has event listener stub', function () {
				expect(typeof CSSModal.on).toBe('function');
			});

			it('has event triggerer', function () {
				expect(typeof CSSModal.trigger).toBe('function');
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

			// Double check
			it('has correct scroll position', function () {
				var scrollTop = $(window).scrollTop();
				$('body').height(5555);

				window.location.hash = '#modal';

				setTimeout(function () {
					expect($(window).scrollTop()).toBe(scrollTop);
				}, 0);
				$('body').height('auto');
			});
		});


		// Testing the event displatcher (triggerer)
		describe('dispatch event', function () {

			// Is it available and working?
			it('creates event', function () {
				var eventCalled;

				$(document).on('newEvent', function () {
					eventCalled = true;
				});

				CSSModal.trigger('newEvent', { 'id': 1 });

				setTimeout(function () {
					expect(eventCalled).toBeTruthy();
				}, 0);
			});

			// Is the data set as expected
			it('has event data', function () {
				var eventData;

				$(document).on('newEvent', function (e) {
					eventData = e.originalEvent.detail;
				});

				CSSModal.trigger('newEvent', { 'id': 1 });

				setTimeout(function () {
					expect(typeof eventData.modal).toBe('object');
					expect(eventData.modal.id).toBe(1);
				}, 0);
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


		// Stackable modals
		describe('Stackable Modal', function () {

			it('has class is-stacked', function () {
				window.location.hash = '#modal';
				window.location.hash = '#stackable';

				setTimeout(function () {
					expect($modal.hasClass('is-stacked')).toBe(true);
				}, 0);
			});

			it('shows unstacked modal after close', function () {
				window.location.hash = '#modal';
				window.location.hash = '#stackable';

				$('#stackable .modal-close').trigger('click');

				setTimeout(function () {
					expect($modal.hasClass('is-stacked')).not.toBe(true);
					expect($modal.hasClass('is-active')).toBe(true);
				}, 0);
			});


		});
	});

}(jQuery, window.CSSModal));
