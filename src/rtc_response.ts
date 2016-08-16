import _ from 'lodash';
import queryDef from './rtc_query_def';
import RtcAggResultParser from './rtc_agg_res_parser';
export default class RtcResponse{
  targets:any;
  response:any;
  constructor(targets, response) {
    this.targets = targets;
    this.response = response;
  }
  parseAll(){
    var seriesList = [];
    let groupByTime = this.checkGroupByTime(this.targets,this.response);

    for(var i in this.response){
      let target = this.targets[i];
      let res = this.response[i];
      if(groupByTime){
        this.parseTimeResult(target, res, seriesList);
      }else{
        this.parseDocs(target, res, seriesList);
      }
    }
    return {data:seriesList};
  }
  checkGroupByTime(targets,response){
    for(let i = 0; i< targets.length; i++){
      if(!targets[i].groupByTime)
      return false;
    }
    return true;
  }

  parseTimeResult(target, res, seriesList){
    let aggresParser = new RtcAggResultParser(res);
    var hiddenSeries  = this.getHiddenSeries(target);
    var groupNumber = target.groupBys.length;
    let groups = aggresParser.parseGrouping(groupNumber-1,1);
    var timepoints = this.getTimepoints(groups.rows);
    if(groupNumber ==1){
      this.putTimeDocs('',[],groups.rows,timepoints,groups.vals,seriesList,aggresParser,hiddenSeries);
    }else{
      for(let i = 0; i< groups.cols.length; i++){
        var col = groups.cols[i];
        let coltag = col.join('-') +"-";
        this.putTimeDocs(coltag,col,groups.rows,timepoints,groups.vals,seriesList,aggresParser,hiddenSeries);
      }
    }
  }

  getTimepoints(rows){
    var res = [];
    for (let i =0; i< rows.length; i++){
      let timestr = rows[i][0];
      res.push(Date.parse(timestr));
    }
    return res;
  }

  putTimeDocs(coltag,col,rows,timepoints,vals,seriesList,aggresParser,hiddenSeries){
    for(let i = 0; i< vals.length; i++){
      var val = vals[i];
      if(hiddenSeries[val[0]]) continue;
      let tag = coltag+ val.join("-");
      var newseries = { datapoints: [], target: tag}; // TODO make target unique
      for(let j = 0; j < rows.length; j++){
        let row = rows[j];
        let value = aggresParser.getData(col,row,val);
        if(value !== null){
          newseries.datapoints.push([value,timepoints[j]]);
        }
      }
      if(newseries.datapoints.length>0){
        seriesList.push(newseries);
      }
    }
  }

  parseDocs(target, res, seriesList){
    var docs = [];
    var hiddenSeries  = this.getHiddenSeries(target);
    var groupNumber = target.groupBys.length;
    let aggresParser = new RtcAggResultParser(res);
    let groups = aggresParser.parseGrouping(0,groupNumber);
    if(groupNumber === 0){
      this.putDocs({},[],aggresParser,groups.vals,docs,hiddenSeries);
    }else{
      for(let i=0; i< groups.rows.length; i++){
        let row = groups.rows[i];
        let rowobj = {};
        for(let j = 0; j< groupNumber; j++){
          rowobj[target.groupBys[j].field] = row[j];
        }
        this.putDocs(rowobj, row, aggresParser, groups.vals,docs,hiddenSeries);
      }
    }
    if (docs.length > 0) {
      seriesList.push({target: 'docs', type: 'docs', datapoints: docs});
    }
  }

  getHiddenSeries(target){
    var res = {};
    for(var i=0 ; i< target.metrics.length; i++){
      if(target.metrics[i].hide){
        res[target.metrics[i].name] = true;
      }
    }
    return res;
  }

  putDocs(rowobj, row, aggresParser, vals,docs,hiddenSeries){
    for(let i =0; i< vals.length; i++){
      let val = vals[i];
      if(hiddenSeries[val[0]]) continue;
      let valtag = vals.join('-');
      let value = aggresParser.getData([],row,val);
      if(value !== null){
        docs.push(Object.assign({},{series:valtag, val: value}, rowobj));
      }
    }
  }



}
