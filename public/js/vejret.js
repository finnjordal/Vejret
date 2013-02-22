
var VEJRET = {};

Function.prototype.curry = function curry() {
  var fn = this, args = Array.prototype.slice.call(arguments);
  return function curryed() {
    return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)));
  };
};

$(function () {
  var socket = io.connect('http://localhost');
  socket.on('animation', function (data) { 
    $("#imganimation").attr("src", "/images/animation.gif");
  });

  VEJRET.lokationsvalg = "gps";
  VEJRET.postnr = 1000;
  if (Modernizr.localstorage && localStorage["lokationsvalg"] != null) {
    VEJRET.lokationsvalg = localStorage["lokationsvalg"];
    VEJRET.postnr = localStorage["postnummer"];
  }
  VEJRET.update();
  $('#indstil').live('pagebeforeshow', function (event, ui) {
    $("input[name=lokvalg]").val([VEJRET.lokationsvalg]);
    $('#postnummer').val(VEJRET.postnr)
  });
  $('#indstil').live('pagebeforehide', function (event, ui) {
    VEJRET.lokationsvalg = $('input:radio[name=lokvalg]:checked').val();
    VEJRET.postnr = $('#postnummer').val();
    VEJRET.update();
    if (!Modernizr.localstorage) return;
    localStorage["lokationsvalg"] = VEJRET.lokationsvalg;
    localStorage["postnummer"] = VEJRET.postnr;
  });
  /* $('#indstil').live('swipeleft', function (event, ui) {
  $.mobile.changePage("#todoegn", "slide"); 
  history.back();
  return false;
  });*/
  $('#indstil').live('swiperight', function (event, ui) {
    /* $.mobile.changePage("#todoegn", "slide"); */
    history.back();
    return false;
  });
  /* $('#om').live('swipeleft', function (event, ui) {
  $.mobile.changePage("#todoegn", "slide"); 
  history.back();
  return false;
  });*/
  $('#om').live('swiperight', function (event, ui) {
    /* $.mobile.changePage("#todoegn", "slide"); */
    history.back();
    return false;
  });
  $('#todoegn').live('swipeleft', function (event, ui) {
    $.mobile.changePage("#nidoegn", { transition: "slide" });
  });
  $('#nidoegn').live('swipeleft', function (event, ui) {
    $.mobile.changePage("#fjortendoegn", { transition: "slide" });
  });
  $('#fjortendoegn').live('swipeleft', function (event, ui) {
      $.mobile.changePage("#nedboersanimation", { transition: "slide" });
  });
  $('#nedboersanimation').live('swipeleft', function (event, ui) {
      $.mobile.changePage("#todoegn", { transition: "slide" });
  });
  $('#nedboerstype').live('swipeleft', function (event, ui) {
    $.mobile.changePage("#nedboersanimation", { transition: "slide" });
  });
  $('#todoegn').live('swiperight', function (event, ui) {
      $.mobile.changePage("#nedboersanimation", { transition: "slide", reverse: true });
  });
  $('#nidoegn').live('swiperight', function (event, ui) {
    $.mobile.changePage("#todoegn", { transition: "slide", reverse: true });
  });
  $('#fjortendoegn').live('swiperight', function (event, ui) {
    $.mobile.changePage("#nidoegn", { transition: "slide", reverse: true });
  });
  $('#nedboersanimation').live('swiperight', function (event, ui) {
      $.mobile.changePage("#fjortendoegn", { transition: "slide", reverse: true });
  });
  $('#nedboerstype').live('swiperight', function (event, ui) {
    $.mobile.changePage("#nedboersanimation", { transition: "slide", reverse: true });
  });
});

VEJRET.update = function () {
  if (VEJRET.lokationsvalg === 'gps' && Modernizr.geolocation) {
    navigator.geolocation.getCurrentPosition(VEJRET.getposition);
  }
  else {
    VEJRET.hentbilleder(VEJRET.postnr);
  }
}

VEJRET.getposition = function (position) {
  if (position && position.coords) {
    var coords = position.coords;
    var url = "http://geo.oiorest.dk/postnumre/" + coords.latitude + "," + coords.longitude + ".json";
    $.ajax({
      url: url,
      dataType: "jsonp",
      error: VEJRET.fejlikommunikation,
      success: VEJRET.getpostnr
    });
  }
  else {
    VEJRET.hentbilleder(1000);
  }
};

VEJRET.getpostnr = function (data) {
  VEJRET.hentbilleder(data.fra);
};

VEJRET.hentbilleder = function (postnr) {
  if (postnr < 2600) {
    postnr = 1000;
  }
  else if (postnr >= 8000 && postnr < 8300) {
    postnr = 8000;
  }
  else if (postnr >= 9000 && postnr <= 9260) {
    postnr = 9000;
  }
  else if (postnr >= 8900 && postnr <= 8960) {
    postnr = 8900;
  }
  else if (postnr >= 5000 && postnr <= 5270) {
    postnr = 5000;
  }
  //$("#img2doegn").attr("src", "http://servlet.dmi.dk/byvejr/servlet/byvejr_dag1?by=" + postnr + "&mode=long");
  //$("#img9doegn").attr("src", "http://servlet.dmi.dk/byvejr/servlet/byvejr?by=" + postnr + "&tabel=dag3_9");
  //$("#img14doegn").attr("src", "http://servlet.dmi.dk/byvejr/servlet/byvejr?by=" + postnr + "&tabel=dag10_14");
  $("#img2doegn").attr("src", "images/" + postnr + "/2/byvejr.gif");
  $("#img9doegn").attr("src", "images/" + postnr + "/9/byvejr.gif");
  $("#img14doegn").attr("src", "images/" + postnr + "/14/byvejr.gif");
};

VEJRET.fejlikommunikation = function (xhr, status, errorThrown) {
  alert(status + errorThrown);
};
