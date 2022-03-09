import NavApp from '../nav-app/index.js';
import NodeContainer from '../node-container/index.js';
import api from '../../utils/api.js';

export default class MainApp extends HTMLElement {
  constructor() {
    super();

    this.state = {
      cache: new Map(),
      pwd: 0,
      prev: 0,
      path: 0,
      files: null
    }

    this.shadowObj = this.attachShadow({mode: 'open'});

    this.registerOtherComponents();
    this.makeInitApiCall();
    this.render();
  }

  connectedCallback() {
    this.shadowObj.addEventListener('moveDirectory', e => {
      console.log('hello3');
      this.checkCacheIfMissCallApi(e.detail.nodeId, e.detail.prevId);
    });
  }

  registerOtherComponents() {
    if (typeof customElements.get('nav-app') === 'undefined') {
      customElements.define('nav-app', NavApp);
    }

    if (typeof customElements.get('node-container') === 'undefined') {
      customElements.define('node-container', NodeContainer);
    }
  }

  checkCacheIfMissCallApi(nodeId, prevId) {
    console.log(`api call nodeId: ${nodeId}`);
    if (this.isCacheHit(nodeId)) {
      this.loadDataFromCache(nodeId);
    } else {
      this.makeApiCallAndSaveCache(nodeId, prevId);
    }
  }

  isCacheHit(nodeId) {
    return this.state.cache.has(nodeId);
  }

  makeApiCallAndSaveCache(nodeId, prevId) {
    api.fetchFilesFromId(nodeId)
    .then(jsonResponse => {
      const [pathId, pathName] = this.getPath(jsonResponse);
      const object = {
        pwd: nodeId,
        prev: prevId,
        path: {
          ids: pathId,
          names: pathName
        },
        files: jsonResponse
      }
      this.saveDataToCache(nodeId, object);
      this.loadDataFromCache(nodeId);
    });
  }

  getPath(files) {
    const pathId = [];
    const pathName = [];
    let currentNode = files;

    pathId.push(currentNode.id);
    pathName.push(currentNode.name);

    while(true) {
      const ParentIdOfFile = currentNode[0].parent.id;
      if (this.isCacheHit(ParentIdOfFile)) {
        currentNode = this.state.cache.get(ParentIdOfFile);
        pathId.push(currentNode.id);
        pathName.push(currentNode.name);
      } else {
        break;
      }
    }

    return [pathId, pathName];
  }

  makeInitApiCall() {
    api.fetchFiles()
    .then(jsonResponse => {
      const object = {
        pwd: 0,
        prev: null,
        path: {
          ids: [0],
          names: ['root']
        },
        files: jsonResponse
      }
      this.saveDataToCache('0', object);
      this.loadDataFromCache('0');
    });
  }

  saveDataToCache(key, data) {
    key = String(key);
    this.state.cache.set(key, data);
  }

  loadDataFromCache(key) {
    key = (key === undefined) ? undefined : String(key);
    const data = this.state.cache.get(key);
    this.state.pwd = data.pwd;
    this.state.prev = data.prev;
    this.state.path = data.path;
    this.state.files = data.files;
    
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  getTemplate() {
    return `
    <main class="App">
      <nav-app
        path="${this.state.path}"
      ></nav-app>
      <node-container
        pwd="${this.state.pwd}"
        prev="${this.state.prev}"
        files='${JSON.stringify(this.state.files)}'
      ></node-container>
    </main>
    ${this.getStyle()}
    `;
  }

  getStyle() {
    return `
      <style>
        .app {
          border: 1px solid #ccc;
          background-color: #fff;
          border-radius: 5px;
          width: 800px;
          height: 600px;
        }
      </style>
    `;
  }
}