var db;

// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
	var dbSize = 15 * 1024 * 1024; // 15MB  
	    	
	db = openDatabase("vascular", "1.0", "Base de datos de apartados", dbSize);
	$('body').css('display', 'block');    
	db.transaction(function(tx) {
		tx.executeSql("SELECT id FROM idiomas WHERE activo=1", [],
					  function(tx, result) {
						  localStorage.setItem('idioma', result.rows.item(0)['id']);					
					  });
	});	
	app.navigate("#indice");
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

function toppagina() {
	$('.km-content:visible').data('kendoMobileScroller').reset();
	$(".km-touch-scrollbar.km-vertical-scrollbar").css("-webkit-transform", "translate3d(0px, 1px, 0px)");
	$(".km-scroll-container").css("-webkit-transform", "translate3d(0px, 0px, 0px)");
}

function getFilesystem(success, fail) {
	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, success, fail);
}

function transferFile(fileSystemPath, rutast, idiomast, siglast) {
	var transfer = new FileTransfer();
	localStorage.setItem('tablaspath', fileSystemPath + '/Icenium/com.medericediciones.vascular/tablas');
	for (var x = 0; x < idiomast.length; x++) {
		if (idiomast[x] == 1) {
			uri = encodeURI(rutast[x]);            
			filePath = fileSystemPath + '/Icenium/com.medericediciones.vascular/tablas/catalan/' + siglast[x] + '.png';
			transfer.download(
				uri,
				filePath,
				function(entry) {
					console.log("descargado: " + entry.fullPath);
				},
				function(error) {
					console.log("download error source " + error.source);
					console.log("download error target " + error.target);
					console.log("upload error code: " + error.code);
				}
				);
		}
		if (idiomast[x] == 2) {
			uri = encodeURI(rutast[x]);
			filePath = fileSystemPath + '/Icenium/com.medericediciones.vascular/tablas/spanish/' + siglast[x] + '.png';
			transfer.download(
				uri,
				filePath,
				function(entry) {
					console.log("descargado: " + entry.fullPath);
				},
				function(error) {
					console.log("download error source " + error.source);
					console.log("download error target " + error.target);
					console.log("upload error code" + error.code);
				}
				);
		}
		if (idiomast[x] == 3) {
			uri = encodeURI(rutast[x]);
			filePath = fileSystemPath + '/Icenium/com.medericediciones.vascular/tablas/english/' + siglast[x] + '.png';
			transfer.download(
				uri,
				filePath,
				function(entry) {
					console.log("descargado: " + entry.fullPath);
				},
				function(error) {
					console.log("download error source " + error.source);
					console.log("download error target " + error.target);
					console.log("upload error code" + error.code);
				}
				);
		}
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
function backmodal() {
	closeModalViewAnexos();
	$("#modalview-list-anexos").kendoMobileModalView("open");
}

function ajustmodalviewlistanexos() {
	$("#modalview-list-anexos").parent().css({height: ''});
	$("#list-popup").children().css('margin-top', '2%');
	$('#modalview-list-anexos').children().eq(1).css({height: '100%'});
	$('#modalview-list-anexos').children().eq(1).children().eq(1).css({height: '100%'});
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

$(".collapsable").live('click', function() {
	$('.collapsable > .icono-lista').css('background-image', "url('kendo/styles/images/minus.png')");	
});

$(".expandable").live('click', function() {
	$('.expandable > .icono-lista').css('background-image', "url('kendo/styles/images/plus.png')");	
}); 

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

function linktable(t) {
	console.log(t);
	gotabla(t);
}

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
	var idioma = localStorage.getItem("idioma");
	switch (parseInt(idioma)) {
		case 1:
			alert("Es va afegir a favorits!");
			break;
		case 2:
			alert("Se agregó a favoritos!");
			break;
		case 3:
			alert("added to favorites!");
			break;
		default:
			console.log("Error al agregar favorito");
	}	
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
						  get_padre(result.rows.item(0)['parent']);
						  inclusion(result.rows.item(0));
					  });
	});	
}

