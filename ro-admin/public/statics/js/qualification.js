angular.module('qualificationApp',[])
	.controller('PostsController', ['$scope', function($scope){
		var postsList = this;
		postsList.posts = [];
		postsList.lastPost = '';
		postsList.qualificationAdmin = null;
		postsList.foodCategories = ["Desayuno", "Almuerzo", "Comida", "Algo"];
		postsList.historicSelected = false;

		$scope.curActivityValue = 0;

		qualificationAdmin = new QualificationAdmin();
		var pendingItem = document.getElementById('btn-item-pending');
		var historicItem = document.getElementById('btn-item-historic');

		pendingItem.className = "itemSelected";

		postsList.logOut = function(){
			postsList.qualificationAdmin.logOut(function(){
				postsList.loadData();
			});
		}

		postsList.loadData = function(){
			postsList.posts = [];
			if(postsList.historicSelected){
				qualificationAdmin.loadPostsStartAt(function(data){
					postsList.loadHistoricPostsInArray(data);
					$scope.$apply();
				});
			}else{
				qualificationAdmin.loadPendingPosts(function(data){
					postsList.loadPostsInArray(data);
					$scope.$apply();
				});
			}
			
			postsList.qualificationAdmin = qualificationAdmin;
			window.qualificationAdmin = qualificationAdmin;
		};

		postsList.loadPostsInArray = function(data){
			var d = null;
			for(d in data)
				postsList.posts.push(data[d]);

			if(d)
				postsList.lastPost = d+"";
		}

		postsList.loadHistoricPostsInArray = function(data){
			for(d in data)
				postsList.posts.push(data[d]);			
			
			if(data!=null && Object.keys(data).length != 1){
				postsList.posts.pop();

				if(d)
					postsList.lastPost = d+"";	
				
			}else{
				postsList.lastPost = "x";
			}
			
		}

		postsList.loadActivityPostQualification = function(post){
			$scope.curActivityValue = post.average;
			console.log($scope.curActivityValue);
		}

		postsList.nextPage = function(){
			if(postsList.historicSelected){
				postsList.qualificationAdmin.loadPostsStartAt(function(data){
					
					postsList.loadHistoricPostsInArray(data);
					$scope.$apply();

				}, postsList.lastPost)
			}else{
				/*postsList.qualificationAdmin.loadHistoricPostsStartAt(function(data){
					
					postsList.loadPostsInArray(data);
					$scope.$apply();

				}, postsList.lastPost)*/
			}
		}

		postsList.shouldBeVisible = function(post){

			if(postsList.historicSelected){
				if(post.result==null){
					return false;
				}
			}
			return true;
		}


		postsList.isFood = function(post){
			if(postsList.foodCategories.indexOf(post.category) != -1)
				return true;
			return false;
		}

		postsList.setPending = function(){
			postsList.historicSelected = false;
			pendingItem.className="itemSelected";
			historicItem.className="";
			postsList.loadData();
		}

		postsList.setHistoric = function(){
			postsList.historicSelected = true;
			pendingItem.className="";
			historicItem.className="itemSelected";
			postsList.loadData();
		}

		postsList.postsIsEmpty = function(){
			return postsList.posts.length == 0;
		}

		postsList.getResultFromAverage = function(average){
			var result = 0;
			if(average<=3){
				result = 3;
			}else if(average>3 && average<=7){
				result = 2;
			}else{
				result = 1;
			}
			return result;
		}

		postsList.removePost = function(post){
			var index = postsList.posts.indexOf(post);
			if(index>-1)
				postsList.posts.splice(index, 1);
		}

		postsList.getActivityResultFromAverage = function(average){
			var result = 0;
			if(average<=3){
				result = 1;
			}else if(average>3 && average<=7){
				result = 2;
			}else{
				result = 3;
			}
			return result;
		}

		postsList.saveQualification = function(post){
			if(postsList.isFood(post)){
				var radioPI = $('input[name="radioPI"]:checked').val();
				var radioAA = $('input[name="radioAA"]:checked').val();
				var radioGS = $('input[name="radioGS"]:checked').val();
				var radioCH = $('input[name="radioCH"]:checked').val();

				if(radioPI!=undefined && radioAA!=undefined && radioGS!=undefined && radioCH!=undefined){
					var average = Math.round(parseFloat(radioPI) + parseFloat(radioAA) +parseFloat(radioGS) + parseFloat(radioCH));
					var result = postsList.getResultFromAverage(average);
					postsList.qualificationAdmin.saveQualificationForFood(post.id,post.user,average, radioPI, radioAA, radioGS, radioCH, result, function(){
						if(!postsList.historicSelected){
							postsList.removePost(post);
							$scope.$apply();
						}
					});

				}else{
					alert("Verifique que haya ingresado todos los campos para calificar");
				}
			}else{
				var activityRadio = $(".activityRadio:checked").val();
				if(activityRadio!=undefined){
					var average = parseInt(activityRadio);
					var result = postsList.getActivityResultFromAverage(average);
					postsList.qualificationAdmin.saveQualificationForActivity(post.id, post.user, average, result, function(){
						if(!postsList.historicSelected){
							postsList.removePost(post);
							$scope.$apply();
						}
					});

				}else{
					alert("Verifique que haya ingresado todos los campos para calificar");
				}
			}
		}

		$(window).scroll(function() {
		   if($(window).scrollTop() + $(window).height() == $(document).height()) {
		       postsList.nextPage();
		   }
		});

		postsList.loadData();

		window.postsList = postsList;



	}])