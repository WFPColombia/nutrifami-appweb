nf2.controller('AuthRegistro2Ctrl', function($ionicPlatform, $scope, $rootScope, $ionicViewSwitcher, $location, UserService, PerfilService) {
    'use strict';

    $ionicPlatform.ready(function() {


        console.log("Registro2!!");

        console.log(UserService.isAuthenticated());

        /*if (UserService.isAuthenticated()) {
            $location.path('/app/search');
        }*/

        $scope.authenticate = function(provider) {
            UserService.authenticate(provider);
        };

        $rootScope.$on('userLoggedIn', function(data) {
            $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
            $location.path('/app/search');

        });

        // will fire in case authentication failed
        $rootScope.$on('userFailedLogin', function() {
            console.log("Error al iniciar sesión");

        });

        PerfilService.getLocation(function(response) {
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
        });


    });
});