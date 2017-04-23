CSSModal/*
 * CSS Modal Plugin for displaying an image gallery
 */
import CSSModal from '../js/CSSModal.js';

class CSSModalGallery extends CSSModal {
  constructor () {
    super();

    this._prev;
    this._next;
    this._detailView;
    this._activeElement;
    this._items = [];
    this._currentItem = 0;

    this.Helpers.on('cssmodal:show', document, this._initNavigation.bind(this));
    this.Helpers.on('cssmodal:hide', document, this._storeActiveItem.bind(this));

    return {
      showNext: this.showNext,
      showPrevious: this.showPrevious,
      setActiveItem: this.setActiveItem,
      setCaption: this.setCaption
    };
  }

  /**
   * Decreases the counter for the active item regarding the "endless"
   * setting.
   * @return {void}
   */
  _setPreviousItem () {
    if (this._currentItem === 0) {
      this._currentItem = (this._items.length - 1);
    } else {
      this._currentItem--;
    }
  }

  /**
   * Shows the content previous to the current item
   * @param  {Object} event The incoming touch/click event
   * @return {void}
   */
  showPrevious (event) {
    event.preventDefault();
    event.stopPropagation();

    this._setPreviousItem();

    this.setActiveItem(this._currentItem);
  }

  /**
   * Increases the counter for the active item regarding the "endless"
   * setting.
   * @return {void}
   */
  _setNextItem () {
    if (this._currentItem === (this._items.length - 1)) {
      this._currentItem = 0;
    } else {
      this._currentItem++;
    }
  }

  /**
   * Shows the content next to the current item
   * @param  {Object} event The incoming touch/click event
   * @return {void}
   */
  showNext (event) {
    event.preventDefault();
    event.stopPropagation();

    this._setNextItem();

    this.setActiveItem(this._currentItem);
  }

  /**
   * Returns the detail image element
   * @param  {Object} element The current CSS Modal instance
   * @return {Object} The detail image
   */
  _getDetailView (element) {
    let container = element.querySelectorAll('.css-modal_detail')[0];

    if (!container) {
      throw new Error('".css-modal_detail" not found!');
    }

    return container;
  }

  /**
   * Registers the listerns on the previous / next buttons to enable gallery
   * navigation
   * @return {void}
   */
  _initNavigation (event, eventData) {
    if (arguments.length === 2) {
      this._activeElement = eventData.detail.modal;
    } else {
      this._activeElement = event.detail.modal;
    }

    if (this._activeElement.querySelectorAll('.css-modal_detail').length === 0) {
      return;
    }

    // Bind events on the current modal element and set the currentItem to 0
    if (!this._activeElement._galleryEventsBound) {
      this._bindEvents(this._activeElement);
      this._activeElement._galleryEventsBound = true;
      this._activeElement._currentItem = 0;
    }

    // If we have an incoming index, override the current item
    if ('index' in this._activeElement) {
      this._activeElement._currentItem = this._activeElement.index;
    }

    this._detailView = this._getDetailView(this._activeElement);
    this._currentItem = this._activeElement._currentItem;
    this._items = this._readContent(this._activeElement);

    this.setActiveItem(this._currentItem);
  }

  /**
   * Reacts to specific keyboard commands to enable viewing a differnt item
   * in the gallery
   * @param  {Object} event The incoming keypress event
   * @return {void}
   */
  _onKeyPress (event) {
    if (event.keyCode === 39) {
      this.showNext(event);
    } else if (event.keyCode === 37) {
      this.showPrevious(event);
    }
  }

  /**
   * Wires the previous / next button to the function to navigation through
   * the gallery
   * @param  {Object} element The CSSModal to set up
   * @return {void}
   */
  _bindEvents (element) {
    var events = ['click', 'touch'];

    // Setup touch / click events
    this._prev = element.querySelectorAll('.modal--gallery-navigation-prev')[0];
    this._next = element.querySelectorAll('.modal--gallery-navigation-next')[0];

    for (let i = 0; i < events.length; i++) {
      this.Helpers.on(events[i], this._prev, this.showPrevious);
      this.Helpers.on(events[i], this._next, this.showNext);
    }

    // Setup keyboard events
    this.Helpers.on('keydown', document, this._onKeyPress);

    // Setup swipe events
    this.Helpers.on('touch:swipe-left', element, this.showPrevious);
    this.Helpers.on('touch:swipe-right', element, this.showNext);
  }

  /**
   * Gathers information about the gallery content and stores it.
   * @param  {Object} element The CSSModal to receive the content from
   * @return {void}
   */
  _readContent (element) {
    let contentList = element.querySelectorAll('.css-modal_content-list')[0];

    return contentList.getElementsByTagName('li');
  }

  /**
   * Set a caption for a given modal
   * @param {String} caption Caption to insert
   */
  setCaption (caption) {
    let captionElement = this._activeElement.querySelectorAll('.css_modal--gallery_caption')[0];

    if (!captionElement) {
      return;
    }

    captionElement.innerHTML = '';

    if (caption) {
      captionElement.innerHTML = '<p>' + caption + '</p>';
    }
  }

  /**
   * Shows the full content of the designated item
   * @param {Number} index The index of the item to show
   */
  setActiveItem (index) {
    if (!this._items[index]) {
      throw new Error('CSS-Modal: Invalid index "' + index + '"!');
    }

    var content = this._items[index].innerHTML;
    var img = new Image();
    var referenceImage;

    this._detailView.innerHTML = content;

    // Position for loading indicator and hide content
    this.Helpers.trigger('cssmodal:resize', this._activeElement);
    this.Helpers.removeClass(this._detailView, 'is-active');

    // Set a caption for the modal
    this.setCaption(this._items[index].getAttribute('data-caption'));

    // Load the original image, if we are in a gallery
    if (this._activeElement.getAttribute('class').indexOf('modal--gallery') !== -1) {
      referenceImage = this._detailView.getElementsByTagName('img')[0];

      if (referenceImage.parentNode.getAttribute('data-iframe') !== null) {
        img = document.createElement('iframe');
        img.src = referenceImage.getAttribute('data-src-fullsize');
        img.setAttribute('webkitallowfullscreen', true);
        img.setAttribute('mozallowfullscreen', true);
        img.setAttribute('allowfullscreen', true);

      } else {
        img.src = referenceImage.getAttribute('data-src-fullsize');
        img.alt = referenceImage.getAttribute('alt');
      }

      // Reposition and show
      this.Helpers.on('load', img, () => {
        this.Helpers.addClass(this._detailView, 'is-active');
        this.Helpers.trigger('cssmodal:resize', this._activeElement);
      });

      referenceImage.parentNode.insertBefore(img, referenceImage);
      referenceImage.parentNode.removeChild(referenceImage);

      this._detailView.style.width = 'auto';
      this._detailView.style.height = 'auto';
    }
  }

  /**
   * Store the index of the currently active item on the gallery instance
   * @param  {Number} item The index to store
   * @return {void}
   */
  _storeActiveItem () {
    this._activeElement._currentItem = this._currentItem;
  }
}

export default CSSModalGallery;
