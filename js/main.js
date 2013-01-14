(function () {

	'use strict';

	// Hide overlay when ESC is pressed
	document.addEventListener('keyup', function (event) {
		var hash = window.location.hash;

		// If hash is not set
		if (hash === '' || hash === "!") {
			return;
		}

		// If key ESC is pressed
		if (event.keyCode === 27) {
			window.location.hash = '!';
		}

	}, false);
}());
