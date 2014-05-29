# CSS Modals [![Build Status](https://secure.travis-ci.org/drublic/css-modal.png?branch=master)](http://travis-ci.org/drublic/css-modal)

Modals built out of pure CSS

Please [visit the website](http://drublic.github.io/css-modal) to read more
about this project and refer to the [FAQ](FAQ.md) in case of a question.

## What is it

__Built with pure CSS:__ CSS Modal is built out of pure CSS. JavaScript is only
for sugar. This makes them perfectly accessible.

__Optimized for mobile:__ The modals are designed using responsive web design
methods. They work on all screen sizes from a small mobile phone up to high
resolution screens.

__Use as Sass plugin:__ You can use CSS Modal as [Sass](http://sass-lang.com/)
plugin and apply it to your custom classes. No need to understand all the code.

__A few other advantages:__ accessible, cross-browser, media-adaptive, small and
fast!


## How to use

### Markup

You need to include the markup and content for modals in you website. This has
a positive effect on SEO. The example code:

	<section class="semantic-content" id="modal-text" tabindex="-1"
	        role="dialog" aria-labelledby="modal-label" aria-hidden="true">

	    <div class="modal-inner">
	        <header id="modal-label"><!-- Header --></header>
	        <div class="modal-content"><!-- The modals content --></div>
	        <footer><!-- Footer --></footer>
	    </div>

	    <a href="#!" class="modal-close" title="Close this modal" data-close="Close"
	        data-dismiss="modal">×</a>
	</section>

Using header and footer is optional. Just remove the tags if you don't want them
in a modal.

You should leave the link's href attribute that way to close the modal in order
to prevent the page from scrolling to top when clicking on it.

Please remember to set a unique ID for the header and change the
`aria-labelledby` attribute to the same value.

### Sass

If you use Sass you can use the file [modal.scss](modal.scss) and include it
into your project. Here is an example:

	@import "modules/modal";

CSS Modals uses Sass's placeholders. You can use them by calling them via
@extend in your modal's class name. The snippet looks something like that:

	.my-awesome-class-name {
	    @extend %modal;
	}

### JavaScript

As stated above you don't need JavaScript to get a good experience out of CSS
Modals. But there are some issues where JavaScript helps:

* IE 8 compatibility.
* Pressing escape: If you press ESC on your keyboard while the modal is visible
it closes itself. This behavior cannot be done with CSS only.
* Preventing background page from scrolling: If you scroll within the modal and
you reach the end you don't want the page in the background to scroll. To prevent
this JavaScript pushs a CSS class selector to the body element.
* Being accessible: To get the browser's focus to the modal and back after
closing.
* Fireing events: When a modal opens a custom event is fired called cssmodal:show.
When the modal is hidden, an event called cssmodal:hide is triggered.
* To add this behavior to your website, please include the JavaScript file
modal.js right before the closing body-tag:

	<script src="js/modal.js"></script>


## Browser Support

This modal is designed to work on all modern browsers. Unfortunately this does
not include Internet Explorer 7 or lower. But we deal with IE 8 – well,… at
least it works.

On mobile Safari for iOS and Android 4+ it is tested pretty well, while Android
2.3 has some problems (biggest issue
[is scrolling](https://github.com/drublic/css-modal/issues/4)).
It's also working on Windows Phone 8.

In numbers: Chrome, Firefox, Safari 6, Opera 12, IE8 (functional), IE9+. And
iOS 6, Android 2.3+.


## Media

Please be aware that you need to stop playing videos or audio manually after
hiding the modal. We have [a plugin](plugins/html5video.js) for this though.

## Events

There is an event `cssmodal:show` fired on the modal itself after the modal is
shown. Another event `cssmodal:hide` is fired after the modal is hidden.

You can use the events by subscribing to them as if they were click events or
something. Here is an example using jQuery:

	$(document).on('cssmodal:show', function (event) {
		console.log(event);
	});

There events are not fired in IE8. Please be aware of that and use jQuery or
something else to create custom events.


## Plugins

We have a couple for the modal to enhance it:

* Resize - Resizes modal to size of input elements
* Gallery - A lightbox plugin (in connection with resize)
* HTML5 Video - Load videos within the modal
* Maximum Width - Set a custom maximum width on a per-modal basis


## Bug reports and feature requests

If you got something that's worth including into the project please
[open an issue](https://github.com/drublic/css-modal/issues) for further
discussion.

Please see the [section on contributing](http://drublic.github.io/css-modal/#contributing)
on the website.


## Contributors

This is a project by [Hans Christian Reinl](http://drublic.de). Thanks goes out
to [all other contributors](https://github.com/drublic/css-modal/contributors).


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/drublic/css-modal/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

