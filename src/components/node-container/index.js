import NodeItem from '../node-item/index.js';

export default class NodeContainer extends HTMLElement {
  constructor() {
    super();

    this.shadowObj = this.attachShadow({mode: 'open'});

    this.registerOtherComponents();
    this.render();
  }

  static get observedAttributes() {
    return ['pwd', 'prev', 'files'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

  connectedCallback() {
    this.shadowObj.addEventListener('nodeToContainer', e => {
      this.dispatchToApp(e);
    });
  }

  get pwd() {
    return this.getAttribute('pwd');
  }

  get prev() {
    return this.getAttribute('prev');
  }

  get files() {
    return JSON.parse(this.getAttribute('files'));
  }

  // set files(data) {
  //   this._files = files;
  //   this.handleData(this._files);    
  // }

  dispatchToApp(e) {
    this.dispatchEvent(new CustomEvent('moveDirectory', {
      detail: {
        nodeId: e.detail.nodeId,
        prevId: e.detail.prevId
      },
      bubbles: true
    }));
  }

  handleFiles() {
    let files = this.files;
    let backNode = '';
    
    if (files === null) return;

    if (files[0].parent !== null) {
      backNode = this.createBackNode();
    }
console.log(files);
    files = files.map(file => {
      return `
        <node-item
          pwd=${this.pwd}
          prev=${this.prev}
          id=${file.id}
          name=${file.name}
          type=${file.type}
          file-path=${file.filePath}
          parent=${file.parent}
        >
        </node-item>
      `
    }).join('');

    this.shadowObj.querySelector('.Nodes')
    .innerHTML = backNode + files;
  }

  createBackNode() {
    return `
      <node-item
        id=${this.prev}
        type="BACK"
      >
      </node-item>
    `
  }

  registerOtherComponents() {
    if (typeof customElements.get('node-item') === 'undefined') {
      customElements.define('node-item', NodeItem);
    }
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
    this.handleFiles();
  }

  getTemplate() {
    return `
    <section class="Nodes">
    </section>
    ${this.getStyle()}
    `;
  }

  getStyle() {
    return `
      <style>
        .Nodes {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          flex-wrap: wrap;
        }
      </style>
    `;
  }
}