var app = angular.module('app', [
    'ngRoute'
]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/pokemon/:id', {
        templateUrl: 'templates/pokemon.html',
        controller: 'detailsCtrl'
      }).
      when('/favorites', {
        templateUrl: 'templates/favorites.html',
        controller: 'favoritesCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
}]);

app.filter('ucfirst', function() { 
    return function(string) {
        if(string)
            return string[0].toUpperCase() + string.substr(1).toLowerCase();
    };
});