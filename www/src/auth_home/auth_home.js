nf2.controller('AuthHomeCtrl', function ($scope, $state, bsLoadingOverlayService, UserService) {
    'use strict';

    console.log("AuthHomeCtrl");
    UserService.logOut();

    $scope.formLogin = {};

    $scope.login = function () {
        $scope.error = '';
        bsLoadingOverlayService.start();
        UserService.login($scope.formLogin.username, 'abc12345');
    };

    // will fire in case authentication failed
    $scope.$on('userFailedLogin', function (event, response) {
        console.log('userFailedLogin');
        bsLoadingOverlayService.stop();
        $scope.error = response.message;
    });

    $scope.$on('userLoggedIn', function (event, data) {
        console.log("userLoggedIn Login");
        bsLoadingOverlayService.stop();
        $state.go('nf.cap_home');
    });

});