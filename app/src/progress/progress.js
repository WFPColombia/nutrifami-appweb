nf2.controller('ProgressCtrl', function($scope, $uibModal, UserService, ngAudio) {
    'use strict';

    $scope.progreso = true;

    $scope.usuarioActivo = UserService.getUser();
    $scope.usuarioAvance = UserService.getAvance();
    //$scope.usuarioFamilia = UserService.getUsuarioFamilia();

    $scope.audio1 = ngAudio.load("audios/consejos-saludables-1.mp3");

    $scope.verDiploma = function(index) {
        var data = {
            nombre: $scope.usuarioActivo.first_name,
            apellido: $scope.usuarioActivo.last_name,
            modulo: $scope.usuarioAvance.diplomas[index]
        };

        var modalDiploma = $uibModal.open({
            animation: true,
            templateUrl: 'modals/certificate/certificate.modal.html',
            controller: 'CertificateModalCtrl',
            keyboard: false,
            size: 'lg',
            backdrop: 'static',
            windowClass: 'diploma',
            resolve: {
                data: function() {
                    return data;
                }
            }

        });
    }
});
