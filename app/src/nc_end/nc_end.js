/*global angular*/
nf2.controller('ncEndCtrl', function($scope, $anchorScroll, $uibModal, bsLoadingOverlayService, UserService, NutricompraService) {
    'use strict';

    $anchorScroll();


    $scope.usuarioActivo = UserService.getUser();
    $scope.feedbacks = {};

    /* Overloading*/
    bsLoadingOverlayService.start();
    /* Se apaga cuando el todo el contenido de la vista ha sido cargado*/
    $scope.$on('$viewContentLoaded', function() {
        /* Se le agrega 0,3 segundos para poder verlo ver inicialmente
         * cuando el contenido se demore mucho en cargar se puede quitar el timeout*/
        bsLoadingOverlayService.stop();
    });

    NutricompraService.getFeedback(function(response) {

        $scope.feedbacks = response;
    });


    $scope.nutricompra = true;


    $scope.salir = function() {

        var data = {
            texto1: '¿Quiere jugar de Nuevo?',
            texto2: 'Podrá seguir practicando para hacer una compra saludable',
            boton: 'Jugar'
        };

        var modalInstance = $uibModal.open({
            animation: true,
            windowClass: 'nutricompra-salir',
            templateUrl: 'modals/nc_exit/nc_exit.modal.html',
            controller: 'ncExitModalCtrl',
            keyboard: false,
            backdrop: 'static',
            resolve: {
                data: function() {
                    return data;
                }
            }

        });


    };

});
