/*

Pi-clock

This is a clock.

It finds the current time somewhere within the first 100,000 digits,
highlights that number, and scrolls to it.

*/

setInterval(processCurrentTime, 1000);

// These values are found in defaults[12|24].js
// set to true for AM/PM
// set to false for 24 hour clock (00:00 through 23:59)
//isClock12 = true
//showSeconds = true

pistring = pistringRaw

initialized = false
shouldChangeTheme = true
previousTime = new Date();   // creating object of Date class
let previousHour = previousTime.getHours();
let previousMinute = previousTime.getMinutes();
let previousSecond = previousTime.getSeconds();

// Reload the digits of pi probably because the hour/minutes have changed so <span> elements are in new positions.
function updatePiDigits() {
  document.getElementById('pidigits').innerHTML = pistring;
}

// cause page to scroll to show the current hour/minute,
// which is a <span> with the id=now

function scrollToNow() {
  var element = document.getElementById('now');
  var headerOffset = 45;
  var elementPosition = element.getBoundingClientRect().top;
  var offsetPosition = elementPosition + window.scrollY - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth"
  });

}

// prepend leading zero to a number
function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

// A function to insert some text at a certain position.
String.prototype.insert = function(string, index) {
  if (index > 0)
  {
    return this.substring(0, index) + string + this.substring(index, this.length);
  }

  return string + this;
};

// Create a span element around a section of text
function addSpan (id, start, length) {

  spanString = "<span id=\"" + id + "\">"

  // insert in reverse order so we don't need to do extra offset calculation
  pistring = pistring.insert("</span>", start+length)
  pistring = pistring.insert(spanString, start)
}

// the span IDs for each of the seconds 0-59 are found
// as a string in piClockData
// for the current hour/minute
// offset is stored in reverse order: deepest into pi first.
// so there is no need to compensate for previously populated <span> elements.
// This works because no <spans> have previously been populated
// in the string at any index lower than the one being inserted.

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

// Change the color of the current <span> second without modifying the size.

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

// call this when time is 3:14 for a bigger time of day.  Because it's fun!
function bigTime () {
  document.getElementById("now").style.fontSize = "10vw"
}

// Initialize the clock
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

// This is the main function of the clock.
// It is scheduled so it is called once every second
// 
function processCurrentTime() {
  let time = new Date()    // creating object of Date class

  let month = time.getMonth() + 1
  let day = time.getDate()
  let hour = time.getHours()
  let min = time.getMinutes()
  let sec = time.getSeconds()


  ///////////////////////
  ///// test code ///////
  ///////////////////////

  // By default all of this test code should be disabled.
  // You can enable any given test by setting testXXXXX = true

  testTopOfPage = false
  if (testTopOfPage) {

    // 10:58 is near the beginning of Pi.
    // for debugging or for screenshot you can uncomment these line:
    hour = 1
    min = 59
    sec = 45
}

 
  testPiDay = false
  if (testPiDay) {
    // Extra fun on Pi-day
    month = 3
    day = 14
    hour = 1
    min = 59
    //hour = 15
    //min = 9
  }


  testPiTime = false
  if (testPiTime) {
    // test pi-time
    // alternate time between 3:13 and 3:14
    hour = 3
    if (min%2) {
      min = 13
    } else {
      min = 14
    }
  }


  testNewHour = false
  if (testNewHour) {
    // test pi-time
    // alternate time between 59 minutes and 00
    if (min%3) {
      min = 59
    } else {
      hour = hour + 1
      min = 0
    }
  }


  ////////////////////////////////////////
  /////// process current time ///////////
  ////////////////////////////////////////

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

  // if this is AM/PM clock then subtract 12 hours
  // and show 12am not 00am

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

  // insert <span> for every second in the current hour/minute
  // Note: all <spans> for seconds are found AFTER the hour/minute <span>
  // So make sure to run populateSecondsSpans() before adding
  // the span for hour/minute

  populateSecondsSpans(timeString)
  addSpan("now", offset, 4)
  updatePiDigits()
  updateColors()

  // For fun, when the time is 3:14 (aka Pi-time) make it huge
  // plus some other special things on pi-day
  if ((hour == 3 && min == 14) ||
      (month == 3 && day == 14 &&
        ((hour == 1 && min == 59) || (hour == 15 && min == 9)))) {
    bigTime()
  }

  // auto-scroll the webpage to reveal the current time of day.
  scrollToNow()


  if (shouldChangeTheme) {
  // randomly change the colors every hour
  // Note: random also means there may not actually be a theme change
  // but more often than not, the colors do change.
  
    pickRandomTheme()
    shouldChangeTheme = false
  }
  
  initialized = true
}

init()
processCurrentTime()  //calling processCurrentTime() function to initiate the process

