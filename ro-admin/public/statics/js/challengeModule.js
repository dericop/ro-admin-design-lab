/*
* Created by: Daniel Estiven Rico Posada
* Laboratorio de Diseño Estratégico
* Controlador de retos
*/
angular.module('qualificationApp',[])
	.controller('ChallengesController', ['$scope', function($scope){
		var challengeList = this;
		challengeList.challenges = []; //listado de retos
		challengeList.lastChallenge = ''; //último reto publicado
		challengeList.challengeAdmin = null; //referencia al modelo de calificación
		challengeList.loader = document.getElementsByClassName("loader")[0];

		challengeAdmin = new ChallengeAdmin();

		var btnItems = document.getElementById("btnChallenge");
		btnItems.className += " btnSelected";

		var loadingMsj = document.getElementById("loading-msj");
		loadingMsj.style.display = 'none';

		var successMsj = document.getElementById("success-msj");
		successMsj.style.display = 'none';

		challengeList.loader.className+=" hide";

		challengeList.add = function(){
			$.magnificPopup.open({
				  items: {
				    src: '#new-challenge-popup',
				    type: 'inline',
				  },
				  closeOnBgClick :true, 
				  closeOnContentClick : false, 
				  showCloseBtn : false,
				  closeMarkup: '<button class="mfp-close" style="position: absolute; top: 30px; right: 30px"><div class="glyphicon glyphicon-remove" width="25" height="29"/></button>',
			});
		}

		challengeList.loadData = function(){
			this.loader.classList.remove("hide");
			challengeList.challenges = [];
			var that = this;
			challengeAdmin.loadChallenges(function(data){
				challengeList.loadChallengesInArray(data);
				$scope.$apply();
				that.loader.className+=" hide";
			});
		};

		challengeList.loadChallengesInArray = function(data){
			var d = null;
			for(d in data)
				challengeList.challenges.push(data[d]);

			if(d)
				challengeList.lastChallenge = d+"";
		};

		challengeList.nextPage = function(){
			challengeList.challengeAdmin.loadChallengesStartAt(function(data){
				challengeList.loadChallengesInArray(data);
				$scope.$apply();
			}, challengeList.lastChallenge)
		};

		challengeList.removeChallenge = function(challenge){
			var index = challengeList.challenges.indexOf(challenge);
			if(index > -1)
				challengeList.challenges.splice(index, 1);
		}

		challengeList.showDate = function(date){
			var nDate = new Date(date);
			return nDate.toLocaleString();
		}

		challengeList.saveNewChallenge = function(){
			var inputTitle = document.getElementById("title");
			var inputStartDate = document.getElementById("startDate");
			var inputEndDate = document.getElementById("endDate");

			var title = inputTitle.value;
			var startDate = inputStartDate.value;
			var endDate = inputEndDate.value;

			if(title != "" && startDate != "" && endDate != ""){
				var sDate = (new Date(startDate)).getTime();
				var eDate = (new Date(endDate)).getTime();

				loadingMsj.style.display = 'block';

				inputTitle.disabled = true;
				inputStartDate.disabled = true;
				inputEndDate.disabled = true;

				challengeAdmin.saveNewChallenge(title, sDate, eDate, function(message){
					loadingMsj.style.display = 'none';
					successMsj.style.display = 'block';

					setTimeout(function(){
						$.magnificPopup.close();

						inputTitle.disabled = false;
						inputStartDate.disabled = false;
						inputEndDate.disabled = false;

						inputTitle.value = '';
						inputStartDate.value = '';
						inputEndDate.value = '';

					}, 2000);

				});
			}
		}

		$(window).scroll(function() {
		   if($(window).scrollTop() + $(window).height() == $(document).height()) {
		       challengeList.nextPage();
		   }
		});


		challengeList.loadData();
		window.challengeList = challengeList;

	}]);