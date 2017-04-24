# Open Weather Map Proxy

*Open Weather Map Proxy* is a simple proxy for the [Open Weather Map](http://www.openweathermap.org/) (OWM) - [Current Weather API](http://openweathermap.org/current) service. The main reason for a web client to use this proxy is that it allows avoiding the exposure of the `appid` [key](http://openweathermap.org/appid#get), which should in general always be kept private.

*Open Weather Map Proxy* is wrapping only the [Current Weather API](http://openweathermap.org/current) service, and I originally coded it to be able to finish a [freeCodeCamp](https://www.freecodecamp.com) challenge [(Show Local Weather)](https://www.freecodecamp.com/challenges/show-the-local-weather) because I did not like the idea of exposing the private OWM API key on [my CodePen](https://codepen.io/lorepirri/).

The intent of this proxy is, in fact, not to extend the OWM service nor to replace it, but just to facilitate the usage of their APIs for learners who dig into [these matters](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f) as beginners.

The proxy is made by a script which will be running on the _current logged-in Google user quota_ for _Google Services_, read more in the [Reading: give me more](#reading-give-me-more) section.

If you liked this project, or it was just useful to you, please :star: it!

Please, contact me if you have suggestions for improvement.

## Mockup me, please
To avoid hammering the good OWM server with test, yet real, requests, while understanding how to set the ajax request, or worse while fixing that CSS, I added an extra query parameter `nomockupme` which is _on purpose_ defined such as that, if not specified, the proxy goes mockup and returns immediately a sample data, _without_ even contacting the OWM server.

From [openweathermap](http://openweathermap.org/appid#get) _How to get API key (APPID)_:
> _Free and Startup accounts have limitation of capacity and data availability. If you do not get respond from server do not try to repeat your request immediately, but only after 10 min. Also we recommend to store your previous request data._

> _Do not send requests more than 1 time per 10 minutes from one device/one API key. Normally the weather is not changing so frequently._

## Debug information
Another extra query parameter is `nodebugme` which tells the proxy whether to wrap the OWM response into another object with some more information. When you are ready to use the real data, set it to `true` or `1` and you'll get the exact format of the OWM response, no additional information (even in the case of `nomockupme === 0`).

## HTTP errors: a little drawback

I could not find a way to set the error code in the HTTP response using the [Content Service](https://developers.google.com/apps-script/reference/content/), therefore even when the OWM service result has an error code, the HTTP error code to the proxy client is always `200` (`OK`).

One should always check for the `cod === 200` in the response object, as shown in the [Usage section](#usage) and the _CodePen_ mentioned in the [Examples](#examples).

## Reading: give me more

*Open Weather Map Proxy* consists of a single file script [Code.gs](Code.gs) to be run as a [Web App](https://developers.google.com/apps-script/guides/web) through the [Google Apps Script](https://developers.google.com/apps-script/overview), which is a scripting language based on JavaScript that lets you do (new and cool) things with _Google Apps_ like _Docs_, _Sheets_, and _Forms_, but in _this_ particular case, acts as a mere [Content Service](https://developers.google.com/apps-script/guides/content).

This also means that the script runs on the _current logged-in Google user quota_ for _Google Services_.

Have a look at the [Quotas for Google Services](https://developers.google.com/apps-script/guides/services/quotas#current_quotas) for `URL Fetch calls`, and `URL Fetch data received` (which are the only features used by this proxy).

# Make it work

## Google Scripts setup
1. Copy the _source code_ from [Code.gs](Code.gs) (click on `Raw` and then <kbd>Ctrl</kbd>+<kbd>a</kbd>)
2. Go to [Google-Scripts](https://script.google.com) and create a new script (subscribe to the service if it's your first time)
3. Paste the proxy _source code_ into the default file named `Code.gs` (replace the default code you see)
4. Within the first function `getAppID_()`, update the returned _string_ value with your [private key from Open Weather Map](http://openweathermap.org/appid#get):
  ```javascript
  ...
  function getAppID_() {
    // underscore at the end of the function name
    // makes it private
    return "PUT_HERE_YOUR_PERSONAL_KEY_FROM_OPEN_WEATHER_MAP"; // personal app id string (change this with the one you get from OWM)
  }
  ...
  ```
  such as it will look something like:
  ```javascript
  ...
  function getAppID_() {
    // underscore at the end of the function name
    // makes it private
    return "12345678901234567890123456789012"; // personal app id string (change this with the one you get from OWM)
  }
  ...
  ```

## Deploy as Web App
1. From the main menu, select `Publish` and then `Deploy as web app...`
2. Enter a new project name if asked
3. Insert a comment for the new `Project version`
4. For `Execute the app as:` select `Me (<youremail>)`
5. For `Who has access to the app:` select `Anyone, even anonymous`,
6. Click on `Deploy`
7. Agree on the authorization request clicking on `Review Permissions` and `Allow` (well, if you trust my code)
6. You should see the message _"This project is now deployed as a web app"_
7. Copy the app URL, from the `Current Web app URL:` which must end with `/exec` (be sure to copy the whole of it, till the end): this is the URL of your OWM proxy service! See [Usage](#usage) to know how to use it

### Remarks and notes
- After the web app is deployed, it is always possible to get its URL from the main menu, selecting `Publish` and then `Deploy as web app...`: the URL is under `Current web app URL:`
- Each time you make any change to the code, you must create a new version (from the main menu `File -> Manage Versions`, or while deploying, selecting `New`)
- If one tries the app URL in the browser, it gets redirected to another working URL, which requires to be authenticate with google services and therefore it can't be used for an AJAX request (the jQuery thing): the URL provided by the publishing dialog is the one that works, also in an incognito tab of the browser

# Usage

**Current Weather Proxy**
----
  Returns JSON data about the current weather, coming from the Open Weather Map and wrapped in some debug information if the URL param `nodebugme` is `0`, `false`, or `undefined`.

* **URL:** /

* **Method:** `GET`

*  **URL Params**

   **Required:**
   _none_

   **Optional:**
   * `nomockupme`: if its value is `0`, `false`, or `undefined`, the response will not contain real data coming from the OWM server (which is then not contacted), but it will be filled with constant, yet consistent values
   * `nodebugme`: if its value is `0`, `false`, or `undefined`, the response will be wrapped into another object which contains debug information (e.g. request parameters)

* **Data Params**: _none_

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```
    {  
       "owmwrapper":"lorepirri",
       "nomockupme":false,
       "parameter":{  
          "nodebugme":"0",
          "nomockupme":"0",
          "id":"0"
       },
       "cod":200,
       "openweathermap":{
          ...data from OWM response,
          "cod":200
       }
    }
    ```
* **Success Response (if `nodebugme` is true):**

  * **Code:** 200 <br />
    **Content:** `{ cod : 200, ...data from OWM response }`

* **Error Response:**

  * **Code:** 200 (due to Google Scripts limitation) <br />
    **Content:**
    ```
    {  
       "owmwrapper":"lorepirri",
       "nomockupme":false,
       "parameter":{  
          "nodebugme":"0",
          "nomockupme":"0",
          "id":"0"
       },
       "cod":"400",
       "openweathermap":{
          "cod":"400",
          message: "error message"
       }
    }
    ```

* **Error Response (if `nodebugme` is true)::**

  * **Code:** 200 (due to Google Scripts limitation) <br />
    **Content:** `{ cod : "400", message: "error message" }`


* **Sample Call:**

  ```javascript
  $.ajax({
    url: "https://script.google.com/macros/s/AKfycbzK_moMuvXmDreD9YnNb_K9GfXoTKCHLE85jx_jNd-5tVAl0so/exec?id=0&nomockupme=0&nodebugme=0",
    datatype: 'json',
    error: function(err){
      console.log('error!');
      console.log(err);
    },//error
    success: function(result){
      if (result.cod === 200) {        
        console.log('success!');
      } else {
        console.log('OWM querystring has an error!');        
      }
      console.log(result);
    }//succes
  });
  ```


## Examples

- CodePen: [Open Weather Map Proxy Usage](http://codepen.io/lorepirri/pen/xdxwVo)
