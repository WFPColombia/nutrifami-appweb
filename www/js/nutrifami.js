var base_url = 'http://www.nutrifami.org/';

var nutrifami = {
    
    /*
     * Sub elemento training
     * 
     * Manejo de todas las funcionalidades de las capacitaciones
     * 
     */
    training: {
        cap_capacitacionesId: new Array(),
        cap_capacitaciones: new Object(),
        /* this.cap_capacitacion */
        cap_modulos: new Object(),
        /* this.cap_modulos */
        cap_lecciones: new Object(),
        /* this.cap_lecciones */
        cap_unidadesinformacion: new Object(),
        /* this.cap_unidadesinformacion */
        cap_loadContentProgress: false,
        /* this.cap_loadContentProgress */

        /*
         *  nutrifami.training.initClient(callback);
         *  
         *  Inicializa los objetos necesarios en la estructura de la capacitacion.
         *  
         */
        initClient: function() {
            if (window.cordova) {
                console.log("Mobile");
                localStorage.setItem("capacitacion", JSON.stringify(capacitacion));
                nutrifami.training.cap_capacitacionesId = capacitacion["serv_capacitacionesId"];
                nutrifami.training.cap_capacitaciones = capacitacion["serv_capacitaciones"];
                nutrifami.training.cap_modulos = capacitacion["serv_modulos"];
                nutrifami.training.cap_lecciones = capacitacion["serv_lecciones"];
                nutrifami.training.cap_unidadesinformacion = capacitacion["serv_unidades"];
                nutrifami.training.cap_unidadestips = capacitacion["serv_tips"];
                console.log(nutrifami);
                callback();
            } else {
                console.log("Web");
                $.getJSON("http://www.nutrifami.org/js/json.php?file=capacitacion.JSON", function(data) {
                    console.log(data);
                    localStorage.setItem("capacitacion", JSON.stringify(data));
                    nutrifami.training.cap_capacitacionesId = data['serv_capacitacionesId'];
                    nutrifami.training.cap_capacitaciones = data['serv_capacitaciones'];
                    nutrifami.training.cap_modulos = data['serv_modulos'];
                    nutrifami.training.cap_lecciones = data['serv_lecciones'];
                    nutrifami.training.cap_unidadesinformacion = data['serv_unidades'];
                    nutrifami.training.cap_unidadestips = data["serv_tips"];
                }).fail(function(jqxhr, textStatus, error) {
                    console.log(jqxhr);
                    var err = textStatus + ", " + error;
                    console.log(err);
                });
            }
        },
        
        /*
         * nutrifami.training.getCapacitacionesId();
         */
        getCapacitacionesId: function() {
            if (typeof nutrifami.training.cap_capacitacionesId !== 'undefined') {
                return nutrifami.training.cap_capacitacionesId;
            } else {
                return false;
            }
        },
        /*
         * nutrifami.training.getCapacitacion(cid);
         */
        getCapacitacion: function(cid) {
            cid = cid || 3;
            if (typeof nutrifami.training.cap_capacitaciones[cid] !== 'undefined') {
                return nutrifami.training.cap_capacitaciones[cid];
            } else {
                return false;
            }
        },
        /*
         * nutrifami.training.getModulosId(cid);
         */
        getModulosId: function(cid) {
            cid = cid || 3;
            if (typeof nutrifami.training.cap_capacitaciones[cid].modulos !== 'undefined') {
                return nutrifami.training.cap_capacitaciones[cid].modulos;
            } else {
                return false;
            }
        },
        /*
         * nutrifami.training.getModulo(mid);
         */
        getModulo: function(mid) {
            if (typeof nutrifami.training.cap_modulos[mid] !== 'undefined') {
                return nutrifami.training.cap_modulos[mid];
            } else {
                return false;
            }
        },
        /*
         * nutrifami.training.getLeccionesId(mid);
         */
        getLeccionesId: function(mid) {
            if (typeof nutrifami.training.cap_modulos[mid].lecciones !== 'undefined') {
                return nutrifami.training.cap_modulos[mid].lecciones;
            } else {
                return false;
            }
        },
        /*
         * nutrifami.training.getLeccion(lid);
         */
        getLeccion: function(lid) {
            if (typeof nutrifami.training.cap_lecciones[lid] !== 'undefined') {
                return nutrifami.training.cap_lecciones[lid];
            } else {
                return false;
            }
        },
        /*
         * nutrifami.training.getUnidadesId(lid);
         */
        getUnidadesId: function(lid) {
            if (typeof nutrifami.training.cap_lecciones[lid].unidades !== 'undefined') {
                return nutrifami.training.cap_lecciones[lid].unidades;
            } else {
                return false;
            }
        },
        /*
         * nutrifami.training.getUnidad(uid);
         */
        getUnidad: function(uid) {
            if (typeof nutrifami.training.cap_unidadesinformacion[uid] !== 'undefined') {
                return nutrifami.training.cap_unidadesinformacion[uid];
            } else {
                return false;
            }
        },
        /*
         * nutrifami.training.getUnidad(uid);
         */
        getTips: function() {
            if (typeof nutrifami.training.cap_unidadestips !== 'undefined') {
                return nutrifami.training.cap_unidadestips;
            } else {
                return false;
            }
        }

    },
    consumo: {
        /*
         * nutrifami.consumo.getConsolidadoCompras(data, callback);
         */
        getConsolidadoCompras: function(data, callback) {
            callback = callback || function() {};
            var serv = base_url + "app/api/get-consolidado-compras";
            response = {
                success: false,
                message: ''
            };
            $.ajax({
                url: serv,
                type: 'GET',
                async: true,
                data: data,
                success: function(data) {
                    var objServ = JSON.parse(data);
                    response.success = true;
                    response.data = objServ;
                    callback(response);
                },
                error: function() {
                    response.success = false;
                    response.message = 'Ha ocurrido un error durante la ejecución';
                    callback(response);
                }
            });

        },
        /*
         * nutrifami.consumo.getProductosPuntoVenta(data, callback);
         */
        getProductosPuntoVenta: function(data, callback) {
            callback = callback || function() {};
            var serv = base_url + "app/api/get-productos-puntoventa";
            response = {
                success: false,
                message: ''
            };
            $.ajax({
                url: serv,
                type: 'GET',
                async: true,
                data: data,
                success: function(data) {
                    var objServ = JSON.parse(data);
                    response.success = true;
                    response.data = objServ;
                    callback(response);
                },
                error: function() {
                    response.success = false;
                    response.message = 'Ha ocurrido un error durante la ejecución';
                    callback(response);
                }
            });

        }
    }

};