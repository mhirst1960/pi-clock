/*

Pi-clock

This is a clock.

It finds the current time somewhere within the first 100,000 digits,
highlights that number, and scrolls to it.

*/

setInterval(currentTime, 1000);

// These values are found in defaults[12|24].js
// set to true for AM/PM
// set to false for 24 hour clock (00:00 through 23:59)
//isClock12 = true
//showSeconds = true

pistring = pistringRaw

initialized = false
previousTime = new Date();   // creating object of Date class
let previousHour = previousTime.getHours();
let previousMinute = previousTime.getMinutes();
let previousSecond = previousTime.getSeconds();

function updatePiDigits() {
  document.getElementById('pidigits').innerHTML = pistring;
}

function scrollToNow() {
  var element = document.getElementById('now');
  var headerOffset = 45;
  var elementPosition = element.getBoundingClientRect().top;
  var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth"
  });

}

function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

String.prototype.insert = function(string, index) {
  if (index > 0)
  {
    return this.substring(0, index) + string + this.substring(index, this.length);
  }

  return string + this;
};

// create a span element around a section of text
function addSpan (id, start, length) {

  spanString = "<span id=\"" + id + "\">"

  // insert in reverse order so we don't need to do extra offset calculation
  pistring = pistring.insert("</span>", start+length)
  pistring = pistring.insert(spanString, start)
}

function populateSecondsSpans(timeStr) {
  data = piClockData[timeStr][1]

  // The data is already sorted descending so simply add a new span
  // for every second without needing to account for earlier populated spans

  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    // data contains [pi digit, spanId]
    addSpan(element[1], element[0], 2)
  }

}

function highlightSecond(second) {
  for(let sec = 0; sec < 60; sec++) {
    id = "sec" + pad(sec,2)

    try {
      
      if (sec == second) {
        setSecondsThemeHighlighted(id)
      } else {
        setSecondsThemeUnhighlighted(id)
      }
    } catch {
      // ignore errors.  Probably not populated yet
    }

  }
}

// call when time is 3:15 for a bigger time of day.  Because it's fun!
function bigTime () {
  document.getElementById("now").style.fontSize = "10vw"
}


function init() {

  // for 24-hour clock append to URL this: ?clock-type=24

  urlString = window.location.href
  url = new URL(urlString)
  parmClockType = url.searchParams.get("clock-type")
  if (parmClockType == "12") {
    isClock12 = true
  } else if (parmClockType == "24") {
    isClock12 = false
  }

  parmClockType = url.searchParams.get("show-seconds")
  if (parmClockType == "yes") {
    showSeconds = true
  } else if (parmClockType == "no") {
    showSeconds = false
  }

}

function currentTime() {
  let time = new Date()    // creating object of Date class

  let month = time.getMonth() + 1
  let day = time.getDate()
  let hour = time.getHours()
  let min = time.getMinutes()
  let sec = time.getSeconds()


  // 10:58 is near the beginning of Pi.
  // for debugging or for screenshot you can uncomment these line:
  //hour = 1
  //min = 59
  //sec = 45

  //hour = 3
  //min = 14
  //sec = 15
 
  // Extra fun on Pi-day
  //month = 3
  //day = 14
  //hour = 1
  //min = 59
  //hour = 15
  //min = 9

  shouldChangeTheme = false

  if (!initialized || previousHour != hour) {
    shouldChangeTheme = true
  }
  
  //if (showSeconds &&  previousSecond != sec) {
    highlightSecond(sec)
  //}

  previousSecond = sec

  if (initialized && previousMinute == min && previousHour == hour) {
    return
  }

  previousMinute = min 
  previousHour = hour

  if (isClock12) {
    if (hour > 12) {
      hour = hour - 12
    } else if (hour < 1) {
      hour = 12
    }
  }

  hourString = pad(hour, 2)
  minutesString = pad(min, 2)
  timeString = hourString + minutesString
  offset = piClockData[timeString][0]

  pistring = pistringRaw

  populateSecondsSpans(timeString)
  // hr/sec time should be before all other spans when adding it here
  addSpan("now", offset, 4)
  updatePiDigits()

  // for fun, when the time is 3:14 (aka Pi-time make it huge
  // plus some pi-day specials
  if ((hour == 3 && min == 14) ||
      (month == 3 && day == 14 &&
        ((hour == 1 && min == 59) || (hour == 15 && min == 9)))) {
    bigTime()
  }
  scrollToNow()

  //setTheme(theme)
  // randomly change the colors every hour
  if (shouldChangeTheme) {
    pickRandomTheme()
  }
  
  
  initialized = true
}

init()
currentTime()  //calling currentTime() function to initiate the process

