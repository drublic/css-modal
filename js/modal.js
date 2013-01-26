/*!
 * CSS Modal
 * http://drublic.github.com/css-modal
 *
 * @author Hans Christian Reinl - @drublic
 * @version 1.0
 */

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
		var hash = window.location.hash.replace('#', ''),
		    modalChild;

		// If hash is set
		if (hash !== '' && hash !== '!') {

			// Get first element in selected element
			modalChild = document.getElementById(hash).firstElementChild;

			// When we deal with a modal and class `has-overlay` is not set on body yet
			if (modalChild.className.match(/modal-inner/) && !document.body.className.match(/has-overlay/)) {
				document.body.className += ' has-overlay';
			}
		} else {
			document.body.className = document.body.className.replace(' has-overlay', '');
		}
	}, false);
}());
