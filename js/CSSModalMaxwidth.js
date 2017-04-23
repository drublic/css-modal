/*
 * CSS Modal Plugin for setting a max-width for modals
 */
import CSSModal from '../js/CSSModal.js';
import injectStyles from './Helper/injectStyles.js';

class CSSModalMaxwidth extends CSSModal {
  constructor () {
    super();

    this._currentMaxWidth;

    // Config: margin for modal when too narrow to show max width
    // can be overwritten with `data-cssmodal-margin` attribute
    this._margin = 20;

    this.MODAL_SMALL_BREAKPOINT = 480;

    /*
     * Assign basic event handlers
     */
    this.Helpers.on('cssmodal:show', document, () => {
      this._scale();
      this._scaleLower();
    });

    this.Helpers.on('resize', window, () => {
      this._scale();
      this._scaleLower();
    });

    /**
     * Plugin API
     */
    return {
      scaleMaxSize: this._scale
    };
  }

  /**
   * Scale the modal according to its custom width
   */
  _scale () {

    // Eject if no active element is set
    if (!this.activeElement) {
      return;
    }

    this._currentMaxWidth = this.activeElement.getAttribute('data-cssmodal-maxwidth');
    this._currentMaxWidth = parseInt(this._currentMaxWidth, 10);

    if (this._currentMaxWidth) {
      injectStyles(`
        [data-cssmodal-maxwidth] .modal-inner {
          max-width: ${this._currentMaxWidth}px;
          margin-left: -${this._currentMaxWidth / 2}px;
        }

        [data-cssmodal-maxwidth] .modal-close:after {
          margin-right: -${this._currentMaxWidth / 2}px !important;
        }
      `, this.activeElement.id);
    }
  }

  _scaleLower () {
    let innerWidth = global.innerWidth || document.documentElement.clientWidth;
    let closeButtonMarginRight = 10;

    // Skip if there is no max width or the window is wider
    if (!this.activeElement || !this._currentMaxWidth || innerWidth > this._currentMaxWidth) {
      return;
    }

    // Window width minus margin left and right
    let margin = this.activeElement.getAttribute('data-cssmodal-margin');

    this._margin = parseInt(margin, 10) || this._margin;
    this._currentMaxWidth = innerWidth - (this._margin * 2);

    if (innerWidth > this.MODAL_SMALL_BREAKPOINT) {
      closeButtonMarginRight = '-' + Math.floor(this._currentMaxWidth / 2);
    }

    injectStyles(`
      [data-cssmodal-maxwidth] .modal-inner {
        max-width: ${this._currentMaxWidth}px;
        margin-left: -${this._currentMaxWidth / 2}px;
      }

      [data-cssmodal-maxwidth] .modal-close:after {
        margin-right: ${closeButtonMarginRight}px !important;
      }
    `, this.activeElement.id);
  }
}

export default CSSModalMaxwidth;
