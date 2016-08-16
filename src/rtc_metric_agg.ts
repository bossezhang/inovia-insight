import angular from 'angular';
import _ from 'lodash';
import queryDef from './rtc_query_def';

    var module = angular.module('grafana.directives');

    module.directive('rtcMetricAgg', function() {
      return {
        templateUrl: 'public/plugins/inovia-insight/partials/metric_agg.html',
        controller: 'RtcMetricAggCtrl',
        restrict: 'E',
        scope: {
          target: "=",
          index: "=",
          getStores: "&",
          onChange: "&",
          getFields: "&",
       //   esVersion: '='
        }
      };
    });

    module.controller('RtcMetricAggCtrl', function($scope, uiSegmentSrv, $q, $rootScope) {
      var metricAggs = $scope.target.metrics;

      $scope.metricAggTypes = queryDef.metricAggTypes;


      $scope.init = function() {
        $scope.agg = metricAggs[$scope.index];
        $scope.getStores().then(function(data){$scope.stores = data});
        $scope.changeStore();
        $scope.validateModel();

      };

      $scope.changeStore = function() {
        $scope.target.store = $scope.agg.store;
        $scope.getFields({$store: $scope.target.store})
          .then(function (data) {
            $scope.fields = data;
            $scope.target.fields = data;
          });

      };
      $scope.changeType = function() {
        $scope.validateModel();
      };
      $scope.getStoresInternal = function() {
        return $scope.getStores();
      };

      $rootScope.onAppEvent('rtc-query-updated', function() {
        $scope.index = _.indexOf(metricAggs, $scope.agg);
        $scope.validateModel();
      }, $scope);

      $scope.validateModel = function() {
        $scope.isFirst = $scope.index === 0;
        $scope.isSingle = metricAggs.length === 1;
        //$scope.settingsLinkText = '';
        $scope.aggDef = _.findWhere($scope.metricAggTypes, {value: $scope.agg.type});

        $scope.agg.store = $scope.agg.store || "";
        //$scope.fields =
        if (!$scope.agg.field) {
          $scope.agg.field = '';
        }

        switch($scope.agg.type) {
          case 'PERCENTILE': {
            if(!$scope.agg.formula||$scope.agg.formula === ''){
              $scope.agg.formula = '25,50,75,95,99';
            }
            break;
          }
          case 'RANK_PERCENTILE': {
            if(!$scope.agg.formula||$scope.agg.formula === ''){
              $scope.agg.formula = '1000,2000';
            }
            break;
          }
          case 'FORMULAR': {
            if(!$scope.agg.formula||$scope.agg.formula === ''){
              $scope.agg.formula = 'CNT{[_time]}';
            }
            break;
          }
        }

      };


      $scope.addMetricAgg = function() {
        var addIndex = metricAggs.length;

        var id = _.reduce($scope.target.groupBys.concat($scope.target.metrics), function(max, val) {
          return parseInt(val.id) > max ? parseInt(val.id) : max;
        }, 0);

        metricAggs.splice(addIndex, 0, {name: "s"+(id+1), store:$scope.target.store ,type: "CNT", field: "_time", id: (id+1).toString()});
        $scope.onChange();
      };

      $scope.removeMetricAgg = function() {
        metricAggs.splice($scope.index, 1);
        $scope.onChange();
      };

      $scope.toggleShowMetric = function() {
        $scope.agg.hide = !$scope.agg.hide;
        if (!$scope.agg.hide) {
          delete $scope.agg.hide;
        }
        $scope.onChange();
      };

      $scope.init();

    });