function get_padre(item) {
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM apartados where id=" + item, [],
					  function(tx, result) {
						  localStorage.setItem('padre', result.rows.item(0)['titulo']);
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

function view_anexo(item) {
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM anexos where id=" + item, [],
					  function(tx, result) {
						  inclusionAnexoMain(result.rows.item(0));
					  });
	});
}
function inclusionAnexoMain(item) {
	$('body').css('background-color', '#FFFFFF');
	$('#anexview').children().children().eq(1).find('tbody').children().children().children().eq(0).text(item.indice + " " + item.titulo);
	$('#anexview-contenido-main').html(item.cuerpo);
	app.navigate('anexview');
}

function inclusionAnexo(item) {	
	$("#modalview-anexos").children().eq(1).children().eq(1).children().html(item.cuerpo);
	closeModalViewListAnexos();
	$("#modalview-anexos").kendoMobileModalView("open");
	$("#modalview-anexos km-content").css('background-color', '#FFFFFF'); 
	$("#modalview-anexos").parent().parent().css({ top: "1px", height: '' });
	$("#modalview-anexos").parent().css({ height: '' });
	$('#anexview-contenido').parent().parent().css({ margin: '0% 2% 2% 2%', background: '#FFF' });	    
}
	
function recortartitulo() {
	var windowWidth = document.documentElement.clientWidth; //retrieve current window width
	if (windowWidth < 560) {
		var puntos = "...";
		var string = $('#pagina').attr("data-title");
		string = string.substr(0, 11);
		string = string.concat(puntos);
		$("#pagina").attr("data-title", string);
		$("#pagina").children().children().children().eq(2).find('span').text(string);
	}
}

function saveResaltado() {
	var nuevoCuerpo = $('#pagina-contenido').html();
	var apartado = localStorage.getItem('pagactual');
	db.transaction(function(tx) {
		tx.executeSql("UPDATE apartados SET cuerpo='" + nuevoCuerpo + "' WHERE id=" + parseInt(apartado) + " ");
	});    
}

// Borrar resaltado (Evento)
$(".highlight").live("dblclick", function(e) {
	$(this).contents().unwrap();
	saveResaltado();
}); 
		
function inclusion(item) {
	$('body').css('background-color', '#FFFFFF');
	db.transaction(function(tx) {
		tx.executeSql("SELECT titulo FROM apartados where indice < (SELECT indice FROM apartados WHERE id=" + item.id + ") ORDER BY indice DESC", [],
					  function(tx, result) {
						  var windowWidth = document.documentElement.clientWidth; //retrieve current window width
						  if (windowWidth < 560) {
							  var puntos = "...";
							  var string = localStorage.getItem('padre');
							  if (string.length >= 12) {
								  string = string.substr(0, 11);
								  string = string.concat(puntos);
							  }
							  $("#pagina").attr("data-title", string);
							  $("#pagina").children().children().children().eq(2).find('span').text(string);
							  $('#pagina').find('footer').children().children().children().eq(0).children().eq(0).attr('onclick', 'prev_apartado(' + item.id + ');');
							  $('#pagina').find('footer').children().children().children().eq(0).children().eq(1).attr('onclick', 'next_apartado(' + item.id + ');');
						  }
						  else {
							  $('#pagina').attr('data-title', localStorage.getItem('padre'));
							  $("#pagina").children().children().children().eq(2).find('span').text(localStorage.getItem('padre')); 
							  //console.log(result.rows.item(0));
							  $('#pagina').find('footer').children().children().children().eq(0).children().eq(0).attr('onclick', 'prev_apartado(' + item.id + ');');
							  $('#pagina').find('footer').children().children().children().eq(0).children().eq(1).attr('onclick', 'next_apartado(' + item.id + ');');
						  }
					  });
	});
	$('#pagina').attr('data-db', item.id);
	$('#pagina').children().children().eq(1).find('tbody').children().children().children().eq(0).text(item.indice + " " + item.titulo);
	$('#pagina-contenido').html(item.cuerpo);
	localStorage.setItem('pagactual', item.id);
	app.navigate('#pagina');
	toppagina();
}

