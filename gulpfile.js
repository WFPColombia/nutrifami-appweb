/*global require */
var gulp = require("gulp");
var webserver = require("gulp-webserver");
/*ify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');
var deleteLines = require('gulp-delete-lines');
var rename = require('gulp-rename');*/

// Servidor web de desarrollo
gulp.task("dev-server", function () {
    "use strict";

    gulp.src("./www").pipe(webserver({
        open: true,
        livereload: true,
        port: 8100
    }));
});


//Servidor web de producción
gulp.task("prod-server", function () {
    "use strict";
    gulp.src("./dist")
            .pipe(webserver({
                open: true,
                livereload: true
            }));
});

/*gulp.task("jsLint", function() {
 "use strict";
 
 return gulp.src(["./app/js/ * * / *.js"])
 .pipe(jsLint())
 .on("error", function(error) {
 console.error(String(error));
 });
 });
 
 gulp.task("jsHint", function() {
 "use strict";
 
 return gulp.src("./app/js/ * * / *.js")
 .pipe(jshint(".jshintrc"))
 .pipe(jshint.reporter("default"));
 });
 
 gulp.task("publish", function() {
 "use strict";
 
 //copiando librerias
 gulp.src("./app/lib/* * / *")
 .pipe(gulp.dest("./dist/lib/"));
 
 //Minimizando y fusión de archivos JavaScript
 gulp.src("./app/js/** /*.js")
 .pipe(concat("main.min.js"))
 .pipe(jsmin())
 .pipe(uglify())
 .pipe(rename("main.min.js"))
 .pipe(gulp.dest("dist/js/"));
 
 //Minimizado y procesado de las plantillas HTML
 gulp.src("./app/view/* * / *.html")
 .pipe(minifyHTML())
 .pipe(gulp.dest("dist/view/"));
 
 //Minimizado y procesado de archivo index.html
 gulp.src("./app/index.html")
 .pipe(deleteLines({
 "filters": ["<!-- BEGIN PROD FILES"]
 }))
 .pipe(deleteLines({
 "filters": ["END PROD FILES -->"]
 }))
 .pipe(deleteLines({
 "filters": [new RegExp(".*DEVFILE.*")]
 }))
 .pipe(minifyHTML())
 .pipe(gulp.dest("dist/"));
 
 });*/

//gulp.task("default", ["jsLint", "jsHint", "dev-server"]);
gulp.task("default", ["dev-server"]);
//gulp.task("compile", ["jsHint", "publish"]);
//gulp.task("compileCordova", ["compile", "cordovaDist"]);
