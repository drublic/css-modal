/**
 * CSS Modal
 * http://drublic.github.com/css-modal
 *
 * @author Hans Christian Reinl - @drublic
 */

import Helpers from './Helpers.js';

/*
 * Storage for functions and attributes
 */
class CSSModal {
  constructor () {
    /**
     * Helpers class
     * @type {Helpers}
     */
    this.Helpers = new Helpers();

    /**
     * Store for currently active element
     * @type {Element}
     */
    this.activeElement = undefined;

    /**
     * Store for last active elemet
     * @type {Element}
     */
    this.lastActive = undefined;

    /**
     * Store for stacked elements
     * @type {Array}
     */
    this.stackedElements = [];

    /**
     * All elements that can get focus, can be tabbed in a modal
     * @type {Array}
     */
    this.tabbableElements = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]'
    ];

    // We use jQuery if the browser doesn't support CustomEvents
    if (!window.CustomEvent && !window.$) {
      throw new Error('This browser doesn\'t support CustomEvent - please include jQuery.');
    }

    /**
     * All events
     */
    this.events();

    /**
     * Inject iframes
     */
    this.injectIframes();
  }

  /*
   * Unfocus
   */
  removeFocus () {
    if (this.lastActive) {
      this.lastActive.focus();
    }
  }

  /*
   * Keep focus inside the modal
   */
  keepFocus () {
    let element = this.activeElement;
    let allTabbableElements = [];

    // Don't keep the focus if the browser is unable to support
    // CSS3 selectors
    try {
      allTabbableElements = element.querySelectorAll(this.tabbableElements.join(','));
    } catch (ex) {
      return;
    }

    let firstTabbableElement = this.getFirstElementVisible(allTabbableElements);
    let lastTabbableElement = this.getLastElementVisible(allTabbableElements);

    let focusHandler = (event) => {
      var keyCode = event.which || event.keyCode;

      // TAB pressed
      if (keyCode !== 9) {
        return;
      }

      // Polyfill to prevent the default behavior of events
      event.preventDefault = event.preventDefault || function () {
        event.returnValue = false;
      };

      // Move focus to first element that can be tabbed if Shift isn't used
      if (event.target === lastTabbableElement && !event.shiftKey) {
        event.preventDefault();
        firstTabbableElement.focus();

      // Move focus to last element that can be tabbed if Shift is used
      } else if (event.target === firstTabbableElement && event.shiftKey) {
        event.preventDefault();
        lastTabbableElement.focus();
      }
    };

    this.Helpers.on('keydown', element, focusHandler);
  }

  /*
   * Return the first visible element of a nodeList
   *
   * @param nodeList The nodelist to parse
   * @return {Node|null} Returns a specific node or null if no element found
   */
  getFirstElementVisible (nodeList) {
    let nodeListLength = nodeList.length;

    // If the first item is not visible
    if (!this.Helpers.isElementVisible(nodeList[0])) {
      for (let i = 1; i < nodeListLength - 1; i++) {

        // Iterate elements in the NodeList, return the first visible
        if (this.Helpers.isElementVisible(nodeList[i])) {
          return nodeList[i];
        }
      }
    } else {
      return nodeList[0];
    }

    return null;
  }

  /*
   * Return the last visible element of a nodeList
   *
   * @param nodeList The nodelist to parse
   * @return {Node|null} Returns a specific node or null if no element found
   */
  getLastElementVisible (nodeList) {
    var nodeListLength = nodeList.length;
    var lastTabbableElement = nodeList[nodeListLength - 1];

    // If the last item is not visible
    if (!this.Helpers.isElementVisible(lastTabbableElement)) {
      for (let i = nodeListLength - 1; i >= 0; i--) {

        // Iterate elements in the NodeList, return the first visible
        if (this.Helpers.isElementVisible(nodeList[i])) {
          return nodeList[i];
        }
      }
    } else {
      return lastTabbableElement;
    }

    return null;
  }

  /*
   * Focus modal
   */
  setFocus () {
    if (this.activeElement) {

      // Set element with last focus
      this.lastActive = document.activeElement;

      // New focussing
      this.activeElement.focus();

      // Add handler to keep the focus
      this.keepFocus();
    }
  }

  /*
   * Mark modal as active
   * @param element {Node} element to set active
   */
  setActive (element) {
    this.Helpers.addClass(element, 'is-active');
    this.activeElement = element;

    // Update aria-hidden
    this.activeElement.setAttribute('aria-hidden', 'false');

    // Set the focus to the modal
    this.setFocus();

    // Fire an event
    this.Helpers.trigger('cssmodal:show', this.activeElement);
  }

  /*
   * Unset previous active modal
   * @param isStacked          {boolean} `true` if element is stacked above another
   * @param shouldNotBeStacked {boolean} `true` if next element should be stacked
   */
  unsetActive (isStacked = false, shouldNotBeStacked = false) {
    this.Helpers.removeClass(document.documentElement, 'has-overlay');

    if (this.activeElement) {
      this.Helpers.removeClass(this.activeElement, 'is-active');

      // Fire an event
      this.Helpers.trigger('cssmodal:hide', this.activeElement);

      // Update aria-hidden
      this.activeElement.setAttribute('aria-hidden', 'true');

      // Unfocus
      this.removeFocus();

      // Make modal stacked if needed
      if (isStacked && !shouldNotBeStacked) {
        this.stackModal(this.activeElement);
      }

      // If there are any stacked elements
      if (!isStacked && this.stackedElements.length > 0) {
        this.unstackModal();
      }

      // Reset active element
      this.activeElement = null;
    }
  }

  /*
   * Stackable modal
   * @param stackableModal {node} element to be stacked
   */
  stackModal (stackableModal) {
    this.Helpers.addClass(stackableModal, 'is-stacked');

    // Set modal as stacked
    this.stackedElements.push(this.activeElement);
  }

  /*
   * Reactivate stacked modal
   */
  unstackModal () {
    var stackedCount = this.stackedElements.length;
    var lastStacked = this.stackedElements[stackedCount - 1];

    this.Helpers.removeClass(lastStacked, 'is-stacked');

    // Set hash to modal, activates the modal automatically
    global.location.hash = lastStacked.id;

    // Remove modal from stackedElements array
    this.stackedElements.splice(stackedCount - 1, 1);
  }

  /*
   * When displaying modal, prevent background from scrolling
   * @param  {Object} event The incoming hashChange event
   * @return {void}
   */
  mainHandler (event, noHash) {
    let hash = window.location.hash.replace('#', '');
    let index = 0;
    let tmp = [];
    let modalElement;
    let modalChild;

    // JS-only: no hash present
    if (noHash) {
      hash = event.currentTarget.getAttribute('href').replace('#', '');
    }

    modalElement = document.getElementById(hash);

    // Check if the hash contains an index
    if (hash.indexOf('/') !== -1) {
      tmp = hash.split('/');
      index = tmp.pop();
      hash = tmp.join('/');

      // Remove the index from the hash...
      modalElement = document.getElementById(hash);

      // ... and store the index as a number on the element to
      // make it accessible for plugins
      if (!modalElement) {
        throw new Error('ReferenceError: element "' + hash + '" does not exist!');
      }

      modalElement.index = (1 * index);
    }

    // If the hash element exists
    if (modalElement) {
      event.preventDefault();

      // Get first element in selected element
      modalChild = modalElement.children[0];

      // When we deal with a modal and body-class `has-overlay` is not set
      if (modalChild && modalChild.className.match(/css-modal_inner/)) {

        // Make previous element stackable if it is not the same modal
        this.unsetActive(
          !this.Helpers.hasClass(modalElement, 'is-active'),
          (modalElement.getAttribute('data-stackable') === 'false')
        );

        // Set an html class to prevent scrolling
        this.Helpers.addClass(document.documentElement, 'has-overlay');

        // Set scroll position for modal
        this._currentScrollPositionY = global.scrollY;
        this._currentScrollPositionX = global.scrollX;

        // Mark the active element
        this.setActive(modalElement);
        this.activeElement._noHash = noHash;
      }
    } else {

      // If activeElement is already defined, delete it
      this.unsetActive();
    }

    return true;
  }

  /**
   * Inject iframes
   */
  injectIframes () {
    var iframes = document.querySelectorAll('[data-iframe-src]');
    var iframe;
    var i = 0;

    for (; i < iframes.length; i++) {
      iframe = document.createElement('iframe');

      iframe.src = iframes[i].getAttribute('data-iframe-src');
      iframe.setAttribute('webkitallowfullscreen', true);
      iframe.setAttribute('mozallowfullscreen', true);
      iframe.setAttribute('allowfullscreen', true);

      iframes[i].appendChild(iframe);
    }
  }

  /**
   * Keyup event triggered
   * @param  {Event} event Event that was triggered
   * @return {void}
   */
  onKeyup (event) {
    let hash = window.location.hash.replace('#', '');

    // If key ESC is pressed
    if (event.keyCode === 27) {
      if (this.activeElement && hash === this.activeElement.id) {
        window.location.hash = '!';
      } else {
        this.unsetActive();
      }

      if (this.lastActive) {
        return false;
      }

      // Unfocus
      this.removeFocus();
    }
  }

  /**
   * Listen to all relevant events
   * @return {void}
   */
  events () {

    /*
     * Hide overlay when ESC is pressed
     */
    this.Helpers.on('keyup', document, this.onKeyup.bind(this), false);

    /**
     * Trigger main handler on click if hash is deactivated
     */
    let noHashElements = document.querySelectorAll('[data-cssmodal-nohash]');
    this.Helpers.on('click', noHashElements, (event) => this.mainHandler(event, true));

    // And close modal without hash
    this.Helpers.on('click', document.querySelectorAll('.css-modal_close'), (event) => {
      if (this.activeElement._noHash) {
        this.mainHandler(event, true);
      }
    });

    /*
     * Trigger main handler on load and hashchange
     */
    this.Helpers.on('hashchange', window, this.mainHandler.bind(this));
    this.Helpers.on('load', window, this.mainHandler.bind(this));

    /**
     * Prevent scrolling when modal is active
     * @return {void}
     */
    window.onscroll = window.onmousewheel = function () {
      if (document.documentElement.className.match(/has-overlay/)) {
        window.scrollTo(this._currentScrollPositionX, this._currentScrollPositionY);
      }
    };
  }
}

export default CSSModal;
