nf2.controller('NavCtrl', function ($scope, UserService, TrainingService) {

    $scope.user = UserService.getUser();

    if (TrainingService.isStaff()) {
        $scope.current_trainee = TrainingService.getCurrentTrainee();
    }

    $scope.$on('traineeUpdated', function (event, data) {
        $scope.current_trainee = data;
    });


});
