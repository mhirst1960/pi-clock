/*

Pi-clock

This is a clock.

It finds the current time somewhere within the first 100,000 digits,
highlights that number, and scrolls to it.

*/

setInterval(currentTime, 1000);

// set to true for AM/PM
// set to false for 24 hour clock (00:00 through 23:59)
isClock12 = true

pistring = pistringRaw

initialized = false
previousTime = new Date();   // creating object of Date class
let previousHour = previousTime.getHours();
let previousMinute = previousTime.getMinutes();

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
  pistring = pistringRaw.insert("</span>", start+length)
  pistring = pistring.insert(spanString, start)
}

function currentTime() {
  let time = new Date();   // creating object of Date class

  let hour = time.getHours();
  let min = time.getMinutes();
  //let sec = time.getSeconds();

  // 10:58 is near the beginning of Pi.
  // for debugging or for screenshot you can uncomment these line:
  //hour = 10
  //min = 58
 
  if (initialized && previousMinute == min && previousHour == hour) {
    return
  }


  //let dayName = time.getDay();
  //let month = time.getMonth();
  //let year = time.getFullYear();
  //let date = time.getDate();


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

  // TODO it would be cool to show the seconds in nearby digits
  // with more data we could do something like this:
  // secondsOffset = piClockData[timeString][seconds+1]
  // but should only scroll when minutes are updated

  addSpan("now", offset, 4)
  updatePiDigits()
  scrollToNow()

  //setTheme(theme)
  // randomly change the colors every hour
  if (!initialized || previousHour != hour) {
    pickRandomTheme()
  }
  
  previousMinute = min 
  previousHour = hour
  
  initialized = true
}

// 10:58 is found near the beginning of pi.  Use this time for a quick screen-shot

function screenshot() {
  offset = piClockData["1058"][0]
  updatePiDigits()
  selectAndHighlightRange('pidigits', offset, offset + 4);
}

//screenshot()

currentTime()  //calling currentTime() function to initiate the process

