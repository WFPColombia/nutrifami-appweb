/*global angular*/
nf2.controller('CapCapacitationCtrl', function ($scope, $stateParams, UserService, CapacitationService) {
        $scope.capacitation = CapacitationService.getCapacitation($stateParams.capacitation);
        $scope.mids = CapacitationService.getModulesIds($stateParams.capacitation);
        $scope.user = UserService.getUser();

        $scope.modulos = [];
        //Obtenemos los ids de los modulos de la capacitación 3 

        //Creamos un arreglo para poder recorerlo y mostrarlo a traves de directivas 
        for (var mid in $scope.mids) {
            var tempModulo = CapacitationService.getModule($scope.mids[mid]);
            tempModulo.disponible = true;
            if (tempModulo.activo == '1') {
                tempModulo.activo = true;
            } else {
                tempModulo.activo = false;
            }
            $scope.modulos.push(tempModulo);
        }

});