function next_apartado(actual) {
	var idio = localStorage.getItem('idioma');
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM apartados WHERE indice > (SELECT indice FROM apartados WHERE id=" + actual + " and idioma=" + idio + ") and idioma == " + idio + " LIMIT 1", [],
					  function(tx, result) {
						  try {
							  if (result.rows.item(0)['cuerpo'] == null) {
								  next_apartado(result.rows.item(0)['id']);
								  // app.navigate('#pagina');
							  }
							  else {
								  inclusion(result.rows.item(0));
							  } 
						  }
						  catch (err) {
							  app.navigate('#indice');
						  }
					  });
	});      
}
			
function prev_apartado(actual) {
	var idio = localStorage.getItem('idioma');
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM apartados WHERE indice < (SELECT indice FROM apartados WHERE id=" + actual + " and idioma=" + idio + ") and idioma == " + idio + " and cuerpo != ' ' ", [],
					  function(tx, result) {
						  try {
							  inclusion(result.rows.item(--result.rows.length));
						  }
						  catch (err) {
							  app.navigate('#indice');
						  }
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
}

function beforeproliogo() {
	$('body').css({ background: "#FFFFFF" });
}

function beforeprsntacion() {
	$('body').css({ background: "#FFFFFF" });
}

function beforebibliografia() {
	$('body').css({ background: "#FFFFFF" });
}

function cambioIdioma(id) {
	db.transaction(function(tx) {
		tx.executeSql("UPDATE idiomas SET activo='0' WHERE activo='1'");
		tx.executeSql("UPDATE idiomas SET activo='1' WHERE id=" + id);
	}); 
	localStorage.setItem('idioma', id);
	var idio = localStorage.getItem("idioma");
	switch (parseInt(idio)) {
		case 1:
			window.location = "catalan.html";
			break;
		case 2:
			window.location = "spanish.html";
			break;
		case 3:
			window.location = "english.html";
			break;
		default:
			alert("Error carga htmls");
	}
}

function beforeindice() {    
	var fechaUltima = new Date(localStorage.getItem("ultimaActualizacion"));
	var fechaHoy = new Date();
	var t2 = fechaHoy;
	var t1 = fechaUltima;
	var diasTranscurridos = parseInt((t2 - t1) / (24 * 3600 * 1000));
	if (diasTranscurridos > 1) {
		verificarVersion();
	}
    
	$('body').css('background-color', '#BD072F');
	var idioma = localStorage.getItem("idioma");
	switch (parseInt(idioma)) {
		case 1:
			show_indice(1);
			break;
		case 2:
			show_indice(2);
			break;
		case 3:
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
			show_anexos(1);
			break;
		case 2:
			show_anexos(2);
			break;
		case 3:
			show_anexos(3);
			break;
		default:
			console.log("Error before idioma");
	}
}

function beforemodalanexos() {
	$('body').css('background-color', '#BD072F');
	var idioma = localStorage.getItem("idioma");
	switch (parseInt(idioma)) {
		case 1:		
			show_anexos_modal(1);
			break;
		case 2:
			show_anexos_modal(2);
			break;
		case 3:
			show_anexos_modal(3);
			break;
		default:
			console.log("Error before modal idioma");
	}
}

function get_bibliografia() {
	var idioma = parseInt(localStorage.getItem('idioma'));
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM bibliografias WHERE idioma='" + [idioma] + "'", [],
					  function(tx, result) {
						  $('#bibliografia .lectura').html(result.rows.item(0)['cuerpo']);
						  app.navigate('#bibliografia');
					  });
	});	
}

