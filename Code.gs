/*************************************************************************
*
* OpenWeatherMapProxy
* __________________
*
*  [April 2017] MIT License
*
*  OpenWeatherMapProxy is a simple proxy for the Open Weather Map: client
*  can use it with no need to expose its appid key, which should be kept
*  private. Only the proxy for the "Current Weather API" service is
*  implemented by now.
*
*  I originally coded it to be able to finish a freeCodeCamp challenge
*  (Show Local Weather) and refined it later.
*
*  It is a Google-Scripts, therefore the code must be pasted into a new
*  Google-Script project (https://script.google.com)
*
*  One must provide the private key from Open Weather Map into the
*  getAppID_(), as the returned value:
*
*  return "PUT_HERE_YOUR_PERSONAL_KEY_FROM_OPEN_WEATHER_MAP";
*
*  Please read the README.md for information on how to make it work.
*
*
* This file is subject to the terms and conditions defined in
* file 'LICENSE', which is part of this source code package.
*
*/

var owmURL = "http://api.openweathermap.org/data/2.5/weather"; // url of the current weather service of OWM

function getAppID_() {
  // underscore at the end of the function name
  // makes it private
  return "PUT_HERE_YOUR_PERSONAL_KEY_FROM_OPEN_WEATHER_MAP"; // personal app id string (change this with the one you get from OWM)
}

function getMockupData_() {

  // this object is a mockup, returned if the param nomockup === ( 0 || false || undefined )
  return {"coord":{"lon":13.41,"lat":52.52},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"base":"stations","main":{"temp":287.64,"pressure":1021,"humidity":51,"temp_min":287.15,"temp_max":288.15},"visibility":10000,"wind":{"speed":1},"clouds":{"all":0},"dt":1491762000,"sys":{"type":1,"id":4892,"message":0.0029,"country":"DE","sunrise":1491711616,"sunset":1491760572},"id":2950159,"name":"Berlin","cod":200};
}

function getOpenWeatherMapURL_(parameter) {

  var queryString = "?appid=" + getAppID_(); // add the app id

  // append all the parameters except for nodebugme and nomockupme
  for (var property in parameter) {
    if ((property !== "nodebugme") && (property !== "nomockupme") && parameter.hasOwnProperty(property)) {
      queryString += "&" + property + "=" + encodeURIComponent(parameter[property]);
    }
  }

  // URL for the API call is done
  return owmURL + queryString;
}

function getOpenWeatherData_(parameter) {

  // calculate the URL for the API call to the OWM
  var owmRequestURL = getOpenWeatherMapURL_(parameter);

  var response = {};
  try{
    response = UrlFetchApp.fetch(owmRequestURL, { 'muteHttpExceptions' : true });

    //get the json and make a js object out of it
    // (this could be done better since at the end everything is stringified anyway)
    response = JSON.parse(response.getContentText());

    // in case the appid is present in any of the properties, blank it
    for (var property in response) {
      if (response.hasOwnProperty(property)) {
        if (typeof response[property] === "string") {
          response[property] = response[property].replace(getAppID_(), ""); // hide it from messages
        }
      }
    }
  } catch(e) {

    // invalid URLs / API calls, still raise exceptions, that's why this catch

    // in case the appid is reported in any of the properties, blank it
    response = { code: 400, message: e.message.replace(getAppID_(), "") }; // only the user relevant info for the error
  }

  // REMARKS:
  //

  // 1) The parameter muteHttpExceptions is neeeded in UrlFetchApp.fetch
  //    because if there is an invalid query (say with an invalid city id),
  //    then an exception is raised with an HTTP error, reporting the full URL
  //    of the API call, including the user API key. Not good.

  // 2) Unfortunately by the time of coding, due to Google Scripts limitation
  //    it is not possible to return a proper HTTP error Code, therefore
  //    in case of errors with the OWM API call the HTTP error code would be
  //    always 200, and the the json of the body would contain the error code.
  //    Fair enough.
  //    https://issuetracker.google.com/issues/36759757

  // 3) In the response, there is always a property "code" in the OWM object
  //    with the error code also when everything goes good (code === 200).
  //
  // 4) to know if the OWM request went really through, one must check the "code" property
  //    inside the response object, because besides exceptions the HTTP error code would be
  //    always 200.

  return response;
}

function readBooleanParam_(parameter, paramName) {

  var booleanParam = false;
  if (parameter && parameter.hasOwnProperty(paramName)) {
    booleanParam = (parameter[paramName] === "1") || (parameter[paramName] === "true") ;
  }
  return booleanParam;
}

function getWeatherData_(parameter) {

  var nomockupme = readBooleanParam_(parameter, "nomockupme");
  var nodebugme = readBooleanParam_(parameter, "nodebugme");

  if (nomockupme === true) {
    // fetch data from OpenWeatherMap
    openweathermap = getOpenWeatherData_(parameter);
  } else {
    // get mockup data
    openweathermap = getMockupData_();
  }

  return {
    nomockupme: nomockupme,
    nodebugme: nodebugme,
    openweathermap: openweathermap
  };
}


function doGet(request) {

  var parameter = request.parameter;

  // retrieve weather data from OWM or from mockup data if nomockupme === false
  var resultData = getWeatherData_(parameter);

  // give back only an OWM json object or, some more information if nodebugme === false
  var result = (resultData.nodebugme)? resultData.openweathermap : {
    owmwrapper: 'lorepirri',
    nomockupme: resultData.nomockupme,
    parameter: parameter,
    cod: resultData.openweathermap.cod,
    openweathermap: resultData.openweathermap
  };

  // everything JSON, mimetype is set to support JSONP for CROS
  return ContentService.createTextOutput( JSON.stringify(result) )
    .setMimeType(ContentService.MimeType.JSON); // JAVASCRIPT
}

function debugDoGet() {

  // select this function in the menu "Select Function" and hit "debug"

  var request = {"parameter":{"nomockupme":"1","id":"2950159"},"contextPath":"","contentLength":-1,"queryString":"id=2950159&nomockupme=0","parameters":{"nomockupme":["0"],"id":["2950159"]}};
  var requestNoQueryString = {"parameter":{},"contextPath":"","contentLength":-1,"queryString":null,"parameters":{}};

  doGet(request);
}
