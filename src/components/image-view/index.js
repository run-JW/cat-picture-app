export default class ImageView extends HTMLElement {
  constructor() {
    super();

    this._open = this.getAttribute('open') || false;

    this.shadowObj = this.attachShadow({mode: 'open'});

    this.$modal = this.shadowObj.querySelector('.Modal');

    this.render();
  }

  get open() {
    return this._open;
  }

  set open(newValue) {
    this._open = newValue;
    this.showModal(this._open);
  }

  // connectedCallback()

  // disconnectedCallback()

  handleCancle() {
    this.open = false;
  }

  showModal(state) {
    if (state) {
      this.$modal.style.display = 'block';
    } else {
      this.modal.style.display = 'none';
    }
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  getTemplate() {
    return `
    <div class="Modal"> 
      <div class="ImageViewer">
        <div class="content">
          <img src="https://fe-dev-matching-2021-03-serverlessdeploymentbuck-t3kpj3way537.s3.ap-northeast-2.amazonaws.com/public/images/a2i.jpg">
        </div>
      </div>
    </div>
    ${this.getStyle()}
    `;
  }

  getStyle() {
    return `
      <style>
        .Modal {
          z-index: 1;
          width: 100%;
          height: 100%;
          position: fixed;
          left: 0;
          top: 0;
          background-color: rgba(0,0,0,0.3);
          display: none;
        }
        
        .Modal > div {
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      </style>
    `;
  }
}