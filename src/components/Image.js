// Specs: https://mjml.io/documentation/#mjml-image

export default (editor, {
  dc, opt, imageModel, imageView, coreMjmlModel, coreMjmlView
}) => {
  const type = 'mj-image';

  dc.addType(type, {


    model: imageModel.extend({ ...coreMjmlModel,

      defaults: { ...imageModel.prototype.defaults,
        'custom-name': 'Image',
        customBadgeLabel: 'Image',
        resizable: false,
        highlightable: false,
        draggable: '[data-type=mj-column]',
        stylable: [
          'width', 'height',
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
          'border', 'border-width', 'border-style', 'border-color',
          'align',
        ],
        'style-default': {
          'padding-top': '10px',
          'padding-bottom': '10px',
          'padding-right': '25px',
          'padding-left': '25px',
          'align': 'center',
        },
        unstylable: ['background-url', 'max-width', 'min-height', 'background-color'],
        void: true,
        traits: [
          {
            //placeholder for our media library link
            type: 'text',
  
          },
          {
            type: 'text',
            label: 'Image URL',
            name: 'src',
            changeProp: 0
          },
          {
            type: 'text',
            label: 'Image Description',
            name: 'alt',
            changeProp: 0
          },
          {
            prop: 'href',
            type: 'text',
            label: 'Destination URL',
            name: 'href',
            placeholder: 'http://www.example.com',
            changeProp: 1,
          },
          {
            type: 'checkbox',
            label: 'Track Clicks',
            name: 'trackClicks',
            changeProp: 1,
            id: 'test'
          },
          {
            type: 'text',
            label: 'Reporting Name',
            name: 'name',
            changeProp: 1
          },
          {
            type: 'buttonGroup',
            name: 'buttonGroup',
            label: '',
            changeProp: 1
          },
  
  
        ],
      },
    },{

      isComponent(el) {
        if (el.tagName == type.toUpperCase()) {
          return { type };
        }
      },
    }),


    view: imageView.extend({ ...coreMjmlView,

      tagName: 'tr',

      attributes: {
        style: 'pointer-events: all; display: table; width: 100%; user-select: none;',
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
        return 'img';
      },
    }),
  });
}
