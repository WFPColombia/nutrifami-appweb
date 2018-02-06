nf2.directive('moduleDrt', function ($rootScope, $state, $stateParams, UserService) {
    return {
        restrict: 'E',
        scope: {
            info: '='
        },
        templateUrl: 'directives/module/module.drt.html',
        link: function ($scope, $element, $attrs) {
            $scope.avance = UserService.getAvanceModulo($scope.info.id);
            $scope.assetpath = $rootScope.ASSETPATH;

            $scope.goToModule = function () {
                $state.go('nf.cap_module', {
                    capacitation: $stateParams.capacitation,
                    module: $scope.info.id
                });
            };
        }
    };
});
