// Contact Class.
function Contact(newContact) {
	var self = this;
	
	var id = newContact.id;
	var name = newContact.name;
	var address = newContact.address;
	var notes = newContact.notes;
//	var fIsUpdated = newContact.done;
	
	self.getContact = function() {
		var newData = {
				"id": id,
				"name": name,
				"address": address,
				"notes": notes
//				"done": fIsUpdated
		};
		return newData;
	};
	
	self.updateContact = function(details) {
		name = details.name;
		address = details.address;
		notes = details.notes;
//		fIsUpdated = details.done;
	};
};

// Initialize Angular JS application.
angular.module('contactApp', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'partials/contactList.html',
				controller: 'listController'
			})
			.when('/contact', {
				templateUrl: 'partials/contactDetails.html',
				controller: 'detailsController'
			})
			.when('/create', {
				templateUrl: 'partials/createContact.html',
				controller: 'createContactController'
			})
			.when('/edit', {
				templateUrl: 'partials/contactEdit.html',
				controller: 'contactEditController'
			})
			.otherwise({
				redirectTo: '/'
			})
	}])
	.factory('contacts', function($http) {
		return $http.get('json/contacts.json');
	})
	.factory('passDetails', function() {
		var oData = {
				"contacts": [],
				"passDetail": {},
				"editContact": [],
				"deleteContact": [],
				"createContact": []
		};
		
		return {
			addData: function(toWhich, newData) {
				switch(toWhich) {
					case "editContact": oData.editContact.push(newData);
						break;
					case "deleteContact": oData.deleteContact.push(newData);
						break;
					case "createContact": oData.createContact.push(newData);
						break;
				}
			},
			
			setData: function(toWhich, newData) {
				switch(toWhich) {
					case "contacts": oData.contacts = newData;
						break;
					case "passDetail": oData.passDetail = newData;
						break;
				}
			},
			
			getData: function(toWhich) {
				var sendData = [];
				
				switch(toWhich) {
					case "contacts": {
						sendData = (oData.contacts.length > 0)? oData.contacts : [];
						break;
					}
					case "passDetail": {
						sendData = (oData.passDetail.hasOwnProperty("name"))? oData.passDetail : {};
						break;
					}
					case "editContact": {
						angular.forEach(oData.editContact, function(value, key, obj) {
							if(!value.done)
								sendData.push(value);
						});
						break;
					}
					case "deleteContact": {
						angular.forEach(oData.deleteContact, function(value, key, obj) {
							if(!value.done)
								sendData.push(value);
						});
						break;
					}
					case "createContact": {
						angular.forEach(oData.createContact, function(value, key, obj) {
							if(!value.done)
								sendData.push(value);
						});
						break;
					}
				}
				
				return sendData;
			},
			
			setUpdateFlag: function(toWhich, id) {
				switch(toWhich) {
					case "editContact": {
						angular.forEach(oData.editContact, function(value, key, obj) {
							if(value.id == id)
								value.done = true;
						});
						
						break;
					}
					case "deleteContact": {
						angular.forEach(oData.deleteContact, function(value, key, obj) {
							if(value.id == id)
								value.done = true;
						});
						
						break;
					}
					case "createContact": {
						angular.forEach(oData.createContact, function(value, key, obj) {
							if(value.id == id)
								value.done = true;
						});
						
						break;
					}
				}
			},
			
			updateEditContact: function(updateData) {
				angular.forEach(oData.editContact, function(value, key, obj) {
					if(value.id == updateData.id && !value.done) {
						value.name = updateData.name;
						value.phoneNo = updateData.phoneNo;
						value.address = updateData.address;
						value.notes = updateData.notes;
					}
				});
			}
		};
	})
	.directive('googleMap', function($window) {
		return {
			restrict: 'E',
			scope: {
				/*lat: '@',
				lng: '@',*/
				addr: '@'
			},
			template: '<div><div>',
			replace: true,
			link: function($scope, $element, $attributes) {
				var latitude, longitude, inpAddress;
				var currentLongitude, currentLatitude, currentPosition;
				var directionsService = new google.maps.DirectionsService();
				var directionsRenderer = new google.maps.DirectionsRenderer();
				ele = $element;
				attrs = $attributes;
				
				navigator.geolocation.getCurrentPosition(function(position) {
					currentLatitude = position.coords.latitude
					currentLongitude = position.coords.longitude
				});
				
				$window.setTimeout(function() {
					/*$attributes.$observe('lat', function(value) {
						latitude = parseFloat($element[0].getAttribute('lat'));
					});
					
					$attributes.$observe('lng', function(value) {
						longitude = parseFloat($element[0].getAttribute('lng'));
					});*/
					
					$attributes.$observe('addr', function(value) {
						inpAddress = $element[0].getAttribute('addr');
					});
				}, 500);
				
				$window.setTimeout(function() {
					var attrAddr = attrs.addr;
					
					if((attrAddr != undefined || attrAddr != null) && (attrAddr != inpAddress))
						inpAddress = attrAddr;
					
					fnCallback = function(message) {
				    	console.log(message);
				    };
				    
				    var getLatLngFrmAddr = function(callback, address) {
				    	if(address) {
				    		var geocoder = new google.maps.Geocoder();
					        if (geocoder) {
					            geocoder.geocode({
					                'address': address
					            }, function (results, status) {
					                if (status == google.maps.GeocoderStatus.OK) {
					                	callback(status);
					                	latitude = results[0].geometry.location.lat();
					                	longitude = results[0].geometry.location.lng();
					                }
					                else {
					                	alert("Please provide valid address");
					                	callback(results);
					                }
					            });
					        }
				    	}
				    	else
				    		callback("Please provide valid address");
				    };
				    
				    getLatLngFrmAddr(fnCallback, inpAddress);
				}, 1000);
				
				$window.setTimeout(function() {
					/*var attrLat = parseFloat(attrs.lat);
					var attrLng = parseFloat(attrs.lng);
					
					if(attrLat != 0 && attrLat != latitude)
						latitude = attrLat;
					
					if(attrLng != 0 && attrLng != longitude)
						longitude = attrLng;*/
					
					var oMapOpts = {
						zoom: 15,
						center: new google.maps.LatLng(latitude, longitude)
					};
					var oMap = new google.maps.Map($element[0], oMapOpts);
					
					new google.maps.Marker({
			            map: oMap,
			            position: oMapOpts.center
					});
					
					currentPosition = new google.maps.LatLng(currentLatitude, currentLongitude);
					directionsRenderer.setMap(oMap);
					directionsService.route({
							  origin: currentPosition,
							  destination: oMapOpts.center,
							  travelMode: 'DRIVING'
							}, function(response, status) {
								if (status === 'OK') {
									directionsRenderer.setDirections(response);
								}
								else {
									console.log(status);
								}
					});
				}, 2000);
			}
		};
	})
	.directive('placesAutocomplete', function() {
		return {
			restrict: 'A',
			scope: {},
			link: function(scope, element, attr, controller) {
				oElement = element;
				oScope = scope;
				oController = controller;
				var autoComplete = new google.maps.places.Autocomplete(oElement[0], {});
				
				google.maps.event.addListener(autoComplete, 'place_changed', (function() {
					var autoCompleteSrv = new google.maps.places.AutocompleteService();
					
					autoCompleteSrv.getPlacePredictions({
		                input: oScope.$parent.address
		              }, function listentoresult(list, status) {
		            	  if(list != undefined || list.length > 0) {
		            		  var placesService = new google.maps.places.PlacesService(oElement[0]);
		                      placesService.getDetails({'reference': list[0].reference}, function detailsresult(detailsResult, placesServiceStatus) {
		                    	  if (placesServiceStatus == google.maps.GeocoderStatus.OK) {
		                    		  oScope.$apply(function() {
		                    			  oScope.$parent.address = detailsResult.formatted_address;
		                    			  oElement.val(detailsResult.formatted_address);
		                    			  oScope.details = detailsResult;
		                    			  
		                    			  //on focusout the value reverts, need to set it again.
		                    			  var watchFocusOut = oElement.on('focusout', function(event) {
			                    			  oScope.$parent.address = detailsResult.formatted_address;
		                    				  oElement.val(detailsResult.formatted_address);
		                    				  oElement.unbind('focusout')
	                    				  });
	                				  });
		                          }
		                        }
		                      );
		            	  }
		            });
					
					/*var result = autoComplete.getPlace();
					
					if(result != undefined) {
						getPlace(result);
					}*/
				}));
				
				/*var getPlace = function(result) {
					var autoCompleteSrv = new google.maps.places.AutocompleteService();
					
					autoCompleteSrv.getPlacePredictions({
		                input: result.name,
		                offset: result.name.length
		              }, function listentoresult(list, status) {
		            	  if(list != undefined || list.length > 0) {
		            		  var placesService = new google.maps.places.PlacesService(oElement[0]);
		                      placesService.getDetails({'reference': list[0].reference}, function detailsresult(detailsResult, placesServiceStatus) {
		                    	  if (placesServiceStatus == google.maps.GeocoderStatus.OK) {
		                    		  oScope.$apply(function() {
		                    			  oScope.$parent.address = detailsResult.formatted_address;
		                    			  oElement.val(detailsResult.formatted_address);
		                    			  oScope.details = detailsResult;
		                    			  
		                    			  //on focusout the value reverts, need to set it again.
		                    			  var watchFocusOut = oElement.on('focusout', function(event) {
			                    			  oScope.$parent.address = detailsResult.formatted_address;
		                    				  oElement.val(detailsResult.formatted_address);
		                    				  oElement.unbind('focusout')
	                    				  });
	                				  });
		                          }
		                        }
		                      );
		            	  }
		            });
				}*/
			}
		};
	})
	.controller('listController', ['$scope', 'contacts', 'passDetails', '$location', function($scope, contacts, passDetails, $location) {
		$scope.filterParam = "";
		$scope.contacts = [];
		var editedContact = passDetails.getData('editContact');
		var deletedContact = passDetails.getData('deleteContact');
		var createdContact = passDetails.getData('createContact');
		
		$scope.search = function(contact) {
			var regExp = new RegExp($scope.filterParam, 'i');
	        return !$scope.filterParam || regExp.test(contact.name) || regExp.test(contact.phoneNo);
		};
		
		contacts.success(function(response) {
			var changeIndex = -1;
			var changedContactId = -1;
			var deleteIndex = -1;
			var deletedContactId = -1;
			
			$scope.contacts = response.data;
			
			if(editedContact.length > 0) {
				angular.forEach(editedContact, function(value, key, obj) {
					changeIndex = -1;
					changedContactId = -1;
					
					angular.forEach(response.data, function(innrValue, innrKey, innrObj) {
						if(value.id == innrValue.id) {
							changedContactId = innrValue.id;
							changeIndex = innrKey;
							return 0;
						}
					});
					
					if(changeIndex > -1) {
						$scope.contacts[changeIndex].id = editedContact[key].id;
						$scope.contacts[changeIndex].name = editedContact[key].name;
						$scope.contacts[changeIndex].phoneNo = editedContact[key].phoneNo;
						$scope.contacts[changeIndex].address = editedContact[key].address;
						$scope.contacts[changeIndex].notes = editedContact[key].notes;
						passDetails.setUpdateFlag("editContact", changedContactId);
					}
				});
			}
			
			if(deletedContact.length > 0) {
				angular.forEach(deletedContact, function(value, key, obj) {
					deleteIndex = -1;
					deletedContactId = -1;
					
					angular.forEach(response.data, function(innrValue, innrKey, innrObj) {
						if(value.id == innrValue.id) {
							deletedContactId = innrValue.id;
							deleteIndex = innrKey;
							return 0;
						}
					});
					
					if(deleteIndex > -1) {
						$scope.contacts.splice(deleteIndex, 1);
						passDetails.setUpdateFlag("deleteContact", deletedContactId);
					}
				});
			}
			
			if(createdContact.length > 0) {
				var newContact = {};
				angular.forEach(createdContact, function(value, key, obj) {
					newContact = {
							"id": value.id,
							"name": value.name,
							"phoneNo": value.phoneNo,
							"address": value.address,
							"notes": value.notes
					};
					
					$scope.contacts.push(newContact);
					passDetails.setUpdateFlag("createContact", value.id);
				});
			}
			
			passDetails.setData("contacts", $scope.contacts);
		});
		
		$scope.showDetails = function(selectedContact) {
			passDetails.setData("passDetail", selectedContact);
			passDetails.addData("editContact", {
				"id": selectedContact.id,
				"name": selectedContact.name,
				"phoneNo": selectedContact.phoneNo,
				"address": selectedContact.address,
				"notes": selectedContact.notes,
				"done": false
			});
			$location.path('contact');
		};
		
		$scope.createContact = function() {
			$location.path('/create');
		};
	}])
	.controller('detailsController', ['$scope', '$location', '$window', 'passDetails', function($scope, $location, $window, passDetails) {
	    if(passDetails.getData("editContact").length > 0)
	    	$scope.contactDetail = passDetails.getData("editContact");
	    else
	    	$scope.contactDetail = passDetails.getData("passDetail");
		
		$scope.isEditable = true;
	    
	    /*
	      $scope.latitude = 0.00;
	    $scope.longitude = 0.00;
	      
	     fnCallback = function(message) {
	    	console.log(message);
	    };
	    
	    var getLatLngFrmAddr = function(callback, address) {
	    	if(address) {
	    		var geocoder = new google.maps.Geocoder();
		        if (geocoder) {
		            geocoder.geocode({
		                'address': address
		            }, function (results, status) {
		                if (status == google.maps.GeocoderStatus.OK) {
		                	callback(status);
		                	$scope.latitude = results[0].geometry.location.lat();
		                	$scope.longitude = results[0].geometry.location.lng();
		                }
		                else {
		                	alert("Please provide valid address");
		                	callback(results);
		                }
		            });
		        }
	    	}
	    	else
	    		callback("Please provide valid address");
	    };
	    
	    getLatLngFrmAddr(fnCallback, $scope.contactDetail.address);*/
	    
		$scope.editContact = function() {
			$location.path('edit');
		};
		
		$scope.deleteContact = function() {
			$scope.contactDetail.done = false;
			passDetails.addData("deleteContact", $scope.contactDetail);
			$location.path('/');
		};
	}])
	.controller('contactEditController', ['$scope', '$location', '$window', 'passDetails', function($scope, $location, $window, passDetails) {
		var details = passDetails.getData("editContact");
		
		$scope.name = details[0].name;
		$scope.phoneNo = details[0].phoneNo;
		$scope.address = details[0].address;
		$scope.notes = details[0].notes;
		
		$scope.done = function() {
			var updatedData = {
				"id": details[0].id,
				"name": $scope.name,
				"phoneNo": $scope.phoneNo,
				"address": $scope.address,
				"notes": $scope.notes,
				"done": false
			};
			
			passDetails.updateEditContact(updatedData);
			$location.path('contact');
		};
	}])
	.controller('createContactController', ['$scope', '$location', '$window', 'passDetails', function($scope, $location, $window, passDetails) {
		var id = 0;
		var contactsList = passDetails.getData("contacts");
		var isSelected = false;
		
		$scope.name = "";
		$scope.phoneNo = "";
		$scope.address = "";
		$scope.notes = "";
		
		function getRandomInt(min, max) {
		    return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		
		var generateID = function() {
			while(1) {
				id = getRandomInt(0, 1000);
				
				angular.forEach(contactsList, function(value, key, obj) {
					if(value.id != id) {
						isSelected = true;
						return 0;
					}
				});
				
				if(isSelected)
					break;
			}
		};
		
		$scope.create = function() {
			generateID();
			passDetails.addData("createContact", {
				"id": id,
				"name": $scope.name,
				"phoneNo": $scope.phoneNo,
				"address": $scope.address,
				"notes": $scope.notes,
				"done": false
			});
			$location.path('/');
		};
		
		$scope.reset = function() {
			id = 0;
			$scope.name = "";
			$scope.phoneNo = "";
			$scope.address = "";
			$scope.notes = "";
		};
	}]);