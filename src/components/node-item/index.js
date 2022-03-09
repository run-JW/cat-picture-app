import ImageView from '../image-view/index.js'

const BACK_IMAGE = "./public/assets/prev.png";
const DIRECTORY_IMAGE = "./public/assets/directory.png";
const FILE_IMAGE = "./public/assets/file.png";

export default class NodeItem extends HTMLElement {
  constructor() {
    super();

    this.shadowObj = this.attachShadow({mode: 'open'});

    this.$image = this.shadowObj.querySelector('image-view');

    this.registerOtherComponents();
    this.render();
    this.handleClick();
  }

  registerOtherComponents() {
    if (typeof customElements.get('image-view') === 'undefined') {
      customElements.define('image-view', ImageView);
    }
  }

  get id() {
    return this.getAttribute('id');
  }

  get name() {
    return this.getAttribute('name');
  }

  set name(value) {
    this.setAttribute('name', value);
  }

  get type() {
    return this.getAttribute('type');
  }

  set type(value) {
    return this.setAttribute('type', value);
  }

  get parent() {
    return this.getAttribute('parent');
  }

  get pwd() {
    return this.getAttribute('pwd');
  }

  handleClick() {
    this.shadowObj.addEventListener('click', () => {
      this.handleEvent();
    });
  }

  handleEvent() {
    if (this.type === 'DIRECTORY' || this.type === 'BACK')  {
      this.dispatchNodeId();
    } else if (this.type === 'FILE') {
      this.displayImageView();
    }
  }

  dispatchNodeId() {
    console.log('hello1')
    this.dispatchEvent(new CustomEvent('nodeToContainer', {
      detail: {
        nodeId: this.id,
        prevId: this.pwd
      },
      bubbles: true
    }));
  }

  displayImageView() {
    this.$image.open = !this.$image.open;
  }

  // dispatchParentNodeId() {
  //   this.dispatchEvent(new CustomEvent('backDirectory', {
  //     detail: {
  //       nodeId: this.parent.id
  //     },
  //     bubbles: true
  //   }));
  // }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
    this.attachImage();
    this.attachName();
  }

  getTemplate() {
    return `
    <div class="Node">
      <image-view></image-view>
    </div>
    ${this.getStyle()}
    `;
  }

  attachImage() {
    const { type } = this;
    const img = document.createElement('img');
    
    // if (type === null || type === '') { 
    //   this.type = 'BACK';
    //   img.src = BACK_IMAGE;
    // } 

    switch(type) {
      case 'DIRECTORY': {
        img.src = DIRECTORY_IMAGE;
        break;
      }

      case 'FILE': {
        img.src = FILE_IMAGE;
        break;
      }

      case 'BACK': {
        img.src = BACK_IMAGE;
        break;
      }
    }

    this.shadowObj.querySelector('.Node')
      .appendChild(img);
  }

  attachName() {
    if (this.type === 'BACK') return;

    const div = document.createElement('div');
    div.textContent = this.name;
    this.shadowObj.querySelector('.Node')
      .appendChild(div);
  }

  getStyle() {
    return `
      <style>
        .Node {
          width: 140px;
          min-height: 150px;
          padding: 12px;
          margin: 8px;
          text-align: center;
          display: flex;
          flex-direction: column;
          word-break: keep-all;
        }

        .Node:hover {
          cursor: pointer;
        }

      </style>
    `;
  }
}