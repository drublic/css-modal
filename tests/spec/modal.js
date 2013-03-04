/*global describe, it, expect */
describe('Modal', function () {

	'use strict';

	it('does not do anything for empty hash', function () {
		window.location.hash = '';

		expect(true).toBe(true);
	});
});