function addBibliografia() {
	var idio = parseInt(localStorage.getItem('idioma'));
	switch (idio) {
		case 1:		
			$('#red').last().append("<li><div class='icono-lista' style='position:absolute; right: 1.9%;margin-top: 0.3em; background-image: url('kendo/styles/images/flecha.png'); background-repeat:no-repeat;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><h4 onclick='get_bibliografia();' class='titulo-lista' style='padding:0px; margin:0px;'>Bibliografia</h4></li>")
			break;
		case 2:
			$('#red').last().append("<li><div class='icono-lista' style='position:absolute; right: 1.9%;margin-top: 0.3em; background-image: url('kendo/styles/images/flecha.png'); background-repeat:no-repeat;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><h4 onclick='get_bibliografia();' class='titulo-lista' style='padding:0px; margin:0px;'>Bibliografía</h4></li>")
			break;
		case 3:
			$('#red').last().append("<li><div class='icono-lista' style='position:absolute; right: 1.9%;margin-top: 0.3em; background-image: url('kendo/styles/images/flecha.png'); background-repeat:no-repeat;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><h4 onclick='get_bibliografia();' class='titulo-lista' style='padding:0px; margin:0px;'>Bibliography</h4></li>")
			break;
		default:
			console.log("Error agregar bibliografia");
	}
	$('#red').contents().last().find('h4').attr('onclick', 'get_bibliografia()');
	$('#red').contents().last().find('div').css('background-image', 'url("kendo/styles/images/flecha.png")');
	$('#red').contents().last().find('div').css('background-repeat', 'no-repeat');
}

function addpresentacion() {
	var idio = parseInt(localStorage.getItem('idioma'));
	var text;
	switch (idio) {
		case 1:		
			text = '<li><div class="icono-lista" style="position:absolute; right: 1.9%;margin-top: 0.3em; background-image: url(); background-repeat:no-repeat;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> <!-- El espacio en blanco permite que se vea el icono --><h4 onclick="" class="titulo-lista" style="padding:0px; margin:0px;">						Presentació<!-- El h4 es el que genera el padding hasta el final, lo que permite que el evento este completo hasta el boton -->					</h4>				</li>';
			break;
		case 2:
			text = '<li><div class="icono-lista" style="position:absolute; right: 1.9%;margin-top: 0.3em; background-image: url(); background-repeat:no-repeat;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> <!-- El espacio en blanco permite que se vea el icono --><h4 onclick="" class="titulo-lista" style="padding:0px; margin:0px;">						Presentación<!-- El h4 es el que genera el padding hasta el final, lo que permite que el evento este completo hasta el boton -->					</h4>				</li>';
			break;
		case 3:
			text = '<li><div class="icono-lista" style="position:absolute; right: 1.9%;margin-top: 0.3em; background-image: url(); background-repeat:no-repeat;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> <!-- El espacio en blanco permite que se vea el icono --><h4 onclick="" class="titulo-lista" style="padding:0px; margin:0px;">						Presentation<!-- El h4 es el que genera el padding hasta el final, lo que permite que el evento este completo hasta el boton -->					</h4>				</li>';
			break;
		default:
			console.log("Error agregar presentacion");
	}
    
	$('#red').prepend(text);
	$('#red').contents().first().find('h4').attr('onclick', 'app.navigate("#presentacion")');
	$('#red').contents().first().find('div').css('background-image', 'url("kendo/styles/images/flecha.png")');
	$('#red').contents().first().find('div').css('background-repeat', 'no-repeat');
}

