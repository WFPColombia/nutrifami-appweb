nf2.controller('LoginController', function ($scope, $location, AuthenticationService) {
    'use strict';
    // reset login status
    AuthenticationService.ClearCredentials();
    localStorage.clear();

    $scope.login = function () {
        $scope.dataLoading = true;
        AuthenticationService.Login($scope.username, $scope.password, function (response) {
            if (response.success) {
                AuthenticationService.SetCredentials($scope.username, $scope.password, response.message);
                $location.path('/capacitacion');
            } else {
                $scope.error = response.message;
                $scope.dataLoading = false;
            }
        });
    };
});
