'use strict';

function QuestionAdmin(){
	this.setupFirebase();
	this.initFirebase();
}

QuestionAdmin.prototype.setupFirebase = function(){
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
QuestionAdmin.prototype.initFirebase = function(){
	console.log("Firebase", firebase.auth());
	this.auth = firebase.auth();
	this.database = firebase.database();
	this.storage = firebase.storage();
	this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
}

QuestionAdmin.prototype.loadQuestions = function(callback){
	this.questionsRef = this.database.ref("questions");
	this.questionsRef.off();
	var that = this;
	that.questionsRef.once('value', function(data){
		var resData = data.val() || {};
		callback(resData);
	});
}

QuestionAdmin.prototype.saveNewQuestion = function(title, res1, res2, sDate, eDate, correct, callback){
		var id = this.database.ref("questions").push().key;

		var data = {
			id:id,
			title:title,
			response1:res1,
			response2:res2,
			correct:correct,
			startDate:sDate,
			endDate:eDate
		};

		this.questionsRef = this.database.ref("questions/"+id);
		this.questionsRef.set(data, function(message){
			callback(data);
		});
}

QuestionAdmin.prototype.deleteQuestion = function(question, callback){
	this.questionsRef = this.database.ref("questions");
	this.questionsRef.child(question).remove();
	callback();
}

QuestionAdmin.prototype.onAuthStateChanged = function(user){
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

QuestionAdmin.prototype.loadQuestionsStartAt = function(callback, startAt){
	console.log("Inicie en "+startAt);

	this.questionsRef = this.database.ref("questions");
	this.questionsRef.off();
	var that = this;

	if(startAt != undefined){
		console.log(startAt);
		this.questionsRef.orderByKey().startAt(startAt).once('value', function(data){
			callback(data.val());
		});
	}else{
		this.questionsRef.orderByKey().once('value', function(data){
			callback(data.val());
		});
	}
}

//Evento para cerrar sesión del admin
QuestionAdmin.prototype.logOut = function(callback){
	this.auth.signOut().then(function(){
		callback();
	}, function(error){
		console.log("Error cerrando sesión");
	})
}

QuestionAdmin.prototype.logIn = function(emailValue, passvalue, callback){

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





