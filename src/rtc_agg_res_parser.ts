class groupStruct{
  _res:any;
  constructor(){
    this._res = {};
  }
  push(data){
    if (!data) return;
    var darray;
    if (data.constructor !== Array) {
      darray = [data];
    } else {
      darray = data;
    }
    this.pushIn(this._res, darray);
  }
  pushIn(res,data){
    if (data.length == 0) return;
    if (data.length == 1) {
      if (!res[data[0]]) {
        res[data[0]] = {};
      }
    } else {
      if (!res[data[0]]) {
        res[data[0]] = {};
      }
      this.pushIn(res[data[0]], data.slice(1));
    }
  }
  toMap(){
    return this._res;
  }
  toArrays(){
    var result = [];
    this.toArrayFunction(this._res, [], result);
    return result;
  }
  toArrayFunction(data, prev, result) {
    if (this.isEmpty(data)) {
      //if(!isEmpty(prev))
      result.push(prev);
    } else {
      for (var val in data) {
        var np = [];
        var rl = this.toArrayFunction(data[val], np.concat(prev).concat(val), result);
      }
    }
  }
  isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
    }
    return true;
  }
}

export default class RtcAggResultParser{
  _res:any;
  _rcv:any;
  constructor(data){
    this._res = data.values;
    this._rcv = {
      cols:[[]],
      rows:[[]],
      vals:[[]],
      colNumber:0,
      rowNumber:0
    };
  }
  parseGrouping(cols, rows) {
    if(this._rcv.colNumber === cols && this._rcv.rowNumber === rows) return this._rcv;
    var groupStr = {
      cols: new groupStruct(),
      rows: new groupStruct(),
      vals: new groupStruct()
    };
    this.parseGroupings(this._res, [], groupStr, cols, rows + cols);
    this._rcv = {
      cols: groupStr.cols.toArrays(),
      rows: groupStr.rows.toArrays(),
      vals: groupStr.vals.toArrays(),
      colNumber:cols,
      rowNumber:rows
    }
    return this._rcv;
  }
  parseGroupings(data, prev, groupStr, cols, rows) {
    if (typeof data !== 'object') {
      return this.pushIn(prev, groupStr, cols, rows);
    } else {
      var np = [];
      for (var val in data) {
        var rl = this.parseGroupings(data[val], np.concat(prev).concat(val), groupStr, cols, rows);
      }
    }
  }

  pushIn(arrayData, groupStr, cols, rows) {
    groupStr.cols.push(arrayData.slice(0, cols));
    groupStr.rows.push(arrayData.slice(cols, rows));
    groupStr.vals.push(arrayData.slice(rows));
  }
  getData(col, row, val) {
    let current = this._res;
    for (var c in col) {
      current = current[col[c]];
      if (!current) return null;
    }
    for (var c in row) {
      current = current[row[c]];
      if (!current) return null;
    }
    for (var c in val) {
      current = current[val[c]];
      if (!current) return null;
    }
    return current
  }

}
