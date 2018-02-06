nf2.directive('lessonDrt', function ($state, $stateParams) {
    return {
        restrict: 'E',
        scope: {
            leccion: '='
        },
        templateUrl: 'directives/lesson/lesson.drt.html',
        link: function ($scope, $element, $attrs) {
            $scope.goToLesson = function () {
                console.log($scope.leccion.id);
                $state.go('nf.cap_unit', {
                    capacitation: $stateParams.capacitation,
                    module: $stateParams.module,
                    lesson: $scope.leccion.id,
                    unit:1
                });
            };
        }
    };
});