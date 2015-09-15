
// MODELS

var Entry = Backbone.Model.extend({

  url: "http://editsober.herokuapp.com/entries",

  defaults: {
    text: "",
    createdAt: function(){
      return new Date();
    }
  }

});



// ROUTER

var WriteRouter = Backbone.Router.extend({

  model: new Entry(),

  routes: {
    "":             "goDrunk",
    "drunk":        "drunk",
    "sober":        "sober"
  },

  goDrunk: function(){
    var self = this,
        visitDrunk = function (e) {
          self.navigate('drunk', {trigger: true});
        };

    $('#intro-modal').modal();
    $('#intro-modal').on('hidden.bs.modal', visitDrunk)
  },

  drunk: function() {
    this.loadView( WriteSpace );
  },

  sober: function() {
    this.loadView( ReadSpace );
  },

  // set new view
  loadView : function(view) {
    // either run the close function or the plain old remove function
    this.view && (this.view.close ? this.view.close() : this.view.remove());
    this.view = new view({model: this.model});
  }

});


// VIEWS

var WriteSpace = Backbone.View.extend({

  el: '#main',

  template: _.template('<div class="row"><div class="col-sm-8 col-sm-offset-2"><textarea id="writespace"></textarea></div></div>'),

  events: {
    "keydown #writespace" : "keyEvent"
  },

  initialize: function() {
    this.render();
    this.$('textarea').focus();
  },

  render: function() {
    this.$el.append(this.template());
  },

  grabParagraph: function(){
    var $writespace = this.$('#writespace'),
        newText;

    if(!$writespace.val().length){
      return;
    } else if (!this.model.get('text').length){
      newText = $writespace.val();
    } else {
      newText = this.model.get('text') + '\n\n' + $writespace.val();
    }

    this.model.set('text', newText);
    $writespace.val('');
  },

  keyEvent: function(e) {
    switch(e.which){
      case 8: //backspace
        e.preventDefault();
        break;
      case 13: //enter
        e.preventDefault();
        this.grabParagraph();
        break;
      default:
        // do nothing special
        break;
    }

  },

  close: function(){
    this.grabParagraph();
    this.remove();
    $(document.body).append('<div class="container" id="main"></div>')
  }

});

var ReadSpace = Backbone.View.extend({
  el: "#main",

  template: _.template('<p class="paragraph"><%= paragraph %></p>'),

  events: {
    "keydown #readspace" : "keyEvent"
  },

  initialize: function(){
    $(document.body).addClass('sober');
    this.$el.html('<div class="row"><div class="col-sm-8 col-sm-offset-2 readcolumn"></div></div>');
    this.render()
  },

  render: function(){
    var self = this,
        text = this.model.get('text'),
        formString = '<div class ="form-group"><form action = "http://editsober.herokuapp.com/txt" method="POST"><input type="hidden" name="token" value="s3cret-W0wWwWw"><input type="hidden" class="textstring" name="text" value=""><input type="submit" value="Save as TXT file" class="btn btn-primary pull-right"><br><textarea id="readspace"></textarea></form></div>';

    this.$('.readcolumn').html(formString)
    this.$('#readspace').val(text);
    this.$('.textstring').val(text);
  },

  keyEvent: function(e) {
    switch(e.which){
      case 8: //backspace
      case 13: //enter
      case 32: //spacebar
      case 46: //delete
        this.persistChanges();
      case 37: // arrows
      case 38:
      case 39:
      case 40:
        break;
      default:
        // regular keys shouldn't work
        e.preventDefault();
        break;
    }

  },

  persistChanges: function(){
    var text = this.$('#readspace').val()
    this.model.set('text', text);
    this.$('.textstring').val(text);
  },

  close: function(){
    this.persistChanges();
    this.remove();
    $(document.body).removeClass('sober');
    $(document.body).append('<div class="container" id="main"></div>')
  }
})





// INIT SECTION!!!!s

$(document).ready(function(){
  window.router = new WriteRouter();

  // turn on event handling for internal links
  $(document).on('click', '.bb-link', function (event) {
      event.preventDefault();
      router.navigate(this.pathname.slice(1), {trigger: true});
  });


  $(document).on('click', '.fullscreen', function(e){
    var main = document.getElementById('main');
    e.preventDefault();

    if (main.requestFullscreen) {
      main.requestFullscreen();
      } else if (main.mozRequestFullScreen) {
      main.mozRequestFullScreen();
      } else if (main.webkitRequestFullscreen) {
      main.webkitRequestFullscreen();
    }
  });

  Backbone.history.start({pushState: true});

})