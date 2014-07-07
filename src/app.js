(function() {
  // Helper
  function htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  var app = angular.module('LimitedReddit', []);

  app.controller('ContentController', ['$http', function($http) {
    var content = this;
    content.links = [];
    content.loading = true;

    this.htmlDecode = htmlDecode;
    //console.log(htmlDecode);

    this.thumbnailAvailable = function(thumbnail) {
      //console.log(thumbnail);
      if (thumbnail && thumbnail !== 'self' && thumbnail !== 'default' && thumbnail !== 'nsfw') {
        return true;
      }

      return false;
    };


    $http.get('/data').success(function(data) {
      //console.log("Fetched data: " + JSON.stringify(data.links));
      //console.log("Was successful");
      content.links = data.links;
      content.loading = false;
    }).error(function(err) {
      console.error(err);
    });
  }]);
})();