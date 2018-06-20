// Specs: https://mjml.io/documentation/#mjml-text

export default (editor, {
  dc, opt, textModel, textView, coreMjmlModel, coreMjmlView
}) => {
  const type = 'rssBlock';

  dc.addType(type, {


    model: textModel.extend({ ...coreMjmlModel,

      defaults: { ...textModel.prototype.defaults,
        'custom-name': 'RSS',
        activeOnRender: true,
        draggable: '[data-type=mj-column]',
        highlightable: false,
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
        if ($(el).hasClass("rss")) {
          return {
            type,
            content: el.innerHTML,
            components: [],
          };
        }
      },
    }),


    view: textView.extend({ ...coreMjmlView,

      tagName: 'tr',

      attributes: {
        style: 'pointer-events: all; display: table; width: 100%',
      },

      initialize(o) {
        const model = this.model;
        textView.prototype.initialize.apply(this, arguments);
        //this.listenTo(model, 'change:src', this.updateSrc);
        this.listenTo(model, 'dblclick active', this.openModal);
      },
      openModal(e) {
        var url = "/csb/Campaigns/CampaignRSS.aspx?editorType=6";
        win.showWindow('Insert RSS Content', url, 630, 745);
        editor.select(this.model);

        //hide the ckEditor
        $(".gjs-rte-toolbar").hide()
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
        return 'div';
      },

      /**
       * Prevent content repeating
       */
      renderChildren() {
        coreMjmlView.renderChildren.call(this);
      },

      /**
       * Need to make text selectable.
       */
      enableEditing() {
        textView.prototype.enableEditing.apply(this, arguments);
        this.getChildrenContainer().style.pointerEvents = 'all';
      },

      disableEditing() {
        textView.prototype.disableEditing.apply(this, arguments);
        this.getChildrenContainer().style.pointerEvents = 'none';
      },
    }),
  });
}
