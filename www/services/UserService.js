nf2.factory('UserService', function ($rootScope, $auth, $http, $q) {

    var service = {};

    /**
     * 
     * @returns {Array|Object}
     */
    service.getVersionApp = function () {
        return JSON.parse(localStorage.getItem('versionApp'));
    };

    /**
     * 
     * @returns {undefined}
     */
    service.setVersionApp = function () {
        localStorage.setItem("versionApp", JSON.stringify(2));
    };

    /**
     * @description Retorna el token de usuario
     * @returns {unresolved}
     */
    service.getToken = function () {
        return $auth.getToken();
    };

    /**
     * @description Retorna verdadero si el usuario se encuentra autenticado dentro de la aplicación
     * @returns {boolean}
     */
    service.isAuthenticated = function () {
        return $auth.isAuthenticated();
    };

    /**
     * 
     * @param {type} provider
     * @returns {undefined}
     * @param {type} provider
     * @returns {undefined}
     */
    service.authenticate = function (provider) {
        console.log("authenticate");
        $auth
                .authenticate(provider)
                .then(this.successAuth)
                .catch(this.failedAuth);
    };

    /**
     * 
     * @param {type} user
     * @returns {undefined}
     * @param {type} username
     * @param {type} email
     * @param {type} password
     * @returns {undefined}
     */
    service.signup = function (user) {
        console.log(user);
        $auth.signup(user)
                .then(function (response) {
                    console.log(response);
                    localStorage.setItem("username", JSON.stringify(user.username));
                    service.login(user.password);
                })
                .catch(function (response) {
                    console.log(response);
                    if (response.data.username) {
                        service.failedAuth({message: "Ya existe este nombre de usuario"});
                    } else if (response.data.email) {
                        service.failedAuth({message: "El correo electrónico ya se encuentra registrado"});
                    } else if (response.data.id_antiguo) {
                        service.failedAuth({message: "Ya se ha generado una contraseña para esta cuenta. Vuelve a la ventana de login e inicia sesión"});
                    } else {
                        service.failedAuth({message: "Ha ocurrido un error inesperado, inténtelo más tarde!!"});
                    }

                });
    };

    /**
     * 
     * @param {type} username
     * @param {type} password
     * @returns {undefined}
     */
    service.loginCedula = function (username, password) {
        nutrifami.login(username, password, function (response) {
            if (response.success) {
                if (response.data.response === 1) {
                    service.userMigration(response.data);
                } else {
                    service.failedAuth({message: 'El documento es incorrecto'});
                }
            } else {
                service.failedAuth({message: 'Ha ocurrido un error durante la ejecución'});
            }
        });
    };
    
    service.checkUser = function (username){
        $http({
            method: 'GET',
            url: $rootScope.BASE_URL + 'api/check-user/' + username
        }).then(function (response) {
            localStorage.setItem("username", JSON.stringify(username));
            $rootScope.$broadcast('userChecked');
        }, function (error) {
            service.failedAuth({message: 'El documento o usuario no existe'});
        });
        
    };

    /**
     * 
     * @param {type} username
     * @param {type} password
     * @returns {undefined}
     */
    service.login = function (password) {
        var username = JSON.parse(localStorage.getItem('username'));
        var user = {
            username: username,
            password: password
        };
        $auth.login(user)
                .then(function (response) {
                    // Redirect user here after a successful log in.
                    //organizamos la respuesta para pasarla al SuccesAuth y que se guarden bien todos los datos
                    console.log(response);
                    var response2 = {
                        data: response.data.user
                    };
                    response2.data.access_token = response.data.token;

                    service.successAuth(response2);
                })
                .catch(function (response) {
                    console.log(response);
                    service.failedAuth({message: 'Los datos ingresados no son correctos, inténtelo nuevamente'});
                });
    };
    
    /**
     * @description Cierra sesión de $auth, elimina el usuario de la cache y lanza evento UserLoogedOut de Ionic
     * @returns {undefined}
     */
    service.logOut = function () {
        $auth.logout();
        $rootScope.globals = {};
        localStorage.removeItem('globals');
        localStorage.removeItem("user");
        localStorage.removeItem("usuarioAvance");
        localStorage.removeItem("usuarioFamilia");
        localStorage.removeItem("usuarioFamiliaAvance");
        localStorage.removeItem("misCompras");
        localStorage.removeItem("staff");
        localStorage.removeItem("current_trainee");
        localStorage.removeItem("username");
        $rootScope.$emit('userLoggedOut');
    };

    /**
     * @description Guard
     * @param {type} user
     * @returns {None}a la información de usuario en la memoria cache
     * @param {object} user
     * @returns {None}
     */
    service.setUser = function (data) {
        var usuarioActivo = data;
        //var usuarioFamiliaAvance = {};
        //var usuarioFamilia = {};

        /*if (data.access_token === 'no-token') {
         usuarioFamiliaAvance = usuarioActivo.avance;
         
         delete usuarioFamiliaAvance[usuarioActivo.id];
         
         usuarioFamilia = usuarioActivo.familia;
         delete usuarioActivo["familia"];
         
         localStorage.setItem("usuarioFamiliaAvance", JSON.stringify(usuarioFamiliaAvance));
         localStorage.setItem("usuarioFamilia", JSON.stringify(usuarioFamilia));
         } else {
         
         localStorage.setItem("usuarioFamiliaAvance", JSON.stringify({}));
         localStorage.setItem("usuarioFamilia", JSON.stringify({}));
         }*/

        $rootScope.globals = {
            currentUser: {
                username: 'usuarioActivo.username',
                id: 'usuarioActivo.id'
            }
        };

        if (usuarioActivo.is_staff) {
            var current_trainee = {
                name: 'Yo',
                document: usuarioActivo.documento
            };
            localStorage.setItem("current_trainee", JSON.stringify(current_trainee));
            //Save the staff member info in a temporal object for an offline purposes
            var staff = {
                is_staff: usuarioActivo.is_staff,
                is_active: true,
                advance: usuarioActivo.avances,
                syncronized: false
            };
            localStorage.setItem("staff", JSON.stringify(staff));
        }

        delete usuarioActivo["avances"];

        localStorage.setItem("user", JSON.stringify(usuarioActivo));
        localStorage.setItem("globals", JSON.stringify($rootScope.globals));
    };


    /**
     * @description Devuelve la informacion de usuario guardada en cache
     * @returns {Array|Object}
     */
    service.getUser = function () {
        return JSON.parse(localStorage.getItem('user'));
    };

    /**
     * @description Devuelve la informacion de usuario guardada en cache
     * @returns {Array|Object}
     */
    service.updateUser = function (user) {
        $http({
            method: 'PUT',
            url: $rootScope.BASE_URL + 'api/usuarios/' + user.id + '/',
            data: user
        }).then(function successCallback(response) {
            delete response.data["avances"];
            localStorage.setItem("user", JSON.stringify(response.data));
            $rootScope.$broadcast('userUpdated', response.data);
        }, function errorCallback(response) {
            console.log(response);
            $rootScope.$broadcast('userFaliedUpdate', response.data);
        });
    };

    service.userMigration = function (data) {

        var oldUser = data;
        var oldAvance = data.avance[oldUser.id];
        var tempAvance = [];
        for (var c in oldAvance) {
            for (var m in oldAvance[c]) {
                for (var l in oldAvance[c][m]) {
                    if (oldAvance[c][m][l]) {
                        tempAvance.push(l);
                    }
                }
            }
        }

        var tempUser = {
            first_name: oldUser["nombre"] || '',
            last_name: oldUser["apellido"] || '',
            id_antiguo: oldUser["id"]
        };

        localStorage.setItem("tempUser", JSON.stringify(tempUser));
        localStorage.setItem("tempAvance", JSON.stringify(tempAvance));

        $rootScope.$broadcast('userLoggedInwithDocument', {data: data});
    };

    service.migrarAvance = function () {

        var tempAvance = JSON.parse(localStorage.getItem('tempAvance'));
        var deferred = $q.defer();
        var promises = [];
        for (var a in tempAvance) {
            var data = {
                'capacitacion': 0,
                'modulo': 0,
                'leccion': tempAvance[a]
            };
            promises.push($http({
                method: 'POST',
                url: $rootScope.BASE_URL + 'api/avances/',
                data: data
            }).then(function successCallback(response) {
                console.log(response);
            }, function errorCallback(response) {
                console.log(response);
            }));
        }

        $q.all(promises).then(function (res) {
            deferred.resolve();
            localStorage.removeItem('tempUser');
            localStorage.removeItem("tempAvance");
            service.readAvance();
        });

        return deferred.promise;

    };

    /**
     * 
     * @param {type} response
     * @returns {undefined}
     */
    service.successAuth = function (response) {
        console.log("successAuth");
        $auth.setToken(response.access_token);
        service.setAvance(response.data.avances);
        service.setUser(response.data);
        service.setVersionApp();
        $rootScope.$broadcast('userLoggedIn', {data: response.data});
    };

    /**
     * 
     */
    service.failedAuth = function (response) {
        console.log("failedAuth");
        $rootScope.$broadcast('userFailedLogin', response);
    };

    /**
     * 
     * @returns {undefined}
     */
    service.crearGestorAvance = function () {

        console.log("Crear gestor descarga");

        var usuarioAvance = {};
        usuarioAvance['totalUnidades'] = Object.keys(nutrifami.training.cap_lecciones).length;
        usuarioAvance['medallas'] = 0;
        usuarioAvance['capacitacionesTerminadas'] = 0;
        usuarioAvance['modulosTerminados'] = 0;
        usuarioAvance['puntos'] = 0;
        usuarioAvance['porcentaje'] = 0;
        usuarioAvance['diplomas'] = [];
        usuarioAvance['capacitaciones'] = {};
        usuarioAvance['modulos'] = {};
        usuarioAvance['lecciones'] = {};

        for (var i in nutrifami.training.cap_capacitaciones) {
            if (i !== 'completo') {
                var tempObject = {};
                tempObject[i] = {
                    completo: false,
                    totalModulos: Object.keys(nutrifami.training.getModulosId(i)).length,
                    completados: 0,
                    porcentaje: 0
                };
                $.extend(usuarioAvance.capacitaciones, tempObject);
            }
        }

        for (var i in nutrifami.training.cap_modulos) {
            var tempObject = {};
            tempObject[i] = {
                completo: false,
                totalLecciones: Object.keys(nutrifami.training.getLeccionesId(i)).length,
                completados: 0,
                porcentaje: 0
            };
            $.extend(usuarioAvance.modulos, tempObject);
        }

        for (var i in nutrifami.training.cap_lecciones) {
            var tempObject = {};
            tempObject[i] = false;
            $.extend(usuarioAvance.lecciones, tempObject);
        }

        localStorage.setItem("usuarioAvance", JSON.stringify(usuarioAvance));

    };

    /**
     * 
     * @param {type} data
     * @returns {undefined}
     */
    service.setAvance = function (avances) {
        console.log(avances);
        service.crearGestorAvance();

        var usuarioAvance = service.getAvance();
        for (var a in avances) {
            usuarioAvance['lecciones'][avances[a]['leccion']] = true;
        }
        localStorage.setItem("usuarioAvance", JSON.stringify(usuarioAvance));
        service.comprobarAvanceModulo();
    };

    service.readAvance = function () {
        $http({
            method: 'GET',
            url: $rootScope.BASE_URL + 'api/avance-user/',
            data: {},
        }).then(function successCallback(response) {
            console.log(response);
            service.setAvance(response.data);
            //localStorage.setItem("user", JSON.stringify(response.data));
            //$rootScope.$broadcast('userUpdated', response.data);
        }, function errorCallback(response) {
            console.log(response);
            //$rootScope.$broadcast('userFaliedUpdate', response.data);
        });

    }


    service.getAvance = function () {
        return JSON.parse(localStorage.getItem('usuarioAvance'));
    };

    service.getAvanceCapacitacion = function (cid) {
        var usuarioAvance = service.getAvance();
        return usuarioAvance['capacitaciones'][cid];
    };

    service.comprobarAvanceCapacitacion = function () {
        var usuarioAvance = service.getAvance();
        var modulosTerminados = 0;
        var diplomas = [];
        for (var c in usuarioAvance.capacitaciones) {
            usuarioAvance['capacitaciones'][c]['completo'] = true;
            var mids = nutrifami.training.getModulosId(c);
            var completados = 0;
            for (var mid in mids) {
                if (!usuarioAvance['modulos'][mids[mid]]['completo']) {
                    usuarioAvance['capacitaciones'][c]['completo'] = false;
                } else {
                    var modulo = nutrifami.training.getModulo(mids[mid]);
                    diplomas.push(modulo.titulo.texto);
                    completados++;
                    modulosTerminados++;

                }
            }
            usuarioAvance['capacitaciones'][c]['completados'] = completados;
            usuarioAvance['capacitaciones'][c]['porcentaje'] = parseInt((100 / usuarioAvance['capacitaciones'][c]['totalModulos']) * usuarioAvance['capacitaciones'][c]['completados']);
        }
        console.log(modulosTerminados);
        usuarioAvance['modulosTerminados'] = modulosTerminados;
        usuarioAvance['diplomas'] = diplomas;
        localStorage.setItem("usuarioAvance", JSON.stringify(usuarioAvance));

    };

    service.getAvanceModulo = function (mid) {
        var usuarioAvance = service.getAvance();
        return usuarioAvance['modulos'][mid];
    };

    service.comprobarAvanceModulo = function () {
        //Comprobar modulos completados
        var usuarioAvance = service.getAvance();
        var medallas = 0;

        for (var m in usuarioAvance.modulos) {
            usuarioAvance['modulos'][m]['completo'] = true;
            var lids = nutrifami.training.getLeccionesId(m);
            var completados = 0;
            for (var lid in lids) {
                if (!usuarioAvance['lecciones'][lids[lid]]) {
                    usuarioAvance['modulos'][m]['completo'] = false;
                } else {
                    completados++;
                    medallas++;

                }
            }
            usuarioAvance['modulos'][m]['completados'] = completados;
            usuarioAvance['modulos'][m]['porcentaje'] = parseInt((100 / usuarioAvance['modulos'][m]['totalLecciones']) * completados);
            usuarioAvance['puntos'] = medallas * 100;
            usuarioAvance['porcentaje'] = parseInt((100 / usuarioAvance['totalUnidades']) * medallas);
        }
        usuarioAvance['medallas'] = medallas;
        localStorage.setItem("usuarioAvance", JSON.stringify(usuarioAvance));
        service.comprobarAvanceCapacitacion();

    };

    service.getAvanceLeccion = function (lid) {
        var usuarioAvance = service.getAvance();
        return usuarioAvance['lecciones'][lid];
    };

    service.setAvanceLeccion = function (lid) {
        var usuarioAvance = service.getAvance();
        usuarioAvance['lecciones'][lid] = true;
        localStorage.setItem("usuarioAvance", JSON.stringify(usuarioAvance));
        service.comprobarAvanceModulo();

    };

    service.createAvance = function (data) {
        console.log(data);

        $http({
            method: 'POST',
            url: $rootScope.BASE_URL + 'api/avances/',
            data: data
        }).then(function successCallback(response) {
            console.log(response);
            service.setAvanceLeccion(data.leccion);
            $rootScope.$broadcast('avanceSaved', response.data);
        }, function errorCallback(response) {
            console.log(response);
            $rootScope.$broadcast('avanceFaliedSave', response.data);
        });

    };

    return service;
});