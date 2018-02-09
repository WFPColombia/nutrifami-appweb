/*global angular*/
nf2.controller('CapUnitCtrl', function ($scope, $rootScope, $state, $stateParams, bsLoadingOverlayService, $anchorScroll, $timeout, $uibModal, ngAudio, UserService, CapacitationService) {
    $anchorScroll();
    //nutrifami.training.initClient();

    $scope.textoBoton = 'Calificar';
    $scope.usuarioActivo = UserService.getUser();
    $scope.estadoUnidad = 'espera';
    $scope.unidad = CapacitationService.getUnidad($stateParams.lesson, $stateParams.unit);
    $scope.unidad.numeroUnidad = $stateParams.unit;
    $scope.unidad.totalUnidades = CapacitationService.getUnidadesActivas($stateParams.lesson).length;

    var tempOpciones = []; //Arreglo para almacenar las opciones

    //Limpiamos el objeto de las opciones que no se deben mostrar
    for (var i in $scope.unidad.opciones) {
        if ($scope.unidad.opciones[i].visible == 0) {
            delete $scope.unidad.opciones[i];
        }
    }
    
    console.log($scope.unidad);

    /* Validamos si la unidad actual es de parejas o de otra 
     * if - Si es parejas ponemos las imagenes de primeras y los textos abajo
     * else - Si es otro tipo de unidad, desorganizamos las opciones */
    if ($scope.unidad.tipo.id == 2) {
        var tempOpcionesPareja = []; //Arreglo para almacenar las parejas de las opciones 

        // Recorre todo el objeto de las opciones para crear el arreglo
        var cantidadParejas = Object.keys($scope.unidad.opciones).length / 2;
        $scope.cantidadParejas = cantidadParejas;

        for (var j in $scope.unidad.opciones) {
            if ($scope.unidad.opciones[j].columna == 1) {
                tempOpcionesPareja.push($scope.unidad.opciones[j]);
            } else {
                tempOpciones.push($scope.unidad.opciones[j]);
            }
        }

        /* Se mezclan los arreglos */
        shuffle(tempOpcionesPareja);
        shuffle(tempOpciones);
        $scope.unidad.opciones = tempOpcionesPareja.concat(tempOpciones); /* Se concatenan los arreglos, con las imagenes primero y las opciones despues */
    } else {
        for (var i in $scope.unidad.opciones) {
            tempOpciones.push($scope.unidad.opciones[i]);
        }
        shuffle(tempOpciones);
        $scope.unidad.opciones = tempOpciones;

        if ($scope.unidad.tipo.id == 1) {
            $timeout(function () {
                $scope.botonCalificar = true;
                $scope.textoBoton = 'continuar';
            }, 10000);

        }
    }

    $scope.audios = {
        instruccion: $rootScope.ASSETPATH_AUDIOS + $scope.unidad.instruccion.audio.url,
        unidad: $rootScope.ASSETPATH_AUDIOS + $scope.unidad.audio.url,
    };




    if ($scope.usuarioActivo.narrador) {
        $scope.unidad.instruccion.audio.audio.play();
        $scope.unidad.instruccion.audio.audio.complete(function () {
            $scope.unidad.instruccion.audio.audio.stop();
            $scope.unidad.audio.audio.play();
            $scope.unidad.audio.audio.complete(function () {
                $scope.unidad.audio.audio.stop();
            });
        });
    }


    $scope.unidad.feedback = [];




    // Obtenemos la cantidad de respuestas correctas
    var respuestasCorrectas = 0;
    var respuestasSeleccionadas = 0;
    for (var i in $scope.unidad.opciones) {
        if ($scope.unidad.opciones[i].correcta == 1) {
            respuestasCorrectas++;
        }
        $scope.unidad.opciones[i].selected = false;
        $scope.unidad.opciones[i].evaluacion = false;
        $scope.unidad.opciones[i].pareja = '';
        $scope.unidad.opciones[i].match = false;
        $scope.audios['option' + $scope.unidad.opciones[i].id] = $rootScope.ASSETPATH_AUDIOS + $scope.unidad.opciones[i].audio.url;
    }

    $scope.botonCalificar = false;

    $scope.seleccionarOpcion = function (index) {
        if ($scope.unidad.opciones[index].selected) {
            $scope.unidad.opciones[index].selected = false;
            respuestasSeleccionadas--;
        } else {
            $scope.unidad.opciones[index].selected = true;
            respuestasSeleccionadas++;
        }

        if (respuestasCorrectas === 1) {
            for (var i in $scope.unidad.opciones) {
                if (i !== index) {
                    if ($scope.unidad.opciones[i].selected) {
                        $scope.unidad.opciones[i].selected = false;
                        $scope.unidad.opciones[i].evaluacion = false;
                        respuestasSeleccionadas--;
                    }
                }
            }
        }

        if (respuestasSeleccionadas === respuestasCorrectas) {
            $scope.botonCalificar = true;
        } else {
            $scope.botonCalificar = false;
        }
    };

    var parejasContador = 0;
    var pareja1Orden = 0;
    var pareja2Orden = 0;
    var pareja1Pos = 0;
    var pareja2Pos = 0;
    var parejasCorrectas = 0;

    $scope.seleccionarPareja = function (index) {
        /* Verifica si es una opcion que no ha hecho match para poderla seleccionar*/
        if (!$scope.unidad.opciones[index].match) {

            for (var i in $scope.unidad.opciones) {
                $scope.unidad.opciones[i].fallo = false;
            }

            /* Toggle para seleccionar y deseleccionar tarjeta*/
            if ($scope.unidad.opciones[index].selected) {
                $scope.unidad.opciones[index].selected = false;
                /*Si se deselecciona la carta se resta del contador*/
                parejasContador--;
            } else {
                $scope.unidad.opciones[index].selected = true;
                /*Almacenar la respuesta correcta para validar más adelante si es una pareja*/

                parejasContador++;
                if (parejasContador === 1) {
                    pareja1Orden = $scope.unidad.opciones[index].orden;
                    pareja1Pos = index;
                } else if (parejasContador === 2) {
                    pareja2Orden = $scope.unidad.opciones[index].orden;
                    pareja2Pos = index;

                    if (pareja1Orden === pareja2Orden) {
                        /*Estilos para la pareja actual*/
                        $scope.unidad.opciones[pareja2Pos].pareja = 'pareja-' + pareja2Orden;
                        $scope.unidad.opciones[pareja2Pos].selected = false;
                        $scope.unidad.opciones[pareja2Pos].match = true;
                        $scope.unidad.opciones[pareja2Pos].evaluacion = true;

                        /*Estilos para pareja anterior*/
                        $scope.unidad.opciones[pareja1Pos].pareja = 'pareja-' + pareja2Orden;
                        $scope.unidad.opciones[pareja1Pos].selected = false;
                        $scope.unidad.opciones[pareja1Pos].match = true;
                        $scope.unidad.opciones[pareja1Pos].evaluacion = true;

                        parejasContador = 0;
                        pareja1Pos = 0;
                        pareja2Pos = 0;
                        pareja1Orden = 0;
                        pareja2Orden = 0;

                        parejasCorrectas++;
                        if (parejasCorrectas == ($scope.unidad.opciones.length / 2)) {
                            /*Si las parejas correctas es igual a la mitad de la cantidad de opciones habilitar el botón de continuar*/
                            $scope.estadoUnidad = 'acierto';
                            $scope.feedback();
                        }

                    } else {
                        $scope.unidad.opciones[pareja2Pos].pareja = '';
                        $scope.unidad.opciones[pareja2Pos].selected = false;
                        $scope.unidad.opciones[pareja2Pos].match = false;
                        $scope.unidad.opciones[pareja2Pos].fallo = true;
                        $scope.unidad.opciones[pareja1Pos].pareja = '';
                        $scope.unidad.opciones[pareja1Pos].selected = false;
                        $scope.unidad.opciones[pareja1Pos].match = false;
                        $scope.unidad.opciones[pareja1Pos].fallo = true;
                        parejasContador = 0;
                        pareja1Pos = 0;
                        pareja2Pos = 0;
                        pareja1Orden = 0;
                        pareja2Orden = 0;

                    }
                }
            }

        }
    };

    $scope.calificarUnidad = function () {
        /* Validar si acerto o fallo*/

        if ($scope.unidad.tipo.id == 1) {
            $scope.irASiguienteUnidad();
            return;
        }


        var tempFeedbackBien = [];
        var tempFeedbackMal = [];

        var respuestasAcertadas = 0;
        for (var i in $scope.unidad.opciones) {
            if ($scope.unidad.opciones[i].selected) {
                $scope.unidad.opciones[i].evaluacion = true;
                if ($scope.unidad.opciones[i].selected == $scope.unidad.opciones[i].correcta) {
                    respuestasAcertadas++;


                    if (typeof $scope.unidad.opciones[i].feedback.audio !== 'undefined') {
                        $scope.unidad.opciones[i].feedback.audio.audio = ngAudio.load($rootScope.ASSETPATH_AUDIOS + $scope.unidad.opciones[i].feedback.audio.url);
                    }
                    //tempFeedbackBien.push($scope.unidad.opciones[i].feedback);
                    tempFeedbackBien[0] = ($scope.unidad.opciones[i].feedback);
                } else {
                    /* Almacena la respuesta incorrecta */
                    if (typeof $scope.unidad.opciones[i].feedback.audio !== 'undefined') {
                        $scope.unidad.opciones[i].feedback.audio.audio = ngAudio.load($rootScope.ASSETPATH_AUDIOS + $scope.unidad.opciones[i].feedback.audio.url);
                    }
                    //tempFeedbackMal.push($scope.unidad.opciones[i].feedback);
                    tempFeedbackMal[0] = $scope.unidad.opciones[i].feedback;
                }
            }
        }
        if (respuestasAcertadas === respuestasCorrectas) {
            $scope.estadoUnidad = 'acierto';
            $scope.unidad.feedback = eliminarRepitidos(tempFeedbackBien, 'texto');
        } else {
            $scope.estadoUnidad = 'fallo';
            $scope.unidad.feedback = eliminarRepitidos(tempFeedbackMal, 'texto');
            ;
        }

        if ($scope.usuarioActivo.narrador) {
            $scope.unidad.feedback[0].audio.audio.play();
        }

        $scope.feedback();
    };

    $scope.feedback = function () {
        var data = {
            estado: $scope.estadoUnidad,
            feedback: $scope.unidad.feedback
        };

        var feedbackModal = $uibModal.open({
            animation: true,
            templateUrl: 'modals/feedback/feedback.modal.html',
            controller: 'FeedbackModalCtrl',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
                data: function () {
                    return data;
                }
            }
        });

        feedbackModal.result.then(function (estado) {
            if (estado === 'acierto') {
                $scope.irASiguienteUnidad();
            } else {
                $scope.reiniciarUnidad();
            }
        });
    };

    $scope.irASiguienteUnidad = function () {
        $scope.siguienteUnidad = parseInt($stateParams.unit) + 1;
        if ($scope.siguienteUnidad > $scope.unidad.totalUnidades) {
            var data = {
                capacitacion: $stateParams.capacitation,
                modulo: $stateParams.module,
                leccion: $stateParams.lesson
            };
            bsLoadingOverlayService.start();
            UserService.createAvance(data);

        } else {
            $state.go('nf.cap_unit', {
                capacitation: $stateParams.capacitation,
                module: $stateParams.module,
                lesson: $stateParams.lesson,
                unit: $scope.siguienteUnidad
            });
        }
    };

    $scope.reiniciarUnidad = function () {
        for (var i in $scope.unidad.opciones) {
            $scope.unidad.opciones[i].selected = false;
            $scope.unidad.opciones[i].evaluacion = false;
            respuestasSeleccionadas = 0;
        }
        $scope.estadoUnidad = 'espera';
        $scope.botonCalificar = false;
    };

    $scope.verConsejoSaludable = function () {
        var data = {
            leccion: $stateParams.lesson,
            narrador: $scope.usuarioActivo.narrador
        };

        var tipsModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/tips.modal.html',
            controller: 'TipsModalController',
            keyboard: false,
            size: 'lg',
            resolve: {
                data: function () {
                    return data;
                }
            }
        });


    };

    $scope.toogleNarrador = function () {
        $scope.usuarioActivo.narrador = !$scope.usuarioActivo.narrador;
        UserService.setUsuarioActivo($scope.usuarioActivo, function (response) {
        });
    };

    $scope.playAudio = function (audio) {
        console.log($scope.audios);
        var audio = ngAudio.load($scope.audios[audio]);
        audio.play();
    };

    $scope.$on('avanceSaved', function (event, id) {
        bsLoadingOverlayService.stop();
        $state.go('nf.cap_unit_end', {
            capacitation: $stateParams.capacitation,
            module: $stateParams.module,
            lesson: $stateParams.lesson,
            unit: $scope.siguienteUnidad
        });
    });

    $scope.$on('avanceFaliedSave', function (event, id) {
        $state.go('nf.cap_unit_end', {
            capacitation: $stateParams.capacitation,
            module: $stateParams.module,
            lesson: $stateParams.lesson,
            unit: $scope.siguienteUnidad
        });
    });

    /**
     * Shuffles array in place.
     * @param {Array} a items The array containing the items.
     */
    function shuffle(a) {
        var j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }

    function eliminarRepitidos(myList, reference) {
        myList.sort(dynamicSort(reference));

        var tempList = [];
        tempList.push(myList[0]);
        for (var i = 1; i < myList.length; i++) {
            if (myList[i][reference] != myList[i - 1][reference]) {
                tempList.push(myList[i]);
            }
        }
        return tempList
    }

    function dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
});

nf2.directive('reiniciarUnidad', function () {
    return {
        restrict: 'E',
        scope: {
            feedback: '='
        },
        templateUrl: 'views/directives/reiniciarUnidad.html',
        link: function ($scope, $element, $attrs) {
            $scope.reiniciar = function () {
                $scope.$parent.reiniciarUnidad();
            };
        }
    };
});

nf2.directive('siguienteUnidad', function () {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'views/directives/siguienteUnidad.html',
        link: function ($scope, $element, $attrs) {
            $scope.siguienteUnidad = function () {
                $scope.$parent.irASiguienteUnidad();
            };
        }
    };
});
