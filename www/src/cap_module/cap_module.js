nf2.controller('CapModuleCtrl', function ($scope, $rootScope, $location, $anchorScroll, $stateParams, $anchorScroll, UserService, CapacitationService) {
    $anchorScroll();

    CapacitationService.initClient();
    $scope.module = CapacitationService.getModulo($stateParams.module);
    $scope.user = UserService.getUser();
    $scope.lessons = [];

    $scope.assetpath = $rootScope.TARGETPATH + $stateParams.capacitacion + "/" + $stateParams.module + "/";

    $scope.total_lessons = 0;
    $scope.total_lessons_endend = 0;

    $scope.lids = CapacitationService.getLessonsId($stateParams.module);

    for (var lid in $scope.lids) {
        var tempLesson = CapacitationService.getLeccion($scope.lids[lid]);
        console.log(tempLesson);
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
