nf2.directive('optionDrt', function ($rootScope) {
    return {
        restrict: 'E',
        scope: {
            info: '=',
            index: '@'
        },
        templateUrl: 'directives/option/option.drt.html',
        link: function ($scope, $element, $attrs) {
            $scope.assetpath = $rootScope.ASSETPATH;
            $scope.click = function () {
                $scope.$parent.seleccionarOpcion($scope.index);
            };
            
            $scope.playAudio = function(id){
                $scope.$parent.playAudio('option'+id);
            };
        }
    };
});