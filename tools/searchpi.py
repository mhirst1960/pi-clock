
# look for numbers found in the first 1 million digits of pi


import datetime

#piFile = 'pi1000000.txt'
piFile = 'pi100000.txt'
time = '1415'

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
                return f.tell() - len(buffer) + pos
            if not buffer:
                return -1
            f.seek(f.tell() - overlap)
            

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
                print (f'"{hour:02d}{minute:02d}":[{index}],')
                
            if index > maxIndex:
                maxIndex = index
            
print ('} // piClockData')

#if good:
#    print (f"Found all minutes in pi. Maximum index = {maxIndex}")
    
#print (indexes)
