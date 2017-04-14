/**
 * Include styles into the DOM
 * @param {string} rule Styles to inject into the DOM
 * @param {string} id   Unique ID for styles
 */
const _injectStyles = (rule, id) => {
  id = 'modal__rule--' + (id || '');

  let head = document.querySelector('head');
  let existingStyleElement = document.getElementById(id);
  let styleElement = null;

  if (existingStyleElement) {
    styleElement = existingStyleElement;
  } else {
    styleElement = document.createElement('style');
    styleElement.id = id;
  }

  styleElement.innerHTML = rule;
  head.appendChild(styleElement);
};

export default _injectStyles;
