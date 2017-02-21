angular.module('qualificationApp',[])
	.controller('PostsController', ['$scope', function($scope){
		var postsList = this;
		postsList.posts = [];
		postsList.lastPost = '';
		postsList.qualificationAdmin = null;
		postsList.foodCategories = ["Desayuno", "Almuerzo", "Comida", "Algo"];
		postsList.historicSelected = true;

		qualificationAdmin = new QualificationAdmin();
		var pendingItem = document.getElementById('btn-item-pending');
		var historicItem = document.getElementById('btn-item-historic');

		historicItem.className = "itemSelected";

		postsList.loadData = function(){
			postsList.posts = [];
			if(postsList.historicSelected){
				qualificationAdmin.loadPostsStartAt(function(data){
					postsList.loadPostsInArray(data);
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
			for(d in data)
				postsList.posts.push(data[d]);

			postsList.posts.pop();
			if(d)
				postsList.lastPost = d+"";
		}

		postsList.nextPage = function(){
			if(postsList.historicSelected){
				postsList.qualificationAdmin.loadPostsStartAt(function(data){
					
					postsList.loadPostsInArray(data);
					$scope.$apply();

				}, postsList.lastPost)
			}else{
				/*postsList.qualificationAdmin.loadHistoricPostsStartAt(function(data){
					
					postsList.loadPostsInArray(data);
					$scope.$apply();

				}, postsList.lastPost)*/
			}
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

		$(window).scroll(function() {
		   if($(window).scrollTop() + $(window).height() == $(document).height()) {
		       postsList.nextPage();
		   }
		});

		postsList.loadData();



	}])