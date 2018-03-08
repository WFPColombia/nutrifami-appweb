nf2.controller('CapModuleCtrl', function ($scope, $rootScope, $anchorScroll, $stateParams, $anchorScroll, UserService, CapacitationService) {
    $anchorScroll();

    $scope.module = CapacitationService.getModule($stateParams.module);
    $scope.user = UserService.getUser();
    $scope.lessons = [];
    
    console.log($scope.module);

    $scope.total_lessons = 0;
    $scope.total_lessons_endend = 0;

    $scope.lids = CapacitationService.getLessonsIds($stateParams.module);
    $scope.assetpath = $rootScope.ASSETPATH;

    for (var lid in $scope.lids) {
        var tempLesson = CapacitationService.getLesson($scope.lids[lid]);
        if (tempLesson.activo === '1') {
            $scope.total_lessons++;
            tempLesson.avance = UserService.getAvanceLeccion($scope.lids[lid]);
            if (tempLesson.avance){
                $scope.total_lessons_endend++;
            }
            $scope.lessons.push(tempLesson);
        }
    }
    
    $scope.percentage = 100 / $scope.total_lessons * $scope.total_lessons_endend ;

});
