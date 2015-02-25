'use strict';

angular.module('core').controller('CatViewController', ['$scope', '$stateParams', 'Authentication', 'Cats',
        function($scope, $stateParams, Authentication, Cats) {
            // This provides Authentication context.
            $scope.authentication = Authentication;

			$scope.isFound = false;
            $scope.cat = Cats.get({catId: $stateParams.catId}, 
				function() {
					$scope.isFound = true;
				});

            $scope.convertSex = function(sexNumber) {
                if (sexNumber === 0) {
                    return 'Unknown';
                }
                else if (sexNumber === 1) {
                    return 'Male';
                }
                else if (sexNumber === 2) {
                    return 'Female';
                }
                else if (sexNumber === 9) {
                    return 'N/A';
                }
            };
        }]
);
