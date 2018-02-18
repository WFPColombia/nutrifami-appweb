/*
 * Configuración de angular para la aplicación Web de nutrifami
 */
var dependencies = ['ui.router', 'satellizer', 'ngCookies', 'ngAudio', 'ngTouch', 'bsLoadingOverlay', 'ui.bootstrap', 'ngAnimate', '720kb.socialshare'];
'use strict';

var nf2 = angular.module('nf2App', dependencies);

nf2.run(function ($rootScope, $location, bsLoadingOverlayService, CapacitationService) {

    console.log('run');
    
    

    $rootScope.BASE_URL = 'http://usuarios.nutrifami.org/';
    $rootScope.TARGETPATH = "https://s3.amazonaws.com/nutrifami/";
    $rootScope.ASSETPATH = "https://s3.amazonaws.com/nutrifami/training/images/";
    $rootScope.ASSETPATH_AUDIOS = "https://s3.amazonaws.com/nutrifami/training/audios/";

    if ($location.$$host === 'localhost' || $location.$$host === '127.0.0.1') {
        console.log('is local!!');
        $rootScope.BASE_URL = 'http://localhost:8000/';
    }

    $rootScope.globals = JSON.parse(localStorage.getItem('globals')) || {};
    // Redirecciona a la pagina de auth si el usuario no está logeado e intenta ir a una página no autorizada

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        console.log('$locationChangeStart');
        // redirect to login page if not logged in
        if (!$rootScope.globals.currentUser) {
            var url = $location.path().substring(0, 5); // Tomamos los primeros 5 caracteres para hacer la validadción de las paginas
            if (url !== '/auth') {
                $location.path('/auth');
            }
        }
    });

    bsLoadingOverlayService.setGlobalConfig({
        templateUrl: 'template/loading-overlay.html'
    });
    
    CapacitationService.initClient();    
    
    /*
     
     nutrifami.getSessionId();
     
     
     if ($rootScope.globals.currentUser) {
     //$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
     
     }
     
     $rootScope.$on('$locationChangeStart', function (event, next, current) {
     // redirect to login page if not logged in
     if ($location.path() !== '/terminos-y-condiciones' && $location.path() !== '/login' && !$rootScope.globals.currentUser) {
     $location.path('/');
     }
     });*/
});

nf2.config(function ($authProvider, $stateProvider, $urlRouterProvider) {

    var commonConfig = {
        // Popup should expand to full screen with no location bar/toolbar.
        popupOptions: {
            location: 'no',
            toolbar: 'no',
            width: window.screen.width,
            height: window.screen.height
        }
    };

    // Change the platform and redirectUri only if we're on mobile
    // so that development on browser can still work. 

    $authProvider.loginUrl = 'http://usuarios.nutrifami.org/api/token-auth/';
    $authProvider.signupUrl = 'http://usuarios.nutrifami.org/api/create-user/';

    // $authProvider.loginUrl = 'http://localhost:8000/api/token-auth/';
    // $authProvider.signupUrl = 'http://localhost:8000/api/create-user/';
    
    // Configure Facebook login.
    $authProvider.facebook(angular.extend({}, commonConfig, {
        clientId: '126883721233688',
        url: 'http://usuarios.nutrifami.org/api/login/social/token_user/facebook',
        responseType: 'token'
    }));


    $authProvider.google({
        url: "http://usuarios.nutrifami.org/api/login/social/token_user/google-oauth2",
        clientId: '898085701705-07ja94k2e3r3b81oqg2baih6q63ih8i3.apps.googleusercontent.com',
        redirectUri: "http://usuarios.nutrifami.org/"
    });

    $authProvider.tokenType = 'Token';

    $stateProvider.state('auth', {
        url: '/auth',
        //cache: false,
        templateUrl: 'src/auth_home/auth_home.html',
        controller: 'AuthHomeCtrl'
    });

    $stateProvider.state('password', {
        url: '/auth/password',
        cache: false,
        templateUrl: 'src/auth_password/auth_password.html',
        controller: 'AuthPasswordCtrl'
    });

    $stateProvider.state('auth_signup', {
        url: '/auth/signup',
        cache: false,
        templateUrl: 'src/auth_signup/auth_signup.html',
        controller: 'AuthSignupCtrl'
    });

    $stateProvider.state('nf', {
        url: '/nf',
        abstract: true,
        templateUrl: 'src/nav/nav.html',
        controller: 'NavCtrl'
    });

    $stateProvider.state('nf.cap_home', {
        url: '/',
        cache: false,
        views: {
            content: {
                templateUrl: 'src/cap_home/cap_home.html',
                controller: 'CapHomeCtrl'
            }
        }
    });

    $stateProvider.state('nf.cap_capacitation', {
        url: '/:capacitation',
        cache: false,
        views: {
            content: {
                templateUrl: 'src/cap_capacitation/cap_capacitation.html',
                controller: 'CapCapacitationCtrl'
            }
        }
    });

    $stateProvider.state('nf.cap_module', {
        url: '/:capacitation/:module',
        cache: false,
        views: {
            content: {
                templateUrl: 'src/cap_module/cap_module.html',
                controller: 'CapModuleCtrl'
            }
        }
    });

    $stateProvider.state('nf.cap_unit', {
        url: '/:capacitation/:module/:lesson/:unit',
        cache: false,
        views: {
            content: {
                templateUrl: 'src/cap_unit/cap_unit.html',
                controller: 'CapUnitCtrl'
            }
        }
    });

    $stateProvider.state('nf.cap_unit_end', {
        url: '/:capacitation/:module/:lesson/:unit/end',
        cache: false,
        views: {
            content: {
                templateUrl: 'src/cap_unit_end/cap_unit_end.html',
                controller: 'CapUnitEndCtrl'
            }
        }
    });

    $stateProvider.state('nf.auth_profile', {
        url: '/profile',
        cache: false,
        views: {
            content: {
                templateUrl: 'src/auth_profile/auth_profile.html',
                controller: 'AuthProfileCtrl'
            }
        }
    });

    $stateProvider.state('nf.auth_profile_edit', {
        url: '/profile/edit',
        cache: false,
        views: {
            content: {
                templateUrl: 'src/auth_profile_edit/auth_profile_edit.html',
                controller: 'AuthProfileEditCtrl'
            }
        }
    });
    
    $stateProvider.state('nf.progress', {
        url: '/progress',
        cache: false,
        views: {
            content: {
                templateUrl: 'src/progress/progress.html',
                controller: 'ProgressCtrl'
            }
        }
    });
    
    $stateProvider.state('nf.shopping_intro', {
        url: '/shopping/intro',
        cache: false,
        views: {
            content: {
                templateUrl: 'src/shopping_intro/shopping_intro.html',
                controller: 'ShoppingIntroCtrl'
            }
        }
    });
    
    $stateProvider.state('nf.shopping_home', {
        url: '/shopping/home',
        cache: false,
        views: {
            content: {
                templateUrl: 'src/shopping_home/shopping_home.html',
                controller: 'ShoppingHomeCtrl'
            }
        }
    });
    
    $stateProvider.state('nf.shopping_group', {
        url: '/shopping/group',
        cache: false,
        views: {
            content: {
                templateUrl: 'src/shopping_group/shopping_group.html',
                controller: 'ShoppingGroupCtrl'
            }
        }
    });
    
    $stateProvider.state('nf.about', {
        url: '/about',
        cache: false,
        views: {
            content: {
                templateUrl: 'src/about/about.html',
            }
        }
    });   

    $urlRouterProvider.otherwise('/nf/');
});
