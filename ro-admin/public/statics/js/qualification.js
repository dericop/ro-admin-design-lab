angular.module('qualificationApp',[])
	.controller('PostsController', ['$scope', function($scope){
		var postsList = this;
		postsList.posts = [];

		postsList.loadData = function(data){
			qualitificationAdmin = new QualificationAdmin();
			qualitificationAdmin.loadPosts(function(data){
				console.log(data);
				postsList.posts.push(data);
				$scope.$apply();
			});

			window.qualitificationAdmin = qualitificationAdmin;
			
		}();
	}])