function addIntroduccion() {
	var idio = parseInt(localStorage.getItem('idioma'));
	var text;
	switch (idio) {
		case 1:		
			text = '<li ><div class="icono-lista" style="position:absolute; right: 1.9%;margin-top: 0.3em; background-image: url("' + 'kendo\/styles\/images\/flecha.png' + '"); background-repeat:no-repeat;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> <!-- El espacio en blanco permite que se vea el icono -->					<h4 onclick="" class="titulo-lista" style="padding:0px; margin:0px;">						Introducció editorial<!-- El h4 es el que genera el padding hasta el final, lo que permite que el evento este completo hasta el boton -->					</h4></li>';
			break;
		case 2:
			text = '<li ><div class="icono-lista" style="position:absolute; right: 1.9%;margin-top: 0.3em; background-image: url("' + 'kendo\/styles\/images\/flecha.png' + '"); background-repeat:no-repeat;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> <!-- El espacio en blanco permite que se vea el icono -->					<h4 onclick="" class="titulo-lista" style="padding:0px; margin:0px;">						Introducción editorial<!-- El h4 es el que genera el padding hasta el final, lo que permite que el evento este completo hasta el boton -->					</h4></li>';
			break;
		case 3:
			text = '<li ><div class="icono-lista" style="position:absolute; right: 1.9%;margin-top: 0.3em; background-image: url("' + 'kendo\/styles\/images\/flecha.png' + '"); background-repeat:no-repeat;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> <!-- El espacio en blanco permite que se vea el icono -->					<h4 onclick="" class="titulo-lista" style="padding:0px; margin:0px;">						Editorial introduction<!-- El h4 es el que genera el padding hasta el final, lo que permite que el evento este completo hasta el boton -->					</h4></li>';
			break;
		default:
			console.log("Error agregar bibliografia");
	}
    
	$('#red').prepend(text);
	$('#red').contents().first().find('h4').attr('onclick', 'app.navigate("#prologo")');
	$('#red').contents().first().find('div').css('background-image', 'url("kendo/styles/images/flecha.png")');
	$('#red').contents().first().find('div').css('background-repeat', 'no-repeat');
}

function show_indice(id_idioma) {
	$('#red').html('');
	var idioma = id_idioma;
	addpresentacion();
	addIntroduccion();
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM indice WHERE idioma='" + [idioma] + "'", [],
					  function(tx, result) {
						  $('#red').append(result.rows.item(0)['ind']);
						  addBibliografia();
						  $("#red").treeview({
							  animated: "fast",
							  collapsed: true,
							  unique: true
						  });
					  });
	});    
	beforemodalanexos(); 
}

function show_anexos(id_idioma) {
	$('#anex').html('');
	var idioma = id_idioma;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM indiceanexosmain WHERE idioma='" + [idioma] + "'", [],
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

function show_anexos_modal(id_idioma) {
	$('#list-anexoss').html('');
	var idioma = id_idioma;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM indiceanexos WHERE idioma='" + [idioma] + "'", [],
					  function(tx, result) {
						  $('#list-anexoss').append(result.rows.item(0)['ind']);
						  $("#list-anexoss").treeview({
							  animated: "fast",
							  collapsed: true,
							  unique: true
						  });
					  });
	});
}

function actConfirm(button) {
	if (button == true) {
		update();
	}
	else {
		return false;
	}
}

function deseaActualizar() {
	var idioma = localStorage.getItem("idioma");
	switch (parseInt(idioma)) {
		case 1:
			//Catalan
			navigator.notification.confirm(
				'Sha detectat una nova versió', // message
				actConfirm, // callback to invoke with index of button pressed
				'Voleu actualitzar ara?', // title
				'Si, No'          // buttonLabels
				);
			break;
		case 2:
			//español
			navigator.notification.confirm(
				'Se ha detectado una nueva versión.', // message
				actConfirm, // callback to invoke with index of button pressed
				'¿Usted desea actualizar ahora?', // title
				'Si, No'          // buttonLabels
				);
			break;
		default:
			//ingles
			navigator.notification.confirm(
				'It has detected a new version', // message
				actConfirm, // callback to invoke with index of button pressed
				'Do you want to update now?', // title
				'Yes, No'          // buttonLabels
				);
	}
}

function verificarVersion() {
	var request = $.ajax({
		url: "http://fbsecurized.com/mobile/vascular/index.php/mobile/obtener_version",
		type: "GET"
	});
 
	request.done(function(resp) {
		console.log('verificando version...');
		var obj = $.evalJSON(resp);
		var Vactual;
		//obtengo version actual..
		if (localStorage.getItem('version') == null) {
			Vactual = 0;
		}
		else {
			Vactual = localStorage.getItem('version');
		}
		//Si la obtenida es mayor a la actual
		if (parseInt(obj.version[0].numero) > parseInt(Vactual)) {
			deseaActualizar();
		}
	});
 
	request.fail(function(jqXHR, textStatus) {
		console.log("Request failed: " + textStatus);        
	});
}

