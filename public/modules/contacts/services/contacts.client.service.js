'use strict';
//Contacts service used to communicate Contacts REST endpoints
angular.module('contacts').factory('Contacts', ['$resource',
	function($resource) {
		return $resource('contacts/:contactId', { contactId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
            findAdoptedCats: {
                method: 'GET',
                url: 'contacts/:contactId/adoptions',
                isArray: true
            },
            getAllAdopters: {
                method: 'GET',
                url: 'adopters',
                isArray: true
            }
		});
	}
]);
