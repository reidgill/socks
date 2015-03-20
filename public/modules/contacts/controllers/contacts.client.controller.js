'use strict';

// Contacts controller

var contactsApp = angular.module('contacts');

contactsApp.controller('ContactsController', ['$scope', '$stateParams', 'Authentication', 'Contacts', '$modal', '$log', '$location',
	function($scope, $stateParams, Authentication, Contacts, $modal, $log, $location) {

        this.authentication = Authentication;

        //$scope.linkToContact =  function(selectedContact,  $location){
        //    $location.path('contacts/' + response._id);
        //}

        $scope.getDetails = function(contact) {
            $location.path('contacts/' + contact._id);
        }
        //find a list of Contacts
        $scope.find = function() {
            $scope.contacts = Contacts.query();
        }
            // Open a modal window to Update a single contact record
            this.modalUpdate = function (size, selectedContact) {

                var modalInstance = $modal.open({
                    templateUrl: 'modules/contacts/views/edit-contacts.client.view.html',
                    controller: function($scope, $modalInstance, contact){
                        $scope.contact = contact;

                        $scope.ok = function () {

                            if (document.updateContactForm.$valid){
								$modalInstance.close($scope.contact);
                            }
                            $modalInstance.dismiss('cancel');
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    },
                    size: size,
                    resolve: {
                        contact: function () {
                            return selectedContact;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
    }
]);

contactsApp.controller('ContactsCreateController', ['$scope', 'Contacts', '$location',
    function($scope, Contacts, $location) {
        // Create new Contact

        $scope.create = function() {
            // Create new Contact object
            var contact = new Contacts ({
                firstName: $scope.firstName,
                surname: $scope.surname,
                address: $scope.address,
                state: $scope.state,
                zipCode: $scope.zipCode,
                email: $scope.email,
                phone: $scope.phone,
                is_volunteer: $scope.is_volunteer,
                city: $scope.city
            });

            // Redirect after save
            contact.$save(function(response) {
                $location.path('contacts/' + response._id);

                // Clear form fields
                $scope.firstName = undefined;
                $scope.surname = undefined;
                $scope.address = undefined;
                $scope.state = undefined;
                $scope.zipCode = undefined;
                $scope.email = undefined;
                $scope.phone = undefined;
                $scope.is_volunteer = undefined;
                $scope.city = undefined;
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
                console.log(errorResponse);
            });
        };
    }
]);

contactsApp.controller('ContactsUpdateController', ['$scope', 'Contacts',
    function($scope, Contacts) {

        // Update existing Contact
        $scope.update = function(updatedContact) {
        	var contact = updatedContact;

        	contact.$update(function() {
        	}, function(errorResponse) {
        		$scope.error = errorResponse.data.message;
        	});
        };

    }
]);

contactsApp.controller('ContactsViewController', [ '$scope', 'Contacts', '$stateParams', '$modal',
function ($scope, Contacts, $stateParams, $modal) {
    // Find existing Contact
    $scope.findOne = function () {
        $scope.contact = Contacts.get({
            contactId: $stateParams.contactId
        });
        console.log($scope.contact);
    };

    // Open a modal window to Update a single contact record
    this.modalUpdate = function (size, selectedContact) {

        var modalInstance = $modal.open({
            templateUrl: 'modules/contacts/views/edit-contacts.client.view.html',
            controller: function($scope, $modalInstance, contact){
                $scope.contact = contact;

                $scope.ok = function () {

                    if (document.updateContactForm.$valid){
                        $modalInstance.close($scope.contact);
                    }
                    $modalInstance.dismiss('cancel');
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            },
            size: size,
            resolve: {
                contact: function () {
                    return selectedContact;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };



}]);
contactsApp.directive('contactList', [function() {
    return {
        restrict: 'E',
        transclude: true,
        templateURL: 'modules/contacts/views/view-contacts.client.view.html',
        link: function(scope, element, attrs){

         }
    };


}]);

		//// Create new Contact
		//$scope.create = function() {
		//	// Create new Contact object
		//	var contact = new Contacts ({
         //       firstName: this.firstName,
		//		surName: this.surName,
         //       address: this.address,
         //       state: this.state,
         //       zipCode: this.zipCode,
         //       email: this.email,
         //       phone: this.phone,
         //       is_volunteer: this.is_volunteer,
         //       city: this.city
		//	});
        //
		//	// Redirect after save
		//	contact.$save(function(response) {
		//		$location.path('contacts/' + response._id);
        //
		//		// Clear form fields
         //       $scope.firstName = '';
         //       $scope.surName = '';
         //       $scope.address = '';
         //       $scope.state = '';
         //       $scope.zipCode = '';
         //       $scope.email = '';
         //       $scope.phone = '';
         //       $scope.is_volunteer = '';
         //       $scope.city = '';
         //   }, function(errorResponse) {
		//		$scope.error = errorResponse.data.message;
		//	});
		//};

		//// Remove existing Contact
		//$scope.remove = function(contact) {
		//	if ( contact ) { contact.$remove();
        //
		//		for (var i in $scope.contacts) {
		//			if ($scope.contacts [i] === contact) {
		//				$scope.contacts.splice(i, 1);
		//			}
		//		}
		//	} else {
		//		$scope.contact.$remove(function() {
		//			$location.path('contacts');
		//		});
		//	}
		//};
        //
		//// Update existing Contact
		//$scope.update = function() {
		//	var contact = $scope.contact;
        //
		//	contact.$update(function() {
		//		$location.path('contacts/' + contact._id);
		//	}, function(errorResponse) {
		//		$scope.error = errorResponse.data.message;
		//	});
		//};
        //
		//// Find existing Contact
		//$scope.findOne = function() {
		//	$scope.contact = Contacts.get({
		//		contactId: $stateParams.contactId
		//	});
		//};
