require('./style/index.less');

import 'angular-ui-router';
import HomeCtrl from './controller/Home';
import LoginCtrl from './controller/Login';
import RegisterCtrl from './controller/Register';
import LoginSvc from './service/Login';

import directiveModule from './directive/index';

angular
    .module('touriends', ['ui.router', directiveModule.name])
    .controller('HomeCtrl', HomeCtrl)
    .controller('LoginCtrl', LoginCtrl)
    .controller('RegisterCtrl', RegisterCtrl)
    .service('LoginSvc', LoginSvc)
    .config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
        $stateProvider.state({
            abstract: true,
            name: 'authful',
            resolve: {
                auth: ['$q', '$state', '$timeout', 'LoginSvc', ($q, $state, $timeout, LoginSvc) => {
                    if (LoginSvc.logged) {
                        return $q.when();
                    }
                    else {
                        $timeout(() => {
                            $state.go('login');
                        });

                        return $q.reject();
                    }
                }]
            }
        }).state({
            abstract: true,
            name: 'authless',
            resolve: {
                auth: ['$q', '$state', '$timeout', 'LoginSvc', ($q, $state, $timeout, LoginSvc) => {
                    if (!LoginSvc.logged) {
                        return $q.when();
                    }
                    else {
                        $timeout(() => {
                            $state.go('home');
                        });

                        return $q.reject();
                    }
                }]
            }
        }).state({
            url: '/login',
            name: 'login',
            parent: 'authless',
            template: require('./template/login.html')
        }).state({
            url: '/register',
            name: 'register',
            parent: 'authless',
            template: require('./template/register.html')
        }).state({
            url: '/home',
            name: 'home',
            parent: 'authful',
            template: require('./template/home.html')
        });

        $urlRouterProvider.otherwise('/login');
    }])
    .config(['$httpProvider', ($httpProvider) => {
        $httpProvider.defaults.headers.post = {'Content-Type': 'application/x-www-form-urlencoded'};
        $httpProvider.defaults.paramSerializer = '$httpParamSerializerJQLike';
    }]);