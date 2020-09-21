Sub stockScript

Dim lastRow as Long
lastRow = Cells(Rows.Count, 1).End(xlUp).Row

Dim startDate as Long
startDate = 2

Dim endDate as Long

Dim tableLooper as Long
tableLooper = 1

Dim yearChange as Double

Dim stockVol as Long
stockVol = 0

'Loop through the entire sheet
For startLooper = 2 to lastRow
	
	stockVol = stockVol + Cells(startLooper, 7) 
	

	'Check if the next cell is different from previous cell, signaling end of set
	if Not StrComp( Cells(startLooper, 1), Cells(startLooper + 1, 1), vbBinaryCompare ) = 0 then
		
		'sets end date for current set
		endDate = startLooper

		'Outputs Ticker Symbols into table
		tableLooper = tableLooper + 1
		Cells(tableLooper, 9) = Cells(endDate, 1)
		

		'Calculating yearly change
		Cells(tableLooper, 10) = (Cells(endDate, 6)) - (Cells(startDate, 3))

		'Calculate percent change
		Cells(tableLooper, 11) = Format( Cells(tableLooper, 10) / Cells(startDate, 3), "Percent")

		

		'Calculate total stock volume
		Cells(tableLooper, 12) = stockVol

		'sets start date for next set
		startDate = endDate + 1
		stockVol = 0
	End if
	
	


next startLooper





End Sub
