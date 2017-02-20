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
	this.loader = document.getElementById("loader");

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

//Obtener el listado de publicaciones de la base de datos
QualificationAdmin.prototype.loadPosts = function(){
	this.postsRef = this.database.ref("user-posts");
	this.postsRef.off();
}

//Trigger para el cambio de estado de un usuario
QualificationAdmin.prototype.onAuthStateChanged = function(user){
	console.log("El estado del usuario ha cambiado");
}

//Inicialización al cargar la página
window.onload = function(){
	
	window.qualitificationAdmin = new QualificationAdmin();

	if(!qualitificationAdmin.auth.currentUser){
		$.magnificPopup.open({
		  items: {
		    src: '#test-popup', // can be a HTML string, jQuery object, or CSS selector
		    type: 'inline',
		  },
		  //closeOnBgClick :false, 
		  closeOnContentClick : false, 
	      showCloseBtn : false,
		});
	}
	
}
