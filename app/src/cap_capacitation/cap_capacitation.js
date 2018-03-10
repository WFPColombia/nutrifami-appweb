/*global angular*/
nf2.controller('CapCapacitationCtrl', function ($scope, $stateParams, UserService, CapacitationService) {
        $scope.user = UserService.getUser();
        $scope.modulos = CapacitationService.getModulesActives($stateParams.capacitation);
        //Obtenemos los ids de los modulos de la capacitación 3 
});