var db;

// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
	var dbSize = 15 * 1024 * 1024; // 15MB  
    //var alturaV = getWindowHeight();
    //$('#bk-image').css({ bottom: "-"+(alturaV / 6) +"%" , position: "absolute"});
	db = openDatabase("vascular", "1.0", "Base de datos de apartados", dbSize);
	db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS idiomas(id INTEGER PRIMARY KEY ASC , idioma TEXT, activo INTEGER)");
		tx.executeSql("CREATE TABLE IF NOT EXISTS apartados(id INTEGER PRIMARY KEY ASC , indice TEXT, parent TEXT, titulo TEXT, cuerpo TEXT, idioma INTEGER )");
		tx.executeSql("CREATE TABLE IF NOT EXISTS indice(idioma INTEGER, ind TEXT)");
        tx.executeSql("CREATE TABLE IF NOT EXISTS indiceanexos(idioma INTEGER, ind TEXT)");
		tx.executeSql("CREATE TABLE IF NOT EXISTS favoritos(id INTEGER , nombre TEXT)");
		tx.executeSql("CREATE TABLE IF NOT EXISTS tablas(id INTEGER PRIMARY KEY ASC , nombre TEXT, idioma INTEGER)");
		tx.executeSql("CREATE TABLE IF NOT EXISTS anexos(id INTEGER PRIMARY KEY ASC , indice TEXT, parent TEXT, titulo TEXT, cuerpo TEXT, idioma INTEGER )");
		tx.executeSql("SELECT * FROM idiomas", [],
					  function(tx, result) {
						  try {
							  result.rows.item(0);
						  }
						  catch (err) {
							  tx.executeSql("INSERT INTO idiomas(idioma, activo) VALUES(?,?)", ["Catalán", 1]);
							  tx.executeSql("INSERT INTO idiomas(idioma, activo) VALUES(?,?)", ["Spanish", 0]);
							  tx.executeSql("INSERT INTO idiomas(idioma, activo) VALUES(?,?)", ["English", 0]);
						  }						  
					  });
	}); 
	db.transaction(function(tx) {
		tx.executeSql("SELECT id FROM idiomas WHERE activo=1", [],
					  function(tx, result) {
						  localStorage.setItem('idioma', result.rows.item(0)['id']);					
					  });
	});
	loadIndex(localStorage.getItem("idioma"));
}

function onConfirm(button) {
	if (button == true) {
		setTimeout(function() {
			app.navigate("#indice"); // Do something after 2 seconds
		}, 2000);
	}
	else {
		navigator.app.exitApp();
	}
}

function startConfirm(idioma) {
	switch (parseInt(idioma)) {
		case 1:
			//Catalan
			navigator.notification.confirm(
				'La información contenida en la presente aplicación va destinada, exclusivamente,' +
				'a profesionales de la salud. Nunca deberá utilizarse la información disponible en la aplicación como' +
				'única fuente para la toma de decisiones de carácter médico. Biogen idec no será responsable,' +
				'en ningún caso, de las consecuencias derivadas de decisiones basadas, en la información disponible' +
				'en la aplicación. El profesional de la salud será quien, en cada caso, deba valorar toda la información,' +
				'o literatura científica disponible y tomar una decisión, con arreglo a sus conocimientos.La información' +
				'contenida en la presente aplicación va destinada, exclusivamente, a profesionales de la salud. Nunca' +
				'deberá utilizarse la información disponible en la aplicación como única fuente para la toma de' +
				'decisiones de carácter médico. Méderic Ediciones no será responsable, en ningún caso, de las' +
				'consecuencias derivadas de decisiones basadas, en la información disponible en la aplicación.' +
				'El profesional de la salud será quien, en cada caso, deba valorar toda la información, o' +
				'literatura científica disponible y tomar una decisión, con arreglo a sus conocimientos.', // message
				onConfirm, // callback to invoke with index of button pressed
				'¿Es usted profesional satnitario?', // title
				'Si, No'          // buttonLabels
				);
			break;
		case 2:
			//español
			navigator.notification.confirm(
				'Aquí responda si o no.', // message
				onConfirm, // callback to invoke with index of button pressed
				'¿Es usted profesional sanitario?', // title
				'Si, No'          // buttonLabels
				);
			break;
		default:
			//ingles
			navigator.notification.confirm(
				'Here answer yes or no', // message
				onConfirm, // callback to invoke with index of button pressed
				'Do you care professional?', // title
				'Yes, No'          // buttonLabels
				);
	}
}

