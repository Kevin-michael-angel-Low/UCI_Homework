# PyPoll Main Code
import os
import csv

# declare variables
voterTot = 0
voteDict =  {}
percentDict = {}
largestVote = 0
outputMain = ""

# path to csv
pyPollPath = os.path.join("Resources", "PyPoll.csv")

with open(pyPollPath) as pollFile:
    pollReader = csv.reader(pollFile, delimiter = ',')
    # skip header
    next(pollFile)

    # loop through the csv
    for row in pollReader:
        # while the csv is not empty
        if row[0] != "":
            voterTot = voterTot + 1

            # obtain unique candidate names, and place in voteDict/percentDict
            if row[2] not in voteDict:
                voteDict[row[2]] = 0
                percentDict[row[2]] = 0

            #loop through vote dictionary's keys
            for keys in voteDict.keys():
                # if the dictionary has a key equal to candidate, adds 1 to vote
                if row[2] == keys:
                    voteDict[keys] = voteDict[keys] + 1
        

# Find the winner
winner = max(voteDict, key = voteDict.get)

# create a dictionary of percentage of votes won
for pVotes in voteDict.keys():
    percentDict[pVotes] = format( (voteDict[pVotes] / voterTot) * 100, '.2f')

# format the data for readability
outputHeader = (f"Election Results \n"
                f"---------------------------\n"
                f"Total Votes: {voterTot}\n"
                f"---------------------------\n"
)

for mainCounter in voteDict:
    outputMain = outputMain +(f"{mainCounter}: {percentDict[mainCounter]}% ({voteDict[mainCounter]})\n")

outputFooter = (f"---------------------------\n"
                f"Winner: {winner}\n"
                f"---------------------------"
)

# final output to terminal
finalOutput = outputHeader + outputMain + outputFooter
print(finalOutput)


# Find file path for analysis
outputPath = os.path.join("analysis", "analysis.txt")

# Opens the analysis file, then writes the output file into it
with open(outputPath, 'w') as outputFile:
    outputFile.write(finalOutput)