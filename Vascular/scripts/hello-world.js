// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
	startConfirm();
}

function onConfirm(button) {
	if (button == true) {
		setTimeout(function() {
			app.navigate("#indice"); // Do something after 2 seconds
		}, 2000);
	}else{
        navigator.app.exitApp();
    }
}

function startConfirm() {
	navigator.notification.confirm(
		'Aqui según respùesta de si o no.', // message
		onConfirm, // callback to invoke with index of button pressed
		'¿Es usted profesional satnitario?', // title
		'Si, No'          // buttonLabels
		);
}


// JavaScript Document
$('#cajaTexto').click(function() {
	$(this).select();
});

function btnEliminar() {
	$(".contenido").each(function() {
		if ($(this).hasClass('km-state-active')) {
			alert('Si');
		}
		else {
			alert('Mo');   
		}
	});

}

//ListView Filter Anexo
(function ($) {
	jQuery.expr[':'].Contains = function(a, i, m) {
		return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
	};
  
	function filterList(header, list) {
		var form = $("<form>").attr({"class":"filterform","action":"#"}),
		input = $("<input>").attr({"class":"filterinput","type":"text"});
		$(form).append(input).appendTo(header);
  
		$(input)
		.change(function () {
			var filter = $(this).val();
			if (filter) {
       
				$matches = $(list).find('a:Contains(' + filter + ')').parent();
				$('li', list).not($matches).slideUp();
				$matches.slideDown();
             
			}
			else {
				$(list).find("li").slideDown();
			}
			return false;
		})
		.keyup(function () {
			$(this).change();
		});
	}
  
	$(function () {
		filterList($("#headeranexos"), $("#list"));
	});
}(jQuery));

//Cerrar app
function Exit() {
	navigator.app.exitApp();
}

//Ocultar cuadro de busqueda
function closeModalViewSearch() {
	$("#modalview-search").kendoMobileModalView("close");
}
function closeModalViewAnexos() {
	$("#modalview-anexos").kendoMobileModalView("close");
}

//Resaltar texto buscado
function borrarBusqueda() {
	$('span').removeClass('resaltarTexto');
}

function resaltarTexto() {
	$(".resaltarTexto").each(function() {
		$(this).removeClass('resaltarTexto');
	});
	$(".lectura").each(function() {
		$(this).resaltar(cajaTexto.value, "resaltarTexto");
	});
}

jQuery.fn.extend({
	resaltar: function(busqueda, claseCSSbusqueda) {
		var regex = new RegExp("(<[^>]*>)|(" + busqueda.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1") + ')', 'ig');
		var nuevoHtml = this.html(this.html().replace(regex, function(a, b, c) {
			return (a.charAt(0) == "<") ? a : "<span class=\"" + claseCSSbusqueda + "\">" + c + "</span>";
		}));
		return nuevoHtml;
	}
})

// Resetear al tamaño original
var originalFontSize = $('html').css('font-size');

$(".resetFont").click(function() {
	$('.lectura').css('font-size', originalFontSize);
});

// Disminuir tamaño fuente
function disminuirText(e) {
	var currentFontSize = $('.lectura').css('font-size');
	var currentFontSizeNum = parseFloat(currentFontSize, 10);
	var newFontSize = currentFontSizeNum * 0.8;
	$('.lectura').css('font-size', newFontSize);
	return false;
}

// Aumentar tamaño fuente
function aumentarText(e) {
	var currentFontSize = $('.lectura').css('font-size');
	var currentFontSizeNum = parseFloat(currentFontSize, 10);
	var newFontSize = currentFontSizeNum * 1.2;
	$('.lectura').css('font-size', newFontSize);
	return false;
}

// Evento click en listas
function enact(what)
{
    what.style('background-color', 'red');
}

