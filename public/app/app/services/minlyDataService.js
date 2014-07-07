angular
    .module('app')
    .factory('MinlyData', ['$http', function($http){

        return {
            get: function(currency, target){
                var now = new Date().toISOString();
                var hrAgo = new Date((new Date() - 3600000)).toISOString();
                $http.get('http://localhost:3000/api/minly/'+currency.slice(0,2)+'/'+hrAgo+'/'+now)
                .then(function(response){
                    console.log(response.data);
                    for(var i=0; i<response.data.length; i++){
                        target.push(response.data[i]);
                    }
                });
            }
        };
    }]);