function loadIndex(idioma) {    
	switch (parseInt(idioma)) {
		case 1:
			app.navigate('#tabstrip-home-catalan');
			startConfirm(idioma);
			break;
		case 2:
			app.navigate('#tabstrip-home-spanish');
			startConfirm(idioma);
			break;
		case 3:
			app.navigate('#tabstrip-home-english');
			startConfirm(idioma);
			break;
		default:
			alert("Error en idioma");
	}
}

function fail(error) {
	console.log(error.code);
}

//ListView Filter Anexo

(function ($) {
	// custom css expression for a case-insensitive contains()
	jQuery.expr[':'].Contains = function(a, i, m) {
		return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
	};
	
	function filterList(header, list) { 
		// header is any element, list is an unordered list
		// create and add the filter form to the header
		var form = $("<form>").attr({"class":"filterform","action":"#"}),
		input = $("<input>").attr({"class":"filterinput","type":"search","name":"s","result":"0","id":"headeranexoss", "style":"padding-left:1%;", "placeholder":"Cercar..." });
		
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
			// fire the above change event after every letter
			$(this).change();
		});
	}
	
	//ondomready
	$(function () {
		filterList($("#form"), $("#list-anexoss"));
		filterList($("#form-buscador"), $("#list-anexos"));
	});
}(jQuery));
//Cerrar app
function Exit() {
	navigator.app.exitApp();
}

//Obteniendo tamaño ral de la pantalla
function getWindowWidth() {
	var windowWidth = 0;
	if (typeof(window.innerWidth) == 'number') {
		windowWidth = window.innerWidth;
	}
	else {
		if (document.documentElement && document.documentElement.clientWidth) {
			windowWidth = document.documentElement.clientWidth;
		}
		else {
			if (document.body && document.body.clientWidth) {
				windowWidth = document.body.clientWidth;
			}
		}
	}
	return windowWidth;
}
function getWindowHeight() {
	var windowHeight = 0;
	if (typeof(window.innerHeight) == 'number') {
		windowHeight = window.innerHeight;
	}
	else {
		if (document.documentElement && document.documentElement.clientHeight) {
			windowHeight = document.documentElement.clientHeight;
		}
		else {
			if (document.body && document.body.clientHeight) {
				windowHeight = document.body.clientHeight;
			}
		}
	}
	return windowHeight;
}

//Ocultar cuadro de busqueda
function closeModalViewSearch() {
	$("#modalview-search").kendoMobileModalView("close");
}
function closeModalViewAnexos() {
	$("#modalview-anexos").kendoMobileModalView("close");
}
function closeModalViewListAnexos() {
	$("#modalview-list-anexos").kendoMobileModalView("close");
}

//Resaltar texto buscado
function borrarBusqueda() {
	$('span').removeClass('resaltarTexto');
}

function resaltarTexto(id, texto) {
    console.log('fdgfdsfsaf');
	$(".resaltarTexto").each(function() {
		$(this).contents().unwrap();
	});
	
	if ((texto != "") && texto != " ") {
		$("#" + id + " .lectura").each(function() {
			$(this).resaltar(texto, "resaltarTexto", id);
		});
	}
}

