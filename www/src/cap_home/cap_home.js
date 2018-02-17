/*global angular*/
nf2.controller('CapHomeCtrl', function ($scope, $location, CapacitationService, UserService) {

    console.log(CapacitationService.getPublicLessons());
    $scope.capacitations = CapacitationService.getCapacitationsActives();
    $scope.user = UserService.getUser();

    //UserService.readAvance();

    for (var c in $scope.capacitations) {
        $scope.capacitations[c]['porcentaje'] = getPorcentaje($scope.capacitations[c].id);
        $scope.capacitations[c].visible = false;

        if ($scope.capacitations[c].status.nombre === 'publico') {
            $scope.capacitations[c].visible = true;
        } else {
            for (var g in $scope.user.groups) {
                if ($scope.user.groups[g].name === 'creator' && $scope.capacitations[c].status.nombre === 'borrador') {
                    $scope.capacitations[c].visible = true;
                }

                if ($scope.user.groups[g].name === 'reviser' && $scope.capacitations[c].status.nombre === 'revision') {
                    $scope.capacitations[c].visible = true;
                }
            }
        }
    }

    function getPorcentaje(cid) {
        var avanceCapacitacion = UserService.getAvanceCapacitacion(cid);
        return avanceCapacitacion.porcentaje;
    }

    $scope.irABuscar = function () {
        $location.path('/app/buscar');
    };

});