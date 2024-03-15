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

initialized = false
previousTime = new Date();   // creating object of Date class
let previousHour = previousTime.getHours();
let previousMinute = previousTime.getMinutes();

function getTextNodesIn(node) {
  var textNodes = [];
  if (node.nodeType == 3) {
    textNodes.push(node);
  } else {
    var children = node.childNodes;
    for (var i = 0, len = children.length; i < len; ++i) {
      textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
    }
  }
  return textNodes;
}

function setSelectionRange(el, start, end) {
  if (document.createRange && window.getSelection) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var textNodes = getTextNodesIn(el);
    var foundStart = false;
    var charCount = 0, endCharCount;

    for (var i = 0, textNode; textNode = textNodes[i++];) {
      endCharCount = charCount + textNode.length;
      if (!foundStart && start >= charCount
        && (start < endCharCount ||
          (start == endCharCount && i <= textNodes.length))) {
        range.setStart(textNode, start - charCount);
        foundStart = true;
      }
      if (foundStart && end <= endCharCount) {
        range.setEnd(textNode, end - charCount);
        break;
      }
      charCount = endCharCount;
    }

    var span = document.createElement("span");
    span.id = "now"

    range.surroundContents(span);

    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (document.selection && document.body.createTextRange) {
    var textRange = document.body.createTextRange();
    textRange.moveToElementText(el);
    textRange.collapse(true);
    textRange.moveEnd("character", end);
    textRange.moveStart("character", start);
    textRange.select();
  }
}

function makeEditableAndHighlight(color) {
  sel = window.getSelection();
  if (sel.rangeCount && sel.getRangeAt) {
    range = sel.getRangeAt(0);
  }
  document.designMode = "on";
  if (range) {
    sel.removeAllRanges();
    sel.addRange(range);
  }
  // Use HiliteColor since some browsers apply BackColor to the whole block
  if (!document.execCommand("HiliteColor", false, color)) {
    document.execCommand("BackColor", false, color);
  }
  document.designMode = "off";
}

function highlight(color) {
  var range, sel;
  if (window.getSelection) {
    // IE9 and non-IE
    try {
      if (!document.execCommand("BackColor", false, color)) {
        makeEditableAndHighlight(color);
      }
    } catch (ex) {
      makeEditableAndHighlight(color)
    }
  } else if (document.selection && document.selection.createRange) {
    // IE <= 8 case
    range = document.selection.createRange();
    range.execCommand("BackColor", false, color);
  }
}


function selectAndHighlightRange(id, start, end) {
  setSelectionRange(document.getElementById(id), start, end);
  //highlight("white");
}

function unhighlight() {
  document.getElementById('pi').innerHTML = pistring;
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
function highlightMinutes() {
  for (var i = 0, offset; offset = offsets[i++];) {
    selectAndHighlightRange('pi', offset, offset + 4);
  }
}

function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

function currentTime() {
  let time = new Date();   // creating object of Date class

  let hour = time.getHours();
  let min = time.getMinutes();
  //let sec = time.getSeconds();

  
  if (initialized && previousMinute == min && previousHour == hour) {
    return
  }

  previousMinute = min 
  previousHour = hour

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

  unhighlight()
  selectAndHighlightRange('pi', offset, offset + 4);
  scrollToNow()

  initialized = true
}

// 10:58 is found near the beginning of pi.  Use this time for a quick screen-shot

function screenshot() {
  offset = piClockData["1058"][0]
  unhighlight()
  selectAndHighlightRange('pi', offset, offset + 4);
}

//screenshot()

currentTime();  //calling currentTime() function to initiate the process
