(function(){
app.controller('pokemonCtrl', ['$scope', '$location', function($scope, $location) {

    $scope.click = function() {
        $location.path('/pokemon/' + $scope.id.toLowerCase());
    }

}]);

app.controller('detailsCtrl', ['$scope', '$location', '$routeParams', function($scope, $location, $routeParams) {
    var pokemonId = $routeParams.id.toLowerCase();
    var info = {};
    
    $scope.hide = false;
    $scope.notFound = false;

    $scope.hideNotFound = function()
    {
        $scope.notFound = false;
    };

    var cache = JSON.parse(localStorage.getItem('cache')) || [];

    var inCache = function(name){
        for(var i=0; i<cache.length; i++)
            if(cache[i].name == name || cache[i].id == name)
                return cache[i];
        return false;
    }

    if(inCache($routeParams.id) !== false){
        info = inCache($routeParams.id);
        $scope.data = info;
        $scope.hide = true;
        $scope.json = $scope.data;
        $scope.$root.title = info.name;
        console.log(info);
        $("#pokeInfo").append('<p> <span class="type">Evolution(s) : </span>' + info.evolution.join(', ') + '.</p>');
    }
    else{
        $.getJSON('http://pokeapi.co/api/v2/pokemon/'+pokemonId+'/',function(data){
                info.name = data.name;
                info.id = data.id;
                $scope.$root.title = info.name;
                info.sprite = data.sprites.front_default;
                info.weight = data.weight / 10;
                info.height = data.height / 10;

                var types = [];
                for(v of data.types) 
                    types.push(v.type.name);
                
                info.types = types.join(', ');
                info.ability = []
                for(v of data.abilities) 
                    info.ability.push(v.ability.name);
                
                info.ability = info.ability.join(', ');

                info.attack = [];
                for(v of data.moves) 
                    info.attack.push(v.move.name);

                info.attack = info.attack.join(', ');

                info.stat = [];
                for(v of data.stats)
                    info.stat.push(v['stat']['name'] + " : " + v['base_stat']);

                $.getJSON('http://pokeapi.co/api/v2/pokemon-species/'+pokemonId+'/',function(data2){
                    var description = data2['flavor_text_entries'][1]['flavor_text'];
                    var evo = data2['evolution_chain']['url'];             
                    info.description = description;
                    var absUrl = $location.absUrl();
                    var path = $location.path();
                    var url = absUrl.replace(path,'') + "/" ;
                    info.link = url + 'pokemon/' + info.name ;
                    
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

                        $("#pokeInfo").append('<p> <span class="type">Evolution(s) : </span>' + info.evolution.join(', ') + '.</p>');
                        info.done = true;    
                    
                    }).done(function(){
                        console.log(info);
                        console.log(cache);
                        cache.push(info);
                        localStorage.setItem('cache', JSON.stringify(cache));
                    });

                    $scope.$apply(function(){
                        $scope.data = info;
                        $scope.hide = true;
                        $scope.json = data;
                    })

                });
                
            }).fail(function() {
                $scope.$apply(function(){
                    $scope.hide = true;
                    $scope.notFound = true;
            });
        });
    }

    $scope.favorite = function() {

        var favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        for (var i = 0; i < favorites.length; i++) 
            if (favorites[i].name == info.name)
                return $scope.favDouble = true;
            
        $location.path('/favorites');
       
        favorites.push({name :info.name, sprite: info.sprite});
        localStorage.setItem('favorites', JSON.stringify(favorites));
    } 

    $scope.hideInfo = function(){
        $scope.info = true;
    }       

}]);

app.controller('favoritesCtrl', ['$scope', '$location', function($scope, $location) {

    $scope.$root.title = 'favorites';
    var favorites = JSON.parse(localStorage.getItem("favorites"));
    
    $scope.fav = favorites; 

    $scope.deleteFav = function() {
        localStorage.removeItem('favorites');
        $scope.fav = JSON.parse(localStorage.getItem("favorites"));
    }
    
    $scope.deleteOne = function(name){
        for (var i = 0; i < favorites.length; i++) {
            if (favorites[i].name == name)
            {
                favorites.splice(i, 1);
                localStorage.setItem('favorites', JSON.stringify(favorites));
            }
        }
    }
  
}]);

})();