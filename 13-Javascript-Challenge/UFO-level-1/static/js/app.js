// from data.js
var tableData = data;

// table references
var tbody = d3.select("tbody");

function buildTable(data){

    //clear table for a blank slate
    tbody.html("");
    
    //append data rows to the end of table
    data.forEach((dataRow) => {
        var row = tbody.append("tr");

        // set values
        Object.values(dataRow).forEach((val) => {
            let cell = row.append("td");
                cell.text(val);
        });
    });
}

function clicker(){

    // put filter value into a variable
    var date = d3.select("#datetime").property("value");
    let filteredData = tableData;

    // only keep the rows where the "datetime" is equal to the filter
    if (date){
        filteredData = filteredData.filter(row => row.datetime === date);
    }

    // build the table using previous function
    buildTable(filteredData);
}

// listener
d3.selectAll("#filter-btn").on("click", clicker);

// load table
buildTable(tableData);