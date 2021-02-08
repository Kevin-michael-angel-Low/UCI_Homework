// from data.js
var tableData = data;

// table references
var tbody = d3.select("tbody");

function buildTable(data){
    tbody.html("");

    data.forEach((data.Row) => {
        var row = tbody.append("tr");

        Object.values(dataRow).forEach((val) => {
            let cell = row.append("td");
                cell.text(val);
        });
    });
}

