import {RtcDatasource} from './rtc_datasource';
import {RtcQueryCtrl} from './rtc_query_ctrl';


class RtcQueryOptionsCtrl {
  static templateUrl = 'partials/query.options.html';
}

class RtcAnnotationsQueryCtrl {
  static templateUrl = 'partials/annotations.editor.html';
}

class RtcConfigCtrl {
  static templateUrl = 'partials/config.html';
}


export {
  RtcDatasource as Datasource,
  RtcQueryCtrl as QueryCtrl,
  RtcConfigCtrl as ConfigCtrl,
  RtcQueryOptionsCtrl as QueryOptionsCtrl,
  RtcAnnotationsQueryCtrl as AnnotationsQueryCtrl,
};
