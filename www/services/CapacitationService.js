nf2.factory('CapacitationService', function() {
    var service = {};

    service.initClient = function(callback) {
        
        if (typeof nutrifami.training.cap_modulos['5'] == 'undefined') {
            var data = JSON.parse(localStorage.getItem('capacitacion'));
            nutrifami.training.cap_capacitacionesId = data['serv_capacitacionesId'];
            nutrifami.training.cap_capacitaciones = data['serv_capacitaciones'];
            nutrifami.training.cap_modulos = data['serv_modulos'];
            nutrifami.training.cap_lecciones = data['serv_lecciones'];
            nutrifami.training.cap_unidadesinformacion = data['serv_unidades'];
            nutrifami.training.cap_unidadestips = data["serv_tips"];
            
            //console.log(nutrifami.training.cap_capacitaciones);
        }
    };

    service.getCapacitacionesId = function() {
        //this.initClient();
        return nutrifami.training.getCapacitacionesId();

    };
    
    service.getCapacitacionesActivas = function(){
        //this.initClient();
        var capacitaciones = [];
        var cids = nutrifami.training.getCapacitacionesId();
        console.log(cids);
        for (var cid in cids) {
            var tempCapacitacion = nutrifami.training.getCapacitacion(cids[cid]);
            if (tempCapacitacion.activo == '1') {
                capacitaciones.push(tempCapacitacion);
            }
        }
        return capacitaciones;
    };

    service.getModulosId = function(cid) {
        //this.initClient();
        return nutrifami.training.getModulosId(cid);

    };
    service.getModulosActivos = function(capacitacion) {

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

    service.getModulo = function(modulo) {
        //this.initClient();
        return nutrifami.training.getModulo(modulo);
    };
    
    service.getLessonsId = function(mid) {
        //this.initClient();
        return nutrifami.training.getLeccionesId(mid);

    };

    service.getLeccionesActivas = function(modulo) {
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

    service.getLeccion = function(leccion) {
        this.initClient();
        return nutrifami.training.getLeccion(leccion);
    };

    service.getUnidadesActivas = function(leccion) {
        this.initClient();
        var uids = nutrifami.training.getUnidadesId(leccion);
        var temp = [];
        for (var i in uids) {
            if (nutrifami.training.getUnidad(uids[i]).activo == 1) {
                temp.push(nutrifami.training.getUnidad(uids[i]));
            }
        }
        return temp;

    };

    service.getUnidad = function(leccion, rp_unidad) {
        //this.initClient();
        unidades = this.getUnidadesActivas(leccion);
        return unidades[rp_unidad - 1];
    };
    return service;
});
