/*
 * CSS Modal Plugin for HTML5 Video (play/pause)
 */
import CSSModal from '../js/CSSModal.js';

class CSSModalHtml5video extends CSSModal {
  constructor () {
    super();

    this.videos;

    // Enables Auto-Play when calling modal
    this.Helpers.on('cssmodal:show', document, this._show);

    // If modal is closed, pause all videos
    this.Helpers.on('cssmodal:hide', document, this._hide);
  }

  /**
   * Show modal
   */
  _show () {

    // Fetch all video elements in active modal
    try {
      this.videos = this.activeElement.querySelectorAll('video');
    } catch (ex) {
      return;
    }

    // Play first video in modal
    if (this.videos.length > 0) {
      this.videos[0].play();
    }
  }

  /**
   * Hide modal
   */
  _hide () {
    // Pause all videos in active modal
    if (this.videos.length && this.videos.length > 0) {
      for (let i = 0; i < this.videos.length; i++) {
        this.videos[i].pause();
      }
    }
  }
}

export default CSSModalHtml5video;
