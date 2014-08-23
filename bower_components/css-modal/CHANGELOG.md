# Changelog

## HEAD

## 1.1.8 - 20.06.2014
* Use innerHTML instead of innerText in order to add styling rule

## 1.1.7 - 20.06.2014
* Add document.createEvent for creating events in oldIE
* Make _injectStyles compatible with legacy browsers

## 1.1.6 - 06.06.2014
* Fix position of close button on small screens
* Check if activeElement is available in max-width

## 1.1.5 - 05.06.2014
* Fix scrolling on touch devices

## 1.1.4 - 05.06.2014
* Fix max-width plugin to work on all sizes and listen to resize

## 1.1.3 - 05.06.2014
* Call init() if neither requirejs nor NPM is available

## 1.1.2 - 05.06.2014
* Modal-Stretch: Don't set height for .modal-content when modal is streched on small devices

## 1.1.1 - 04.06.2014
* Listen to events in the AMD callback, not during load time

## 1.1.0 - 04.06.2014

### New features

* Add different modal animation styles (#51)
* Register CSSModal as module for AMD (#57)
* Add function to keep focus in modal when tabbing through (#26)
* Allow multiple, stackable modals (#20)

### Improvements

* Use a name for the main component: CSSModal
* Add gallery thumbnail images to gallery footer
* Add focus state for close button
* Better compatiblity for IE8
* Add polyfill for event.preventDefault to work with IE8
* Add compatiblity for IE8 (use "bean" library for event handling)
* Only activate stacked modal if there already is another modal
* Add HTML5 Shiv for IE8 in visual tests
* Improve ARIA support
* Unify close btn on mobile
* Add error handling to `on` method to prevent wrong function calls
* Add option to configure mobile-layout breakpoint
* Modularize config, core and theme into separate files (#73)
* Update background transparency image (#67)
* Rewrite trigger method to use `new CustomEvent` (#56)
* Apply all functions directly on the modal-object
* Rename function `_dispatchEvent` to `trigger`
* Rename function `_addEventListener` to `on`
* Move set and unset of modal in own function
* Add convenience functions to add and remove classes on elements
* Add native style momentum scrolling to content area

### Plugins

* Add folder plugins for extendable modules
* Add plugin to stretch a modal to 80% of the screen height
* Implement max width for modal via data attribute
* Add gallery plugin
* Add a spinner
* Add resize plugin
* Add HTML5 video plugin

### Bugfixes

* The user can now load/mock Bean during the runtime
* Fix jumping of the page on devices with small screens (#32)
* Update body scrolling behavior: Prevent double scroll bar in FF and Co
* Remove scrollbars for lt IE9 (#67)
* Fix close button position
* Correct handling of aria-hidden with JavaScript
* Prevent overflow in mobile modals
* Bugfix: Prevent body jump in Chrome Canary
* Bugfix: UTF-8 problem in Ruby 1.9.3 (#61)
* Bugfix: open modal on pageload (#46)
* Prevent body from scrolling when scrolling in modal on iOS and Android (#31)

### Other

* Add FAQ for questions we get from time to time
* Update documentation
* Rename tests directory to test
* Add better function documentation in JavaScript
* Update node version to v0.10 when working with Travis
* Update npm dependencies


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
