///<reference path="./common.d.ts" />

import  './rtc_bucket_agg';
import  './rtc_metric_agg';

import angular from 'angular';
import _ from 'lodash';
import queryDef from './rtc_query_def';



export class RtcQueryCtrl {
  static templateUrl = 'partials/query.editor.html';

  rawQueryOld: string;
  target: any;
  datasource: any;
  panelCtrl: any;
  panel: any;
  hasRawMode: boolean;
  error: string;
  /** @ngInject **/
  constructor($scope, $injector, private $rootScope, private $timeout, private uiSegmentSrv) {
    this.panel = this.panelCtrl.panel;
    if(!this.target.store){
      this.target.store = "";
    }
    if(this.target.store!=""){
      this.getFields(this.target.store).then(function(data)
      {
        this.target.fields = data;
      });
    }
    this.queryUpdated();
  }
  refresh() {
    this.panelCtrl.refresh();
  }
  getStores(){
    return this.datasource.getStores();
      //.then(this.uiSegmentSrv.transformToSegments(false))
      //.catch(this.handleQueryError.bind(this));
  }

  getFields(store) {
    if(!store){
      store = this.target.store;
    }
    return this.datasource.getMapping(store)
    //.then(this.uiSegmentSrv.transformToSegments(false))
    //.catch(this.handleQueryError.bind(this));
  }
  changeStore(store){
    this.target.store = store;
  }

  queryUpdated() {
    var newJson = angular.toJson(this.datasource.queryBuilder.build(this.target,"","",this.datasource.mappings), true);
    if (newJson !== this.rawQueryOld) {
      this.rawQueryOld = newJson;
      this.refresh();
    }

    this.$rootScope.appEvent('rtc-query-updated');
  }

  getCollapsedText() {
    //var metricAggs = this.target.metrics;
    //var bucketAggs = this.target.bucketAggs;
    //var metricAggTypes = queryDef.metricAggTypes;
    //var bucketAggTypes = queryDef.bucketAggTypes;
    //var text = '';
    //
    //if (this.target.query) {
    //  text += 'Query: ' + this.target.query + ', ';
    //}
    //
    //text += 'Metrics: ';
    //
    //_.each(metricAggs, (metric, index) => {
    //  var aggDef = _.findWhere(metricAggTypes, {value: metric.type});
    //  text += aggDef.text + '(';
    //  if (aggDef.requiresField) {
    //    text += metric.field;
    //  }
    //  text += '), ';
    //});
    //
    //_.each(bucketAggs, (bucketAgg, index) => {
    //  if (index === 0) {
    //    text += ' Group by: ';
    //  }
    //
    //  var aggDef = _.findWhere(bucketAggTypes, {value: bucketAgg.type});
    //  text += aggDef.text + '(';
    //  if (aggDef.requiresField) {
    //    text += bucketAgg.field;
    //  }
    //  text += '), ';
    //});
    //
    //if (this.target.alias) {
    //  text += 'Alias: ' + this.target.alias;
    //}

   // return text;
    return "TODO: Text";
  }

  handleQueryError(err) {
    this.error = err.message || 'Failed to issue metric query';
    return [];
  }
}
