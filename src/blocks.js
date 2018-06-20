export default (editor, opt = {}) => {
  let bm = editor.BlockManager;

  if (opt.resetBlocks) {
    bm.getAll().reset();
  }

//for future use of using categories
const categoryStructure = '';
const categoryContent = '';
const categoryTemplates = '';


  // const allBlocks = {
  //   category: opt.categoryLabel,
  // }
  bm.add('mj-1-column', {
    label: '1 Column',
    content: `<mj-section>
        <mj-column><mj-text>Content 1</mj-text></mj-column>
      </mj-section>`,
    attributes: { class: 'gjs-fonts gjs-f-b1' },
    badgable: true,
    category: categoryStructure,
  });

  bm.add('mj-2-columns', {
    label: '2 Columns',
    content: `<mj-section>
        <mj-column><mj-text>Content 1</mj-text></mj-column>
        <mj-column><mj-text>Content 2</mj-text></mj-column>
      </mj-section>`,
    attributes: { class: 'gjs-fonts gjs-f-b2' },
    badgable: true,
    category: categoryStructure,
  });

  bm.add('mj-3-columns', {
    label: '3 Columns',
    content: `<mj-section>
        <mj-column><mj-text>Content 1</mj-text></mj-column>
        <mj-column><mj-text>Content 2</mj-text></mj-column>
        <mj-column><mj-text>Content 3</mj-text></mj-column>
      </mj-section>`,
    attributes: { class: 'gjs-fonts gjs-f-b3' },
    badgable: true,
    category: categoryStructure,
  });

  bm.add('mj-divider', {
    label: 'Divider',
    content: '<mj-divider/>',
    attributes: { class: 'gjs-fonts gjs-f-divider divider'},
    category: categoryContent,
  });
  

  bm.add('mj-text', {
    label: 'Text',
    content: '<mj-text>Insert your text here</mj-text>',
    attributes: { class: 'gjs-fonts gjs-f-text text' },
    category: categoryContent,
  });


  bm.add('mj-image', {
    label: 'Image',
    content: '<mj-image src="../images/imgPlaceholder150x150.png">',
    attributes: { class: 'gjs-fonts gjs-f-image' },
    category: categoryContent,
  });

   bm.add('rssBlock', {
    label: 'RSS',
    content: '<mj-text class="rss">Your RSS feed will be merged here.</mj-text>',
    attributes: { class: 'fa fa-rss', activeOnRender: true, droppable:false, selected:true },
    category: categoryContent,
  });

  bm.add('mj-button', {
    label: 'Button',
    content: '<mj-button>Button</mj-button>',
    attributes: { class: 'gjs-fonts gjs-f-button buttonBlock' },
    category: categoryContent,
  });

  bm.add('mj-spacer', {
    label: 'Spacer',
    content: '<mj-spacer/>',
    attributes: { class: 'fa fa-arrows-v' },
    category: categoryContent,
  });



/*Grid Item */

const styleFont = `style="font-family: Arial, Times New Roman, Serif; font-size: 1em;"`;
bm.add('grid-items', {
    label: 'Grid Items',
    content: `
      <mj-section>
        <mj-column>
          <mj-image style="align:left;" align="left" src="../images/imgPlaceholder150x150.png"></mj-image>
            <mj-text>
              <h1 class="card-title">Title here</h1>
              <div class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</div>
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section>
            <mj-column>
              <mj-image style="align:left;" align="left" src="../images/imgPlaceholder150x150.png"></mj-image>
                <mj-text>
                  <h1 class="card-title">Title here</h1>
                  <div class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</div>
                </mj-text>
            </mj-column>
        </mj-section>
    `,
    attributes: { class: 'fa fa-th fix-small-block-icon grid-items' },
    category: categoryTemplates,
  });



/*Text Section */
bm.add('text-sect', {
  label: 'Text Section',
  content: `
  <mj-section>
    <mj-column>
         <mj-text><h1 class="card-title">Insert title here</h1></mj-text>
         <mj-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</mj-text>
    </mj-section>
    </mj-column>
  `,
  attributes: { class: 'gjs-fonts gjs-f-h1p text-sect' },
  category: categoryTemplates,
});

/*List Item */
bm.add('list-items', {
  label: 'List Items',
  category: categoryTemplates,
  content: `
      <mj-section>
      <mj-column>
          <mj-image style="align:left;" align="left" src="../images/imgPlaceholder150x150.png"></mj-image>
      </mj-column>
      <mj-column>
        <mj-text><h1 class="card-title">Title here</h1></mj-text>
        <mj-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</mj-text>
      </mj-column>
      </mj-section>
      <mj-section>
      <mj-column>
          <mj-image style="align:left;" align="left" src="../images/imgPlaceholder150x150.png"></mj-image>
      </mj-column>
      <mj-column>
        <mj-text><h1 class="card-title">Title here</h1></mj-text>
        <mj-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</mj-text>
      </mj-column>
      </mj-section>
          `,
  attributes: {class:'fa fa-th-list fix-small-block-icon list-items'},
});


}