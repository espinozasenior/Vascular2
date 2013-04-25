var db;

// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
	var dbSize = 15 * 1024 * 1024; // 15MB  
	var alturaV = getWindowHeight();
	$('#tabstrip-home table').css({ height: alturaV});
    	
	db = openDatabase("vascular", "1.0", "Base de datos de apartados", dbSize);
	db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS idiomas(id INTEGER PRIMARY KEY ASC , idioma TEXT, activo INTEGER)");
		tx.executeSql("CREATE TABLE IF NOT EXISTS apartados(id INTEGER PRIMARY KEY ASC , indice TEXT, parent TEXT, titulo TEXT, cuerpo TEXT, idioma INTEGER )");
		tx.executeSql("CREATE TABLE IF NOT EXISTS indice(idioma INTEGER, ind TEXT)");
		tx.executeSql("CREATE TABLE IF NOT EXISTS indiceanexos(idioma INTEGER, ind TEXT)");
        tx.executeSql("CREATE TABLE IF NOT EXISTS indiceanexosmain(idioma INTEGER, ind TEXT)");
		tx.executeSql("CREATE TABLE IF NOT EXISTS favoritos(id INTEGER , nombre TEXT)");
		tx.executeSql("CREATE TABLE IF NOT EXISTS bibliografias(cuerpo TEXT, idioma INTEGER)");
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
							  localStorage.setItem('idioma', '1');
							  update();
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
			var idio = localStorage.getItem("idioma");
			//localStorage.setItem('confirm', 'true');
			switch (parseInt(idio)) {
				case 1:
					window.location.replace("catalan.html");
					break;
				case 2:
					window.location.replace("spanish.html");
					break;
				case 3:
					window.location.replace("english.html");
					break;
				default:
					alert("Error carga htmls");
			}
		}, 3000);
	}
	else {
		navigator.app.exitApp();
	}
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

function startConfirm(idioma) { 
	if (localStorage.getItem('confirm') == null) {
		switch (parseInt(idioma)) {
			case 1:
				//Catalan
				navigator.notification.confirm(
					"La informació continguda en aquesta aplicació està destinat, exclusivament, a professionals de la salut. La informació disponible en l'aplicació com l'única font que mai no s'utilitzarà per prendre decisions mèdiques. Médéric edicions no respondrà, en qualsevol cas, les conseqüències de les decisions segons la informació disponible en l'aplicació. El professional de la salut serà que, en cada cas, s'ha d'avaluar la informació, o la literatura científica disponible i prendre una decisió, segons els seus coneixements.La informació continguda en aquesta aplicació està destinat, exclusivament, a professionals de la salut. La informació disponible en l'aplicació com l'única font que mai no s'utilitzarà per prendre decisions mèdiques. Médéric edicions no respondrà, en qualsevol cas, les conseqüències de les decisions segons la informació disponible en l'aplicació. El professional de la salut serà que, en cada cas, s'ha d'avaluar la informació, o la literatura científica disponible i prendre una decisió, segons els seus coneixements.", // message
					onConfirm, // callback to invoke with index of button pressed
					'¿Es usted profesional satnitario?', // title
					'Si, No'          // buttonLabels
					);
				break;
			case 2:
				//español
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
					'¿Es usted profesional sanitario?', // title
					'Si, No'          // buttonLabels
					);
				break;
			default:
				//ingles
				navigator.notification.confirm(
					"The information contained in this application is destined, exclusively, to health professionals. The information available in the application as the sole source to be never used for medical decision-making. Médéric editions will not be liable, in any case, the consequences of decisions based on the information available in the application. The health professional will be who, in each case, must assess the information, or the available scientific literature and make a decision, according to their knowledge.The information contained in this application is destined, exclusively, to health professionals. The information available in the application as the sole source to be never used for medical decision-making. Médéric editions will not be liable, in any case, the consequences of decisions based on the information available in the application. The health professional will be who, in each case, must assess the information, or the available scientific literature and make a decision, according to their knowledge.", // message
					onConfirm, // callback to invoke with index of button pressed
					'Do you care professional?', // title
					'Yes, No'          // buttonLabels
					);
		}
	}
	else {		
		setTimeout(function() {
            var idio = localStorage.getItem("idioma");
			switch (parseInt(idio)) {
				case 1:
					window.location.replace("catalan.html");
					break;
				case 2:
					window.location.replace("spanish.html");
					break;
				case 3:
					window.location.replace("english.html");
					break;
				default:
					alert("Error carga htmls");
			}
		}, 3000);
	}
}

function loadIndex(idioma) {    
	switch (parseInt(idioma)) {
		case 1:
			$('#tabstrip-home table').children().children().eq(0).children().html('<h3 style="color:#FFF;"><b> Guia oficial de diagnòstic i<br>tractament de les malalties <br>vasculars cerebrals de la <br>Societat Catalana de <br>Neurologia</b></h3>');
			$('#tabstrip-home table').children().children().eq(1).children().eq(0).html('<h4 style="color:#FFF;">1ª edició interactiva</h4>');
			$('#tabstrip-home table').children().children().eq(3).children().children().eq(1).html('Patrocinat per');
			app.navigate('#tabstrip-home');
			startConfirm(idioma);
			break;
		case 2:
			$('#tabstrip-home table').children().children().eq(0).children().html('<h3 style="color:#FFF;"><b> Guía oficial de diagnóstico<br>y tratamiento de las <br>enfermedades cerebrales <br>vasculares de la Sociedad <br>Catalana de Neurología </b></h3>');
			$('#tabstrip-home table').children().children().eq(1).children().eq(0).html('<h4 style="color:#FFF;">1ª Edición interactiva</h4>');
			$('#tabstrip-home table').children().children().eq(3).children().children().eq(1).html('Patrocinado por');
			app.navigate('#tabstrip-home');
			startConfirm(idioma);
			break;
		case 3:
			$('#tabstrip-home table').children().children().eq(0).children().html('<h3 style="color:#FFF;"><b> Oficial Guide to diagnosis<br>and treatment of cerebral <br>vascular diseases of the <br>Catalan society of <br>Neurology </b></h3>');
			$('#tabstrip-home table').children().children().eq(1).children().eq(0).html('<h4 style="color:#FFF;">1ª Edition interactive</h4>');
			$('#tabstrip-home table').children().children().eq(3).children().children().eq(1).html('Sponsored by');
			app.navigate('#tabstrip-home');
			startConfirm(idioma);
			break;
		default:
			alert("Error en idioma");
	}
}

function fail(error) {
	console.log(error.code);
}

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