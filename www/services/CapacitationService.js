nf2.factory('CapacitationService', function ($http) {
    var service = {};

    service.capacitation = {};

    service.initClient = function (callback) {
        console.log('initClient');
        service.capacitation = JSON.parse(localStorage.getItem('capacitacion'));
        var version_old = JSON.parse(localStorage.getItem('version'));
        var version_new = '';

        $http.get('http://www.nutrifami.org/js/json.php?file=version.JSON').then(function (response) {
            version_new = response.data.Capacitacion.ID;
            if (version_old !== version_new || !service.capacitation) {
                localStorage.setItem("version", JSON.stringify(version_new));
                $http.get('http://www.nutrifami.org/js/json.php?file=capacitacion.JSON').then(function (response) {
                    localStorage.setItem("capacitacion", JSON.stringify(response.data));
                    service.capacitation = response.data;
                    callback();
                });
            } else {
                callback();
            }
        });
    };


    /* Capacitations */
    service.getPublicCapacitations = function () {
        var capacitations = service.capacitation.serv_capacitaciones;
        var publicCapacitations = {};


        for (var c in capacitations) {
            if (capacitations[c].activo === '1' && capacitations[c].status.nombre === 'publico') {
                publicCapacitations[capacitations[c].id] = capacitations[c];
            }
        }
        return publicCapacitations;
    };

    service.getCapacitationsIds = function () {
        if (typeof service.capacitation.serv_capacitacionesId !== 'undefined') {
            return service.capacitation.serv_capacitacionesId;
        } else {
            return false;
        }
    };

    service.getCapacitation = function (cid) {
        cid = cid || 3;
        if (typeof service.capacitation.serv_capacitaciones[cid] !== 'undefined') {
            return service.capacitation.serv_capacitaciones[cid];
        } else {
            return false;
        }
    };

    service.getCapacitationsActives = function () {
        var capacitaciones = [];
        var cids = service.getCapacitationsIds();
        for (var cid in cids) {
            var tempCapacitacion = service.getCapacitation(cids[cid]);
            if (tempCapacitacion.activo === '1') {
                capacitaciones.push(tempCapacitacion);
            }
        }
        return capacitaciones;
    };

    /* End - Capacitations*/

    /* Modules */

    service.getPublicModules = function () {
        var capacitations = service.getPublicCapacitations();
        var public_modules = {};
        for (var c in capacitations) {
            for (var m in capacitations[c].modulos) {
                public_modules[capacitations[c].modulos[m]] = service.getModule(capacitations[c].modulos[m]);
            }
        }
        return public_modules;
    };

    /**
     * 
     * @param {type} cid
     * @returns {JSON@call;parse.serv_capacitaciones.modulos|service.capacitation.serv_capacitaciones.modulos|response.data.serv_capacitaciones.modulos|Boolean}
     */
    service.getModulesIds = function (cid) {
        cid = cid || 3;
        if (typeof service.capacitation.serv_capacitaciones[cid].modulos !== 'undefined') {
            return service.capacitation.serv_capacitaciones[cid].modulos;
        } else {
            return false;
        }
    };
    service.getModulesActives = function (capacitacion) {

        //this.initClient();

        var modulos = [];
        mids = nutrifami.training.getModulosId(capacitacion);
        for (var mid in mids) {
            var tempModulo = nutrifami.training.getModulo(mids[mid]);

            tempModulo.avance = {};
            tempModulo.avance.finalizado = false;
            //tempModulo.disponible = false;
            tempModulo.disponible = true;


            if (tempModulo.activo == '1') {
                tempModulo.activo = true;
            } else {
                tempModulo.activo = false;
            }
            modulos.push(tempModulo);
        }

        modulos[0].disponible = true;
        for (var i in modulos) {
            if (i != 0) {
                var temp = i - 1;
                if (modulos[i].avance.finalizado) {
                    modulos[i].disponible = true;
                } else if (modulos[i].avance.leccionesFinalizadas > 0) {
                    modulos[i].disponible = true;
                } else if (modulos[temp].avance.finalizado) {
                    modulos[i].disponible = true;
                }
            }


        }

        return modulos;

    };

    service.getModule = function (mid) {
        if (typeof service.capacitation.serv_modulos[mid] !== 'undefined') {
            return service.capacitation.serv_modulos[mid];
        } else {
            return false;
        }
    };

    /* End - Modules*/

    /* Lessons */

    service.getPublicLessons = function () {
        var modules = service.getPublicModules();
        var public_lessons = {};
        for (var m in modules) {
            for (var l in modules[m].lecciones) {
                public_lessons[modules[m].lecciones[l]] = service.getLesson(modules[m].lecciones[l]);
            }
        }
        return public_lessons;
    };

    service.getLessonsIds = function (mid) {
        if (typeof service.capacitation.serv_modulos[mid].lecciones !== 'undefined') {
            return service.capacitation.serv_modulos[mid].lecciones;
        } else {
            return false;
        }

    };

    service.getLessonsActives = function (modulo) {
        //this.initClient();
        var lecciones = [];
        lids = nutrifami.training.getLeccionesId(modulo);
        for (var lid in lids) {
            var tempLeccion = nutrifami.training.getLeccion(lids[lid]);

            if (tempLeccion.activo == 1) {
                lecciones.push(tempLeccion);
            }
        }

        return lecciones;

    };

    service.getLesson = function (lid) {
        if (typeof service.capacitation.serv_lecciones[lid] !== 'undefined') {
            return service.capacitation.serv_lecciones[lid];
        } else {
            return false;
        }
    };

    /* End - Lessons */

    /* Units */

    service.getUnitsIds = function (lid) {
        if (typeof service.capacitation.serv_lecciones[lid].unidades !== 'undefined') {
            return service.capacitation.serv_lecciones[lid].unidades;
        } else {
            return false;
        }

    };

    service.getUnitsActives = function (lid) {
        this.initClient();
        var uids = service.getUnitsIds(lid);
        var temp = [];
        for (var i in uids) {
            if (service.getUnit(uids[i]).activo === '1') {
                temp.push(service.getUnit(uids[i]));
            }
        }
        return temp;

    };

    service.getUnit = function (uid) {
        if (typeof service.capacitation.serv_unidades[uid] !== 'undefined') {
            return service.capacitation.serv_unidades[uid];
        } else {
            return false;
        }

    };

    service.getUnitFromOrder = function (lid, rp_unidad) {
        //this.initClient();
        unidades = service.getUnitsActives(lid);
        return unidades[rp_unidad - 1];
    };
    return service;

    /* End - Units */
});
