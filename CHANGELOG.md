# Changelog

## HEAD
* Fix jumping of the page on devices with small screens (#32)
* Fix vertical resizing for large pictures
* Fix margins around modal in resize plugin

* Fix position of close button when modal is between mobile and table
* Avoid incorrect rendering of the detail container
* Correct resizing and positioning in IE8
* Better compatiblity for IE8
* Fix magic numbers in resize script
* Add gallery thumbnail images to gallery footer
* Only activate stacked modal if there already is another modal
* Always show gallery arrows on mobile

* Add compatiblity for IE8 (use "bean" library for event handling)
* Allow the content with id 0 to be selected

* Fix max height of modal content
* Add gallery plugin
* Add a spinner
* Add resize plugin
* Add HTML5 video plugin

* Use methods for show and hide modal in HTML5 Video plugin
* Update plugin HTML5 Video to work with AMD definition

* Use a name for the main component: CSSModal
* Add focus state for close button
* Add HTML5 Shiv for IE8 in visual tests
* Add polyfill for CustomEvents
* Update node version to v0.10 when working with Travis
* Improve ARIA support
* Add FAQ for questions we get from time to time.
* Update documentation in README file
* Remove scrollbars for lt IE9 (#67)
* Separated Sass Partials. Config, Core and Theme
* Update body scrolling behavior: Prevent double scroll bar in FF and Co

* Add support to have a specific element visible when the gallery is opened
* Add polyfill for CustomEvents
* Fix modal modifier close button positions
* Separate close button position from its theme styling
* Fix close button position
* Correct handling of aria-hidden with JavaScript
* Unify close btn on mobile
* Prevent overflow in mobile modals
* Add error handling to `on` method to prevent wrong function calls
* Improve plainScreen layout
* Rename tests directory to test
* Add option to configure mobile-layout breakpoint
* Add folder plugins for extendable modules
* Modularize config, core and theme into separate files (#73)
* Update background transparency image (#67)
* Bugfix: Prevent body jump in Chrome Canary
* Add better function documentation in JavaScript
* Rewrite trigger method to use `new CustomEvent` (#56)
* Update npm dependencies
* Add different modal animation styles (#51)
* Bugfix: UTF-8 problem in Ruby 1.9.3 (#61)
* Bugfix: open modal on pageload (#46)
* Register CSSModal as module for AMD (#57)
* Prevent body from scrolling when scrolling in modal on iOS and Android (#31)
* Add function to keep focus in modal when tabbing through (#26)
* Allow multiple, stackable modals (#20)
* Apply all functions directly on the modal-object
* Rename function `_dispatchEvent` to `trigger`
* Rename function `_addEventListener` to `on`
* Move set and unset of modal in own function
* Add convenience functions to add and remove classes on elements
* Add native style momentum scrolling to content area

## 1.0.4 - 27.06.2013

* Remove and add is-active-class properly on modals (#44)
* Change × for its hex code (\00d7) to avoid causing problems during minification (#43)

## 1.0.3 - 04.06.2013

* Rewrite addEventListener polyfill to work with elements other than document
* Fire an event if page loads with hash (#37)
* Add string for close button on mobile as data-attribute (#39)

## 1.0.2 - 21.05.2013

* Overwrite IE8 hack for IE9 and 10 to get modal working without JS (#33)
* Minor clean up of Sass and JS

## 1.0.1 - 10.05.2013

* Prevent page from jumping when opening a modal (#24)
* Remove an error when a hash has no HTML element associate (#27)
* Remove check if modal contains an id on focus - it is not necessary (#25)
* Rename component.json to bower.json to match new bower spec

## 1.0.0 - 05.05.2013

* Initial Release
