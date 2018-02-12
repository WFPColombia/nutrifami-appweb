/*global angular*/
nf2.controller('AuthPerfilEditarCtrl', function ($ionicPlatform, $filter, $scope, $rootScope, $location, $ionicLoading, $ionicPopup, UserService, PerfilService) {
    'use strict';
    $ionicPlatform.ready(function () {

        if ($rootScope.isOffline) {
            $ionicPopup.alert({
                title: "Sin conexión a Internet",
                content: "Actualmente su equipo no tiene conexión a Internet. Para ver esta sección debe estár conectado a Internet ",
                buttons: [
                    {text: 'Salir'}
                ]
            })
                    .then(function (res) {
                        $location.path('/app/capacitacion');
                    });
        }

        $scope.usuarioActivo = UserService.getUser();

        console.log($scope.usuarioActivo);

        $scope.generos = {
            availableOptions: [
                {id: 'Femenino', name: 'Femenino'},
                {id: 'Masculino', name: 'Masculino'}
            ],
            selectedOption: {id: $scope.usuarioActivo.genero, name: $scope.usuarioActivo.genero}
        };

        $scope.etnias = {
            availableOptions: [
                {id: 'Afrocolombianos', name: 'Afrocolombianos'},
                {id: 'Indigenas', name: 'Indigenas'},
                {id: 'Mestizo', name: 'Mestizo'},
                {id: 'Otros', name: 'Otros'},
                {id: 'Ninguno', name: 'Ninguno'}
            ],
            selectedOption: {id: $scope.usuarioActivo.etnia, name: $scope.usuarioActivo.etnia}
        };

        $scope.tipos_documento = {
            availableOptions: [
                {id: 'Cédula de ciudadania', name: 'Cédula de ciudadania'},
                {id: 'Cédula de extranjeria', name: 'Cédula de extranjeria'},
                {id: 'Tarjeta de identidad', name: 'Tarjeta de identidad'},
                {id: 'Pasaporte', name: 'Pasaporte'}
            ],
            selectedOption: {id: $scope.usuarioActivo.tipo_documento, name: $scope.usuarioActivo.tipo_documento}
        };

        $scope.date = {};


        if ($scope.usuarioActivo.fecha_nacimiento !== null) {
            var nacimiento = $scope.usuarioActivo.fecha_nacimiento;
            var n_ano = nacimiento.slice(0, 4);
            var n_mes = nacimiento.slice(5, 7) - 1;
            var n_dia = nacimiento.slice(8, 10);

            $scope.date.fecha_nacimiento = new Date(n_ano, n_mes, n_dia);
        } else {
            $scope.date.fecha_nacimiento = new Date(0, 0, 0);
        }

        /*PerfilService.getLocation(function(response) {
         $scope.paises = response.countries;
         
         $scope.departamentos = response.states;
         $scope.ciudades = response.cities;
         
         for (var pais in response.countries) {
         if ($scope.usuarioActivo.pais == response.countries[pais].name) {
         $scope.usuarioActivo.pais_id = {
         id: response.countries[pais].id,
         name: response.countries[pais].name,
         phonecode: response.countries[pais].phonecode,
         sortname: response.countries[pais].sortname,
         }
         
         }
         }
         
         for (var departamento in response.states) {
         if ($scope.usuarioActivo.departamento == response.states[departamento].name) {
         console.log(response.states[departamento])
         $scope.usuarioActivo.departamento_id = {
         id: response.states[departamento].id,
         name: response.states[departamento].name,
         country_id: response.states[departamento].country_id,
         };
         $scope.departamentos_filter = [$scope.usuarioActivo.departamento_id];
         
         }
         }
         
         for (var ciudad in response.cities) {
         if ($scope.usuarioActivo.municipio == response.cities[ciudad].name) {
         console.log(response.cities[ciudad]);
         $scope.usuarioActivo.municipio_id = {
         id: response.cities[ciudad].id,
         name: response.cities[ciudad].name,
         state_id: response.cities[ciudad].state_id,
         };
         $scope.ciudades_filter = [$scope.usuarioActivo.municipio_id];
         }
         }
         });*/

        $scope.updateUser = function () {
            
            console.log("UpdateUser");

            $scope.loading = $ionicLoading.show({
                template: 'Guardando Cambios...',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 40
            });

            $scope.usuarioActivo.genero = $scope.generos.selectedOption.id || '';
            $scope.usuarioActivo.etnia = $scope.etnias.selectedOption.id || '';
            $scope.usuarioActivo.tipo_documento = $scope.tipos_documento.selectedOption.id || '';
            console.log($scope.date.fecha_nacimiento);

            var tempMonth = $scope.date.fecha_nacimiento.getMonth() + 1;
            var tempDay = $scope.date.fecha_nacimiento.getDate();

            if (tempMonth < 10) {
                tempMonth = "0" + tempMonth;
            }
            $scope.usuarioActivo.fecha_nacimiento = $scope.date.fecha_nacimiento.getFullYear() + "-" + tempMonth + "-" + tempDay;

            /*for (var pais in $scope.paises) {
             if ($scope.paises[pais].id == usuarioActivo.pais_id) {
             usuarioActivo.pais = $scope.paises[pais].name;
             
             }
             }
             
             for (var departamento in $scope.departamentos) {
             if ($scope.departamentos[departamento].id == usuarioActivo.departamento_id) {
             usuarioActivo.departamento = $scope.departamentos[departamento].name;
             
             }
             }
             
             for (var ciudad in $scope.ciudades) {
             if ($scope.ciudades[ciudad].id == usuarioActivo.municipio_id) {
             usuarioActivo.municipio = $scope.ciudades[ciudad].name;
             
             }
             }
             
             
             
             */


            console.log($scope.usuarioActivo);

            UserService.updateUser($scope.usuarioActivo);

            /*UsuarioService.setUsuarioActivo(usuarioActivo, function(response) {
             if (response.success) {
             $scope.mensaje = {
             texto: "Los datos han sido guardado con éxito",
             };
             UsuarioService.setUsuarioActivo(usuarioActivo, function(response) {});
             } else {
             
             $scope.mensaje = {
             texto: "Ops!! Hubo un error y los datos no fueron guardados. Por favor intenta más tarde."
             
             };
             }
             
             $ionicLoading.hide();
             $scope.dataLoading = false;
             
             
             
             });*/

        };

        $scope.updateDropDownDepartamentos = function (pais) {
            console.log(pais);
            $scope.departamentos_filter = $filter('filter')($scope.departamentos, {country_id: pais}, true);
        };

        $scope.updateDropDownCiudades = function (estado) {
            console.log(estado);
            $scope.ciudades_filter = $filter('filter')($scope.ciudades, {state_id: estado}, true);
            console.log($scope.ciudades_filter);
        };

        $scope.$on('userUpdated', function (event, data) {
            console.log(data);
            $ionicLoading.hide();
            $scope.modal = {
                texto1: 'Perfil actualizado con éxito',
                estado: 'ok' // ok, alert, error
            };
            $ionicPopup.show({
                templateUrl: 'modals/modal.html',
                scope: $scope,
                cssClass: 'salir-unidad',
                buttons: [{
                        text: 'Continuar',
                        type: 'button-positive',
                        onTap: function (e) {
                        }
                    }]
            });
        });

        $scope.$on('userFaliedUpdate', function (event, data) {
            var error = data[Object.keys(data)[0]];
            $scope.modal = {
                texto1: 'Hubo un error al actualizar el perfil',
                texto2: error[0],
                estado: 'error' // ok, alert, error
            };
            $ionicPopup.show({
                templateUrl: 'modals/modal.html',
                scope: $scope,
                cssClass: 'salir-unidad',
                buttons: [{
                        text: 'Continuar',
                        type: 'button-positive',
                        onTap: function (e) {
                        }
                    }]
            });
            $ionicLoading.hide();
        });

    }, false);
});
