# Pybank Main Code
import os
import csv

# set variables
monthNum = 0
netTotal = 0
greatestInc = 0
greatestDec = 0
avgChange = 0

# csv open path:
pyBankPath = os.path.join("Resources", "PyBank.csv")

# open the csv file:
with open(pyBankPath) as bankFile:
    bankReader = csv.reader(bankFile, delimiter=",")
    # skip the header
    next(bankFile)

# iterate through the csv
    for row in bankReader:
        # as long as the row is not empty
        if row[0] != "":
            monthNum = monthNum + 1
            netTotal = netTotal + int(row[1])
            #find greatest increase and decrease of the csv
            if greatestInc < int(row[1]):
                greatestInc = int(row[1])
                gIncName = row[0]
            if greatestDec > int(row[1]):
                greatestDec = int(row[1])
                gDecName = row[0]
    #calculate average change
    avgChange = netTotal / monthNum
    
# formats the data for readability
outputString = (f"Financial Analysis \n -------------------\n"
                f"Total Months: {monthNum} \n"
                f"Total: ${netTotal}\n"
                f"Average Change: ${format(avgChange, '.2f')}\n"
                f"Greatest Increase in Profits: {gIncName} (${greatestInc})\n"
                f"Greatest Decrease in Profits: {gDecName} (${greatestDec})"
            )
#prints output string to the terminal
print(outputString)


# Find file path to anaylsis
outputPath = os.path.join("analysis", "analysis.txt")

# opens the output file and writes the output to text file
with open(outputPath, 'w') as outputFile:
    outputFile.write(outputString)

