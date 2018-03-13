/*global angular*/
nf2.controller('ncHomeCtrl', function ($anchorScroll, NutricompraService) {
    'use strict';

    $anchorScroll();
    console.log("ncHomeCtrl");
    NutricompraService.clearProductos(function (response) {
        console.log("Clear productos");
    });


});
