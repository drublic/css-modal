# Changelog

## HEAD

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
