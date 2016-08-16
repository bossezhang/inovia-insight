import angular from 'angular';
import _ from 'lodash';
import moment from 'moment';
import queryDef from './rtc_query_def';
import RtcQueryBuilder from './rtc_query_builder';
import RtcResponse from './rtc_response';
export function RtcDatasource(instanceSettings, $q, backendSrv, templateSrv) {
  var self = this;
  this.basicAuth = instanceSettings.basicAuth;
  this.withCredentials = instanceSettings.withCredentials;
  this.url = instanceSettings.url;
  this.name = instanceSettings.name;
  this.$q = $q;
  this.backendSrv = backendSrv;
  this.templateSrv = templateSrv;
  this.queryBuilder = new RtcQueryBuilder();
  //this.getInitMappings = function() {
  //  this._get('metadata/stores').then(function (data) {
  //    return {stores: data, mapping: {}};
  //  });
  //}

  this._request = function (method, url, data) {
    var options = {
      url: this.url + "/" + url,
      method: method,
      data: data
    };

    //if (this.basicAuth || this.withCredentials) {
    //  options.withCredentials = true;
    //}
    //if (this.basicAuth) {
    //  options.headers = {
    //    "Authorization": this.basicAuth
    //  };
    //}

    return backendSrv.datasourceRequest(options);
  }
  this._get = function (url) {
    return this._request('GET', url).then(function (results) {
      results.data.$$config = results.config;
      return results.data;
    });
  }

  this._post = function (url, data) {
    return this._request('POST', url, data).then(function (results) {
      results.data.$$config = results.config;
      return results.data;
    });
  }
  this.mappings = {stores: [], mapping: {}, fields:{}};
  this._request('GET','metadata/stores')
    .then(function(data)
    {
      self.mappings.stores = data.data
    });

  this.getStores = function(){
    //if(self.mappings.stores.length === 0){
    //  self.mappings.stores = this._get('metadata/stores').then(function (data) {
    //    return data;
    //  });
    //}

      var d = self.$q.defer();
      d.resolve(self.mappings.stores);
      return d.promise;

  };

  this.annotationQuery = function (options) {
    return [];
  };
  this.testDatasource = function () {
    return this._get('metadata/stores').then(function (data) {
      //self.mappings.stores = data.data;
      return {status: "success", message: "Data source is working", title: "Success"};
    }, function (err) {
      if (err.data && err.data.error) {
        return {status: "error", message: angular.toJson(err.data.error), title: "Error"};
      } else {
        return {status: "error", message: err.status, title: "Error"};
      }
    });
  };
  this.getMapping = function(store){
    if(!store || store === ""){
        var d = self.$q.defer();
        d.resolve([]);
        return d.promise;
    }
    //if(self.mappings.stores.length === 0 ){
    //  self.mappings.stores = this.getStores();
    //}

    if(self.mappings.mapping[store]){
        var d = self.$q.defer();
        d.resolve(self.mappings.mapping[store]);
        return d.promise;
    }
    return this._get('metadata/storeMappings/'+store).then(function(res) {
      var mp = [];
      var fields = {};
      var typeMap = {
        'float': 'number',
        'double': 'number',
        'integer': 'number',
        'long': 'number',
        'date': 'date',
        'string': 'string',
        'boolean': 'string'
      };
      for(var fieldName in res[store].sourceAsMap.properties){
        var type = res[store].sourceAsMap.properties[fieldName].type;
        mp.push({name: fieldName, type: typeMap[type]});
        fields[fieldName] = type;
      }
      self.mappings.mapping[store] = mp;
      self.mappings.fields[store] = fields;
      return mp;
    });
  }
  this.query = function(options) {
  var payload = "";
  var target;
  var sentTargets = [];
  var reqs = [];

  for (var i = 0; i < options.targets.length; i++) {
    target = options.targets[i];
    if (target.hide) {continue;}

    var queryObj = this.queryBuilder.build(target, options.range.from, options.range.to, this.mappings);
    if(!queryObj) continue;
    var queryJson = angular.toJson(queryObj);

    sentTargets.push(target);
    reqs.push(this._post('query/aggregation', queryJson));

  }

  if (sentTargets.length === 0) {
    return $q.when([]);//this.$q.when([]);
  }

 return (Promise.all(reqs).then(function(resps){
   return new RtcResponse(sentTargets, resps).parseAll();
    }));
  }

}


