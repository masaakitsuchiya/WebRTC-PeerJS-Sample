'use strict';

// getUserMediaを使ったカメラテストの結果テーブル
var CameraResultView = Backbone.View.extend({
  el: "#camera-list",
  initialize: function (args) {
    this.config = args.config;
    this.tracker = args.tracker;
    this.you = args.you;

    this.render();
  },
  events: {
    'click #camera-test-result-select': 'submit'
  },
  submit: function(e) {
    e.preventDefault();
    this.you.set('size_id',$('input[name="camera-select"]:checked').val())
  },
  getTestData: function() {
    // configからテストデータ抽出
    let testData = [];
    let cameraId = this.you.get('camera_id');
    _.each(this.config.get('video_sizes'),function(size) {
      let data = {
        'id': size.id,
        'size': size.label,
        'width': size.width,
        'height': size.height,
        'result': false
      };
      if (!_.isEmpty(cameraId)) {
        data['camera_id'] = cameraId;
      }
      testData.push(data);
    });
    return testData;
  },
  reciveResult: function(output) {
    if (!_.isEmpty(output)) {
      $('#camera-test-result-table').append('<tr class="test-result ' + (output['result']?'bg-info':'bg-danger') + '">' +
          '<td class="text-center"><input type="radio" name="camera-select" id="camera-size-radio-' + output['id'] + '" value=" ' + output['id'] + '" />' +
          '<td class="text-center">' + output['size'] + '</td>' +
          '<td class="text-center">' + (output['result']?'OK':'NG') + '</td>' +
        '</tr>'
      );
    }
    if (!_.isEmpty(this.you.get('camera_id'))) {
      $('#now-camera-id').text('Camera Id:' + this.you.get('camera_id'));
    }
  },
  render: function() {
    $('#user-form,#rtc-view,#all-user-list,#rtc-text-chat-area').hide();
    this.$el.find('#camera-test-result-table tbody tr.test-result').remove();
    $('#camera-list').show();

    let testData = this.getTestData();
    // callbackで取得
    _.each(testData , function(param) {
      this.tracker.getCameraTestResults(param,this.reciveResult.bind(this));
    },this);
    return this;
  }
});
