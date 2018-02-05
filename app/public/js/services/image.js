angular.module('imageService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Images', ['$http',function($http) {
		return {
			get : function(searchText) {
				return $http.get('/api/photos/' + searchText);
			},
			create : function(todoData) {
				return $http.post('/api/photos', todoData);
			},
			delete : function(id) {
				return $http.delete('/api/photos/' + id);
			}
		}
	}]);