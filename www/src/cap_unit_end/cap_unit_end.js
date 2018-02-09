/*global angular*/
nf2.controller('CapUnitEndCtrl', function ($scope, $anchorScroll, $state, $stateParams, UserService, $uibModal, CapacitationService) {

    $anchorScroll();

    $scope.user = UserService.getUser();
    $scope.leccion = CapacitationService.getLeccion($stateParams.lesson);
    $scope.modulo = CapacitationService.getModulo($stateParams.module);
    var avanceModulo = UserService.getAvanceModulo($stateParams.module);

    $scope.continuar = function () {
        console.log(avanceModulo);
        if (avanceModulo.completo) {

            var data = {
                nombre: $scope.user.first_name,
                apellido: $scope.user.last_name,
                modulo: $scope.modulo.titulo.texto
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
                    data: function () {
                        return data;
                    }
                }

            });

            modalDiploma.result.then(function () {
                $state.go('nf.cap_capacitation', {
                    capacitation: $stateParams.capacitation
                });
            });


        } else {
            $state.go('nf.cap_capacitation', {
                capacitation: $stateParams.capacitation,
                module: $stateParams.module
            });

        }

    };

});
