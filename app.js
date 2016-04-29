(function(){
var app = angular.module('app', [
    'ngRoute'
]);

app.controller('pokemonCtrl', ['$scope', '$location', function($scope, $location) {

    $scope.click = function() {
        $location.path('/pokemon/' + $scope.id.toLowerCase());
    }

}]);

app.controller('detailsCtrl', ['$scope', '$location', '$routeParams', function($scope, $location, $routeParams) {
    var pokemonId = $routeParams.id.toLowerCase();
    var info = new Object();
    
    $scope.hide = false;

    
    $.getJSON('http://pokeapi.co/api/v2/pokemon/'+pokemonId+'/',function(data){

            info.name = data['name'];
            info.sprite = data['sprites']['front_default'];
            info.weight = data['weight'] / 10;
            info.height = data['height'] / 10;
            var types = [];
            for (v of data['types']) {
                types.push(v['type']['name']);
            }
            info.types = types.join(', ');
            
            $.getJSON('http://pokeapi.co/api/v2/pokemon-species/'+pokemonId+'/',function(data2){
                var description = data2['flavor_text_entries'][1]['flavor_text'];
                var evo = data2['evolution_chain']['url'];             
                info.description = description;
                
                $.getJSON(evo, function(data3){
                    console.log(data3['chain']);
                    console.log(data3['chain']['species']['name']);
                
                });

                $scope.$apply(function(){
                    $scope.data = info;
                    $scope.hide = true;
                })
            });
            
        });



}]);



app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/pokemon/:id', {
        templateUrl: 'pokemon.html',
        controller: 'detailsCtrl'
      }).
      when('/', {
        templateUrl: 'home.html',
        controller: 'pokemonCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);


})();

