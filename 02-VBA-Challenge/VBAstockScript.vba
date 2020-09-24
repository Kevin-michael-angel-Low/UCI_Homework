Sub stockScript

'Set Table Titles
	Cells(1, 9) = "Ticker"
	Cells(1, 10) = "Yearly Change"
	Cells(1, 11) = "Percent Change"
	Cells(1, 12) = "Total Stock Volume"
	Cells(1, 16) = "Ticker"
	Cells(1, 17) = "Value"
	Cells(2, 15) = "Greatest % Increase"
	Cells(3, 15) = "Greatest % Decrease"
	Cells(4, 15) = "Greatest Total Volume"


'Initialize variables
Dim startDate as Double
startDate = 2 

Dim endDate as Double

Dim tableLooper as Double
tableLooper = 1

Dim yearChange as Double

Dim stockVol as Double
stockVol = 0

Dim largestInc as Double
largestInc = 0

Dim largestDec as Double
largestDec = 0

Dim largestVol as Double
largestVol = 0


'Set last row of data
Dim lastRow as Double
lastRow = Cells(Rows.Count, 1).End(xlUp).Row

'Loop through the entire sheet
For startLooper = 2 to lastRow
	
	'Accumulate total stock volume
	stockVol = stockVol + CDbl(Cells(startLooper, 7) )
	
	'Check if the next cell is different from previous cell, signaling end of set
	if Not StrComp( Cells(startLooper, 1), Cells(startLooper + 1, 1), vbBinaryCompare ) = 0 then
		
		'sets end date for current set
		endDate = startLooper

		'Outputs Ticker Symbols into table
		tableLooper = tableLooper + 1
		Cells(tableLooper, 9) = Cells(endDate, 1)
		
		'Calculate yearly change
		Cells(tableLooper, 10) = (Cells(endDate, 6)) - (Cells(startDate, 3))

		'set color of yearly change
		if Cells(tableLooper, 10) >= 0 then
			Cells(tableLooper, 10).Interior.ColorIndex = 4
			Cells(tableLooper,10).Font.ColorIndex = 1
		Else
			Cells(tableLooper,10).Interior.ColorIndex = 3
			Cells(tableLooper, 10).Font.ColorIndex = 1
		end if

		'Calculate percent change. For stocks with 0 in all rows, set the results as 0 (to prevent dividing error)
		if Cells(startDate, 3) <> 0 then
			Cells(tableLooper, 11) = Format( Cells(tableLooper, 10) / Cells(startDate, 3), "Percent")
		Else
			Cells(tableLooper, 9) = 0
			Cells(tableLooper, 10) = 0
			Cells(tableLooper, 11) = 0
			Cells(tableLooper, 12) = 0
		end if

		'Insert total stock volume into table
		Cells(tableLooper, 12) = stockVol

		'sets start date for next set and reset stock volume
		startDate = endDate + 1
		stockVol = 0
	End if

next startLooper

'----------------------------------------------------------------'
'Bonus!

'Set last row of table
Dim lastRowTable as Double
lastRowTable = Cells(Rows.Count, 11).End(xlUp).Row

'Find largest % increase
For i = 2 to lastRowTable
	If Cells(i, 11) > largestInc then
		largestInc = Cells(i, 11)
		Cells(2, 17) = Format(largestInc, "Percent")
		Cells(2, 16) = Cells(i, 9)
	end If
Next i


'Find largest % decrease
For j = 2 to lastRowTable
	If Cells(j, 11) < largestDec then
		largestDec = Cells(j, 11)
		Cells(3, 17) = Format(largestDec, "Percent")
		Cells(3, 16) = Cells(j, 9)
	end If
Next j


'Find largest total volume
For k = 2 to lastRowTable
	If cells(k, 12) > largestVol then
		largestVol = Cells(k, 12)
		Cells(4, 17) = largestVol
		Cells(4, 16) = Cells(k, 9)
	end if
Next k

End Sub