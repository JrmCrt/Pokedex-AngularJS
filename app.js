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
            info.ability = []
            for (v of data['abilities']) {
                info.ability.push(v['ability']['name']);
            }
            info.ability = info.ability.join(', ');

            info.attack = [];
            for (v of data['moves']) {
                info.attack.push(v['move']['name']);
            }
            info.attack = info.attack.join(', ');

            info.stat = [];
            for (v of data['stats']) {
                info.stat.push(v['stat']['name'] + " : " + v['base_stat']);
            }

            $.getJSON('http://pokeapi.co/api/v2/pokemon-species/'+pokemonId+'/',function(data2){
                var description = data2['flavor_text_entries'][1]['flavor_text'];
                var evo = data2['evolution_chain']['url'];             
                info.description = description;
                var absUrl = $location.absUrl();
                var path = $location.path();
                var url = absUrl.replace(path,'') + "/" ;
                
                $.getJSON(evo, function(data3){
                    info.evolution = ['<a href="' + url + 'pokemon/' + data3['chain']['species']['name'] + '">' + data3['chain']['species']['name'] + '</a>'];
                    var obj = data3['chain'];

                    while(obj['evolves_to'].length > 0)
                    {
                        for (v of obj['evolves_to']) {
                            var name = v['species']['name'];
                            info.evolution.push('<a href="' + url + 'pokemon/' + name + '">' + name + '</a>');
                        }
                        obj = obj['evolves_to'][0];
                    }

                    $("#pokeInfo").append('<p> Evolution(s) : ' + info.evolution.join(', ') + '.</p>');
                    info.done = true;    
                });

                $scope.$apply(function(){
                    $scope.data = info;
                    $scope.hide = true;
                    $scope.json = data;
                })
            });
            
        });

    $scope.favorite = function() {
        $location.path('/favorites');
    }    

}]);

app.controller('favoritesCtrl', ['$scope', '$location', function($scope, $location) {

    console.log('fav');

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
      when('/favorites', {
        templateUrl: 'favorites.html',
        controller: 'favoritesCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);


})();