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

    if (typeof window.FileReader == "undefined") {
      $('.instructions').html('You need a newer browser (Firefox 38+, Safari 7.1+, Chrome 31+) to use this service.');
      $('.upload').attr('disabled', true);
    }

    this.tracer = new ImageTracer();
    
    this.canvas = $('canvas.canvas')[0]
    this.context = this.canvas.getContext('2d');
    this.canvas.width = $(window).width();
    this.canvas.height = $(window).height();

    var _vectorcam = this;

    $("#file-select input").change(function(e) {

      $('.spinner').show();
      $('.instructions').hide();

      var reader = new FileReader(),
          f = e.target.files[0];

      // Closure to capture the file information.
      reader.onload = (function(file) {

        return function(e) {

          _vectorcam.img = new Image();
  
          _vectorcam.img.onload = function(e) {

            var _img = this; //e.path[0];

            _vectorcam.imgWidth  = _img.width;
            _vectorcam.imgHeight = _img.height;
            _vectorcam.imgRatio  = _img.height/_img.width;

            if (_img.width > 1000 || _img.height > 1000) {
              _vectorcam.imgWidth = 1000;
              _vectorcam.imgHeight = _vectorcam.imgWidth * _vectorcam.imgRatio;
            }

            _vectorcam.canvas.width = _vectorcam.imgWidth;
            _vectorcam.canvas.height = _vectorcam.imgHeight;

            _vectorcam.context.drawImage(_vectorcam.img, 0, 0, _vectorcam.canvas.width, _vectorcam.canvas.width * _vectorcam.imgRatio);

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
      // don't actually show the svg; use it as a background:
      $('#svg').hide();
      $('body').css('background-image',"url('"+"data:image/svg+xml;utf8,"+$('#svg').html()+"')")
      $('.spinner').hide();

    }

    $('.btn-options').click(function(e) {
      $('.options').toggle();
    });

    $('.reload').click(function(e) {
      $('.spinner').show();
      _vectorcam.options.numberofcolors = parseInt($('.colors').val());
      _vectorcam.options.pathomit = parseInt($('.pathomit').val());
      _vectorcam.generate();
    });

    $('.save').click(function(e) {
      var name = prompt('Name your image', 'vectorcam.svg');
      $('.save').attr('download', name);
    });

  },

  clear: function() {
    $('.canvas').show();
    $('.upload').show();
    $('.btn-options').hide();
    // $('#svg').hide();
  }

});


