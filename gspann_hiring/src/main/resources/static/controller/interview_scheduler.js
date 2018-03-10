/**
 * 
 */

myApp.directive('fileModel', [ '$parse', function($parse) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function() {
				scope.$apply(function() {
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
} ]);

myApp.service('fileUploader', [ '$http', function($http) {
	this.uploadFileToUrl = function(file, uploadUrl) {
		var fd = new FormData();
		// fd.append("model", angular.toJson(postData));
		fd.append('uploadFile', file);
		return $http.post(uploadUrl, fd, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).success(function(data,status) {
			console.log(data+ "  : "+status);
			// return data.subTaskResult;
			return status;
		}).error(function(data) {
			return data;
		});
	}
} ]);

myApp.filter('split', function() {
	return function(input, splitChar, splitIndex) {
		// do some bounds checking here to ensure it has that index
		return input.split(splitChar)[splitIndex];
	}
});

// ************************For Google chart api***********************
myApp.factory('ChartService', function() {
	return {

		/**
		 * Loads the visualization module from the Google Charts API if
		 * available
		 * 
		 * @returns {boolean} - Returns true is successful, or false if not
		 *          available
		 */
		loadGoogleVisualization : function() {

			// Using a try/catch block to guard against unanticipated
			// errors when loading the visualization lib
			try {

				// Arbitrary callback required in google.load() to
				// support loading after initial page rendering
				google.load('visualization', '1', {
					'callback' : 'console.log(\'success\');',
					'packages' : [ 'corechart' ]
				});

				return true;

			} catch (e) {
				console.log('Could not load Google lib', e);
				return false;
			}

		}
	};
});

myApp
		.directive(
				"googleChart",
				function() {
					return {
						restrict : "A",
						link : function($scope, $elem, $attr) {
							var model;

							// Function to run when the trigger is activated
							var initChart = function() {

								// Run $eval on the $scope model passed
								// as an HTML attribute
								model = $scope.$eval($attr.ngModel);

								// If the model is defined on the scope,
								// grab the dataTable that was set up
								// during the Google Loader callback
								// function, and draw the chart
								if (model) {
									var dt = model.dataTable, options = {}, chartType = $attr.googleChart;

									if (model.title) {
										options.title = model.title;
									}

									var googleChart = new google.visualization[chartType](
											$elem[0]);
									googleChart.draw(dt, options)
								}
							};

							// Watch the scope value placed on the trigger
							// attribute
							// if it ever flips to true, activate the chart
							$scope.$watch($attr.trigger, function(val) {
								if (val === true) {
									initChart();
								}
							});

						}
					}
				});

myApp
		.controller(
				'ChartCtrl',
				function($scope, $http, ChartService) {

					// activateChart flips to true once the Google
					// Loader callback fires
					$scope.activateChart = false;
					$scope.loading = 'no';
					$scope.bugByStatus = 'init';
					$scope.bugByStatusFlag = 'no';
					console.log("called the controller.....")
					document.getElementById("loadingChart").style.visibility = "hidden";
					$scope.tagName = "na";

					// This is where my data model will be stored.
					// "visual" will contain the chart's datatable
					$scope.dataModel = {
						visual : {},
						metaData : {},
						data : {}
					};

					// First, we attempt to load the Visualization module
					var loadGoogle = ChartService.loadGoogleVisualization();

					// If the Google Loader request was made with no errors,
					// register a callback, and construct the chart data
					// model within the callback function
					if (loadGoogle) {
						google.charts.load('current', {
							'packages' : [ 'corechart' ]
						});
						google.charts.setOnLoadCallback(drawChart);

						function drawChart() {
							console.log("Google chart loaded.....");

							// Update the model to activate the chart on the DOM
							// Note the use of $scope.$apply since we're in the
							// Google Loader callback.

							$(document)
									.ready(
											function() {
												$scope.loading = 'yes';
												// document.getElementById("loading").style.visibility
												// = "visible";
												$
														.ajax({
															type : 'GET',
															dataType : 'json',
															url : 'http://indl136032.in.oracle.com:5555/HEDEnvDetails/EnvironmentDetails/bugTagCount',
															success : function(
																	response) {
																console
																		.log(response);
																$scope.loading = 'no';
																// document.getElementById("loading").style.visibility
																// = "hidden";
																drawVisualization(response.bugTagCounter);
																// drawVisualizationColumnChart(response.bugTagCounter);
															}
														});
											})

							$scope.$apply(function() {
								$scope.activateChart = true;
							});
						}
					}

					// ***********************START
					// SCRIPT********************************

					function drawVisualization(dataValues) {
						var data = new google.visualization.DataTable();
						data.addColumn('string', 'tagName');
						data.addColumn('number', 'noOfBugs');
						for (var i = 0; i < dataValues.length; i++) {
							data.addRow([ dataValues[i].tagName,
									parseInt(dataValues[i].noOfBugs) ]);
						}
						console.log(data)
						var chart = new google.visualization.PieChart(document
								.getElementById('visualization'));
						chart.draw(data, {
							title : "Bug Reporting Tool ",
							is3D : true
						});

						google.visualization.events.addListener(chart,
								'select', selectHandler);

						function selectHandler(e) {
							$scope.loading = 'yes';
							console.log("Changed to yes")
							console.log($scope.loading)
							document.getElementById("loadingChart").style.visibility = "visible";
							document.getElementById("visualization").style.visibility = "hidden";
							console.log(chart.getSelection()[0].row);
							if (data.getValue(chart.getSelection()[0].row, 0) === 'hedRel13p')
								drawVisualizationColumnChart('hedRel13p');
							else if (data.getValue(chart.getSelection()[0].row,
									0) === 'rel13must')
								drawVisualizationColumnChart('rel13must');
							else if (data.getValue(chart.getSelection()[0].row,
									0) === 'rel13c')
								drawVisualizationColumnChart('rel13c');
							else if (data.getValue(chart.getSelection()[0].row,
									0) === 'rel13p')
								drawVisualizationColumnChart('rel13p');

						}
					}

				});

// ************************End of google chart api**********************

myApp
		.controller(
				'interviewAdminHomeController',
				function($scope, $log, $http) {

					$scope.candidates = "";
					$scope.modalCandidate = "";
					$scope.interviewLevel = "";
					$scope.candidateDetails = "";
					$scope.singleCandidate = 'false';

					$http.get('/candidates').success(function(data) {
						$scope.candidates = data;
						console.log(typeof $scope.candidates);

					});
					$scope.getCandidates = function() {
						$http.get('/candidates').success(function(data) {
							if (typeof data.candidate == 'undefined') {
								console.log("candidate is not defined");
								$scope.candidates = "NO_DATA";
							} else if (data.candidate.length > 1) {
								console.log("More than one records");
								$scope.candidates = data.candidate;
							} else {
								console.log("Only one candidate");
								$scope.candidates = data;
							}
							console.log(typeof $scope.candidates);

						});
					}
					$scope.setCandidate = function(candidate) {
						$scope.modalCandidate = candidate;

						$http.get('/interviewers').success(function(data) {
							$scope.interviewers = data;
						});

						if ($scope.modalCandidate.candidateStatus == 'NOT_STARTED') {
							$scope.interviewLevel = 1;
						} else {
							$scope.interviewLevel = parseInt($scope.modalCandidate.interviewLevel) + 1;
						}
					}
					$scope.convertToInt = function(num) {
						return parseInt(num);
					}

					$scope.interviewDetails = "na";

					$scope.showCandidateDetails = function(candidateId) {
						$scope.interviewDetails = "";
						console.log("show candidate details called...");
						$http
								.get(
										'/HEDEnvDetails/InterviewService/candidateWithInterviewStatus/'
												+ candidateId)
								.success(
										function(data) {
											$scope.candidateDetails = data;
											if (typeof data.interviewStatusList == 'undefined') {
												$scope.interviewDetails = "NO_DATA";
											} else if (data.interviewStatusList.length > 1) {
												$scope.interviewDetails = data.interviewStatusList;
											} else {
												$scope.interviewDetails = data;
											}
										});
					}

					$scope.assignInterviewer = function() {
						console.log("Interview assignment called");

						$http
								.post(
										'/HEDEnvDetails/InterviewService/assignInterviewer?candidateId='
												+ $scope.modalCandidate.candidateId
												+ '&interviewLevel='
												+ $scope.interviewLevel
												+ '&interviewer='
												+ $scope.interviewer)
								.success(
										function(data) {
											$scope.assignResult = data;
											console.log(data);
											if (data == 'success') {
												swal(
														"Interviewer assigned Successfully",
														"Notification has been triggered",
														"success");
												$scope.getCandidates();
											}

										});
					}

				});

myApp
		.controller(
				'interviewerHomeController',
				function($scope, $log, $http, fileUploader) {

					$scope.candidates = "";
					$scope.modalCandidate = "";
					$scope.interviewLevel = "";
					$scope.loggedinUer = "";
					var user = "";
					$scope.username = "";
					$scope.ssoStatus = "na";

					// $http
					// .get("/HEDEnvDetails/EnvironmentDetails/getSession")
					// .success(
					// function(data, status) {
					// if (data.userName != 'null') {
					// $scope.showUser = 'true';
					// $log.info(data);
					// if (data.userName === 'Tapas'
					// || data.userName === 'Basanth'
					// || data.userName === 'Chuck')
					// $scope.login = 'true';
					// $scope.loggedinUer = data.userName;
					// console.log("Logged in user:"+$scope.loggedinUer);
					// if(typeof $scope.loggedinUer == 'undefined'){
					// $scope.ssoStatus = "not_login";
					// }else{
					// console.log($scope.loggedinUer);
					// user = $scope.loggedinUer.split('.');
					// console.log(user.length);
					// for(var i = 0;i<user.length;i++){
					// if(i == 0)
					// $scope.username = $scope.username +
					// user[i].toLowerCase();
					// else
					// $scope.username = $scope.username + "." +
					// user[i].toLowerCase();
					// }
					// $scope.username = $scope.loggedinUer + '@oracle.com';
					// if($scope.loggedinUer == 'Prasanna'){
					// $scope.username = 'prasanna.kumar.nistala@oracle.com';
					// $scope.loggedinUer = $scope.username;
					// }else if($scope.loggedinUer == 'Chandrasekhar'){
					// $scope.username =
					// 'suma.chandrasekhar.nirmala@oracle.com';
					// $scope.loggedinUer = $scope.username;
					// }
					// //****************************Checking for email
					// Id*************
					// // swal(
					// // {
					// // title : "Please confirm your mail id and if wrong then
					// correct it ",
					// // type : "input",
					// // inputType : "text",
					// // closeOnConfirm : true,
					// // animation : "slide-from-top",
					// // inputValue : $scope.username
					// // },
					// // function(inputValue) {
					// // if (inputValue === false)
					// // return false;
					// // if (inputValue === "") {
					// // swal
					// // .showInputError("You need to write something!");
					// // return false
					// // }
					// // $scope.username = inputValue;
					// //
					// // }
					// // );
					// //****************************End of checking for email
					// id*************
					// console.log($scope.username);
					// //$scope.username = user[0].toLowerCase() +'.'+
					// user[1].toLowerCase()+'@oracle.com';
					// $scope.getAssignedCandidate();
					// }
					// } else {
					//
					// $scope.login = 'false';
					// }
					// }).error(function(data, status) {
					// console.log(data);
					// });
					//			

					// $http
					// .get(
					// '/HEDEnvDetails/InterviewService/assignedCandidate?username='+$scope.username)
					// .success(function(data) {
					// console.log(data);
					// if(data == null){
					// $scope.candidates = "NO_DATA";
					// }else if(data.interviewStatus.length > 1){
					// $scope.candidates = data.interviewStatus;
					// }else{
					// $scope.candidates = data;
					// }
					// console.log(typeof $scope.candidates);
					//						
					// });

					// $scope.getAssignedCandidate = function() {
					// $http
					// .get(
					// '/HEDEnvDetails/InterviewService/assignedCandidate?username='+$scope.username)
					// .success(function(data) {
					// console.log(data);
					// if(data == null){
					// $scope.candidates = "NO_DATA";
					// }else if(data.interviewStatus.length > 1){
					// $scope.candidates = data.interviewStatus;
					// }else{
					// $scope.candidates = data;
					// }
					// console.log(typeof $scope.candidates);
					//					
					// });
					// }
					$scope.setCandidate = function(candidate) {
						$scope.modalCandidate = candidate.candidate;
						$scope.interviewDetails = candidate;

						$http.get('/interviewers').success(function(data) {
							$scope.interviewers = data;
						});

						if ($scope.modalCandidate.candidateStatus == 'NOT_STARTED') {
							$scope.interviewLevel = 1;
						} else {
							$scope.interviewLevel = $scope.interviewDetails.interviewLevel;
						}
					}

					$scope.uploadIfs = function() {
						console.log("Uploa IFS called");

						var file = $scope.myIfs;
						console.log($scope.myIfs);
						console.log('file is ');
						console.dir(file);
						var uploadUrl = "/HEDEnvDetails/InterviewService/upload/ifs?candidateId="
								+ $scope.interviewDetails.candidateId
								+ "&interviewId="
								+ $scope.interviewDetails.interviewId
								+ "&ifsPath="
								+ $scope.modalCandidate.ifs
								+ "&result=" + $scope.result;
						fileUploader
								.uploadFileToUrl(file, uploadUrl)
								.success(
										function(result) {
											$scope.result = result;
											console.log("Printing the result");
											console.log($scope.result);
											if ($scope.result == 'SUCCESS') {
												swal(
														"IFS Uploaded Successfully",
														"Notification has been triggered to Admin",
														"success");
												$scope.getAssignedCandidate();
											}
										});

					}

				});

myApp.controller('interviewSchedulerController', [
		'$scope',
		'fileUploader',
		'$http',
		'$routeParams',
		function($scope, fileUploader, $http, $routeParams) {
			$scope.orgList = "";

			$http.get('/organizations').success(function(data) {
				console.log(data);
				if (data.length > 1) {
					$scope.orgList = data;
				} else {
					$scope.orgList = data;
					console.log(data);
				}

			});

			$scope.candidateId = $routeParams.candidateId;
			$scope.updateStatus = "na";
			console.log($scope.candidateId);
			if ($scope.candidateId != 'non') {
				console.log("Getting the candidate Details : "
						+ $scope.candidateId);
				$http.get('/getCandidate/' + $scope.candidateId).success(
						function(data) {
							$scope.candidate = data;
							$scope.name = $scope.candidate.name;
							$scope.org = $scope.candidate.organization;
							$scope.exp = $scope.candidate.experience;
							$scope.role = $scope.candidate.role;
						});
			}
			var d = new Date();
			// $scope.currentDate =
			// d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
			$scope.currentDate = d.getFullYear() + "-" + (d.getMonth() + 1)
					+ "-" + d.getDate();
			$scope.result = "na";
			// var user = $scope.loggedinUer.split(' ');
			// $scope.username = $scope.loggedinUer+'@oracle.com';
			// $scope.name = "";
			// $scope.org = "";
			// $scope.exp = "";
			// $scope.role = "";

			$scope.uploadFile = function() {
				console.log("Entered to uploadFile");
				if (typeof $scope.name == 'undefined'
						|| typeof $scope.org == 'undefined'
						|| typeof $scope.role == 'undefined'
						|| typeof $scope.myFile == 'undefined'
						|| typeof $scope.exp == 'undefined'
						|| typeof $scope.currentDate == 'undefined') {
					return;
				}
				if ($scope.org == 'other') {
					$scope.org = $scope.newOrg;
				}

				$scope.processingFile = 'true';
				var file = $scope.myFile;
				console.log($scope.myFile);
				console.log('file is ');
				console.dir(file);
				var postData = {
					name : $scope.name,
					organization : $scope.org,
					role : $scope.role,
					experience : $scope.exp,
					creationDate : $scope.currentDate,
					candidateStatus : 'NOT_STARTED'
				};
				var uploadUrl = "/candidate";
				// fileUploader.uploadFileToUrl(
				// file, uploadUrl, postData).success(function(result) {
				// $scope.result = result;
				// $scope.processingFile = 'false';
				// console.log("Printing the result");
				// console.log($scope.result);
				// $scope.name = undefined;
				// $scope.org = undefined;
				// $scope.role = undefined;
				// $scope.myFile = undefined;
				// $scope.exp = undefined
				// $http
				// .get(
				// '/organizations')
				// .success(function(data) {
				// if(data.organization.length > 1){
				// $scope.orgList = data.organization;
				// }else{
				// $scope.orgList = data;
				// }
				//										
				// });
				// });
				$http.post('/candidate', postData).success(
						function(data, status) {
							$scope.result = data;
							console.log(status + '   : ' + data);
							if (status == 201) {
								console.log("Its success");
								//*****************
								fileUploader.uploadFileToUrl(file,
										"/uploadResume?candidateId="+data.candidateId).success(
										function(result) {
											console.log("After file upload"
													+ result);

										});

								//*****************

							}
						});

			};

			$scope.updateCandidate = function() {
				$http.post(
						'/HEDEnvDetails/InterviewService/updateCandidate?name='
								+ $scope.name + "&org=" + $scope.org + "&role="
								+ $scope.role + "&exp=" + $scope.exp
								+ "&candidateId=" + $scope.candidateId)
						.success(function(data) {
							$scope.updateStatus = data;

						});
			}

		} ]);