nf2.controller('AuthHomeCtrl', function ($scope, $state, bsLoadingOverlayService, UserService) {
    'use strict';

    console.log("AuthHomeCtrl");
    UserService.logOut();


    $scope.formLogin = {};
    $scope.formLoginDocument = {};

    $scope.login = function () {
        $scope.error = '';
        bsLoadingOverlayService.start();
        UserService.checkUser($scope.formLogin.username);
    };

    // will fire in case authentication failed
    $scope.$on('userFailedLogin', function (event, response) {
        console.log('userFailedLogin');
        bsLoadingOverlayService.stop();
        $scope.error = response.message;
    });

    $scope.$on('userChecked', function (event, data) {
        console.log('userChecked');
        bsLoadingOverlayService.stop();
        $state.go('password');
    });

});