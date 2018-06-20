export default (editor, config = {}) => {


  editor.TraitManager.addType('txtRssFeed', {
    events:{
      //click: 'onClick',  // trigger parent onChange method on keyup
    },
    /**
    * Returns the input element
    * @return {HTMLElement}
    */
    getInputEl: function() {
      if (!this.inputEl) {
        var self = this;
        
        var feedURL = document.createElement("input");
        feedURL.setAttribute("placeholder", "e.g. http://www.example.com/rssfeed.xml");
        
        feedURL.addEventListener("change", function() {
             getRSSFeed(self.inputEl.value, self);
        });
        this.inputEl = feedURL;
      }
      return this.inputEl;
    },
    renderLabel() {
        this.$el.html(
          '<div class="' + this.labelClass + '">Feed URL</div>'
        );
      },
    /**
     * Triggered when the value of the model is changed
     */
    
    onValueChange: function () {
      //this.target.set('content', this.model.get('value'));
    }
  });


  editor.TraitManager.addType('rssButtonGroup', {
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
  
          btnUpdate.innerHTML = 'INSERT';
          btnUpdate.id = "btnUpdateRss";
  
          var btnCancel = document.createElement('button');
          btnCancel.setAttribute('class', 'btnCancel');
          btnCancel.innerHTML = 'CANCEL';
          btnCancel.id = "btnCancelRss";
  
          var d = this.$el.children()[1];
          $(d).removeClass('gjs-field');
  
          div.appendChild(btnUpdate);
          div.appendChild(btnCancel);
          this.inputEl = div;
        }
        return this.inputEl;
      },
      onClick: function(e) {
          if(e.target.id == "btnUpdateRss") {
                  this.doRssUpdate();
  
          }
          else if(e.target.id == "btnCancelRss") {
                  this.doRssCancel();
  
          }
      },
      doRssUpdate: function() {
         
        var selectedComponent = editor.getSelected();
       
        var selComponentSrc = "";
        if(selectedComponent != null)
        {
          selComponentSrc = selectedComponent.view.el.src;
        }
  
          //get all of our trait values:
          var src = this.model.collection.models[1].get('value');
          var alt = this.model.collection.models[2].get('value');
          var href = this.model.collection.models[3].get('value');
          var trackClicks = this.model.collection.models[4].get('value');
          var name = this.model.collection.models[5].get('value');
  
          //get original values to compare and only update what has changed:
          var oSrc = selectedComponent.get('attributes').src;
          var oAlt = selectedComponent.get('attributes').alt;
  
  
          //update the model with our values, call the component update methods
  
          if(src != oSrc) {
            this.target.updateSrc(this.target, src);
            this.target.updateDimensions(this.target, src);
          }
          if(alt != oAlt)
            this.target.updateAlt(this.target, alt);
  
          this.target.updateHref(this.target, href);
          this.target.updateName(this.target, name);
          this.target.updateTrackedLink(this.target, trackClicks);
  
      },
      doRssCancel: function() {
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
    

    editor.TraitManager.addType('rssTextArea', {
      events:{
        //click: 'onClick',  // trigger parent onChange method on keyup
      },
      /**
      * Returns the input element
      * @return {HTMLElement}
      */
      getInputEl: function() {
        if (!this.inputEl) {
          var txtarea = document.createElement('textarea');
          txtarea.setAttribute('class', 'rssTextarea');
          txtarea.innerHTML = "This RSS feed is temporarily unavailable";
          txtarea.style.height = "70px";
          this.inputEl = txtarea;

        }
        return this.inputEl;
      },
      renderLabel() {
          this.$el.html(
            '<div class="' + this.labelClass + '">Default Content</div>'
          );
        },
      /**
       * Triggered when the value of the model is changed
       */
      
      onValueChange: function () {
        //this.target.set('content', this.model.get('value'));
      }
    });




    editor.TraitManager.addType('rssRadio', {
      events:{
        //click: 'onClick',  // trigger parent onChange method on keyup
      },
      /**
      * Returns the input element
      * @return {HTMLElement}
      */
      getInputEl: function() {
        if (!this.inputEl) {
          var rssDiv = document.createElement('div');
          var rssRadio1 = this.createRadioElement('rssRad', false, 'test label 1');
          var rssRadio2 = this.createRadioElement('rssRad', false, 'test label 2');
          var rssRadio3 = this.createRadioElement('rssRad', false, 'test label 3');
          rssRadio1.setAttribute('class', 'rssRadio');
          rssRadio2.setAttribute('class', 'rssRadio');
          rssRadio3.setAttribute('class', 'rssRadio');

          rssRadio1.setAttribute("checked", "checked");
          rssRadio1.addEventListener("click", function() {
                 disableRSSDates();
          });

          rssRadio2.addEventListener("click", function() {
            disableDateEnableTime();
          });

          rssRadio3.addEventListener("click", function() {
              enableRSSDates();
          });

          rssRadio1.setAttribute('id', 'rad1');
          rssRadio2.setAttribute('id', 'rad2');
          rssRadio3.setAttribute('id', 'rad3');

          var lblRad1 = document.createElement('label');
          var lblRad2 = document.createElement('label');
          var lblRad3 = document.createElement('label');

          var linebr1 = document.createElement('br');
          var linebr2 = document.createElement('br');
          var linebr3 = document.createElement('br');

          lblRad1.innerHTML = "<b>Same date and time</b> as this campaign sends.";
          lblRad2.innerHTML = "<b>Same date</b> as this campaign sends but different time.";
          lblRad3.innerHTML = "Custom date and time";

          lblRad1.setAttribute("for", "rad1");
          lblRad2.setAttribute("for", "rad2");
          lblRad3.setAttribute("for", "rad3");

          rssDiv.appendChild(rssRadio1);
          rssDiv.appendChild(lblRad1);
          rssDiv.appendChild(linebr1);
          rssDiv.appendChild(rssRadio2);
          rssDiv.appendChild(lblRad2);
          rssDiv.appendChild(linebr2);
          rssDiv.appendChild(rssRadio3);
          rssDiv.appendChild(lblRad3);
          rssDiv.appendChild(linebr3);
        
          this.inputEl = rssDiv;
        }
        return this.inputEl;
      },
      createRadioElement(name, checked, label) {
          var radioHtml = '<input type="radio" name="' + name + '"';
          if ( checked ) {
              radioHtml += ' checked="checked"';
          }
          radioHtml += '/>' + label;
      
          var radioFragment = document.createElement('div');
          radioFragment.innerHTML = radioHtml;
      
          return radioFragment.firstChild;
      },
      renderLabel() {
          this.$el.html(
            '<div class="' + this.labelClass + '">Start RSS Feed</div>'
          );
        },
      /**
       * Triggered when the value of the model is changed
       */
      
      onValueChange: function () {
        //this.target.set('content', this.model.get('value'));
      }
    });

    editor.TraitManager.addType('rssFormatOptions', {
      events:{
        //click: 'onClick',  // trigger parent onChange method on keyup
      },
      /**
      * Returns the input element
      * @return {HTMLElement}
      */
      getInputEl: function() {
        if (!this.inputEl) {
          var rssDiv = document.createElement('div');

          //ordered list checbox and span
          var olSpan = document.createElement("span");
          olSpan.setAttribute("class", "fa fa-list-ol");
          var cbOl = document.createElement("input");
          cbOl.setAttribute("type", "checkbox");
          cbOl.setAttribute("class", "number");
          cbOl.setAttribute("checked", "checked");
          cbOl.style.display = "none";


          //un-ordered list checkbox and span
          var ulSpan = document.createElement("span");
          ulSpan.setAttribute("class", "fa fa-list-ul")
          var cbUl = document.createElement("input");
          cbUl.setAttribute("type", "checkbox");
          cbUl.setAttribute("class", "bullet");
          cbUl.style.display = "none";

          //add cb's to span, spans to div
         
          olSpan.appendChild(cbOl);
          ulSpan.appendChild(cbUl);
        
          rssDiv.appendChild(ulSpan);
          rssDiv.appendChild(olSpan);
        
         
          olSpan.addEventListener("click", function() {
                enableOl();
                disableUl();
          });

          ulSpan.addEventListener("click", function() {
              enableUl();
              disableOl();
          });

        
          this.inputEl = rssDiv;

          enableOl();
          disableUl();
        }
        return this.inputEl;
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





    function enableOl() {

      $(".gjs-trt-trait .fa-list-ol").css({
        'height': '30px',
        'padding': '5px 8px 5px 8px',
        'color': 'white',
        'background': '#2e7aa9',
        'border-radius': '3px',
        'font-size': '2rem'
      });
    }

    function disableOl() {
      $(".gjs-trt-trait .fa-list-ol").css({
        'height': '30px',
        'padding': '5px 8px 5px 8px',
        'color': '#000',
        'background': 'rgb(219, 220, 221)',
        'border-radius': '3px',
        'font-size': '2rem'
      });
    }

    function enableUl() {
      $(".gjs-trt-trait .fa-list-ul").css({
        'height': '30px',
        'padding': '5px 8px 5px 8px',
        'color': 'white',
        'background': '#2e7aa9',
        'border-radius': '3px',
        'font-size': '2rem'
      });
    }

    function disableUl() {
      $(".gjs-trt-trait .fa-list-ul").css({
        'height': '30px',
        'padding': '5px 8px 5px 8px',
        'color': '#000',
        'background': 'rgb(219, 220, 221)',
        'border-radius': '3px',
        'font-size': '2rem'
      });
    }


  }
    function disableRSSDates() {

      $(".gjs-trt-trait").find('.gjs-label').filter(function() {
          return $(this).text().toLowerCase() == "start date"
        }).css("color", "#afafaf")

        $(".gjs-trt-trait").find('.gjs-label').filter(function() {
          return $(this).text().toLowerCase() == "start time"
        }).css("color", "#afafaf")


      $(".gjs-trt-trait").find('.gjs-label').filter(function() {
          return $(this).text().toLowerCase() == "start date"
        }).parent().find("input").css("color", "#afafaf").prop('disabled', true);

        $(".gjs-trt-trait").find('.gjs-label').filter(function() {
          return $(this).text().toLowerCase() == "start time"
        }).parent().find("input").css("color", "#afafaf").prop('disabled', true);
    }

    function enableRSSDates() {
      $(".gjs-trt-trait").find('.gjs-label').filter(function() {
          return $(this).text().toLowerCase() == "start date"
        }).css("color", "inherit")

        $(".gjs-trt-trait").find('.gjs-label').filter(function() {
          return $(this).text().toLowerCase() == "start time"
        }).css("color", "inherit")

      $(".gjs-trt-trait").find('.gjs-label').filter(function() {
          return $(this).text().toLowerCase() == "start date"
        }).parent().find("input").css("color", "inherit").prop('disabled', false);

      $(".gjs-trt-trait").find('.gjs-label').filter(function() {
          return $(this).text().toLowerCase() == "start time"
      }).parent().find("input").css("color", "inherit").prop('disabled',false);
    }

    function disableDateEnableTime() {
      $(".gjs-trt-trait").find('.gjs-label').filter(function() {
        return $(this).text().toLowerCase() == "start date"
      }).css("color", "#afafaf")

      $(".gjs-trt-trait").find('.gjs-label').filter(function() {
        return $(this).text().toLowerCase() == "start date"
      }).parent().find("input").css("color", "#afafaf").prop('disabled', true);
     

      $(".gjs-trt-trait").find('.gjs-label').filter(function() {
        return $(this).text().toLowerCase() == "start time"
      }).css("color", "inherit")

      $(".gjs-trt-trait").find('.gjs-label').filter(function() {
        return $(this).text().toLowerCase() == "start time"
    }).parent().find("input").css("color", "inherit").prop('disabled',false);

    }




  