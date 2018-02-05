
nf2.controller('AuthMigrationCtrl', function ($scope, bsLoadingOverlayService, $state, UserService) {

    $scope.formSignup = {};

    $scope.tempUser = JSON.parse(localStorage.getItem('tempUser'));

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
                email: $scope.formSignup.email,
                password: $scope.formSignup.password,
                terminos: $scope.formSignup.terminos
            };

            UserService.signup(Object.assign(user, $scope.tempUser));

        } else {
            $scope.error = "Las contraseñas deben ser iguales";
        }
    };

    $scope.$on('userLoggedIn', function (event, data) {
        console.log("userLoggedIn Migration");
        UserService.migrarAvance().then(function () {
            bsLoadingOverlayService.stop();
            $state.go('home');
        });
    });

    // will fire in case authentication failed
    $scope.$on('userFailedLogin', function (event, response) {
        console.log(response);
        bsLoadingOverlayService.stop();
        $scope.error = response.message;
    });




});