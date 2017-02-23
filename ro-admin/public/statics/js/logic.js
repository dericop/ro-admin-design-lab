/*
* Created by: Daniel Estiven Rico Posada
* Laboratorio de Diseño Estratégico
* modelo necesario para la calificación de usuarios
*/
'use strict';

//Inicialización de QualificationAdmin
function QualificationAdmin(){
	this.setupFirebase();
	this.initFirebase();

	//Accesos al DOM
	this.posts = document.getElementById("posts");
	
	this.loader = document.getElementsByClassName("loader")[0];

	//Listeners
	//this.loginButton.addEventListener("click", this.logIn.bind(this));
}

//Configuración de la aplicación de firebase
QualificationAdmin.prototype.setupFirebase = function(){
	var config = {
	    apiKey: "AIzaSyBQKctnO3-Bb_KfiFrvIBQxntmP9OUKpcU",
	    authDomain: "reduccion-de-obesidad-7414c.firebaseapp.com",
	    databaseURL: "https://reduccion-de-obesidad-7414c.firebaseio.com",
	    storageBucket: "reduccion-de-obesidad-7414c.appspot.com",
	    messagingSenderId: "610665651722"
	};
	firebase.initializeApp(config);
}

//Inicialización de atributos de firebase
QualificationAdmin.prototype.initFirebase = function(){
	console.log("Firebase", firebase.auth());
	this.auth = firebase.auth();
	this.database = firebase.database();
	this.storage = firebase.storage();
	this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
}

//Evento para la definición del login
QualificationAdmin.prototype.logIn = function(emailValue, passvalue, callback){

	this.auth.signInWithEmailAndPassword(emailValue, passvalue).then(function(token){
		//Login satisfactorio
		//localstorage.setItem("firebase", window.firebase);
		callback();
		$.magnificPopup.close();
	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  if (errorCode === 'auth/wrong-password') {
	    alert('Contraseña Incorrecta.');
	  } else if(errorCode == 'auth/user-not-found'){
	    alert("El correo ingresado no está registrado");
	  }
	});
	
}

//Carga los posts que están pendientes de calificación (corus y cocono)
QualificationAdmin.prototype.loadPendingPosts = function(callback){
	this.postsRef = this.database.ref("user-posts");
	this.postsRef.off();
	var that = this;
	that.loader.classList.remove("hide");

	this.postsRef.orderByChild("result").equalTo(null).once('value', function(data){
		var resData = data.val() || {};
		that.postsRef = that.database.ref("user-posts-reflexive");
		that.postsRef.orderByChild("result").equalTo(null).once('value', function(datar){
			if(datar.val()!=null){
				var d = null;
				for(d in datar.val())
					resData[d] = datar.val()[d];

				callback(resData);

			}else{
				callback(resData);
			}
		})

		that.loader.className+=" hide";
	});
	
}

//Obtener el listado de publicaciones de la base de datos
QualificationAdmin.prototype.loadPostsStartAt = function(callback, startat){
	this.postsRef = this.database.ref("user-posts");
	this.postsRef.off();
	var that = this;
	that.loader.classList.remove("hide");

	if(startat != undefined){
		console.log(startat)
		this.postsRef.orderByKey().limitToFirst(10).startAt(startat).once('value', function(data){
			callback(data.val());
			that.loader.className+=" hide";
		});
	}else{
		this.postsRef.orderByKey().limitToFirst(10).once('value', function(data){
			callback(data.val());
			that.loader.className+=" hide";
		});
	}
}

//Cargar el listado de publicaciones finalizando en la clave indicada
QualificationAdmin.prototype.loadPostsEndAt = function(callback, endAt){
	this.postsRef = this.database.ref("user-posts");
	this.postsRef.off();
	var that = this;
	that.loader.classList.remove("hide");
	
	this.postsRef.orderByKey().limitToLast(10).endAt(endAt).once('value', function(data){
		callback(data.val());
		that.loader.className+=" hide";
	});
}