jQuery.fn.extend({
	resaltar: function(busqueda, claseCSSbusqueda, id) {
		var regex = new RegExp("(<[^>]*>)|(" + busqueda.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1") + ')', 'ig');
		var nuevoHtml = this.html(this.html().replace(regex, function(a, b, c) {
			return (a.charAt(0) == "<") ? a : "<span class=\"resaltarTexto\" data=\"" + id + "\">" + c + "</span>";
		}));
		console.log("html: " + nuevoHtml);
		return nuevoHtml;
	}
});

// Resetear al tamaño original
var originalFontSize = $('html').css('font-size');

$(".resetFont").click(function() {
	$('.lectura').css('font-size', originalFontSize);
});

// Disminuir tamaño fuente
function disminuirText(e) {
	var currentFontSize = $('.lectura *, .lectura').css('font-size');
	var currentFontSizeNum = parseFloat(currentFontSize, 10);
	var newFontSize = currentFontSizeNum * 0.8;
	$('.lectura *, .lectura').css('font-size', newFontSize);
	return false;
}

// Aumentar tamaño fuente
function aumentarText(e) {
	var currentFontSize = $('.lectura *, .lectura').css('font-size');
	var currentFontSizeNum = parseFloat(currentFontSize, 10);
	var newFontSize = currentFontSizeNum * 1.2;
	$('.lectura *, .lectura').css('font-size', newFontSize);
	return false;
}

function togglebuscar() {
	if ($(".buscar-content").css("display") == "none") {
		$(".buscar-content").css("display", "block");
		$(".titulo").css("display", "none");
	}
	else {
		$(".buscar-content").css("display", "none");				
		$(".titulo").css("display", "block");
	}
}

$(".eliminables").live("click", function(e) {
	$(this).addClass("eliminables-selected");
});        
			
$("#boton-eliminar").live("click", function(e) {
	$("#div-list-favoritos li").each(function() {
		if ($(this).hasClass("eliminables-selected")) {
			var elem = $(this).attr("id");
			removeFavorito(elem);
		}
	});
	listfavoritos();				
});

function showUsers(users) {
	$("#div-list-favoritos").html("");
	for (var i = 0; i < users.length; i++) {
		$("#div-list-favoritos").append("<li id=" + "\'" + users[i][0] + "\'" + " onclick=" + "get_apartado(\'" + users[i][0] + "\'" + ");>" + users[i][1] + "</li>");
	}
}
			
function listfavoritos() {
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM favoritos", [],
					  function(tx, result) {
						  var output = [];
						  for (var i = 0; i < result.rows.length; i++) {
							  output.push([
								  result.rows.item(i)['id'],
								  result.rows.item(i)['nombre']
							  ]);
						  }
			
						  showUsers(output);
					  });
	});
}

function addFavorito(indice, nombre) {
	db.transaction(function(tx) {
		tx.executeSql("INSERT INTO favoritos(id, nombre) VALUES(?,?)", [indice, nombre]);
	});
	alert("Es va afegir a favorits!");
	listfavoritos();
}

function restarFavorito() {				       
	$("#dltbtnfv").css({ background: "#EC0C3C" });
	$("#dltbtnfv").removeClass("ocupado");
	$("#div-list-favoritos > li").removeClass("eliminables");
}
	
function get_apartado(item) {
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM apartados where id=" + item, [],
					  function(tx, result) {
						  inclusion(result.rows.item(0));
					  });
	});
}

function get_anexo(item) {
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM anexos where id=" + item, [],
					  function(tx, result) {
						  inclusionAnexo(result.rows.item(0));
					  });
	});
}

function inclusionAnexo(item) {
	$('body').css('background-color', '#FFFFFF');
	
    $('#anexview').attr('data-db', item.id);
	$('#anexview').children().children().eq(1).find('tbody').children().children().children().eq(0).text(item.indice + " " + item.titulo);
	$('#anexview-contenido').html(item.cuerpo);
	app.navigate('#anexview');
}
			
