/*global angular*/
nf2.controller('CapHomeCtrl', function ($scope, $location, CapacitationService, UserService) {
    
    CapacitationService.initClient();
    $scope.capacitations = CapacitationService.getCapacitacionesActivas();
    
    //UserService.readAvance();

    for (var c in $scope.capacitations) {
        $scope.capacitations[c]['porcentaje'] = getPorcentaje($scope.capacitations[c].id);
    }

    function getPorcentaje(cid) {
        var avanceCapacitacion = UserService.getAvanceCapacitacion(cid);
        return avanceCapacitacion.porcentaje;
    }

    $scope.irABuscar = function () {
        $location.path('/app/buscar');
    };

});