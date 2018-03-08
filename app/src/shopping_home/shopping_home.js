nf2.controller('ShoppingHomeCtrl', function ($scope, $timeout, $state, $uibModal, $anchorScroll, ShoppingService, ngAudio, bsLoadingOverlayService, UserService) {
    'use strict';

    $anchorScroll();

    $scope.usuarioActivo = UserService.getUser();
    $scope.compras = true;


    $scope.audio1 = ngAudio.load("audios/compras-intro.mp3");
    $scope.audio2 = ngAudio.load("audios/compras-dieta-variada.mp3");


    $scope.consumoUltimoMes = [{
            'nombre': "Cereales, raíces, tubérculos y plátanos.",
            'porcentaje_compra': 0,
            'grupo_id': '1'
        }, {
            'nombre': "Carnes, huevos y leguminosas secas.",
            'porcentaje_compra': 0,
            'grupo_id': '2'

        }, {
            'nombre': "Leches y otros productos lácteos.",
            'porcentaje_compra': 0,
            'grupo_id': '3'
        }, {
            'nombre': "Frutas y verduras.",
            'porcentaje_compra': 0,
            'grupo_id': '4'
        }, {
            'nombre': "Grasas.",
            'porcentaje_compra': 0,
            'grupo_id': '5'
        }, {
            'nombre': "Azucar.",
            'porcentaje_compra': 0,
            'grupo_id': '6'
        }];

    $scope.negarAcceso = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'modals/simple/simple.modal.html',
            controller: 'SimpleModalCtrl',
            keyboard: false,
            size: 'lg',
            backdrop: 'static',
            resolve: {
                data: function () {
                    return {
                        message: 'No hay información de compras para este usuario',
                        sticker: 'bad'
                    };
                }
            }

        });

        modalInstance.result.then(function () {
            $state.go('nf.cap_home');
        });
    };

    //$scope.usuarioActivo.username = '1006330568';

    bsLoadingOverlayService.start();

        ShoppingService.getConsolidadoComprasUltimoMes($scope.usuarioActivo, function (response) {
        console.log(response);
        if (response) {
            $scope.consumoUltimoMes = response;
            $timeout(function () {
                $scope.animar = true;
            }, 1500);
        } else {
            $scope.negarAcceso();
        }
        bsLoadingOverlayService.stop();
    });
});
