nf2.factory('TrainingService', function ($rootScope, $http, $q, UserService) {

    var service = {};

    /**
     * @description Return true if the User is part of the staff (Trainer)
     * @returns {Array|Object}
     */
    service.isStaff = function () {
        var staff = JSON.parse(localStorage.getItem('staff'));
        if (staff) {
            return staff.is_staff;
        } else {
            return false;
        }

    };

    /**
     * @description Return the info of the current trainee in the offline community training
     * @returns {Array|Object}
     */
    service.getCurrentTrainee = function () {
        return JSON.parse(localStorage.getItem('current_trainee'));
    };

    /**
     * @description Save the info of the current trainee
     * @param {type} data
     * @returns {undefined}
     */
    service.saveCurrentTrainee = function (data, is_staff) {
        localStorage.setItem("current_trainee", JSON.stringify(data));
        var staff = JSON.parse(localStorage.getItem('staff'));
        if (is_staff) {
            //Update de advance for the staff member
            UserService.setAvance(staff.advance);
        } else {
            //Update de advance for the selected trainee
            UserService.setAvance(data.advance);
        }
        staff.is_active = is_staff;
        localStorage.setItem("staff", JSON.stringify(staff));
        $rootScope.$broadcast('traineeUpdated', data);
    };

    /**
     * @description Return all trainees registred in the offline community training
     * @returns {Array|Object}
     */
    service.getAllTrainees = function () {
        return JSON.parse(localStorage.getItem('trainees'));
    };


    /**
     * @description Save/Update all trainees of the offline community training
     * @param {type} data
     * @returns {Array|Object}
     */
    service.saveAllTrainees = function (data) {
        localStorage.setItem("trainees", JSON.stringify(data));
    };

    /**
     * @description Return true if the any Trainee is active
     * @returns {Array|Object}
     */
    service.isTraineeActive = function () {
        var staff = JSON.parse(localStorage.getItem('staff'));
        if (staff) {
            return !staff.is_active;
        } else {
            return false;
        }

    };

    /**
     * @description Save the advance of the trainee in cache
     * @returns {undefined}
     */
    service.saveTraineeAdvance = function (advance) {
        var trainees = service.getAllTrainees();
        var current_trainee = service.getCurrentTrainee();
        for (var t in trainees) {
            if (trainees[t]['document'] === current_trainee.document) {
                trainees[t]['advance'].push(advance);
                UserService.setAvance(trainees[t]['advance']);
            }
        }
        service.saveAllTrainees(trainees);
        $rootScope.$broadcast('avanceSaved');
    };

    /**
     * 
     * @returns {undefined}
     */
    service.sinchronizeTraining = function () {

        service.synchronizeTrainees();


    };

    /**
     * 
     * @returns {$q@call;defer.promise}
     */
    service.synchronizeTrainees = function () {
        var trainees = service.getAllTrainees();

        var deferred = $q.defer();
        var promises = [];
        for (var trainee in trainees) {

            var temp_trainee = trainees[trainee];
            var data = {
                temp_id: trainee,
                name: temp_trainee.name,
                document: temp_trainee.document
            };

            if (!temp_trainee.synchronized) {
                promises.push(
                        $http({
                            method: 'POST',
                            url: $rootScope.BASE_URL + 'api/trainees/',
                            data: data
                        }).
                        then(function successCallback(response) {
                            trainees[response.config.data.temp_id].synchronized = true;
                            trainees[response.config.data.temp_id].id = response.data.id;

                        }, function errorCallback(response) {
                            console.log(response);
                        }));
            }
        }

        $q.all(promises).then(function (res) {
            deferred.resolve();
            service.saveAllTrainees(trainees);
            console.log('Trainees Synchronized');
            service.synchronizeTraineesAdvance();

        });
        return deferred.promise;
    };

    service.synchronizeTraineesAdvance = function () {

        var trainees = service.getAllTrainees();

        var deferred = $q.defer();
        var promises = [];
        for (var trainee in trainees) {
            var temp_trainee = trainees[trainee];
            for (var advance in temp_trainee.advance) {
                var temp_advance = temp_trainee.advance[advance];
                var data = {
                    temp_id_user: trainee,
                    temp_id_advance: advance,
                    trainee: temp_trainee.id,
                    capacitation: temp_advance.capacitacion,
                    module: temp_advance.modulo,
                    lesson: temp_advance.leccion
                };

                if (!temp_advance.synchronized) {
                    promises.push(
                            $http({
                                method: 'POST',
                                url: $rootScope.BASE_URL + 'api/trainee-advance/',
                                data: data
                            }).
                            then(function successCallback(response) {
                                trainees[response.config.data.temp_id_user].advance[response.config.data.temp_id_advance].synchronized = true;

                            }, function errorCallback(response) {
                                console.log(response);
                            }));
                }
            }
        }

        $q.all(promises).then(function (res) {
            deferred.resolve();
            service.saveAllTrainees(trainees);
            console.log('Trainees Advance Synchronized');
            $rootScope.$broadcast('synchronizeTrainingFinished');

        });
        return deferred.promise;

    };

    return service;
});