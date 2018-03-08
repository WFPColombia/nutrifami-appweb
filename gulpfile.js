/*global require */
var gulp = require("gulp");
var webserver = require("gulp-webserver");
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var deleteLines = require('gulp-delete-lines');
var rename = require('gulp-rename');

// Servidor web de desarrollo
gulp.task("dev-server", function () {
    "use strict";
    console.log('dev-server');

    gulp.src("./app").pipe(webserver({
        open: true,
        livereload: true,
        port: 8100
    }));
});


//Servidor web de producción
gulp.task("prod-server", function () {
    "use strict";
    gulp.src("./www")
            .pipe(webserver({
                open: true,
                livereload: true,
                port: 8100
            }).on('error', function (e) {
                console.log(e);
            }));
});

gulp.task("build", function () {
    "use strict";

    //copiando librerias
    gulp.src("./app/lib/**/*").pipe(gulp.dest("./www/lib/"));

    //Minimizando y fusión de archivos JavaScript
    gulp.src(["./app/js/app.js", "./app/src/**/*.js", "./app/directives/**/*.js", "./app/services/**/*.js", "./app/filters/**/*.js", "./app/modals/**/*.js"])
            .pipe(concat("nf2.min.js"))
            //.pipe(uglify())
            .pipe(rename("nf2.min.js"))
            .pipe(gulp.dest("www/js/"));

    //Procesando archivos css
    gulp.src(["./app/src/**/*.css", "./app/css/style.css", "./app/css/circle.css"])
            .pipe(concat("nf2.min.css"))
            .pipe(minifyCSS())
            .pipe(rename("nf2.min.css"))
            .pipe(gulp.dest("www/css/"));
    
    gulp.src("./app/css/font-awesome.min.css").pipe(gulp.dest("./www/css/"));
    
    //Copying audio, fonts, translations and img folders
    
    gulp.src("./app/fonts/*").pipe(gulp.dest("./www/fonts/"));
    gulp.src("./app/audios/*").pipe(gulp.dest("./www/audios/"));
    gulp.src("./app/img/**/*").pipe(gulp.dest("./www/img/"));
    gulp.src("./app/translations/*").pipe(gulp.dest("./www/translations/"));

    //Minimizado y procesado de las plantillas HTML
    gulp.src("./app/src/**/*.html")
            .pipe(gulp.dest("www/src/"));

    gulp.src("./app/directives/**/*.html")
            .pipe(minifyHTML())
            .pipe(gulp.dest("www/directives/"));

    gulp.src("./app/modals/**/*.html")
            .pipe(minifyHTML())
            .pipe(gulp.dest("www/modals/"));
    
    gulp.src("./app/template/*.html")
            .pipe(minifyHTML())
            .pipe(gulp.dest("www/template/"));

    //Minimizado y procesado de archivo index.html
    gulp.src("./app/index.html")
            .pipe(deleteLines({
                "filters": ["<!-- BEGIN PROD FILES"]
            }))
            .pipe(deleteLines({
                "filters": ["END PROD FILES -->"]
            }))
            .pipe(deleteLines({
                "filters": ["<!-- DEVFILE -->"]
            }))
            //.pipe(minifyHTML())
            .pipe(gulp.dest("www/"));

});

//gulp.task("default", ["jsLint", "jsHint", "dev-server"]);
gulp.task("default", ["dev-server"]);
//gulp.task("compileCordova", ["compile", "cordovaDist"]);
