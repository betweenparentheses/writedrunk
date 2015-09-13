
// MODELS

var Paragraph = Backbone.Model.extend({

  defaults: {
    text: "",
    createdAt: function(){
      return new Date();
    }
  }

});

// COLLECTIONS

var Entry = Backbone.Collection.extend({
  model: Paragraph
});


// ROUTER

var WriteRouter = Backbone.Router.extend({

  collection: new Entry(),

  routes: {
    "":             "drunk",
    "sober":        "sober"
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
    this.view = new view({collection: this.collection});
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
    // this.listenTo(this.model, "change", this.render);
  },

  render: function() {
    this.$el.append(this.template());
  },

  grabParagraph: function(){
    var $writespace = this.$('#writespace');

    this.collection.add( new Paragraph({
      text: $writespace.val(),
    }) )
    $writespace.val('');
  },

  keyEvent: function(e) {
    switch(e.which){
      case 8: //backspace
        event.preventDefault();
        break;
      case 13: //enter
        this.grabParagraph();
        break;
      default:
        // do nothing special
        break;
    }

  },

  close: function(){
    this.remove();
    $(document.body).append('<div class="container" id="main"></div>')
  }

});

var ReadSpace = Backbone.View.extend({
  el: "#main",

  template: _.template('<p class="paragraph"><%= paragraph %></p>'),

  initialize: function(){
    $(document.body).addClass('sober');
    this.$el.html('<div class="row"><div class="col-sm-8 col-sm-offset-2"></div></div>');
    this.render()
  },

  render: function(){
    var self = this;

    this.collection.each(function(graf){
      self.$el.append( self.template({paragraph: graf.get('text')}) )
    });
  },

  close: function(){
    this.remove();
    $(document.body).removeClass('sober');
    $(document.body).append('<div class="container" id="main"></div>')
  }
})





// INIT

$(document).ready(function(){
  window.router = new WriteRouter();


  // turn on event handling for internal links
  $(document).on('click', 'a', function (event) {
      // here, ensure that it was a left-mouse-button click. middle click should be
      // allowed to pass through
      event.preventDefault();
      console.log(this.pathname.slice(1));
      router.navigate(this.pathname.slice(1), {trigger: true});
  });


  var main = document.getElementById('main');
  $(document).on('click', '.fullscreen', function(){
    // get native DOM element

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