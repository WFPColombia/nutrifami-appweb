nf2.directive('optionDrt', function () {
    return {
        restrict: 'E',
        scope: {
            info: '=',
            index: '@'
        },
        templateUrl: 'directives/option/option.drt.html',
        link: function ($scope, $element, $attrs) {
            $scope.click = function () {
                $scope.$parent.seleccionarOpcion($scope.index);
            };
            
            $scope.playAudio = function(id){
                $scope.$parent.playAudio('option'+id);
            };
        }
    };
});