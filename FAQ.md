# FAQ

## TOC

* Is it possible to show modal on page load?
* Can I open a modal via JavaScript?

## Is it possible to show modal on page load?

Yes. Just push the hash (ID of the modal) on load via JavaScript.

	window.location.hash = 'the-modals-id';

Remember to check if another hash is already set:

	if (!window.location.hash) {
	    window.location.hash = 'the-id';
	}

## Can I open a modal via JavaScript?

Yes, please see the question "Is it possible to show modal on page load?".
