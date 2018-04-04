var myApp = angular.module('myApp', [ 'ngMessages', 'ngRoute', 'ngResource' ]);

myApp.config(function($routeProvider) {

	$routeProvider

	.when('/', {
		templateUrl : 'pages/interview/home.html',
		controller : 'interviewAdminHomeController'
	})
	//Routing part for Interview Scheduler
	.when('/interviewAdmin/:candidateId', {
		templateUrl : 'pages/interview/admin.html',
		controller : 'interviewSchedulerController'
	}).when('/interviewAdminHome', {
		templateUrl : 'pages/interview/home.html',
		controller : 'interviewAdminHomeController'
	}).when('/interviewerHome', {
		templateUrl : 'pages/interview/interviewerHome.html',
		controller : 'interviewerHomeController'
	})

	
});

myApp
		.controller(
				'mainController',
				function($scope, $log, $http) {
					$scope.login = 'false';
					$scope.showUser = 'false';
					$scope.qaditHostName = "";
					$scope.pmditHostName = "";
					$scope.deploymentStatus = "false";

					
					$http
							.get("/HEDEnvDetails/EnvironmentDetails/getSession")
							.success(
									function(data, status) {
										if (data.userName != 'null') {
											$scope.showUser = 'true';
											$log.info(data);
											if (data.userName === 'Tapas'
													|| data.userName === 'Basanth'
													|| data.userName === 'Chuck')
												$scope.login = 'true';
											$scope.loggedinUer = data.userName;

											if ($scope.login == 'true') {
												$scope.getEnvInternalDetails();
											}

										} else {

											$scope.login = 'false';
										}
									}).error(function(data, status) {
								console.log(data);
							});

				
					$scope.enableEditTest = function() {
						if ($scope.uname == null || $scope.uname == ""
								|| $scope.pass == null || $scope.pass == "") {
							swal("username and password can not be blank!", "",
									"error");
							return;
						}
						var user = {
							userName : $scope.uname,
							password : $scope.pass,
						};
						$http
								.post(
										"/HEDEnvDetails/EnvironmentDetails/createSession",
										user)
								.success(
										function(data, status) {
											$scope.loggedinUer = data.userName;
											$log.info(data);
											if (data.userName != 'null') {
												$scope.login = 'true';
												$scope.editFlag = 'true';
												$scope.uname = "";
												$scope.pass = "";
												swal(
														"You are successfully logged in",
														"You can edit the content now",
														"success");
											} else {
												swal(
														"Wrong password",
														"Don't try to edit if you are not the authorized person",
														"error");
												$scope.uname = "";
												$scope.pass = "";
											}
										}).error(function(data, status) {
									console.log(data);
								});
						$scope.getEnvInternalDetails();
					}

					$scope.logout = function() {
						$http
								.get("/HEDEnvDetails/EnvironmentDetails/logout")
								.success(
										function(data, status) {
											if (data == 'success') {
												$scope.login = 'false';
												swal(
														"You are successfully logged out",
														"You can login again to edit it",
														"success");
											} else if (data == 'already_logout') {
												swal(
														"You are already logged out",
														"You can login again",
														"success");
											}
										}).error(function(data, status) {
									console.log(data);
								});
					}

				});


myApp.controller('homeController', function($scope, $log, $http, $interval) {

	

});








myApp.directive('backButton', function() {
	return {
		restrict : 'A',

		link : function(scope, element, attrs) {
			element.bind('click', goBack);

			function goBack() {
				history.back();
				scope.$apply();
			}
		}
	}
});

myApp.filter('toArray', function() {
	return function(obj, addKey) {
		if (!angular.isObject(obj))
			return obj;
		if (addKey === false) {
			return Object.keys(obj).map(function(key) {
				return obj[key];
			});
		} else {
			return Object.keys(obj).map(
					function(key) {
						var value = obj[key];
						return angular.isObject(value) ? Object.defineProperty(
								value, '$key', {
									enumerable : false,
									value : key
								}) : {
							$key : key,
							$value : value
						};
					});
		}
	};
});