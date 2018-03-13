/*global angular*/
nf2.controller('ncPlayCtrl', function($scope, $anchorScroll, $state, $uibModal, bsLoadingOverlayService, UserService, NutricompraService) {
    'use strict';

    $anchorScroll();


    $scope.usuarioActivo = UserService.getUser();
    $scope.pagina = 1;

    /* Overloading*/
    bsLoadingOverlayService.start();
    /* Se apaga cuando el todo el contenido de la vista ha sido cargado*/
    $scope.$on('$viewContentLoaded', function() {
        /* Se le agrega 0,3 segundos para poder verlo ver inicialmente
         * cuando el contenido se demore mucho en cargar se puede quitar el timeout*/
        bsLoadingOverlayService.stop();
    });

    $scope.nutricompra = true;

    var categorias = [
        'azucares', 'carnes', 'cereal', 'frutas', 'grasas', 'inadecuados', 'leche'

    ];

    $scope.productosVitrina = [];

    actualizarProductos();

    $scope.agregarProductoAlCarrito = function(grupo, id_producto, index) {
        NutricompraService.addProductoAlCarrito(grupo, id_producto, index, function(response) {
            actualizarProductos();
            if ($scope.cantidadProductosCarrito === 15) {
                $state.go('nf.nc_end');
            }
        });

    };

    $scope.paginaSiguiente = function() {
        $scope.pagina++;
    };

    $scope.paginaAnterior = function() {
        $scope.pagina--;
    };

    $scope.salir = function() {
        var data = {
            texto1: '¿Estás seguro de salir?',
            texto2: 'Si sale perderá el progreso',
            boton: 'Continuar'
        };

        $uibModal.open({
            animation: true,
            windowClass: 'nutricompra-salir',
            templateUrl: 'modals/nc_exit/nc_exit.modal.html',
            controller: 'ncExitModalCtrl',
            keyboard: false,
            size: 'lg',
            resolve: {
                data: function() {
                    return data;
                }
            }

        });


    };

    function actualizarProductos() {
        NutricompraService.getProductos(function(response) {
            $scope.productosVitrina = response.productosVitrina;
            $scope.productosCarrito = response.productosCarrito;
            $scope.cantidadProductosCarrito = response.cantidadProductosCarrito;

            console.log($scope.productosCarrito);
        });
    }






});
