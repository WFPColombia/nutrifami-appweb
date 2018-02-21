nf2.controller('AuthSignupCtrl', function ($scope, $state, bsLoadingOverlayService, UserService) {

    $scope.formSignup = {};

    $scope.signup = function () {

        $scope.error = "";
        bsLoadingOverlayService.start();
        var user = {
            username: $scope.formSignup.username,
            email: '',
            password: 'abc12345',
            first_name: $scope.formSignup.first_name,
            last_name: $scope.formSignup.last_name,
            id_antiguo: null,
            terminos: $scope.formSignup.terminos
        };
        UserService.signup(user);
    };


    $scope.$on('userLoggedIn', function (event, data) {
        console.log("userLoggedIn Registro");
        bsLoadingOverlayService.stop();
        $state.go('nf.cap_home');

    });

    // will fire in case authentication failed
    $scope.$on('userFailedLogin', function (event, response) {
        console.log(response);
        bsLoadingOverlayService.stop();
        $scope.error = response.message;

    });
});