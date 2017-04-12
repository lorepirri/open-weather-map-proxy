# OpenWeatherMapProxy

*OpenWeatherMapProxy* is a simple proxy for the [Open Weather Map](http://www.openweathermap.org/) (OWM) - [Current Weather API](http://openweathermap.org/current) service. The main reason for a web client to use this proxy is that it allows avoiding the exposure of the `appid` [key](http://openweathermap.org/appid#get), which should in general always be kept private.

*OpenWeatherMapProxy* is wrapping only the [Current Weather API](http://openweathermap.org/current) service, and I originally coded it to be able to finish a [freeCodeCamp](https://www.freecodecamp.com) challenge [(Show Local Weather)](https://www.freecodecamp.com/challenges/show-the-local-weather) because I did not like the idea of exposing the private OWM API key on [my CodePen](https://codepen.io/lorepirri/).

The intent of this proxy is, in fact, not to extend the OWM service nor to replace it, but just to facilitate the usage of their APIs for learners who dig into [these matters](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f) as beginners.

The proxy is made by a script which will be running on the _current logged-in Google user quota_ for _Google Services_, read more in the [Reading: give me more](#reading-give-me-more) section.


## Mockup me, please
To avoid hammering the good OWM server with test, yet real, requests, while understanding how to set the ajax request, or worse while fixing that CSS, I added an extra query parameter `nomockupme` which is _on purpose_ defined such as that, if not specified, the proxy goes mockup and returns immediately a sample data, _without_ even contacting the OWM server.

From [openweathermap](http://openweathermap.org/appid#get) _How to get API key (APPID)_:
> _Free and Startup accounts have limitation of capacity and data availability. If you do not get respond from server do not try to repeat your request immediately, but only after 10 min. Also we recommend to store your previous request data._

> _Do not send requests more than 1 time per 10 minutes from one device/one API key. Normally the weather is not changing so frequently._

## Debug information
Another extra query parameter is `nodebugme` which tells the proxy whether to wrap the OWM response into another object with some more information. When you are ready to use the real data, set it to `true` or `1` and you'll get the exact format of the OWM response, no additional information (even in the case of `nomockupme === 0`).

<!-- ## A little drawback

HTTP errors

anyway check for the `code === 200` in the response, a CodePen example is explained in the Usage section. -->

## Be like water
In my opinion, considering only the educational aspect, one could still complete the _freeCodeCamp_ challenge using the [Sample Data API provided by OWM](http://openweathermap.org/current), which does not require any private key:
```
http://samples.openweathermap.org/data/2.5/weather?lat=30&lon=139&appid=b1b15e88fa797225412429c1c50c122a1
```

which returns as well always the same nice data, which is anyway (still in my opinion) enough to complete the challenge.

From [openweathermap](http://openweathermap.org/current) _Examples Page_:
> _Please remember that all Examples of API calls that listed on [this](http://openweathermap.org/current) page are just samples and do not have any connection to the real API service!_

<!-- Here an example on CodePen. -->

## Reading: give me more

*OpenWeatherMapProxy* consists of a single file script [Code.gs](Code.gs) to be run as a [Web App](https://developers.google.com/apps-script/guides/web) through the [Google Apps Script](https://developers.google.com/apps-script/overview), which is a scripting language based on JavaScript that lets you do (new and cool) things with _Google Apps_ like _Docs_, _Sheets_, and _Forms_, but in _this_ particular case, acts as a mere [Content Service](https://developers.google.com/apps-script/guides/content).

This also means that the script runs on the _current logged-in Google user quota_ for _Google Services_.

Have a look at the [Quotas for Google Services](https://developers.google.com/apps-script/guides/services/quotas#current_quotas) for `URL Fetch calls`, and `URL Fetch data received` (which are the only features used by this proxy).

# Make it work

## Google Scripts setup
1. Copy the _source code_ from [Code.gs](Code.gs) (click on `Raw` and then <kbd>Ctrl</kbd>+<kbd>a</kbd>)
2. Go to [Google-Scripts](https://script.google.com) and create a new script (subscribe to the service if it's your first time)
3. Paste the proxy _source code_ into the default file named `Code.gs` (replace the default code you see)
4. On the second line of code, update the `appID` value with your [private key from Open Weather Map](http://openweathermap.org/appid#get):
```
...
var appID = "PUT_HERE_YOUR_PERSONAL_KEY_FROM_OPEN_WEATHER_MAP";
...
```
such as it will look something like:
```
...
var appID = "12345678901234567890123456789012";
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

_...Soon to come..._

<!--
```javascript
function fancyAlert(arg) {
  if(arg) {
    $.facebox({div:'#foo'})
  }
}
``` -->

## Examples

_...Soon to come..._

Hint:
```
https://script.google.com/macros/s/AKfycbybFVtS_EurDJJwccfyyFiw7_h2ggh8Ubd3LbNzLrwyJj_mnuc/exec?id=2634010&nomockupme=1&nodebugme=1&units=metric
```
