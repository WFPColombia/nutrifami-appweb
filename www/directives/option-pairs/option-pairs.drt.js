nf2.directive('optionPairsDrt', function ($rootScope) {
    return {
        restrict: 'E',
        scope: {
            info: '=',
            index: '@'
        },
        templateUrl: 'directives/option-pairs/option-pairs.html',
        link: function ($scope, $element, $attrs) {
            
            console.log($scope.info);
            
            $scope.assetpath = $rootScope.ASSETPATH;
            console.log($scope.assetpath);
            $scope.click = function () {
                $scope.$parent.seleccionarPareja($scope.index);
            };
        }
    };
});