function inclusion(item) {
	$('body').css('background-color', '#FFFFFF');
	db.transaction(function(tx) {
		tx.executeSql("SELECT titulo FROM apartados where indice < (SELECT indice FROM apartados WHERE id=" + item.id + ") ORDER BY indice DESC", [],
					  function(tx, result) {
						  $('#pagina').attr('data-title', result.rows.item(0)['titulo']);
						  $('#pagina').children().eq(0).children().eq(0).children().eq(2).children().html(result.rows.item(0)['titulo']);
						  console.log(result.rows.item(0));
					  });
	});
	$('#pagina').attr('data-db', item.id);
	$('#pagina').children().children().eq(1).find('tbody').children().children().children().eq(0).text(item.indice + " " + item.titulo);
	$('#pagina-contenido').html(item.cuerpo);
	$('#pagina').find('footer').children().children().children().eq(0).children().eq(0).attr('onclick', 'prev_apartado(' + item.id + ');');
	$('#pagina').find('footer').children().children().children().eq(0).children().eq(1).attr('onclick', 'next_apartado(' + item.id + ');');
	app.navigate('#pagina');
}

function next_apartado(actual) {
	var idio = localStorage.getItem('idioma');
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM apartados WHERE indice > (SELECT indice FROM apartados WHERE id=" + actual + " and idioma=" + idio + ") and idioma == " + idio + " LIMIT 1", [],
					  function(tx, result) {
						  console.log(result.rows.item(0));
						  if (result.rows.item(0)['cuerpo'] == null) {
							  next_apartado(result.rows.item(0)['id']);
							  app.navigate('#pagina');
						  }
						  else {
							  inclusion(result.rows.item(0));
						  }                          
					  });
	});      
}
			
function prev_apartado(actual) {
	var idio = localStorage.getItem('idioma');
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM apartados WHERE indice < (SELECT indice FROM apartados WHERE id=" + actual + " and idioma=" + idio + ") and idioma == " + idio + " and cuerpo != ' ' ", [],
					  function(tx, result) {
						  inclusion(result.rows.item(--result.rows.length));                       
					  });
	});     
}

function beforefavoritos() {
	$('body').css({ background: "#FFFFFF" });
	listfavoritos();
}

function beforecreditos() {
	$('body').css({ background: "#FFFFFF" });
}

function beforeidiomas() {
	$('body').css({ background: "#BD072F" });
	var idioma = localStorage.getItem("idioma");
	switch (parseInt(idioma)) {
		case 1:
			$('#idiomas').attr('data-title', 'IDIOMES');
			$('#idiomas').children().eq(0).children().eq(0).children().children().eq(1).html('IDIOMES');
			$('#idiomas').children().eq(0).children().eq(0).children().children().eq(0).children().html('ENRERE');
			$('#list-idiomas').html('<ul data-role="listview" data-style="inset"><li class="selectidio">CATALÁN</li><li class="unselectidio" onclick="cambioIdioma(2);">ESPAÑOL</li><li class="unselectidio" onclick="cambioIdioma(3);">INGLÉS</li><li class="unselectidio">POLACO</li></ul>');
			break;
		case 2:
			$('#idiomas').children().eq(0).children().eq(0).children().children().eq(0).children().html('ATRÁS');
			$('#idiomas').attr('data-title', 'IDIOMAS');
			$('#idiomas').children().eq(0).children().eq(0).children().children().eq(1).html('IDIOMAS');
			$('#list-idiomas').html('<ul data-role="listview" data-style="inset"><li class="unselectidio" onclick="cambioIdioma(1);">CATALÁN</li><li class="selectidio">ESPAÑOL</li><li class="unselectidio"onclick="cambioIdioma(3);">INGLÉS</li><li class="unselectidio">POLACO</li></ul>');
			break;
		case 3:
			$('#idiomas').attr('data-title', 'LANGUAGES');
			$('#idiomas').children().eq(0).children().eq(0).children().children().eq(1).html('LANGUAGES');
			$('#idiomas').children().eq(0).children().eq(0).children().children().eq(0).children().html('BACK');
			$('#list-idiomas').html('<ul data-role="listview" data-style="inset"><li class="unselectidio" onclick="cambioIdioma(1);">CATALÁN</li><li class="unselectidio" onclick="cambioIdioma(2);">ESPAÑOL</li><li class="selectidio">INGLÉS</li><li class="unselectidio">POLACO</li></ul>');
			break;
		default:
			console.log("Error before idioma");
	}
}

