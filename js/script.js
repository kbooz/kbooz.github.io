/*!
 * Start Bootstrap - Creative Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */
 var frutas = ["laranja","pimentao","morango"];
 var atributes = ["fechado","feliz","surpreso","convencional"];

(function($) {
    "use strict"; // Start of use strict


    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    })

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Fit Text Plugin for Main Header
    $("h1").fitText(
        1.2, {
            minFontSize: '35px',
            maxFontSize: '65px'
        }
    );

    $(".overlay-content-box").fitText(
        1.2, {
            minFontSize: '35px',
            maxFontSize: '65px'
        }
    );

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    })

    // Initialize WOW.js Scrolling Animations
    new WOW().init();

})(jQuery); // End of use strict

function randomFruit()
{
	var num = Math.floor((Math.random() * frutas.length));
	return frutas[num];
}

function pickFruit(fruta)
{
	if (isFruit(fruta))
		return fruta;
	else
		return randomFruit();
}

function isFruit(fruta)
{
	for (var i = 0; i < frutas.length; i++) {
		if (frutas[i] == fruta)
			return true;
	}
	return false;
}

function getAtribute(attrs)
{
	for (var e = 0; e < attrs.length; e++) {
		for (var i = 0; i < atributes.length; i++) {
			if (attrs[e] == atributes[i])
				return atributes[i];
		}
	}
	return false;
}

function getUrlParameter(sParam)
{
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++)
	{
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam)
			{
					return sParameterName[1];
			}
	}
}
var text = "";
$(".fruta").attr("src",function(){
  var atribute = getAtribute($(this).attr("class").split(" "));
  console.log(atribute);
  var fruta = pickFruit(getUrlParameter("fruta"));
  text += fruta + " " + atribute + "\n";
  $("#te").text(text);
  return "img/svg/"+fruta+"_"+atribute+".svg";
});

$(".fruta").click(function(e){
  e.preventDefault();
  alert($(this).attr("src"));
})

$("#link-harmonia").click(function(){
  $("#overlay-wrapper").show();
  $("#overlay-harmonia").show();
});

$("#link-diferenca").click(function(){
  $("#overlay-wrapper").show();
  $("#overlay-diferenca").show();
});

$("#link-concentracao").click(function(){
  $("#overlay-wrapper").show();
  $("#overlay-concentracao").show();
});

$("#hide").click(function(){
  $("#overlay-wrapper").hide();
  $("#overlay-wrapper").children().hide();
  $("#hide").show();
})
