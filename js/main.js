(function () {

	'use strict';

	// Hide overlay when ESC is pressed
	document.addEventListener('keyup', function (event) {
		var hash = window.location.hash.replace('#', '');

		// If hash is not set
		if (hash === '' || hash === '!') {
			return;
		}

		// If key ESC is pressed
		if (event.keyCode === 27) {
			window.location.hash = '!';
		}
	}, false);


	// When showing overlay, prevent background from scrolling
	window.addEventListener('hashchange', function () {
		var hash = window.location.hash.replace('#', '');

		// If hash is set
		if (hash !== '' && hash !== '!') {
			document.body.className += ' has-overlay';
		} else {
			document.body.className = document.body.className.replace(' has-overlay', '');
		}
	}, false);
}());
