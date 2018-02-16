nf2.controller('AuthSignupCtrl', function ($scope, $state, bsLoadingOverlayService, UserService) {

    $scope.formSignup = {};

    $scope.signup = function () {

        $scope.error = "";

        if (/[^a-zA-Z0-9\-\/]/.test($scope.formSignup.username)) {
            $scope.error = "El Usuario no es válido. El usuario no debe tener caracteres especiales ni espacios";
            return false;
        }

        if ($scope.formSignup.password === $scope.formSignup.password2) {
            bsLoadingOverlayService.start();
            var user = {
                username: $scope.formSignup.username,
                email: '',
                password: $scope.formSignup.password,
                first_name: '',
                last_name: '',
                id_antiguo: null,
                terminos: $scope.formSignup.terminos,
            };
            UserService.signup(user);

        } else {
            $scope.error = "Las contraseñas deben ser iguales";
        }
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