const fs = require('fs');
const path = require('path');
const contentPath = path.resolve(__dirname, './visual/index.html');
const modalContent = fs.readFileSync(contentPath);

const isCssValue = (element, property, value) => {
  const style = window.getComputedStyle(element);

  return (style[property] === value);
};


// Testing if the modal works in general
describe('Modal', () => {
  document.documentElement.innerHTML += modalContent;

  const $modal = document.querySelector('#modal');

  // Reset location hash after each test
  afterEach(() => {
    window.location.hash = '';
  });

  it('is hidden', () => {
    const returnValue = isCssValue($modal, 'opacity', '0');
    expect(returnValue).toBe(true);
  });

  it('is hidden when hash is #!', () => {
    window.location.hash = '#!';
    const returnValue = isCssValue($modal, 'opacity', '0');
    expect(returnValue).toBe(true);
  });

  it('is visible when hash is set', () => {
    window.location.hash = '#modal';

    const returnValue = isCssValue($modal, 'opacity', '1');
    expect(returnValue).toBe(true);
  });

  it('has class is-active when hash is set', () => {
    window.location.hash = '#modal';

    expect($modal.classList.has('is-active')).toBe(true);
  });

  it('has not class is-active when hash is #!', () => {
    window.location.hash = '#!';

    expect($modal.classList.has('is-active')).not.toBe(true);
  });

  // aria-hidden values tests
  describe('aria-hidden', () => {
    it('has aria-hidden true when is hidden', () => {
      setTimeout(() => {
        expect($modal.attr('aria-hidden')).toBe('true');
      }, 0);
    });

    it('has aria-hidden false when is visible when hash is set', () => {
      window.location.hash = '#modal';

      setTimeout(() => {
        expect($modal.attr('aria-hidden')).toBe('false');
      }, 0);
    });

    it('has aria-hidden true when is hidden when hash is #!', () => {
      window.location.hash = '#!';
      setTimeout(() => {
        expect($modal.attr('aria-hidden')).toBe('true');
      }, 0);
    });
  });

  // Class helper functions
  describe('classes', () => {

    it('adds class to an element', () => {
      var docClasses;

      CSSModal.addClass(document.documentElement, 'test-class');

      docClasses = document.documentElement.className;
      expect(docClasses).toMatch(' test-class');
    });

    it('removes class on element', () => {
      var docClasses;

      CSSModal.removeClass(document.documentElement, 'test-class');

      docClasses = document.documentElement.className;
      expect(docClasses).not.toMatch(' test-class');
    });
  });


  // All functions for events
  describe('event functions', () => {

    it('has event listener stub', () => {
      expect(typeof CSSModal.on).toBe('function');
    });

    it('has event triggerer', () => {
      expect(typeof CSSModal.trigger).toBe('function');
    });

    it('is hidden after ESC key press', () => {
      window.location.hash = '#modal';

      var e = $.Event('keypress');
      e.which = 65; // ESC
      $(document).trigger(e);

      setTimeout(() => {
        expect($modal.css('opacity')).toBe('0');
      }, 0);
    });

    // Double check
    it('has correct scroll position', () => {
      var scrollTop = $(window).scrollTop();
      $('body').height(5555);

      window.location.hash = '#modal';

      setTimeout(() => {
        expect($(window).scrollTop()).toBe(scrollTop);
      }, 0);
      $('body').height('auto');
    });
  });


  // Testing the event displatcher (triggerer)
  describe('dispatch event', () => {

    beforeEach(() => {
      $ = jQuery;
    });

    // Is it available and working?
    it('creates event', () => {
      var eventCalled;

      $(document).on('newEvent', () => {
        eventCalled = true;
      });

      CSSModal.trigger('newEvent', { 'id': 1 });

      setTimeout(() => {
        expect(eventCalled).toBeTruthy();
      }, 0);
    });

    // Is the data set as expected
    it('has event data (jQuery)', () => {
      var eventData;

      $(document).on('newEvent', function (e, data) {
        eventData = data.detail;
      });

      CSSModal.trigger('newEvent', { 'id': 1 });

      setTimeout(() => {
        expect(typeof eventData.modal).toBe('object');
        expect(eventData.modal.id).toBe(1);
      }, 0);
    });

    it('has event data (none jQuery)', () => {
      var eventData;

      $(document).on('newEvent', function (e, data) {
        eventData = data.detail;
      });

      $ = false;

      CSSModal.trigger('newEvent', { 'id': 1 });

      setTimeout(() => {
        expect(typeof eventData.modal).toBe('object');
        expect(eventData.modal.id).toBe(1);
      }, 0);
    });

    it('fires event when modal is shown', () => {
      var eventCalled;

      $(document).on('cssmodal:show', () => {
        eventCalled = true;
      });

      window.location.hash = '#modal';

      setTimeout(() => {
        expect(eventCalled).toBeTruthy();
      }, 0);
    });

    it('fires event when modal is hidden', () => {
      var eventCalled;

      $(document).on('cssmodal:hide', () => {
        eventCalled = true;
      });

      window.location.hash = '#modal';

      window.location.hash = '#!';

      setTimeout(() => {
        expect(eventCalled).toBeTruthy();
      }, 0);
    });
  });


  // Stackable modals
  describe('Stackable Modal', () => {

    it('has class is-stacked', () => {
      window.location.hash = '#modal';
      window.location.hash = '#stackable';

      setTimeout(() => {
        expect($modal.hasClass('is-stacked')).toBe(true);
      }, 0);
    });

    // FIXME: Issue unrelated to iframes
    xit('shows unstacked modal after close', () => {
      window.location.hash = '#modal';
      window.location.hash = '#stackable';

      $('#stackable .modal-close').trigger('click');

      setTimeout(() => {
        expect($modal.hasClass('is-stacked')).not.toBe(true);
        expect($modal.hasClass('is-active')).toBe(true);
      }, 0);
    });

    it('does not stack when defined', () => {
      window.location.hash = '#modal';
      window.location.hash = '#non-stackable';

      expect($modal.hasClass('is-stacked')).not.toBe(true);
    });


  });
});
