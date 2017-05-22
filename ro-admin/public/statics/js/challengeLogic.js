'use strict';

function ChallengeAdmin(){
	this.setupFirebase();
	this.initFirebase();
}

//Configuración de la aplicación de firebase
ChallengeAdmin.prototype.setupFirebase = function(){
	var config = {
	    apiKey: "AIzaSyBQKctnO3-Bb_KfiFrvIBQxntmP9OUKpcU",
	    authDomain: "reduccion-de-obesidad-7414c.firebaseapp.com",
	    databaseURL: "https://reduccion-de-obesidad-7414c.firebaseio.com",
	    storageBucket: "https://reduccion-de-obesidad-7414c.appspot.com",
	    messagingSenderId: "610665651722"
	};
	firebase.initializeApp(config);
}

//Inicialización de atributos de firebase
ChallengeAdmin.prototype.initFirebase = function(){
	console.log("Firebase", firebase.auth());
	this.auth = firebase.auth();
	this.database = firebase.database();
	this.storage = firebase.storage();
	this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
}

ChallengeAdmin.prototype.loadChallenges = function(callback){
	this.challengesRef = this.database.ref("challenges");
	this.challengesRef.off();
	var that = this;
	that.challengesRef.once('value', function(data){
		var resData = data.val() || {};
		callback(resData);
	});
}

ChallengeAdmin.prototype.saveNewChallenge = function(title,initDate, endDate, callback){
	
	var id = this.database.ref("challenges").push().key;

	var data = {
		id:id,
		title:title,
		initDate:initDate,
		endDate:endDate
	};

	var that = this;
	this.challengesRef = this.database.ref("challenges/"+id);
	this.challengesRef.set(data, function(message){
		callback(data);
	});

}

ChallengeAdmin.prototype.deleteChallenge = function(challenge, callback){
	this.challengesRef = this.database.ref("challenges");
	this.challengesRef.child(challenge).remove();
	callback();
}

ChallengeAdmin.prototype.onAuthStateChanged = function(user){

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

ChallengeAdmin.prototype.loadChallengesStartAt = function(callback, startAt){
	console.log("Inicie en "+startAt);

	this.challengesRef = this.database.ref("challenges");
	this.challengesRef.off();
	var that = this;

	if(startAt != undefined){
		console.log(startAt);//.limitToFirst(10)
		this.challengesRef.orderByKey().startAt(startAt).once('value', function(data){
			callback(data.val());
		});
	}else{//.limitToFirst(10)
		this.challengesRef.orderByKey().once('value', function(data){
			callback(data.val());
		});
	}
}

//Evento para cerrar sesión del admin
ChallengeAdmin.prototype.logOut = function(callback){
	this.auth.signOut().then(function(){
		callback();
	}, function(error){
		console.log("Error cerrando sesión");
	})
}

ChallengeAdmin.prototype.logIn = function(emailValue, passvalue, callback){

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



