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

QuestionAdmin.prototype.saveNewQuestion = function(title, res1, res2, sDate, eDate,callback){
		var id = this.database.ref("questions").push().key;

		var data = {
			id:id,
			title:title,
			response1:res1,
			response2:res2,
			startDate:sDate,
			endDate:eDate
		};

		var that = this;
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

	}else{

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



