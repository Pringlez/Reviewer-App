(function() {

  angular
    .module('reviewerApp')
    .service('reviewerData', reviewerData);

  reviewerData.$inject = ['$http'];
  function reviewerData ($http) {
    var locationByCoords = function (lat, lng) {
      return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=20000');
    };

    var locationById = function (locationid) {
      return $http.get('/api/locations/' + locationid);
    };

    var addReviewById = function (locationid, data) {
      return $http.post('/api/locations/' + locationid + '/reviews', data);
    };

    return {
      locationByCoords : locationByCoords,
      locationById : locationById,
      addReviewById : addReviewById
    };
  }

})();
