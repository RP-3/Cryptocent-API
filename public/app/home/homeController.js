angular
    .module('app')
    .controller('homeController', ['$scope', function($scope){
        $scope.title = 'Home';
        $scope.items = [1, 3, 5, 2, 7];
    }]);