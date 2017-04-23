/*
 * CSS Modal Plugin for dynamic modal resizing
 *
 * Integration:
 * - Add modal-resize.js to your JS (via AMD you can easily require it)
 * - Add `data-cssmodal-resize` to the modal which should be resized
 */
import CSSModal from '../js/CSSModal.js';
import injectStyles from './Helper/injectStyles.js';

class CSSModalResize extends CSSModal {
  constructor () {
    super();

    /*
     * Assign basic event handlers
     */
    this.Helpers.on('resize', window, this._scale.bind(this));
    this.Helpers.on('cssmodal:show', document, this._scale.bind(this));
    this.Helpers.on('cssmodal:resize', document, this._scale.bind(this));
  }

  /**
   * Get dimentions of a given element
   * @param  {node}   element Element to find dimentions of
   * @return {object}         Dimentions of object
   */
  getDimentions (element) {
    if (!element || element.length === 0) {
      return;
    }

    var computedStyles = window.getComputedStyle(element);

    var margin = {
      top: parseInt(computedStyles.getPropertyValue('margin-top'), 10),
      left: parseInt(computedStyles.getPropertyValue('margin-left'), 10),
      right: parseInt(computedStyles.getPropertyValue('margin-right'), 10),
      bottom: parseInt(computedStyles.getPropertyValue('margin-bottom'), 10)
    };

    var padding = {
      top: parseInt(computedStyles.getPropertyValue('padding-top'), 10),
      left: parseInt(computedStyles.getPropertyValue('padding-left'), 10),
      right: parseInt(computedStyles.getPropertyValue('padding-right'), 10),
      bottom: parseInt(computedStyles.getPropertyValue('padding-bottom'), 10)
    };

    return {
      width: element.offsetWidth,
      height: element.offsetHeight,
      margin,
      padding
    };
  }

  /*
   * Resize modal dynamically
   */
  resizeModalDynamically () {
    if (!this.activeElement) {
      throw new Error('Error: No active modal.');
    }

    let element = this.activeElement.querySelector('.css-modal_inner');
    let elementContent = this.activeElement.querySelector('.css-modal_content');
    let headerContent = this.activeElement.querySelector('.css-modal_header');
    let captionContent = this.activeElement.querySelector('.css-modal--gallery_caption');
    let footerContent = this.activeElement.querySelector('.css-modal_footer');
    let containerDimentions;
    let headerDimentions;
    let captionDimentions;
    let footerDimentions;
    let offsetWidth = 0;
    let offsetHeight = 0;
    let elements;
    let i;

    // Margins for top and bottom of gallery in px
    var margins = 35 + 35;

    element.style.width = 'auto';
    elementContent.style.maxHeight = 'none';

    containerDimentions = this.getDimentions(elementContent);
    footerDimentions = this.getDimentions(footerContent);

    offsetWidth = containerDimentions.margin.left +
      containerDimentions.margin.right + containerDimentions.padding.left +
      containerDimentions.padding.right;
    offsetHeight = containerDimentions.margin.top +
      containerDimentions.margin.bottom + containerDimentions.padding.top +
      containerDimentions.padding.bottom;

    // Calculate offset from header, caption and footer
    if (headerContent) {
      headerDimentions = this.getDimentions(headerContent);
      offsetHeight += headerDimentions.margin.top +
        headerDimentions.margin.bottom + headerDimentions.padding.top +
        headerDimentions.padding.bottom + headerDimentions.height;
    }

    if (captionContent) {
      captionDimentions = this.getDimentions(captionContent);
      offsetHeight += captionDimentions.margin.top +
        captionDimentions.margin.bottom + captionDimentions.padding.top +
        captionDimentions.padding.bottom + captionDimentions.height;
    }

    if (footerContent) {
      footerDimentions = this.getDimentions(footerContent);
      offsetHeight += footerDimentions.margin.top +
        footerDimentions.margin.bottom + footerDimentions.padding.top +
        footerDimentions.padding.bottom + footerDimentions.height;
    }

    if (containerDimentions.width > global.innerWidth) {
      elements = this.activeElement.querySelectorAll('img, video, [data-iframe]');

      for (i = 0; i < elements.length; i++) {
        elements[i].style.maxWidth = (global.innerWidth - offsetWidth - margins) + 'px';
        elements[i].style.maxHeight = '100%';
      }
    }

    if (containerDimentions.height > global.innerHeight) {
      elements = this.activeElement.querySelectorAll('img, video, [data-iframe]');

      for (i = 0; i < elements.length; i++) {
        elements[i].style.maxHeight = (global.innerHeight - offsetHeight - margins) + 'px';
        elements[i].style.maxWidth = '100%';
      }
    }
  }

  /*
   * Reset modal from being dynamically resized and prepare for e.g. mobile view
   * @param CSSModal {CSSModal} (required)
   */
  resetModal () {
    var modalInner = this.activeElement.querySelector('.css-modal_inner');
    var modalImage = this.activeElement.querySelector('img');

    if (modalInner && modalInner.style) {
      modalInner.style.top = '0';
      modalInner.style.left = '0';

      if (modalImage) {
        modalImage.style.maxWidth = '100%';
        modalImage.style.maxHeight = '100%';
      }
    }
  }

  /*
   * Helper function to call resizeModalDynamically only under conditions
   * @param modal {object} CSSModal object
   */
  resizeModal () {
    this.resetModal();

    if (window.matchMedia('(min-width: 30em)').matches) {
      this.resizeModalDynamically();
    }
  }

  getHorizontalOffset () {
    var innerWidth = window.innerWidth || document.documentElement.clientWidth;
    var element = this.activeElement.querySelector('.css-modal_inner');
    var elementWidth = parseInt(global.getComputedStyle(element).getPropertyValue('width'), 10);
    var offset = (innerWidth - elementWidth) / 2;

    return offset;
  }

  getVerticalOffset () {
    var innerHeight = window.innerHeight || document.documentElement.clientHeight;
    var element = this.activeElement.querySelector('.css-modal_inner');
    var elementHeight = parseInt(window.getComputedStyle(element).getPropertyValue('height'), 10);
    var offset = (innerHeight - elementHeight) / 2;

    return offset;
  }

  positionModal () {
    var offset = {
      top: this.getVerticalOffset(),
      left: this.getHorizontalOffset()
    };

    var element = this.activeElement.querySelector('.css-modal_inner');
    var elementWidth = parseInt(global.getComputedStyle(element).getPropertyValue('width'), 10);
    var margin = 20;

    element.style.top = offset.top + 'px';
    element.style.left = (offset.left - margin) + 'px';
    element.style.marginLeft = margin + 'px';
    element.style.marginRight = margin + 'px';

    // Close button
    injectStyles(`
      [data-cssmodal-resize] .css-modal_close::after {
        top: ${offset.top - 25}px !important;
        margin-right: -${elementWidth / 2}px !important;
      }
    `, element.id);
  }

  _scale () {

    // Eject if no active element is set
    if (!this.activeElement) {
      return;
    }

    var resize = this.activeElement.getAttribute('data-cssmodal-resize');

    if (resize === 'true' || resize === '') {
      this.resizeModal();
      this.positionModal();
    }
  }
}

export default CSSModalResize;
