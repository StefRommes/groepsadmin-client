(function() {
  'use strict';

  angular
    .module('ga.services.alert', [])
    .factory('AlertService', AlertService);

  AlertService.$inject = ['$rootScope', '$timeout'];

  function AlertService($rootScope, $timeout) {
    $rootScope.alerts = [];

    return {
      add: function(type, error, timeout, suggesties) {

        var msg;
        if (error.data && error.data.beschrijving) {
          msg = error.data.beschrijving;
        } else if (error.statusText) {
          msg = "Error " + error.status + " - " + error.statusText;
        } else {
          msg = error;
        }

        var alert = {
          'type': type,
          'msg': msg,
          'suggesties': suggesties,
          'hash': type + msg + _.map(suggesties, _.property('id')).join(),
          'close': function() {
            var index = $rootScope.alerts.indexOf(alert);
            if (0 <= index) {
              $rootScope.alerts.splice(index, 1);
            }
          }
        };

        console.log(alert);

        if (_.findIndex($rootScope.alerts, {'hash': alert.hash}) < 0) {
          $rootScope.alerts.push(alert);
        }

        if (timeout) {
          $timeout(function(){
            alert.close();
          }, timeout);
        }
      }
    };
  };
})();
