angular
    .module('app')
    .controller('homeController', ['$scope', 'MinlyData', '$http', function($scope, MinlyData, $http){
        $scope.title = 'Cryptocent';

        $http.get('app/data/sightings.json').success(function(result){
            $scope.sightings = result;

            $scope.renderer = 'line';

            $scope.sightingsByDate = _(result)
                .chain()
                .countBy(function(sighting){return sighting.sightedAt.$date;})
                .pairs()
                .map(function(pair){
                    return {
                        x: new Date(parseInt(pair[0])).getTime()/1000,
                        y: pair[1]
                    };
                })
                .sortBy(function(dateCount){return dateCount.x;})
                .value();
        });




        // $scope.tinyStuff = [
        //     {ID: 2}
        // ];

        // $scope.foo = function(){
        //     MinlyData.get('bitcoin', $scope.tinyStuff);
        // };
    }]);