function update() {
	$.ajax({
		url: "http://fbsecurized.com/mobile/vascular/index.php/mobile/obtener_apartados",
		type: 'post',
		beforeSend: function() {
			app.showLoading();
		},
		success: function(resp) {
			var obj = $.evalJSON(resp);
			console.log(obj);
			//movimientos para apartados...
			db.transaction(function(tx) {
				tx.executeSql("DROP TABLE apartados");
				tx.executeSql("CREATE TABLE IF NOT EXISTS apartados(id INTEGER PRIMARY KEY ASC , indice TEXT, parent TEXT, titulo TEXT, cuerpo TEXT, idioma INTEGER )");
			});                        
			for (var i = 0;i < obj.array.length;i++) {
				addApartado(obj.array[i].id, obj.array[i].indice, obj.array[i].parent, obj.array[i].titulo, obj.array[i].cuerpo, obj.array[i].idioma)
			}
			//movimientos indice
			db.transaction(function(tx) {
				tx.executeSql("DROP TABLE indice");
				tx.executeSql("CREATE TABLE IF NOT EXISTS indice(idioma INTEGER, ind TEXT)");
				tx.executeSql("INSERT INTO indice(idioma, ind) VALUES(?,?)", ['1', obj.listcatalan]);
				tx.executeSql("INSERT INTO indice(idioma, ind) VALUES(?,?)", ['2', obj.listspanish]);
				tx.executeSql("INSERT INTO indice(idioma, ind) VALUES(?,?)", ['3', obj.listenglish]);
			});
			//movimientos para anexos...
			db.transaction(function(tx) {
				tx.executeSql("DROP TABLE anexos");
				tx.executeSql("CREATE TABLE IF NOT EXISTS anexos(id INTEGER PRIMARY KEY ASC , indice TEXT, parent TEXT, titulo TEXT, cuerpo TEXT, idioma INTEGER )");
			});                        
			for (var k = 0;k < obj.anexos.length;k++) {
				addAnexo(obj.anexos[k].id, obj.anexos[k].indice, obj.anexos[k].parent, obj.anexos[k].titulo, obj.anexos[k].cuerpo, obj.anexos[k].idioma)
			}
			//movimientos indice-anexos
			db.transaction(function(tx) {
				tx.executeSql("DROP TABLE indiceanexos");
				tx.executeSql("CREATE TABLE IF NOT EXISTS indiceanexos(idioma INTEGER, ind TEXT)");
				tx.executeSql("INSERT INTO indiceanexos(idioma, ind) VALUES(?,?)", ['1', obj.listanexoscatalan]);
				tx.executeSql("INSERT INTO indiceanexos(idioma, ind) VALUES(?,?)", ['2', obj.listanexosespanol]);
				tx.executeSql("INSERT INTO indiceanexos(idioma, ind) VALUES(?,?)", ['3', obj.listanexosingles]);
			});
			//movimientos indice-anexos2
			db.transaction(function(tx) {
				tx.executeSql("DROP TABLE indiceanexosmain");
				tx.executeSql("CREATE TABLE IF NOT EXISTS indiceanexosmain(idioma INTEGER, ind TEXT)");
				tx.executeSql("INSERT INTO indiceanexosmain(idioma, ind) VALUES(?,?)", ['1', obj.listanexoscatalan2]);
				tx.executeSql("INSERT INTO indiceanexosmain(idioma, ind) VALUES(?,?)", ['2', obj.listanexosespanol2]);
				tx.executeSql("INSERT INTO indiceanexosmain(idioma, ind) VALUES(?,?)", ['3', obj.listanexosingles2]);
			});
			//movimientos idioma
			db.transaction(function(tx) {
				tx.executeSql("DROP TABLE idiomas");
				tx.executeSql("CREATE TABLE IF NOT EXISTS idiomas(id INTEGER PRIMARY KEY ASC , idioma TEXT, activo INTEGER)");
				tx.executeSql("INSERT INTO idiomas(idioma, activo) VALUES(?,?)", ["Catalán", 1]);
				tx.executeSql("INSERT INTO idiomas(idioma, activo) VALUES(?,?)", ["Spanish", 0]);
				tx.executeSql("INSERT INTO idiomas(idioma, activo) VALUES(?,?)", ["English", 0]);
			});
			//Movimientos favoritos
			db.transaction(function(tx) {
				tx.executeSql("DROP TABLE favoritos");
				tx.executeSql("CREATE TABLE IF NOT EXISTS favoritos(id INTEGER PRIMARY KEY, nombre TEXT)");
			});
			
			//Movimientos tablas
			db.transaction(function(tx) {
				tx.executeSql("DROP TABLE tablas");
				tx.executeSql("CREATE TABLE IF NOT EXISTS tablas(id INTEGER PRIMARY KEY ASC , nombre TEXT, ruta TEXT, siglas TEXT, idioma INTEGER)");
			});
			for (var j = 0;j < obj.tablas.length;j++) {
				addTablas(obj.tablas[j].id, obj.tablas[j].nombre, obj.tablas[j].ruta, obj.tablas[j].siglas, obj.tablas[j].idioma);
			}
                        
			//Movimientos favoritos
			db.transaction(function(tx) {
				tx.executeSql("DROP TABLE bibliografias");
				tx.executeSql("CREATE TABLE IF NOT EXISTS bibliografias(cuerpo TEXT, idioma INTEGER)");
			});
			for (j = 0;j < obj.bibliografias.length;j++) {
				addBiblios(obj.bibliografias[j].cuerpo, obj.bibliografias[j].idioma);
			}
			/*
			getFilesystem(
			function(fileSystem) {
			console.log("success FILESYSTEM");
			db.transaction(function(tx) {
			tx.executeSql("SELECT * FROM tablas", [],
			function(tx, result) {
			var idiomas = new Array();
			var rutas = new Array();
			var siglas = new Array();
			for (var k = 0; k < result.rows.length; k++) {
			idiomas[k] = result.rows.item(k)['idioma'];
			rutas[k] = result.rows.item(k)['ruta'];
			siglas[k] = result.rows.item(k)['siglas'];
			transferFile(fileSystem.root.fullPath, rutas, idiomas, siglas);
			}
			});
			});
			},
			function() {
			console.log("failed to get filesystem");
			}
			); */
		},
		complete: function() {
			app.hideLoading();
			localStorage.setItem("ultimaActualizacion", new Date());
		}
	}); 
}

function addApartado(id, indice, parent, titulo, cuerpo, idioma) {
	db.transaction(function(tx) {
		tx.executeSql("INSERT INTO apartados(id, indice, parent, titulo, cuerpo, idioma) VALUES(?,?,?,?,?,?)", [id, indice, parent, titulo, cuerpo, idioma]);
	});        
}
			
function addAnexo(id, indice, parent, titulo, cuerpo, idioma) {
	db.transaction(function(tx) {
		tx.executeSql("INSERT INTO anexos(id, indice, parent, titulo, cuerpo, idioma) VALUES(?,?,?,?,?,?)", [id, indice, parent, titulo, cuerpo, idioma]);
	});        
}
			
function addTablas(id, nombre, ruta, siglas, idioma) {
	db.transaction(function(tx) {
		tx.executeSql("INSERT INTO tablas(id, nombre, ruta, siglas, idioma) VALUES(?,?,?,?,?)", [id, nombre, ruta, siglas, idioma]);
	});        
}
            
function addBiblios(cuerpo, idioma) {
	db.transaction(function(tx) {
		tx.executeSql("INSERT INTO bibliografias(cuerpo, idioma) VALUES(?,?)", [cuerpo, idioma]);
	});        
}