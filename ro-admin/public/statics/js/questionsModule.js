angular.module('qualificationApp',[])
	.controller('QuestionsController', ['$scope', function($scope){

		var questionList = this;
		questionList.questions = [];
		questionList.lastQuestion = '';
		questionList.questionAdmin = null;
		questionList.loader = document.getElementsByClassName("loader")[0];

		questionAdmin = new QuestionAdmin();

		var btnItems = document.getElementById("btnQuestions");
		btnItems.className += " btnSelected";

		var loadingMsj = document.getElementById("loading-msj");
		loadingMsj.style.display = 'none';

		var successMsj = document.getElementById("success-msj");
		successMsj.style.display = 'none';

		questionList.loader.className+=" hide";

		//Accesos al DOM
		questionList.emailForm = document.getElementById("email");
		questionList.passwordForm = document.getElementById("password");

		questionList.add = function(){
			$.magnificPopup.open({
				  items: {
				    src: '#new-question-popup',
				    type: 'inline',
				  },
				  closeOnBgClick :true, 
				  closeOnContentClick : false, 
				  showCloseBtn : false,
				  closeMarkup: '<button class="mfp-close" style="position: absolute; top: 30px; right: 30px"><div class="glyphicon glyphicon-remove" width="25" height="29"/></button>',
			});
		};

		questionList.loadData = function(){
			this.loader.classList.remove("hide");
			questionList.questions = [];
			var that = this;
			questionAdmin.loadQuestions(function(data){
				questionList.loadQuestionsInArray(data);
				$scope.$apply();
				that.loader.className+=" hide";
			});
		};

		questionList.logOut = function(){
			questionAdmin.logOut(function(){
				questionList.loadData();
			});
		}

		questionList.loadQuestionsInArray = function(data){
			var d = null;
			for(d in data)
				questionList.questions.push(data[d]);

			if(d)
				questionList.lastQuestion = d+"";

			console.log(data);
		}

		questionList.nextPage = function(){
			questionAdmin.loadChallengesStartAt(function(data){
				questionList.loadChallengesInArray(data);
				$scope.$apply();
			}, questionList.lastChallenge)
		};

		questionList.removeQuestion = function(question){
			var response = confirm("¿Está seguro que desea eliminar la pregunta?");

			if(response){
				questionAdmin.deleteQuestion(question, function(){
					questionList.removeGraphicalQuestion(question);
				});
			}
		}

		questionList.removeGraphicalQuestion = function(question){
			for (var i = 0; i < questionList.questions.length; i++) {
				if(questionList.questions[i].id === question){
					questionList.questions.splice(i, 1);
				}
			}
		}

		questionList.login = function(e){
			if(questionList.emailForm.checkValidity() && questionList.passwordForm.checkValidity()){
				e.preventDefault();
				
				questionAdmin.logIn(questionList.emailForm.value, questionList.passwordForm.value, function(){
					questionList.loadData();
				});
			}
		}

		questionList.showData = function(date){
			var nDate = new Date(date);
			return nDate.toLocaleString();
		}

		questionList.showDate = function(date){
			var nDate = new Date(date);
			return nDate.toLocaleString();
		}

		questionList.saveNewChallenge = function(){
			var inputTitle = document.getElementById("title");
			var inputResp1 = document.getElementById("response1");
			var inputResp2 = document.getElementById("response2");
			var inputStartDate = document.getElementById("startDate");
			var inputEndDate = document.getElementById("endDate");
			var checkCorrect1 = document.querySelector("#correctCbx1:checked");
			var checkCorrect2 = document.querySelector("#correctCbx2:checked");
			var correct = "";

			var title = inputTitle.value;
			var response1 = inputResp1.value;
			var response2 = inputResp2.value;
			var startDate = inputStartDate.value;
			var endDate = inputEndDate.value;



			if(title != "" && startDate != "" && endDate != "" 
				&& response1 != "" && response2 != "" && ( checkCorrect1 != undefined || checkCorrect2 != undefined)){

				var sDate = (new Date(startDate)).getTime();
				var eDate = (new Date(endDate)).getTime();

				if(checkCorrect1 != undefined)
					correct = response1;
			
				if(checkCorrect2 != undefined)
					correct = response2;

				loadingMsj.style.display = 'block';

				inputTitle.disabled = true;
				inputResp1.disabled = true;
				inputResp2.disabled = true;
				inputStartDate.disabled = true;
				inputEndDate.disabled = true;

				questionAdmin.saveNewQuestion(title, response1, response2, sDate, eDate, correct, function(data){
					loadingMsj.style.display = 'none';
					successMsj.style.display = 'block';

					setTimeout(function(){
						$.magnificPopup.close();

						inputTitle.disabled = false;
						inputResp1.disabled = false;
						inputResp2.disabled = false;
						inputStartDate.disabled = false;
						inputEndDate.disabled = false;

						inputTitle.value = '';
						inputResp1.value = '';
						inputResp2.value = '';
						inputStartDate.value = '';
						inputEndDate.value = '';

						successMsj.style.display = 'none';
						questionList.questions.push(data);
						$scope.$apply();

					}, 1000);
				});

			}
		}

		$(window).scroll(function(){
			if($(window).scrollTop() + $(window).height() == $(document).height()){
				//questionList.nextPage();
			}
		})

		questionList.loadData();
		window.questionList = questionList;



	}]);