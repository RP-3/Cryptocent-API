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
                controller: 'homeController'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'app/about/about.html',
                controller: 'aboutController'
            })
    }])