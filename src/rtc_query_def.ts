
export default class rtc_query_def{

    static metricAggTypes = [
      {text: "CNT", value: 'CNT', requiresField: true},
      {text: "AVG", value: 'AVG', requiresField: true},
      {text: "SUM", value: 'SUM', requiresField: true},
      {text: "MAX", value: 'MAX', requiresField: true},
      {text: "MIN", value: 'MIN', requiresField: true},
      {text: "SSQ", value: 'SSQ', requiresField: true},
      {text: "STD", value: 'STD', requiresField: true},
      {text: "VAR", value: "VAR", requiresField: true},
      {text: "UNIQUE", value: 'UNIQUE', requiresField: true},
      {text: "PERCENTILE", value: 'PERCENTILE', requiresField: true, supportsInlineScript: true},
      {text: "RANK_PERCENTILE", value: "RANK_PERCENTILE", requiresField: true, supportsInlineScript: true},
      {text: "FORMULAR", value: 'FORMULAR', requiresField: false, supportsInlineScript: true}//,
    //  {text: "Raw Field", value: "raw_document", requiresField: true},
    //  {text: "Raw Document", value: "raw_document", requiresField: false}
    ];

  static bucketAggTypes = [
      {text: "Field", value: 'field', requiresField: true},
      {text: "Time", value: 'time'},
    ];

  static orderByOptions=[
      {text: "Doc Count", value: '_count'},
      {text: "Term value", value: '_term'},
    ];

  static orderOptions= [
      {text: "Top", value: 'desc'},
      {text: "Bottom", value: 'asc'},
    ];

  static timezones = ["Etc/UTC","America/Los_Angeles","America/Chicago","America/Montreal","Asia/Shanghai","Europe/London", "Europe/Berlin","Europe/Stockholm","Europe/Helsinki","Asia/Istanbul", "Asia/Tokyo"];
  static intervalOptions= [
      {text: 'auto', value: 'auto'},
      {text: '10s', value: '10s'},
      {text: '1m', value: '1m'},
      {text: '5m', value: '5m'},
      {text: '10m', value: '10m'},
      {text: '20m', value: '20m'},
      {text: '1h', value: '1h'},
      {text: '1d', value: '1d'},
    ];

  static describeMetric= function (metric) {
  return metric.type + ' ' + metric.field;
};

}


