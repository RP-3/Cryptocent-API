angular
    .module('app')
    .controller('navController', ['$scope', '$location', function($scope, $location){


        $scope.userId = $location.search().id;
        $location.url($location.path());
        $scope.loggedIn = $scope.userId ? true : false;
        console.log($scope.loggedIn);

        
    }]);