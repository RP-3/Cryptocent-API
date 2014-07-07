angular
    .module('app')
    .controller('aboutController', ['$scope', function($scope){
        $scope.stuff = ['stuff', 'morestuff', 'yet more stuff'];
    }]);