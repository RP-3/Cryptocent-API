angular
    .module('app', [
        'ui.router'
        ])
    .config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){
        $urlRouterProvider.otherwise('/'); //seems to control what happens when navigating directly to routes from within the domain of the app
    
        //given to us by ui-router
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/home/home.html',
                controller: 'homeController',
                resolve: {
                    friends: ['$http', function($http){
                        return $http.get('http://localhost:3000/api/minly/bi/2014-06-25T20:11:08.246Z/2014-06-25T20:16:39.868Z').then(function(response){
                            return response;
                        })
                    }]
                }
            })
            .state('about', {
                url: '/about',
                templateUrl: 'app/about/about.html',
                controller: 'aboutController'
            })
    }])