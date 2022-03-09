export default class MainApp extends HTMLElement {
  constructor() {
    super();

    this.shadowObj = this.attachShadow({mode: 'open'});
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  getTemplate() {
    return `
    <nav class="Breadcrumb">
      <div>root</div>
      <div>노란고양이</div>
    </nav>
    ${this.getStyle()}
    `;
  }

  getStyle() {
    return `
      <style>
        .Breadcrumb {
          height: 62px;
          padding: 16px;
          border-bottom: 1px solid #ccc;
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .Breadcrumb > div {
          padding: 4px;
        }

        .Breadcrumb > div::after {
          content: " -";
        }
        
        .Breadcrumb > div:last-child::after {
          content: "";
        }
        
      </style>
    `;
  }
}