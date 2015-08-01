# CSS Modals [![Build Status](https://secure.travis-ci.org/drublic/css-modal.png?branch=master)](http://travis-ci.org/drublic/css-modal)

Modals built out of pure CSS

Please [visit the website](http://drublic.github.io/css-modal) to read more
about this project and refer to the [FAQ](FAQ.md) in case of a question.

## [Gratipay me](https://gratipay.com/drublic)
(aka. Gittip) if you enjoy this plugin.

## What is it

**Built with pure CSS:** CSS Modal is built out of pure CSS. JavaScript is only
for sugar. This makes them perfectly accessible.

**Optimized for mobile:** The modals are designed using responsive web design
methods. They work on all screen sizes from a small mobile phone up to high
resolution screens.

**Use as Sass plugin:** You can use CSS Modal as [Sass](http://sass-lang.com/)
plugin and apply it to your custom classes. No need to understand all the code.

**A few other advantages:** Accessible, cross-browser, media-adaptive, small and
fast!


## How to use

Please be aware that modals get stacked above each other if you open one modal
from within another. You can add a data-attribute `data-stackable="false"` to
the modal in order to make it non-stackable.

### Markup

You need to include the markup and content for modals in your website. This has
a positive effect on SEO. The example code:

```html
<section class="modal--show" id="modal-text" tabindex="-1"
        role="dialog" aria-labelledby="modal-label" aria-hidden="true">

    <div class="modal-inner">
        <header id="modal-label"><!-- Header --></header>
        <div class="modal-content"><!-- The modals content --></div>
        <footer><!-- Footer --></footer>
    </div>

    <a href="#!" class="modal-close" title="Close this modal" data-close="Close"
        data-dismiss="modal">?</a>
</section>
```

The `id` attribute is the one which identifies the modal. You can link to this
ID from everywhere.

> Please note that the ID cannot include the `/` character since this one is
needed for identifying stacked modals.

Using header and footer is optional. Just remove the tags if you don't want them
in a modal.

You should leave the link's href attribute that way to close the modal in order
to prevent the page from scrolling to top when clicking on it.

Please remember to set a unique ID for the header and change the
`aria-labelledby` attribute to the same value.

You link to a modal by simply setting the ID to a link element's `href` like this:

```html
<a href="#modal">Modal</a>
```

If you want to decouple the modal call from the location's hash you need to add
`data-cssmodal-nohash` to the link.

### Sass

If you use Sass you can use the file [modal.scss](modal.scss) and include it
into your project. Here is an example:

```scss
@import "modules/modal";
```

CSS Modals uses Sass's placeholders. You can use them by calling them via
@extend in your modal's class name. The snippet looks something like that:

```scss
.my-awesome-class-name {
    @extend %modal;
}
```

### JavaScript

As stated above you don't need JavaScript to get a good experience out of CSS
Modals. But there are some issues where JavaScript helps:

* IE 8 compatibility (please include jQuery if you need full compatibility).
* Pressing escape: If you press <kbd>ESC</kbd> on your keyboard while the modal is visible
it closes itself. This behavior cannot be achieved with CSS only.
* Preventing background page from scrolling: If you scroll within the modal and
you reach the end you don't want the page in the background to scroll. To
prevent this JavaScript pushes a CSS class selector to the body element.
* Being accessible: To get the browser's focus to the modal and back after
closing.
* Firing events: When a modal opens a custom event is fired called
`cssmodal:show`. When the modal is hidden, an event called `cssmodal:hide` is
triggered.
* To add this behavior to your website, please include the JavaScript file
modal.js right before the closing body-tag:

```html
<script src="js/modal.js"></script>
```


## Browser Support

This modal is designed to work on all modern browsers. Unfortunately this does
not include Internet Explorer 7 or lower. But we deal with IE 8 – well,… at
least it works.

On mobile Safari for iOS and Android 4+ it is tested pretty well, while Android
2.3 has some problems (biggest issue
[is scrolling](https://github.com/drublic/css-modal/issues/4)).
It's also working on Windows Phone 8.

In numbers:

* Chrome
* Firefox
* Safari 6.x
* Opera 12+
* Internet Explorer 8 (functional, include jQuery if you want support for
  events)
* Internet Explorer 9+
* iOS 6
* Android 2.3 (functional)
* Android 4.x
* Windows Phone 8

## Media

Please be aware that you need to stop playing videos or audio manually after
hiding the modal. We have [a plugin](plugins/html5video.js) for this though.

## Events

There is an event `cssmodal:show` fired on the modal itself after the modal is
shown. Another event `cssmodal:hide` is fired after the modal is hidden.

You can use the events by subscribing to them as if they were click events or
something. Here is an example using jQuery:

```js
$(document).on('cssmodal:show', function (event) {
    console.log(event);
});
```

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
