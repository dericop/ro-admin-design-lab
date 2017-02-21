/*
* Created by: Daniel Estiven Rico Posada
* Laboratorio de Diseño Estratégico
* Sistema de administración para la calificación de usuarios
*/
'use strict';

//Inicialización de QualificationAdmin
function QualificationAdmin(){
	this.setupFirebase();
	this.initFirebase();

	//Accesos al DOM
	this.posts = document.getElementById("posts");
	this.emailForm = document.getElementById("email");
	this.passwordForm = document.getElementById("password");
	this.loginButton = document.getElementById("btn_login");
	this.loader = document.getElementsByClassName("loader")[0];

	//Listeners
	this.loginButton.addEventListener("click", this.logIn.bind(this));
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
QualificationAdmin.prototype.logIn = function(e){

	if(this.emailForm.checkValidity() && this.passwordForm.checkValidity()){
		e.preventDefault();
		
		this.auth.signInWithEmailAndPassword(this.emailForm.value, this.passwordForm.value).then(function(token){
			//Login satisfactorio
			//localstorage.setItem("firebase", window.firebase);
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
}

QualificationAdmin.prototype.loadPendingPosts = function(callback){
	this.postsRef = this.database.ref("user-posts");
	this.postsRef.off();
	var that = this;

	this.postsRef.orderByChild("result").equalTo(null).once('value', function(data){
		callback(data.val());
		that.loader.className+=" hide";
	});
	
}

//Obtener el listado de publicaciones de la base de datos
QualificationAdmin.prototype.loadPostsStartAt = function(callback, startat){
	this.postsRef = this.database.ref("user-posts");
	this.postsRef.off();
	var that = this;

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

QualificationAdmin.prototype.loadPostsEndAt = function(callback, endAt){
	this.postsRef = this.database.ref("user-posts");
	this.postsRef.off();
	var that = this;
	
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

