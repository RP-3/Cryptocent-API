angular
    .module('app')
    .controller('homeController', ['$scope', 'MinlyData', function($scope, MinlyData){
        $scope.title = 'Home';

        $scope.tinyStuff = [
            {ID: 2}
        ];

        $scope.foo = function(){
            MinlyData.get('bitcoin', $scope.tinyStuff);
        };

        $scope.log = function(){
            console.log($scope.thing);
        }

        $scope.items = [1, 3, 5, 2, 7];
        $scope.selectedValue = 5;
    }]);