function cambioIdioma(id) {
	db.transaction(function(tx) {
		tx.executeSql("UPDATE idiomas SET activo='0' WHERE activo='1'");
		tx.executeSql("UPDATE idiomas SET activo='1' WHERE id=" + id);
	}); 
	localStorage.setItem('idioma', id);
	app.navigate('#indice');
}

function beforeindice() {
	$('body').css('background-color', '#BD072F');
	var idioma = localStorage.getItem("idioma");
	switch (parseInt(idioma)) {
		case 1:
			$('#indice').attr('data-title', 'ÍNDEX');
			$('#indice').children().eq(0).children().eq(0).children().children().eq(1).html('ÍNDEX');
			$('#indice').children().eq(0).children().eq(0).children().children().eq(0).children().html('INFO');
			show_indice(1);
			break;
		case 2:
			$('#indice').attr('data-title', 'INDICE');
			$('#indice').children().eq(0).children().eq(0).children().children().eq(1).html('INDICE');
			$('#indice').children().eq(0).children().eq(0).children().children().eq(0).children().html('INFO');
			show_indice(2);
			break;
		case 3:
			$('#indice').attr('data-title', 'INDEX');
			$('#indice').children().eq(0).children().eq(0).children().children().eq(1).html('INDEX');
			$('#indice').children().eq(0).children().eq(0).children().children().eq(0).children().html('INFO');
			show_indice(3);
			break;
		default:
			console.log("Error before idioma");
	}
}

function beforeanexos() {
	$('body').css('background-color', '#BD072F');
	var idioma = localStorage.getItem("idioma");
	switch (parseInt(idioma)) {
		case 1:
			$('#anexos').attr('data-title', 'ÍNDEX');
			$('#anexos').children().eq(0).children().eq(0).children().children().eq(1).html('ÍNDEX');
			$('#anexos').children().eq(0).children().eq(0).children().children().eq(0).children().html('ENRERE');
			show_anexos(1);
			break;
		case 2:
			$('#anexos').attr('data-title', 'INDICE');
			$('#anexos').children().eq(0).children().eq(0).children().children().eq(1).html('INDICE');
			$('#anexos').children().eq(0).children().eq(0).children().children().eq(0).children().html('INFO');
			show_anexos(2);
			break;
		case 3:
			$('#anexos').attr('data-title', 'INDEX');
			$('#anexos').children().eq(0).children().eq(0).children().children().eq(1).html('INDEX');
			$('#anexos').children().eq(0).children().eq(0).children().children().eq(0).children().html('INFO');
			show_anexos(3);
			break;
		default:
			console.log("Error before idioma");
	}
}

function show_indice(id_idioma) {
	$('#red').html('');
	var idioma = id_idioma;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM indice WHERE idioma='" + [idioma] + "'", [],
					  function(tx, result) {
						  $('#red').append(result.rows.item(0)['ind']);
						  $("#red").treeview({
							  animated: "fast",
							  collapsed: true,
							  unique: true
						  });
					  });
	});
}

function show_anexos(id_idioma) {
	$('#anex').html('');
	var idioma = id_idioma;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM indiceanexos WHERE idioma='" + [idioma] + "'", [],
					  function(tx, result) {
						  $('#anex').append(result.rows.item(0)['ind']);
						  $("#anex").treeview({
							  animated: "fast",
							  collapsed: true,
							  unique: true
						  });
					  });
	});
}