import angular from 'angular';
import _ from 'lodash';
import queryDef from './rtc_query_def';

   var module = angular.module('grafana.directives');
   module.directive('rtcBucketAgg', function() {
     return {
       templateUrl: 'public/plugins/inovia-insight/partials/bucket_agg.html',
       controller: 'RtcBucketAggCtrl',
       restrict: 'E',
       scope: {
         target: "=",
         index: "=",
         getStores: "&",
         onChange: "&",
         getFields: "&",
       }
     };
   });
    module.controller('RtcBucketAggCtrl', function($scope, uiSegmentSrv, $q, $rootScope) {
      var bucketAggs = $scope.target.groupBys;

      $scope.bucketAggTypes = queryDef.bucketAggTypes;


      $rootScope.onAppEvent('rtc-query-updated', function() {
        $scope.validateModel();
      }, $scope);

      $scope.init = function() {
        $scope.by = bucketAggs[$scope.index];
        $scope.validateModel();
      };

      $scope.onFieldChanged = function() {
        $scope.validateModel();
        $scope.onChange();
      };

      $scope.onTypeChanged = function() {
        $scope.validateModel();
        $scope.onChange();
      };

      $scope.validateModel = function() {
        $scope.index = _.indexOf(bucketAggs, $scope.by);
        $scope.isFirst = $scope.index === 0;
        $scope.isLast = $scope.index === bucketAggs.length - 1;


        switch($scope.by.type) {
          case 'Time': {
            $scope.requiresField = false;
            $scope.requiresInterval = true;
            if(!$scope.by.interval||$scope.by.interval==""){
              $scope.by.interval = "1DAY";
            }
            break;
          }
          case 'Field': {
            $scope.by.field = $scope.by.field || '_time';
            $scope.requiresField = true;
            $scope.requiresInterval = true;
            var f = _.findWhere($scope.target.fields, {name: $scope.by.field});
            if(f.type == "string"){
              $scope.requiresInterval = false;
            }else if(f.type == "date"){
              if(!$scope.by.interval||$scope.by.interval==""){
                $scope.by.interval = "1DAY";
              }
            }else{
              if(/\d*\w+/.test($scope.by.interval)){
                $scope.by.interval = "";
              }
            }
            break;
          }

        }
        return true;
      };



      $scope.addBucketAgg = function() {
        // if last is date histogram add it before
        var lastBucket = bucketAggs[bucketAggs.length - 1];
        var addIndex = bucketAggs.length - 1;

        var id = _.reduce($scope.target.groupBys.concat($scope.target.metrics), function(max, val) {
          return parseInt(val.id) > max ? parseInt(val.id) : max;
        }, 0);

        bucketAggs.splice(addIndex, 0, {type: "time", field: "_time", id: (id+1).toString(), interval: "1DAY"});
        $scope.onChange();
      };

      $scope.removeBucketAgg = function() {
        bucketAggs.splice($scope.index, 1);
        $scope.onChange();
      };

      $scope.init();

    });

