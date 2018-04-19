nf2.directive('optionPairsDrt', function ($rootScope) {
    return {
        restrict: 'E',
        scope: {
            info: '=',
            index: '@'
        },
        templateUrl: 'directives/option-pairs/option-pairs.html',
        link: function ($scope, $element, $attrs) {
            $scope.assetpath = $rootScope.ASSETPATH;
            $scope.click = function () {
                $scope.$parent.seleccionarPareja($scope.index);
            };
        }
    };
});