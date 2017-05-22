/*
* Created by: Daniel Estiven Rico Posada
* Laboratorio de Diseño Estratégico
* Controlador de calificaciones
*/

angular.module('qualificationApp',[])
	.controller('PostsController', ['$scope', function($scope){
		var postsList = this;
		postsList.posts = []; //listado de posts
		postsList.lastPost = ''; //último post publicado
		postsList.qualificationAdmin = null; //referencia al modelo de calificación
		postsList.foodCategories = ["Desayuno", "Almuerzo", "Comida", "Algo"]; //Categoria de alimentos
		postsList.historicSelected = false; //Indica si se quiere cargar pendientes o historicos

		var btnItems = document.getElementById("btnItems");
		btnItems.className += " btnSelected";

		//Accesos al DOM
		postsList.emailForm = document.getElementById("email");
		postsList.passwordForm = document.getElementById("password");

		//Variables de debug
		$scope.curActivityValue = 3;

		qualificationAdmin = new QualificationAdmin();

		//Referencia de elementos del DOM
		var pendingItem = document.getElementById('btn-item-pending');
		var historicItem = document.getElementById('btn-item-historic');

		pendingItem.className = "itemSelected"; //Seleccionar por defecto las publicaciones pendientes

		//Evento para cerrar sesión
		postsList.logOut = function(){
			postsList.qualificationAdmin.logOut(function(){
				postsList.loadData();
			});
		}

		//Carga los datos en históricos o pendientes
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

		//Carga el resultado de posts pendientes en el feed visual
		postsList.loadPostsInArray = function(data){
			var d = null;
			for(d in data)
				postsList.posts.push(data[d]);

			if(d)
				postsList.lastPost = d+"";
		}

		//Carga el resulto de posts históricos en el feed visual
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

		///DEBUG para la carga de calificaciones en items ya calificados
		postsList.loadActivityPostQualification = function(post){
			$scope.curActivityValue = post.average;
			console.log($scope.curActivityValue);
		}

		//Carga la siguiente página del listado de históricos
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

		//Indica si un posts debe ser visible en una sección específica
		postsList.shouldBeVisible = function(post){

			if(postsList.historicSelected){
				if(post.result==null){
					return false;
				}
			}
			return true;
		}

		//Indica si el post enviado es un alimento
		postsList.isFood = function(post){
			if(postsList.foodCategories.indexOf(post.category) != -1)
				return true;
			return false;
		}

		//Carga los datos de la pestaña pendientes
		postsList.setPending = function(){
			postsList.historicSelected = false;
			pendingItem.className="itemSelected";
			historicItem.className="";
			postsList.loadData();
		}

		//Carga los datos de la pestaña históricos
		postsList.setHistoric = function(){
			postsList.historicSelected = true;
			pendingItem.className="";
			historicItem.className="itemSelected";
			postsList.loadData();
		}

		//Indica si el arreglo de posts está vacío
		postsList.postsIsEmpty = function(){
			return postsList.posts.length == 0;
		}

		//Obtiene el resultado de la publicación basados en su promedio
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

		//Elimina un post de la lista de pendientes
		postsList.removePost = function(post){
			var index = postsList.posts.indexOf(post);
			if(index>-1)
				postsList.posts.splice(index, 1);
		}	

		//Obtiene el resultado de una actividad basados en su promedio
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

		postsList.setActivitySelected = function(post){
			return post.average;
		}

		//Guarda la calificación
		postsList.saveQualification = function(post){
			if(postsList.isFood(post)){
				var radioPI = $('.radioPI:checked').val();
				var radioAA = $('.radioAA:checked').val();
				var radioGS = $('.radioGS:checked').val();
				var radioCH = $('.radioCH:checked').val();

				if(radioPI!=undefined && radioAA!=undefined && radioGS!=undefined && radioCH!=undefined){
					var average = Math.round(parseFloat(radioPI) + parseFloat(radioAA) +parseFloat(radioGS) + parseFloat(radioCH));
					var result = postsList.getResultFromAverage(average);
					postsList.qualificationAdmin.saveQualificationForFood(post.id,post.user,average, parseFloat(radioPI), parseFloat(radioAA), parseFloat(radioGS), parseFloat(radioCH), result, function(){
						if(!postsList.historicSelected){
							postsList.removePost(post);
							$scope.$apply();
						}
						alert("Calificado con éxito");
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

						alert("Calificado con éxito");
					});

				}else{
					alert("Verifique que haya ingresado todos los campos para calificar");
				}
			}
		}


		postsList.login = function(e){
			if(postsList.emailForm.checkValidity() && postsList.passwordForm.checkValidity()){
				e.preventDefault();
				
				postsList.qualificationAdmin.logIn(postsList.emailForm.value, postsList.passwordForm.value, function(){
					postsList.loadData();
				});
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