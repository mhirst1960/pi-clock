
# look for numbers found in the first 1 million digits of pi


import datetime

piFile = 'pi100000.txt'
#piFile = 'e100000.txt'
time = '1415'

# Adjust based on width of your screen so no time will wrap to next line
charactersPerLine = 69

# How wide is the 4-character highlighted time in units of normal characters
#   Take any time of day.  It will take up a certain large amount of space on a line
#   Count the number of normal-size characters on the next line directly under this big number
howManySmallCharInFourBigChar = 8

indexes = []

def findInPi(fname, goal, start=0, bsize=4096):
    if bsize < len(goal):
        raise ValueError("The buffer size must be larger than the string being searched for.")
    with open(fname, 'rb') as f:
        if start > 0:
            f.seek(start)
        overlap = len(goal) - 1
        while True:
            buffer = f.read(bsize)
            pos = buffer.find(goal)
            if pos >= 0:
                posInFile = f.tell() - len(buffer) + pos
                linePos = posInFile % charactersPerLine
                # avoid time spilling across to the next line
                if linePos < charactersPerLine - howManySmallCharInFourBigChar :
                    return posInFile
                #print (f'//pick another pos = {posInFile}, line position = {linePos}')
            if not buffer:
                return -1
            f.seek(f.tell() - overlap)
           
#from typing import NamedTuple
#class SecOffsets(NamedTuple):
#    secondStr: str
#    offset:    int
from operator import attrgetter
from collections import namedtuple
SecOffsets = namedtuple('SecOffsets', 'secondStr offset')

def findSecondsInPi(offset):
    # find nearby seconds 00 to 59 after the offset without overlap from other seconds
    secondsOffsets = []
    
    for second in range(60):
        secStr = f"{second:02d}"
        
        findAnother = True
        
        secIndex = offset
        
        while findAnother:
        
            secIndex = findInPi(piFile, str.encode(secStr), secIndex)
            
            if secIndex < 0:
                print(f"ERROR: did not find {secStr}")
                exit  # probably better practice to throw exception but this is good enough
            
            findAnother = False

            for sec in secondsOffsets:
                if abs(sec.offset - secIndex) <= 2:
                    #print (f"overlap at time: {time}")
                    findAnother = True
                    secIndex = secIndex +1
                    break
                
        secTuple = SecOffsets(secStr, secIndex)
        secondsOffsets.append(secTuple)
                
    #secondsOffsets[] should now contain 60 entries nearby and after the time which was passed in as the offset into the pi string
    
    # now sort into offset reverse order makes it easier for javascript to insert html <span> for each one.
    
    sortedSeconds = sorted(secondsOffsets, key=attrgetter('offset'), reverse=True)
    return sortedSeconds

def findTimeInPi(time):
    global piFile
    
    index = findInPi (piFile, time)
    return index

now = datetime.datetime.now()

hour = int(now.hour)
min = int(now.minute)

time = f"{hour:02d}{min:02d}"

index = findTimeInPi (str.encode(time))
#if index >= 0:
#    print(f'found current time: {time} at index {index-2} after decimal')
#else:
#    print(f'did not find {time} in first 1 million digits of pi')

good = True
maxIndex = -1

print ('piClockData = {')
for hour in range(24):
    for minute in range(60):
        time = f"{hour:02d}{minute:02d}"

        findAnother = True
        index = 0
        
        while findAnother:
            index = findInPi (piFile, str.encode(time), index)
            if index < 0:
                print(f'did not find {time} in first 1 million digits of pi')
                good = False
            else:
                #print(f'time: {time} at index {index-2} after decimal')

                findAnother = False
                #for i in indexes:
                #    if abs(i - index) <= 10:
                #        #print (f"overlap at time: {time}")
                #        findAnother = True
                #        index = index + 1
                #        continue
                    
                indexes.append(index)
                #print (f'"{hour:02d}{minute:02d}":[{index}],')
                print (f'"{hour:02d}{minute:02d}":[{index},[')
                
                secIndexes = findSecondsInPi(index+100)
                # TODO print index dictionary sorted by index
                #print (f"seconds: {secIndexes}")
                for secIndex in secIndexes:
                    if secIndex.offset > maxIndex:
                        maxIndex = secIndex.offset
                    print(f'    [{secIndex.offset}, "sec{secIndex.secondStr}"],')
                print (f']],')

            if index > maxIndex:
                maxIndex = index
            
print ('} // piClockData')
print (f'// last digit used  is {maxIndex}')
#if good:
#    print (f"Found all minutes in pi. Maximum index = {maxIndex}")
    
#print (indexes)
