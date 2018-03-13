nf2.controller('ncExitModalCtrl', function (data, $state, $scope, $uibModalInstance, NutricompraService) {

    $scope.data = data;
    $scope.boton1 = function () {
        console.log($scope.data);
        $uibModalInstance.close();
        if ($scope.data.boton === 'Jugar') {
            NutricompraService.clearProductos(function (response) {
                $state.go('nf.nc_play');
            });
        }
    };

    $scope.exit = function () {
        $uibModalInstance.close();
        $state.go('nf.cap_home');
    };


});
