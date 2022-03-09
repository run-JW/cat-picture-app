import MainApp from '../main-app/index.js';

export default class EntryApp extends HTMLElement {
constructor() {
    super();

    this.shadowObj = this.attachShadow({mode: 'open'});

    this.registerOtherComponents();
    this.render();
  }

  registerOtherComponents() {
    if (typeof customElements.get('main-app') === 'undefined') {
      customElements.define('main-app', MainApp);
    }
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  getTemplate() {
    return `
    <header>
      <h1>고양이 사진첩</h1>
    </header>
    <main-app></main-app>
    ${this.getStyle()}
    `;
  }

  getStyle() {
  return `
    <style>
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #eee;
        flex-direction: column;
      }
    </style>
  `;
  }
}