//Trigger para el cambio de estado de un usuario
QualificationAdmin.prototype.onAuthStateChanged = function(user){

	if(firebase.auth().currentUser){
		$.magnificPopup.close();
	}else{
		console.log("No tiene usuario");
		$.magnificPopup.open({
		  items: {
		    src: '#test-popup', // can be a HTML string, jQuery object, or CSS selector
		    type: 'inline',
		  },
		  closeOnBgClick :false, 
		  closeOnContentClick : false, 
	      showCloseBtn : false,
		});
	}
}

//Evento para cerrar sesión del admin
QualificationAdmin.prototype.logOut = function(callback){
	this.auth.signOut().then(function(){
		callback();
	}, function(error){
		console.log("Error cerrando sesión");
	})
}


//Guardar la calificación del alimento
QualificationAdmin.prototype.saveQualificationForFood = function(id, user, average, r_pi, r_aa, r_gs, r_ch, result, callback){

	this.postsRef = this.database.ref("user-posts");
	var that = this;
	//Datos a almacenar
	var data = {
		average: average,
	    r_pi: r_pi,
	    r_aa: r_aa,
	    r_gs: r_gs,
	    r_ch: r_ch,
	    result: result
	}
	this.postsRef.orderByChild("id").equalTo(id).once('value', function(snap){
		if(snap.val() === null){
			//Existe en cocono
			that.postsRef = that.database.ref("user-posts-reflexive/"+id);
			that.postsRef.off();
			that.postsRef.update(data);

			that.postsRef = that.database.ref("user-data-reflexive/"+user);
			that.postsRef.off();
			that.postsRef.orderByChild("id").equalTo(id).once('value', function(snap){
				if(snap.val()!=null){
					var dat = snap.val();
					that.postsRef.child(Object.keys(dat)[0]).update(data, function(error){
						if(error){
							alert("Revise su conexión a internet o intentelo más tarde")
						}else{
							callback();
						}
					});
				}
			});

		}else{
			//Existe en corus
			that.postsRef = that.database.ref("user-posts/"+id);
			that.postsRef.off();
			that.postsRef.update(data);

			that.postsRef = that.database.ref("user-data/"+user);
			that.postsRef.off();

			that.postsRef.orderByChild("id").equalTo(id).once('value', function(snap){
				if(snap.val()!=null){
					var dat = snap.val();
					that.postsRef.child(Object.keys(dat)[0]).update(data, function(error){
						if(error){
							alert("Revise su conexión a internet o intentelo más tarde")
						}else{
							callback();
						}
					});

				}
			});
		}
	});
}

//Guardar calificación para una actividad.
QualificationAdmin.prototype.saveQualificationForActivity = function(id, user, average, result, callback){

	this.postsRef = this.database.ref("user-posts");
	var that = this;
	var data = {
		average: average,
	    result: result
	}
	this.postsRef.orderByChild("id").equalTo(id).once('value', function(snap){
		if(snap.val() === null){
			//Existe en cocono
			that.postsRef = that.database.ref("user-posts-reflexive/"+id);
			that.postsRef.off();
			that.postsRef.update(data);

			that.postsRef = that.database.ref("user-data-reflexive/"+user);
			that.postsRef.off();
			that.postsRef.orderByChild("id").equalTo(id).once('value', function(snap){
				if(snap.val()!=null){
					var dat = snap.val();
					that.postsRef.child(Object.keys(dat)[0]).update(data, function(error){
						if(error){
							alert("Revise su conexión a internet o intentelo más tarde")
						}else{
							callback();
						}
					});
				}
			});

		}else{
			//Existe en corus
			that.postsRef = that.database.ref("user-posts/"+id);
			that.postsRef.off();
			that.postsRef.update(data);

			that.postsRef = that.database.ref("user-data/"+user);
			that.postsRef.off();
			that.postsRef.orderByChild("id").equalTo(id).once('value', function(snap){
				if(snap.val()!=null){
					var dat = snap.val();
					that.postsRef.child(Object.keys(dat)[0]).update(data, function(error){
						if(error){
							alert("Revise su conexión a internet o intentelo más tarde")
						}else{
							callback();
						}
					});
				}
			});
		}
	});
}
