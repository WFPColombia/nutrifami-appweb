nf2.controller('TipsCtrl', function ($scope, $rootScope, ngAudio, UserService, CapacitationService) {
    'use strict';
    $scope.tips = true;
    $scope.usuarioActivo = UserService.getUser();
    $scope.assetpath = $rootScope.ASSETPATH;



    // $scope.audio1 = ngAudio.load("audios/consejos-saludables-1.mp3");
    // $scope.audio2 = ngAudio.load("audios/consejos-saludables-2.mp3");

    $scope.modulos = [];
    // Obtenemos los ids de los modulos de la capacitación 3



    $scope.mids = CapacitationService.getModulesIds(3);
    /*Creamos un arreglo para poder recorerlo y mostrarlo a traves de directivas */
    for (var mid in $scope.mids) {
        var tempModulo = CapacitationService.getModule($scope.mids[mid]);
        //tempModulo.titulo.audio.audio = ngAudio.load(tempModulo.titulo.audio.url);
        $scope.modulos.push(tempModulo);
    }

    console.log($scope.modulos);



});
