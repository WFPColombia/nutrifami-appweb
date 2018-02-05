nf2.controller('AuthHomeCtrl', function ($scope, $state, bsLoadingOverlayService, UserService) {
    'use strict';

    console.log("AuthHomeCtrl");
    UserService.logOut();


    $scope.formLogin = {};
    $scope.formLoginDocument = {};

    $scope.login = function () {
        $scope.error = '';
        bsLoadingOverlayService.start();
        UserService.login($scope.formLogin.username, $scope.formLogin.password);
    };

    $scope.loginDocument = function () {
        $scope.error = '';
        bsLoadingOverlayService.start();
        UserService.loginCedula($scope.formLoginDocument.username, 'no-pass');
    };

    $scope.$on('userLoggedIn', function (event, data) {
        console.log("userLoggedIn Login");
        bsLoadingOverlayService.stop();
        $state.go('home.capacitation');

    });

    // will fire in case authentication failed
    $scope.$on('userFailedLogin', function (event, response) {
        console.log('userFailedLogin');
        bsLoadingOverlayService.stop();
        $scope.error = response.message;
    });

    $scope.$on('userLoggedInwithDocument', function (event, data) {
        console.log('userLoggedInwithDocument');
        bsLoadingOverlayService.stop();
        $state.go('migration');

    });


});