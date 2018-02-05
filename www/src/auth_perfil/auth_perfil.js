/*global angular*/
nf2.controller('AuthPerfilCtrl', function($ionicPlatform, $scope, $ionicPopup, $ionicLoading, PerfilService, UserService) {
    'use strict';
    $ionicPlatform.ready(function() {

        /* Cargamos la información del local storage*/
        $scope.usuarioActivo = UserService.getUser();
        //$scope.usuarioFamilia = UsuarioService.getUsuarioFamilia();
        
        console.log($scope.usuarioActivo);

        /* Creamos un arreglo para mostrar los miembros de la familia de forma dinamica */
        /*$scope.usuarioFamilia.miembrosPorRango = [{
            rango: '0 a 2 años',
            cantidad: parseInt($scope.usuarioActivo.rango_0a2),
            rango_alias: '0a2'
        }, {
            rango: '2 a 5 años',
            cantidad: parseInt($scope.usuarioActivo.rango_2a5),
            rango_alias: '2a5'
        }, {
            rango: '6 a 17 años',
            cantidad: parseInt($scope.usuarioActivo.rango_6a17),
            rango_alias: '6a17'
        }, {
            rango: '18 a 60 años',
            cantidad: parseInt($scope.usuarioActivo.rango_18a60),
            rango_alias: '18a60'
        }, {
            rango: '60 0 más años',
            cantidad: parseInt($scope.usuarioActivo.rango_60mas),
            rango_alias: '60mas'
        }];

        $scope.miembro = '';

        $scope.usuarioActivo.totalMiembrosPorInscribir = 0;
        for (var i in $scope.usuarioFamilia.miembrosPorRango) {
            $scope.usuarioActivo.totalMiembrosPorInscribir = $scope.usuarioActivo.totalMiembrosPorInscribir + $scope.usuarioFamilia.miembrosPorRango[i].cantidad;
        }*/

        $scope.familiar = {};
        $scope.familiar.FAM_PER_NOMBRE = '';
        $scope.familiar.FAM_PER_APELLIDO = '';
        $scope.familiar.parentescos = {
            availableOptions: [
                { id: 'hijo', name: 'Hijo' },
                { id: 'conyuge', name: 'Conyuge' },
                { id: 'padre', name: 'Padre' },
                { id: 'otros', name: 'Otros' }
            ]
        };

        //$scope.usuarioActivo.totalMiembrosInscritos = $scope.usuarioFamilia.length;

        $scope.abrirModalEditarFamiliar = function(index) {

            if (index != 0) {
                $scope.miembro = $scope.usuarioFamilia.miembrosPorRango[index];
                $scope.indexFamiliar = index;

            }
            $scope.popUpAgregarFamiliar = $ionicPopup.show({
                templateUrl: 'views/template/agregarFamiliar.tpl.html',
                scope: $scope,
                cssClass: 'agregar-familiar'
            });
        };

        $scope.agregarFamiliar = function() {

            $scope.loading = $ionicLoading.show({
                template: 'Guardando Familiar...',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 40
            });
            var index = $scope.indexFamiliar;

            var familiar = Object.assign({}, $scope.familiar);
            familiar.FAM_PER_PARENTESCO = familiar.parentescos.selectedOption.id;
            familiar.FAM_PER_JEFE = $scope.usuarioActivo.id;
            familiar.FAM_PER_CODIGO = $scope.usuarioActivo.login_codigo;
            familiar.documento_jefe = $scope.usuarioActivo.login_documento;
            familiar.FAM_PER_BIRTHDATE = "0";
            //familiar.FAM_PER_BIRTHDATE = familiar.birthdate.getFullYear() + "-" + tempMonth + "-" + familiar.birthdate.getDate();

            /* If para verificar si es usuario nuevo o miembro de la familia */
            if ($scope.miembro == '') {
                familiar.rango = false;
                familiar.cantidad = 0;
            } else {
                familiar.rango = $scope.miembro.rango_alias;
                familiar.cantidad = $scope.miembro.cantidad - 1;
            }

            console.log(familiar);

            delete familiar["parentescos"];
            PerfilService.agregarFamiliar(familiar, function(response) {
                if (response.success) {
                    if (familiar.rango !== false) {
                        $scope.usuarioFamilia.miembrosPorRango[index].cantidad--;
                        $scope.usuarioActivo['rango_' + familiar.rango] = familiar.cantidad;
                        $scope.usuarioActivo.totalMiembrosPorInscribir--;
                    }


                    $scope.usuarioActivo.totalMiembrosInscritos++;
                    $scope.usuarioFamilia.push(familiar);


                    //UsuarioService.setUsuarioFamilia($scope.usuarioFamilia);
                    //UsuarioService.setUsuarioActivo($scope.usuarioActivo, function(response) {});
                }
                $ionicLoading.hide();
                $scope.popUpAgregarFamiliar.close();
                var alertPopup = $ionicPopup.alert({
                    template: response.message,
                    cssClass: 'confirmacion'
                });
            });
        };
    });
});
