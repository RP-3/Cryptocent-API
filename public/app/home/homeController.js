angular
    .module('app')
    .controller('homeController', ['$scope', 'friends', function($scope, friends){
        $scope.title = 'Home';
        $scope.friends = friends;
        $scope.items = [1, 3, 5, 2, 7];
        $scope.selectedValue = 5;
    }]);