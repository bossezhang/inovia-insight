import queryDef from './rtc_query_def';

export default class RtcQueryBuilder {
  self: any;
  constructor(){
    this.self = this;
  }
  isvalidMetrics(metrics){
    if(!metrics.store) return false;
    if(metrics.store == "" || metrics.type == ""){
      return false;
    }
    return true;
  }
  build(target,from,to, mappings, datasource) {
    // make sure query has defaults;
    target.metrics = target.metrics || [{ name:"s1", store: "", type: 'CNT', field: '_time', id: '1' }];
    target.groupBys = target.groupBys || [{type:"time", field:"_time", interval: "1DAY"}];
    var groupBy  = [];
    var aggQueries = [];
    var store;
    for (let i = 0; i < target.metrics.length; i++) {
      var metric = target.metrics[i];
      store = metric.store;
      //if(metric.hide) continue;
      if (metric.type === 'FORMULAR') {
        aggQueries.push({
          name: metric.name,
          datastore: metric.store,
          formula: metric.formula
        })
      } else if( metric.type === 'PERCENTILE' || metric.type == 'RANK_PERCENTILE'){
        var values = metric.formula.split(",").map((part)=>{ return parseFloat(part)});
        //TODO
        aggQueries.push({
          name: metric.name,
          datastore: metric.store,
          aggregation : metric.type,
          field: metric.field,
          values: values
        })
      } else{
        aggQueries.push({
          name: metric.name,
          datastore: metric.store,
          aggregation : metric.type,
          field: metric.field
        })
      }
    }
    if(store === "") return null;
    var groupByTime;
    var fields = mappings.fields[store];
    for (let i = 0; i < target.groupBys.length; i++) {

      var aggDef = target.groupBys[i];

      switch(aggDef.type) {
        case 'Time': {
          groupByTime = {field:"_time", interval: aggDef.interval};
          break;
        }
        case 'Field': {
          if(aggDef.field === "_time" || fields[aggDef.field] === 'date' ){
            groupByTime = {field:aggDef.field, interval: aggDef.interval};
          }else if(fields[aggDef.field] === 'string' || !aggDef.interval || aggDef.interval == "") {
            groupBy.push({field:aggDef.field});
          } else{
            groupBy.push({field:aggDef.field, interval: aggDef.interval});
          }
          break;
        }
      }
    }
    if(groupByTime){
      groupBy.push(groupByTime);
      target.groupByTime = true;
    } else{
      target.groupByTime = false;
    }
    var aggQueries = [];
    for (let i = 0; i < target.metrics.length; i++) {
      metric = target.metrics[i];
      //if(metric.hide) continue;
      if (metric.type === 'FORMULAR') {
        aggQueries.push({
          name: metric.name,
          datastore: metric.store,
          formula: metric.formula
        })
      } else if( metric.type === 'PERCENTILE' || metric.type == 'RANK_PERCENTILE'){
        var values = metric.formula.split(",").map((part)=>{ return parseFloat(part)});
        //TODO
        aggQueries.push({
          name: metric.name,
          datastore: metric.store,
          aggregation : metric.type,
          field: metric.field,
          values: values
        })
      } else{
        aggQueries.push({
          name: metric.name,
          datastore: metric.store,
          aggregation : metric.type,
          field: metric.field
        })
      }
    }



    return {
      groupBy: groupBy,
      queries: aggQueries,
      filter: {
        logic:"AND",
        filters:[
          {
            field:"_time",
            operator:"gte",
            value: from.valueOf()
          },
          {
            field:"_time",
            operator:"lte",
            value: to.valueOf()
          }
        ]
      }
    };

  }

}
