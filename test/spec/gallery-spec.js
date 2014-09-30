/*global describe, it, expect, Event, waits, runs, afterEach, CSSModal*/
(function ($) {

	'use strict';

	// Testing if the modal works in general
	describe('Gallery plugin', function () {

		// Hide the last open gallery
		afterEach(function () {
			window.location.hash = '';
		});

		it('can open a modal', function () {
			runs(function () {
				var element = $('ul > li').eq(1).find('a').get(0);
				var event = new MouseEvent('click', {'cancelable': true});
				element.dispatchEvent(event);

				setTimeout(function () {
					expect($('#modal-gallery-boring').css('opacity')).toBe('1');
				}, 500);
			});

			waits(750);
		});

		it('can navigate forwards by clicking', function () {
			runs(function () {
				var element = $('#modal-gallery-boring .modal--gallery-navigation-next').get(0);
				var event = new MouseEvent('click', {'cancelable': true});
				element.dispatchEvent(event);

				event = new Event('click', {'cancelable': true});
				element.dispatchEvent(event);

				window.setTimeout(function () {
					var src = $('#modal-gallery-boring .modal-detail img').attr('src');
					expect(src).toEqual('http://dummyimage.com/400x300&text=3+-+6-consectetur');
				}, 0);
			});

			waits(20);
		});

		it('can navigate backwards by clicking', function () {
			runs(function () {
				var element = $('#modal-gallery-boring .modal--gallery-navigation-prev').get(0);
				var event = new MouseEvent('click', {'cancelable': true});
				element.dispatchEvent(event);

				window.setTimeout(function () {
					var src = $('#modal-gallery-boring .modal-detail img').attr('src');
					expect(src).toEqual('http://dummyimage.com/400x300&text=2+-+6-dolor+sit+amet');
				}, 0);
			});

			waits(10);
		});

		it('can close the gallery', function () {
			runs(function () {
				var element = $('#modal-gallery-boring .modal-close').get(0);
				var event = new MouseEvent('click', {'cancelable': true});
				element.dispatchEvent(event);
				setTimeout(function () {
					expect($('#modal-gallery-boring').css('opacity')).toBe('0');
				}, 750);
			});

			waits(800);
		});

		it('can open a diffent gallery', function () {
			runs(function () {
				var element = $('ul > li').eq(0).find('a').get(0);
				var event = new MouseEvent('click', {'cancelable': true});
				element.dispatchEvent(event);

				setTimeout(function () {
					expect($('#modal-gallery').css('opacity')).toBe('1');
					var src = $('#modal-gallery .modal-detail img').attr('src');
					expect(src).toMatch('http://placekitten.com/440/300');
				}, 500);
			});

			waits(750);
		});

		it('restores the first gallery correctly, after it had been closed', function () {
			runs(function () {
				window.setTimeout(function () {
					var element = $('#modal-gallery .modal--gallery-navigation-next').get(0);
					var event = new MouseEvent('click', {'cancelable': true});
					element.dispatchEvent(event);

					element = $('#modal-gallery .modal-close').get(0);
					event = new Event('click', {'cancelable': true});
					element.dispatchEvent(event);
				}, 20);

				window.setTimeout(function () {
					var element = $('ul > li').eq(1).find('a').get(0);
					var event = new MouseEvent('click', {'cancelable': true});
					element.dispatchEvent(event);

					var src = $('#modal-gallery-boring .modal-detail img').attr('src');
					expect(src).toEqual('http://dummyimage.com/400x300&text=2+-+6-dolor+sit+amet');
				}, 40);
			});

			waits(100);
		});

		it('throws an error if a modal with the given ID does not exist', function () {
			try {
				document.location.href = '#modal-gallery-error/2';
				expect(CSSModal.mainHandler()).toThrow();
			} catch (exception) {
				// we want this exception to be thrown
			}
		});

		it('sets caption on element', function () {
			runs(function () {
				window.setTimeout(function () {
					var $element = $('#modal-gallery-boring');

					window.location.hash = '#modal-gallery-boring';

					CSSModal.setCaption('test');

					expect($element.find('.modal--gallery-caption').text()).toEqual('test');
				}, 40);
			});

			waits(100);
		});
	});

}(jQuery, window.CSSModal));
