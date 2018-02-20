nf2.controller('ShoppingGroupCtrl', function ($scope, $stateParams, $anchorScroll, ShoppingService, bsLoadingOverlayService, UserService) {
    'use strict';

    $anchorScroll();

    $scope.usuarioActivo = UserService.getUser();
    $scope.compras = true;

    var cargarRecomendados = function () {

        bsLoadingOverlayService.start();

        ShoppingService.getConsolidadoComprasUltimoMes($scope.usuarioActivo, function (response) {
            if (response) {
                $scope.consumoUltimoMes = response;

                $scope.data = $scope.consumoUltimoMes[$stateParams.group - 1];

                ShoppingService.getProductosPuntoVenta(function (response) {
                    console.log(response);
                    if (response) {
                        console.log(response);
                        $scope.recomendados = response[$stateParams.group];
                        console.log($scope.recomendados);
                    } else {
                    }
                    bsLoadingOverlayService.stop();
                });
            } else {
                $scope.negarAcceso();
            }
        });
    };


    cargarRecomendados();
});
