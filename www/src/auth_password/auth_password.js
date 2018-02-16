nf2.controller('AuthPasswordCtrl', function ($scope, $state, bsLoadingOverlayService, UserService) {
    'use strict';

    console.log("AuthPasswordCtrl");
    
    $scope.username = JSON.parse(localStorage.getItem('username'));


    $scope.formLogin = {};
    $scope.formLoginDocument = {};

    $scope.login = function () {
        $scope.error = '';
        bsLoadingOverlayService.start();
        UserService.login($scope.formLogin.password);
    };

    $scope.$on('userLoggedIn', function (event, data) {
        console.log("userLoggedIn Login");
        bsLoadingOverlayService.stop();
        $state.go('nf.cap_home');

    });

    // will fire in case authentication failed
    $scope.$on('userFailedLogin', function (event, response) {
        console.log('userFailedLogin');
        bsLoadingOverlayService.stop();
        $scope.error = response.message;
    });

});