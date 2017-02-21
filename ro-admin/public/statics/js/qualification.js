angular.module('qualificationApp',[])
	.controller('PostsController', ['$scope', function($scope){
		var postsList = this;
		postsList.posts = [];
		postsList.lastPost = '';
		postsList.qualificationAdmin = null;
		postsList.foodCategories = ["Desayuno", "Almuerzo", "Comida", "Algo"];

		postsList.loadData = function(){
			postsList.posts = [];
			qualificationAdmin = new QualificationAdmin();
			qualificationAdmin.loadPostsStartAt(function(data){
				postsList.loadPostsInArrayForNext(data);
				$scope.$apply();
			});
			postsList.qualificationAdmin = qualificationAdmin;
			window.qualificationAdmin = qualificationAdmin;
		}();

		postsList.loadPostsInArrayForNext = function(data){
			for(d in data)
				postsList.posts.push(data[d]);

			if(d)
				postsList.lastPost = d+"";
		}

		postsList.loadPostsInArrayForPrevious = function(data){
			var i = 0;
			for(d in data){
				i++;
				if(i == 1)
					postsList.lastPost = d+"";
				postsList.posts.push(data[d]);
			}
				
		}

		postsList.nextPage = function(){
			postsList.posts = [];
			console.log(postsList.lastPost);
			postsList.qualificationAdmin.loadPostsStartAt(function(data){

				postsList.loadPostsInArrayForNext(data);
				postsList.posts.shift(0);//Elimino el que queda repetido por la consulta
				$scope.$apply();

			}, postsList.lastPost)
		}

		postsList.previousPage = function(){
			postsList.posts = [];
			console.log(postsList.lastPost);
			postsList.qualificationAdmin.loadPostsEndAt(function(data){

				postsList.loadPostsInArrayForPrevious(data);
				$scope.$apply();

			}, postsList.lastPost)
		}

		postsList.isFood = function(post){
			if(postsList.foodCategories.indexOf(post.category) != -1)
				return true;
			return false;
		}



	}])