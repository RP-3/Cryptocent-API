angular
    .module('app')
    .controller('homeController', ['$scope', 'MinlyData', '$http', function($scope, MinlyData, $http){
        $scope.title = 'Cryptocent';

        $http.get('app/data/sightings.json').success(function(result){
            $scope.sightings = result;

            $scope.renderer = 'line'; //edit type of chart here, e.g., 'bar', 'scatterplot'

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

            console.log($scope.sightingsByDate);
        });



        var now = new Date().toISOString();
        var hrAgo = new Date((new Date() - 3600000)).toISOString();
        $http.get('http://localhost:3000/api/minly/bi/'+hrAgo+'/'+now).success(function(result){
            $scope.bit = result;

            for(var i=0; i<$scope.bit.length; i++){
                var newObj = {};
                newObj.x = new Date($scope.bit[i].updated).getTime()/1000;
                newObj.y = $scope.bit[i].last;
                newObj.y0 = 0;

                $scope.bit[i] = newObj;
            }

            $scope.renderer = 'line';

        });

        // $scope.tinyStuff = [
        //     {ID: 2}
        // ];

        // $scope.foo = function(){
        //     MinlyData.get('bitcoin', $scope.tinyStuff);
        // };
    }]);