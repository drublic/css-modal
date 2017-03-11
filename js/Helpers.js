/**
 * Helper functions
 */
class Helpers {

  /*
   * Convenience function to add a class to an element
   * @param element {Node} element to add class to
   * @param className {string}
   */
  addClass (element, className) {
    if (element && !element.className.match(className)) {
      element.className += ' ' + className;
    }
  }

  /*
   * Convenience function to remove a class from an element
   * @param element {Node} element to remove class off
   * @param className {string}
   */
  removeClass (element, className) {
    element.className = element.className.replace(className, '').replace('  ', ' ');
  }

  /**
   * Convenience function to check if an element has a class
   * @param  {Node}    element   Element to check classname on
   * @param  {string}  className Class name to check for
   * @return {Boolean}           true, if class is available on modal
   */
  hasClass (element, className) {
    return !!element.className.match(className);
  }

  /*
   * Polyfill addEventListener for IE8 (only very basic)
   * @param  {String}   event    event type
   * @param  {Node}     elements node to fire event on
   * @param  {Function} callback gets fired if event is triggered
   * @return {void}
   */
  on (event, elements, callback) {
    if (typeof event !== 'string') {
      throw new Error('Type error: `event` has to be a string');
    }

    if (typeof callback !== 'function') {
      throw new Error('Type error: `callback` has to be a function');
    }

    if (!elements) {
      return;
    }

    /**
     * Make elements an array and attach event listeners
     * If a window contains at least one (i)frame, it will behave array-like,
     *   see https://developer.mozilla.org/en-US/docs/Web/API/Window/length
     * If we don't explicitly check for window, we'll be adding the event
     * listeners to the frames instead of the root window.
     */
    if (elements === global || !elements.length) {
      elements = [elements];
    }

    // If jQuery is supported
    if (this.$) {
      this.$(elements).on(event, callback);

    // Default way to support events
    } else {
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].addEventListener) {
          elements[i].addEventListener(event, callback, false);
        }
      }
    }
  }

  /*
   * Convenience function to trigger event
   * @param event {string} event type
   * @param modal {string} id of modal that the event is triggered on
   */
  trigger (event, modal) {
    var eventTrigger;
    var eventParams = {
      detail: {
        'modal': modal
      }
    };

    // Use jQuery to fire the event if it is included
    if (this.$) {
      this.$(document).trigger(event, eventParams);

    // Use createEvent if supported (that's mostly the case)
    } else if (document.createEvent) {
      eventTrigger = document.createEvent('CustomEvent');

      eventTrigger.initCustomEvent(event, false, false, {
        'modal': modal
      });

      document.dispatchEvent(eventTrigger);

    // Use CustomEvents if supported
    } else {
      eventTrigger = new CustomEvent(event, eventParams);

      document.dispatchEvent(eventTrigger);
    }
  }

  /*
   * Convenience function to check if an element is visible
   *
   * Test idea taken from jQuery 1.3.2 source code
   *
   * @param element {Node} element to test
   * @return {boolean} is the element visible or not
   */
  isElementVisible (element) {
    return !(element.offsetWidth === 0 && element.offsetHeight === 0);
  }
}

export default Helpers;
