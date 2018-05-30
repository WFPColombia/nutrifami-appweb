/*global angular*/
nf2.controller('AuthProfileEditCtrl', function ($filter, $scope, UserService, $anchorScroll, bsLoadingOverlayService) {
    
    $anchorScroll();
    $scope.user = UserService.getUser();

    $scope.generos = {
        availableOptions: [
            {id: 'Femenino', name: $filter('translate')('Femenino')},
            {id: 'Masculino', name: $filter('translate')('Masculino')}
        ],
        selectedOption: {id: $scope.user.genero, name: $scope.user.genero}
    };

    $scope.tipos_documento = {
        availableOptions: [
            {id: 'Cédula de ciudadania', name: $filter('translate')('Cédula de ciudadania / DNI')},
            {id: 'Pasaporte', name: $filter('translate')('Pasaporte')},
            {id: 'Otro', name: $filter('translate')('Otro')}
        ],
        selectedOption: {id: $scope.user.tipo_documento, name: $scope.user.tipo_documento}
    };

    $scope.date = {};
    
    console.log($scope.user.fecha_nacimiento);
    if ($scope.user.fecha_nacimiento !== null) {
        var nacimiento = $scope.user.fecha_nacimiento;
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
     if ($scope.user.pais == response.countries[pais].name) {
     $scope.user.pais_id = {
     id: response.countries[pais].id,
     name: response.countries[pais].name,
     phonecode: response.countries[pais].phonecode,
     sortname: response.countries[pais].sortname,
     }
     
     }
     }
     
     for (var departamento in response.states) {
     if ($scope.user.departamento == response.states[departamento].name) {
     console.log(response.states[departamento])
     $scope.user.departamento_id = {
     id: response.states[departamento].id,
     name: response.states[departamento].name,
     country_id: response.states[departamento].country_id,
     };
     $scope.departamentos_filter = [$scope.user.departamento_id];
     
     }
     }
     
     for (var ciudad in response.cities) {
     if ($scope.user.municipio == response.cities[ciudad].name) {
     console.log(response.cities[ciudad]);
     $scope.user.municipio_id = {
     id: response.cities[ciudad].id,
     name: response.cities[ciudad].name,
     state_id: response.cities[ciudad].state_id,
     };
     $scope.ciudades_filter = [$scope.user.municipio_id];
     }
     }
     });*/

    $scope.updateUser = function () {

        console.log("UpdateUser");

        bsLoadingOverlayService.start();

        $scope.user.genero = $scope.generos.selectedOption.id || '';
        $scope.user.tipo_documento = $scope.tipos_documento.selectedOption.id || '';
        console.log($scope.date.fecha_nacimiento);

        var tempMonth = $scope.date.fecha_nacimiento.getMonth() + 1;
        var tempDay = $scope.date.fecha_nacimiento.getDate();

        if (tempMonth < 10) {
            tempMonth = "0" + tempMonth;
        }
        $scope.user.fecha_nacimiento = $scope.date.fecha_nacimiento.getFullYear() + "-" + tempMonth + "-" + tempDay;

        /*for (var pais in $scope.paises) {
         if ($scope.paises[pais].id == user.pais_id) {
         user.pais = $scope.paises[pais].name;
         
         }
         }
         
         for (var departamento in $scope.departamentos) {
         if ($scope.departamentos[departamento].id == user.departamento_id) {
         user.departamento = $scope.departamentos[departamento].name;
         
         }
         }
         
         for (var ciudad in $scope.ciudades) {
         if ($scope.ciudades[ciudad].id == user.municipio_id) {
         user.municipio = $scope.ciudades[ciudad].name;
         
         }
         }
         
         
         
         */

        UserService.updateUser($scope.user);

        /*UsuarioService.setUsuarioActivo(user, function(response) {
         if (response.success) {
         $scope.mensaje = {
         texto: "Los datos han sido guardado con éxito",
         };
         UsuarioService.setUsuarioActivo(user, function(response) {});
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
        $anchorScroll();
        bsLoadingOverlayService.stop();
        $scope.mensaje = {
            estado: true,
            texto: $filter('translate')('Los datos han sido guardado con éxito'),
            success: true
        };

    });

    $scope.$on('userFaliedUpdate', function (event, data) {
        var error = data[Object.keys(data)[0]];
        bsLoadingOverlayService.stop();
        $anchorScroll();
        $scope.mensaje = {
            estado: true,
            texto: $filter('translate')('Ops!! Hubo un error y los datos no fueron guardados') + error,
            success: true

        };
    });

});