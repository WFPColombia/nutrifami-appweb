nf2.controller('AuthProfileCtrl', function($scope, $anchorScroll, $timeout, UserService) {

    $anchorScroll();

    $scope.user = UserService.getUser();
    console.log($scope.user);
    // $scope.usuarioFamilia = UserService.getUsuarioFamilia();

    /* Creamos un arreglo para mostrar los miembros de la familia de forma dinamica */
    /*
    $scope.user.miembrosPorRango = [{
        rango: '0 a 2 años',
        cantidad: parseInt($scope.user.rango_0a2),
        rango_alias: '0a2',
        open: false
    }, {
        rango: '2 a 5 años',
        cantidad: parseInt($scope.user.rango_2a5),
        rango_alias: '2a5',
        open: false
    }, {
        rango: '6 a 17 años',
        cantidad: parseInt($scope.user.rango_6a17),
        rango_alias: '6a17',
        open: false
    }, {
        rango: '18 a 60 años',
        cantidad: parseInt($scope.user.rango_18a60),
        rango_alias: '18a60',
        open: false
    }, {
        rango: '60 0 más años',
        cantidad: parseInt($scope.user.rango_60mas),
        rango_alias: '60mas',
        open: false
    }]; */

    $scope.mensajeFam = {
        message: '',
        success: true,
        estado: false
    };

    $scope.porInscribir = false;

    /*$scope.user.totalMiembrosPorInscribir = 0;
    for (var i in $scope.user.miembrosPorRango) {
        $scope.user.totalMiembrosPorInscribir = $scope.user.totalMiembrosPorInscribir + $scope.user.miembrosPorRango[i].cantidad;
    }

    $scope.user.totalMiembrosInscritos = $scope.usuarioFamilia.length; */

    $scope.actualizarInfo = function(mensajeFam) {
        $scope.mensajeFam = mensajeFam;
        UserService.setUsuarioFamilia($scope.usuarioFamilia);
        UserService.setUsuarioActivo($scope.user, function(response) {});
        $scope.porInscribir = false;


        $timeout(function() {
            $scope.mensajeFam.estado = false;
        }, 10000);
    };

});

/*nf2.directive('agregarFamiliar', function(bsLoadingOverlayService, PerfilService, UserService) {
    return {
        restrict: 'E',
        scope: {
            miembro: "=",
            index: '@',
        },
        templateUrl: 'views/directives/agregarFamiliar.html',
        link: function($scope, $element, $attrs) {
            $scope.familiar = {};
            $scope.familiar.FAM_PER_NOMBRE = '';
            $scope.familiar.FAM_PER_APELLIDO = '';
            $scope.familiar.birthdate = new Date();
            $scope.familiar.parentescos = {
                availableOptions: [
                    { id: 'hijo', name: 'Hijo' },
                    { id: 'conyuge', name: 'Conyuge' },
                    { id: 'padre', name: 'Padre' },
                    { id: 'otros', name: 'Otros' }
                ]
            };

            $scope.update = function() {
                var familiar = Object.assign({}, $scope.familiar);
                var tempMonth = $scope.familiar.birthdate.getMonth() + 1;
                var tempDay = $scope.familiar.birthdate.getDate();
                if (tempMonth < 10) {
                    tempMonth = "0" + tempMonth;
                }

                familiar.FAM_PER_BIRTHDATE = familiar.birthdate.getFullYear() + "-" + tempMonth + "-" + familiar.birthdate.getDate();
                familiar.FAM_PER_PARENTESCO = familiar.parentescos.selectedOption.id;
                familiar.FAM_PER_JEFE = $scope.$parent.user.id;
                familiar.FAM_PER_CODIGO = $scope.$parent.user.login_codigo;
                familiar.documento_jefe = $scope.$parent.user.login_documento;

                // If para verificar si es usuario nuevo o miembro de la familia 
                if (typeof $scope.miembro === 'undefined') {
                    familiar.rango = false;
                    familiar.cantidad = 0;
                } else {
                    familiar.rango = $scope.miembro.rango_alias;
                    familiar.cantidad = $scope.miembro.cantidad - 1;
                }

                delete familiar["parentescos"];

                bsLoadingOverlayService.start();
                PerfilService.agregarFamiliar(familiar, function(response) {

                    if (response.success) {
                        // Restarle el familiar agregado al rango 

                        if (familiar.rango != false) {
                            $scope.$parent.user.miembrosPorRango[$scope.index].cantidad--;
                            $scope.$parent.user['rango_' + familiar.rango] = familiar.cantidad;
                            $scope.$parent.user.totalMiembrosPorInscribir--;

                        }
                        $scope.$parent.user.totalMiembrosInscritos++;
                        $scope.$parent.usuarioFamilia.push(familiar);
                    }

                    bsLoadingOverlayService.stop();


                    var mensajeFam = response
                    mensajeFam.estado = true;

                    $scope.familiar.FAM_PER_NOMBRE = '';
                    $scope.familiar.FAM_PER_APELLIDO = '';
                    $scope.familiar.FAM_PER_DOCUMENTO = '';
                    $scope.familiar.FAM_PER_EMAIL = '';


                    if (familiar.rango != false) {
                        $scope.miembro.open = false;

                    }

                    $scope.$parent.actualizarInfo(mensajeFam);





                });
            };
        }
    };
}); */
