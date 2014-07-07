angular
    .module('app')
    .directive('rickshawChart', function(){
        return {
            scope: {
                data: '=',
                renderer: '='
            },
            template: '<div></div>',
            restrict: 'E',
            link: function postLink(scope, element, attrs){
                scope.$watchCollection('[data, renderer]', function(newVal, oldVal){
                    if(!newVal[0]){
                        return;
                    }

                    var graphEl = element.find("div:first");
                    graphEl.html('');

                    var graph = new Rickshaw.Graph({
                        element: graphEl[0],
                        width: attrs.width,
                        height: attrs.height,
                        series: [{data: scope.data, color: attrs.color, name:attrs.series}],
                        renderer: scope.renderer
                    });

                    graph.render();

                    var xAxis = new Rickshaw.Graph.Axis.Time({graph:graph});
                    xAxis.render();

                    var yAxis = new Rickshaw.Graph.Axis.Y({graph:graph});
                    yAxis.render();

                });
            }
        };
    });