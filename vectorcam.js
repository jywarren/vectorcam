jQuery(document).ready(function($) {

  vectorcam = new VectorCam();

});

// simple class declaration & inheritance
Class = function(methods) {   
  var klass = function() {    
    this.initialize.apply(this, arguments);          
  };  
  
  for (var property in methods) { 
    klass.prototype[property] = methods[property];
  }
        
  if (!klass.prototype.initialize) klass.prototype.initialize = function(){};      
  
  return klass;    
};

VectorCam = Class({

  options: { 
    numberofcolors: 16, 
    colorquantcycles: 5,
  },

  initialize: function() {

    this.tracer = new ImageTracer();
    
    this.canvas = $('canvas.canvas')[0]
    this.context = this.canvas.getContext('2d');
    this.canvas.width = $(window).width();
    this.canvas.height = $(window).height();

    var _vectorcam = this;

    $("#file-select input").change(function() {

      var reader = new FileReader(),
          f = this.files[0];

      // Closure to capture the file information.
      reader.onload = (function(file) {
        return function(e) {

          _vectorcam.img = new Image();
  
          _vectorcam.img.onload = function() {

            _vectorcam.context.drawImage(_vectorcam.img, 0, 0);

            _vectorcam.generate();

          };
          _vectorcam.img.src = e.target.result;

        };
      })(f);
 
      // Read in the image file as a data URL.
      reader.readAsDataURL(f);

    });

    this.generate = function() {

      $('#svg').remove();

      var img = _vectorcam.tracer.getImgdata( _vectorcam.canvas );
 
      var svgstr = _vectorcam.tracer.imagedataToSVG( img, _vectorcam.options );
 
      _vectorcam.tracer.appendSVGString( svgstr, 'svg' );

      $('.save').attr('href',"data:image/svg+xml;utf8,"+$('#svg').html());
      $('.save').show();
      $('.btn-options').show();
      $('.canvas').hide();
      $('.upload').hide();
      $('#svg').show();

    }

    $('.btn-options').click(function(e) {
      $('.options').toggle();
    });

    $('.reload').click(function(e) {
      _vectorcam.options.numberofcolors = parseInt($('.colors').val());
      _vectorcam.options.pathomit = parseInt($('.pathomit').val());
      _vectorcam.generate();
    });

  },

  clear: function() {
    $('.canvas').show();
    $('.upload').show();
    $('.btn-options').hide();
    $('#svg').hide();
  }

});
