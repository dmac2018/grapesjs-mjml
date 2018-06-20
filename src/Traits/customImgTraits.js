export default (editor, config = {}) => {



  editor.TraitManager.addType('buttonGroup', {
      events:{
        click: 'onClick',  // trigger parent onChange method on keyup
      },
     
      
      /**
      * Returns the input element
      * @return {HTMLElement}
      */
      getInputEl: function() {
        if (!this.inputEl) {
          var div = document.createElement('div');
          var btnUpdate = document.createElement('button');
          btnUpdate.setAttribute('class', 'btnUpdate');
  
          btnUpdate.innerHTML = 'OK';
          btnUpdate.id = "btnUpdate";
  
          var btnCancel = document.createElement('button');
          btnCancel.setAttribute('class', 'btnCancel');
          btnCancel.innerHTML = 'Cancel';
          btnCancel.id = "btnCancel";
  
          var d = this.$el.children()[1];
          $(d).removeClass('gjs-field');
          //input.onclick = this.btnUpdateClick;
  
          div.appendChild(btnUpdate);
          div.appendChild(btnCancel);
          this.inputEl = div;
        }
        return this.inputEl;
      },
      onClick: function(e) {
          if(e.target.id == "btnUpdate") {
                 this.doUpdate();
  
          }
          else if(e.target.id == "btnCancel") {
                  this.doCancel();
  
          }
      },
      doUpdate: function() {
        var self = this;
        // setTimeout(function() {
          //get all of our traits and values
          var srcTrait = self.model.collection.models[1];
          var altTrait = self.model.collection.models[2];
          var hrefTrait = self.model.collection.models[3];
          var trackClicksTrait = self.model.collection.models[4];
          var nameTrait = self.model.collection.models[5];

          var src = srcTrait.get('value');
          var alt = altTrait.get('value');
          var href = hrefTrait.get('value');
          var trackClicks = trackClicksTrait.get('value');
          var name = nameTrait.get('value');


          //update the model with our values, call the component update methods
        
              if(src.indexOf("http") == -1 && src !== "") {
                src = "http://" + src;
              }
              if(alt === "")
                try{alt = editor.TraitManager.getTraitsViewer().collection.models[2].get('value');}catch(x){alt = altTrait.getTargetValue();}
              if(name === "")
                try{name = editor.TraitManager.getTraitsViewer().collection.models[5].get('value');}catch(x){name = nameTrait.getTargetValue();}
         
              if(src !== "") {
                srcTrait.set("changeProp", 1);
                srcTrait.set("value", "");
                srcTrait.set("value", src);
                srcTrait.set("changeProp", 0);
              }

                if(alt === "")
                  alt = altTrait.getTargetValue();
                altTrait.set("changeProp", 1);
                altTrait.set("value", "");
                altTrait.set("value", alt);
                altTrait.set("changeProp", 0);
                self.target.updateAlt(self.target, alt);
              
              //update href (mjml will wrap img with <a> but changeProp has to be 0)           
              //we set it to 1, to prevent the auto-upadte when value is changed
              //we want to control that via the update button to give user option of cancel
              hrefTrait.set("changeProp", 0);
              hrefTrait.set("value", "");
              hrefTrait.set("value", href);
              hrefTrait.set("changeProp", 1);
              self.target.updateHref(self.target, href);
            
              if(!trackClicks)
                name = "LinkIsNotTracked";
              else {
                if(name === "LinkIsNotTracked" && href !== "" && href !== null)
                  name = generateReportingName('', href);
              }

                nameTrait.set("changeProp", 0);
                nameTrait.set("value", "");
                nameTrait.set("value", name);
                nameTrait.set("changeProp", 1);
                self.target.updateName(self.target, name);

                updateMediaLibaryTrait();
                editor.showPanel('style');

   //},1000);

          // this.target.updateTrackedLink(this.target, trackClicks);

       

     

        
  
      },
      doCancel: function() {
          var src = this.target.view.$el.attr('src');
          editor.TraitManager.getTraitsViewer().collection.models[1].setTargetValue(src);
  
          var alt = this.target.view.$el.attr('alt');
          editor.TraitManager.getTraitsViewer().collection.models[2].setTargetValue(alt);
  
          var href = this.target.parent().attributes.attributes.href;
          editor.TraitManager.getTraitsViewer().collection.models[3].setTargetValue(href);
  
          var name = this.target.parent().attributes.attributes.name;
          editor.TraitManager.getTraitsViewer().collection.models[5].setTargetValue(name);
  
  
          if(name == "" || name == null || name == "LinkIsNotTracked") {
              editor.TraitManager.getTraitsViewer().collection.models[4].setTargetValue(false);
          }
          else{
              editor.TraitManager.getTraitsViewer().collection.models[4].setTargetValue(true);
          }
          editor.TraitManager.getTraitsViewer().render();
          updateMediaLibaryTrait();
      },
      renderLabel() {
          this.$el.html(
            '<div class="' + this.labelClass + '"></div>'
          );
        },
      /**
       * Triggered when the value of the model is changed
       */
      
      onValueChange: function () {
        //this.target.set('content', this.model.get('value'));
      }
    });
    function generateReportingName(linkText, linkUrl) {
      if (linkUrl.indexOf("#") == 0) {
        return noTrackedLinks;
      }
      var usedField = linkText.trim();
      if (usedField == "") {
        usedField = linkUrl.trim();
      }
      usedField = usedField.replace("http://", "");
      usedField = usedField.replace("www.", "");
      //var nonChars = new XRegExp('[^\\p{L}\\s\\d]*', 'g');
      //input.replace(/\W/g, '')
      usedField = usedField.replace(/\W/g, '');
      return usedField.trim().substring(0, 45);
    }
  }