// Specs: https://mjml.io/documentation/#mjml-text

export default (editor, {
    dc, opt, defaultModel, defaultView, coreMjmlModel, coreMjmlView
  }) => {
    const type = 'mj-table';
  
    dc.addType(type, {
  
      model: defaultModel.extend({ ...coreMjmlModel,
  
        defaults: { ...defaultModel.prototype.defaults,
          'custom-name': 'Table',
          draggable: '[data-type=mj-column]',
          highlightable: false,
          editable: true,
          unstylable: ['background-color', 'text-align','width', 'max-width', 'height', 'min-height', 'text-shadow',
          'font', 'font-size', 'font-weight', 'letter-spacing', 'vertical-align',
          'color', 'line-height', 'text-decoration', 'font-family', 'font-style','background-url', 'background-repeat',
          'background-size'],
          stylable: [
            'height', 'font-style', 'font-size', 'font-weight', 'font-family', 'color',
            'line-height', 'letter-spacing', 'text-decoration', 'align', 'text-transform',
            'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
            'container-background-color'
          ],
          'style-default': {
            'padding-top': '10px',
            'padding-bottom': '10px',
            'padding-right': '25px',
            'padding-left': '25px',
            'font-size': '13px',
            'line-height': '22px',
            'align': 'left',
          },
        },
      },{
  
        isComponent(el) {
          if (el.tagName == type.toUpperCase()) {
            return {
              type,
              content: el.innerHTML,
              components: [],
            };
          }
        },
      }),
  
  
      view: defaultView.extend({ ...coreMjmlView,
  
        tagName: 'tr',
  
        attributes: {
          style: 'pointer-events: all; display: table; width: 100%',
        },
  
        getMjmlTemplate() {
          return {
            start: `<mjml><mj-body><mj-column>`,
            end: `</mj-column></mj-body></mjml>`,
          };
        },
  
        getTemplateFromEl(sandboxEl) {
          return sandboxEl.querySelector('tr').innerHTML;
        },
  
        getChildrenSelector() {
          return 'td';
        },
  
        /**
         * Prevent content repeating
         */
        renderChildren() {
          coreMjmlView.renderChildren.call(this);
        },

        // renderContent() {
        //   //Issue with table rendering: https://github.com/artf/grapesjs-mjml/issues/8
        //   //Based on the block definition (content), we'll implement the table layout here
        //   let tableType = this.model.get('content').trim();
        //   let tableMarkup = this.getTableMarkup(tableType);
        //   this.getChildrenContainer().innerHTML = tableMarkup;
        // },
        
        getTableMarkup(tableType) {
          let markup = "";
          switch(tableType) {
            case 'grid':
              markup = `<table style="pointer-events:all;>
                  <tr style="pointer-events:all;>
                    <td style="pointer-events:all;>
                      <table style="pointer-events:all;>
                        <tr style="pointer-events:all;>
                          <td style="pointer-events:all;>
                            <h1 style="pointer-events:all;>Title here</h1>
                            <div style="pointer-events:all;>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>`;
              break;
            case 'list':
              markup = ``;
              break;
            case 'text-section':
              markup = ``;
              break;
            default:
              markup = `<table><tr><td></td></tr></table>`;
          }
          return markup;
        },
        /**
         * Need to make text selectable.
         */
        enableEditing() {
          defaultView.prototype.enableEditing.apply(this, arguments);
          this.getChildrenContainer().style.pointerEvents = 'all';
        },
  
        disableEditing() {
          defaultView.prototype.disableEditing.apply(this, arguments);
          this.getChildrenContainer().style.pointerEvents = 'none';
        },
      }),
    });
  }
  