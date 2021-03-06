nf2.controller('NavCtrl', function ($scope, $rootScope, UserService, TrainingService) {

    $scope.user = UserService.getUser();
    
    if (TrainingService.isStaff()) {
        $scope.current_trainee = TrainingService.getCurrentTrainee();
    }

    $scope.$on('traineeUpdated', function (event, data) {
        $scope.current_trainee = data;
    });
    
    
    //Traido de la versión anterior
    /* 
     $scope.informacion = false;
        $scope.breadcrumb = false;
        $scope.home = false;
        $scope.links = [];

        if ($location.$$path === '/') {
            $scope.home = true;
        }

        if ($location.$$path === '/perfil' || $location.$$path === '/editar-perfil') {
            $scope.informacion = true;
        }

        //Si se esta mostrando una unidad, se activa el breadcrumb y se llena con la información que vienen de los parametros
        if ($routeParams.unidad != null) {
            $scope.breadcrumb = true;
            var totalUnidades = Object.keys(nutrifami.training.getUnidadesId($routeParams.leccion)).length;
            $scope.links.push(nutrifami.training.getModulo($routeParams.modulo).titulo);
            $scope.links.push(nutrifami.training.getLeccion($routeParams.leccion).titulo);
            $scope.links.push($routeParams.unidad + ' de ' + totalUnidades);
        }

*/


});
