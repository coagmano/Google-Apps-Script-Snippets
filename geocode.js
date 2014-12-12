/**
 * Geocodes an address with the Google API
 * @param {string} inputAddress The address to geocode
 * @return The comma separated latitute and longitude
 * @customfunction
 */
function GEOCODE(inputAddress) {
  if (typeof inputAddress  != "string" || inputAddress.length < 4) {
    return "Address must be a string";
  }
  var lat, lon, err;
  var cache = CacheService.getDocumentCache();
  
  // Check cache first
  var cachedResult = cache.get(inputAddress);
  if (cachedResult !== null) {
    var split = cachedResult.split(", ");
    if (split[1] === undefined) {
      return cachedResult;
    }
    lat = split[0];
    lon = split[1];
  } else {
    // Otherwise new request
    var params = "?address="+encodeURIComponent(inputAddress);
    var res = UrlFetchApp.fetch("https://maps.googleapis.com/maps/api/geocode/json"+params);
    var result  = JSON.parse(res.getContentText());
    
    if (result.status == "OK") {  
      lat = result.results[0].geometry.location.lat;
      lon = result.results[0].geometry.location.lng;
      // Cache Result
      cache.put(inputAddress, (lat + ", " + lon));
    } else if(result.status == "ZERO_RESULTS") {
      err = "no results";
      cache.put(inputAddress, err);
      return err;
    } else {
      err = "ERROR";
      cache.put(inputAddress, err);
      return err;
    }
  }
  // Return lat, lon
  return [[lat, lon]];
  
}