// Box width
var width = parseInt(d3.select("#scatter").style("width"));

// Graph height
var height = width - width / 3.9;

// Space out the graph's margins
var margin = 20;

// get space for words
var labelArea = 110;

// pad bottom and left areas
var tPadBot = 40;
var tPadLeft = 40;

// create canvas for graphs using above dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

// Function: radius for each dot in data
var circRadius;
function crGet() {
  if (width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
crGet();

// Axis Labels

// Bottom labels
svg.append("g").attr("class", "xText");

// xText to select the x labels easier
var xText = d3.select(".xText");

// a function to change x label function as the window itself changes size
function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - tPadBot) +
      ")"
  );
}
xTextRefresh();

// Use xText to append values AND give it sizes so it can shift
// poverty
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");
// age
xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age (Median)");
// income
xText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income (Median)");

// y axis

// Make the attributes more readable
var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// label for y axis
svg.append("g").attr("class", "yText");

// use yText to select the code
var yText = d3.select(".yText");

// transform into a function to make it easier to manipulate, but rotate it 90 degrees
function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

// append some text to the y axis again

// obesity
yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

// smoking
yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)");

// healthcare
yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)");


// import csv, and visualize the data
d3.csv("assets/data/data.csv").then(function(data) {
  visualize(data);
});

// visualization function
function visualize(theData) {
  // set local variables that matches csv data
  var curX = "poverty";
  var curY = "obesity";

  // variables to save the mins and max of each axis
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  // Tooltip functions for hovering over each datapoint
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
      var theX;
      var theState = "<div>" + d.state + "</div>";
      // Get the y values
      var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
      // if x is poverty, grab x and show the percentage
      if (curX === "poverty") {
        theX = "<div>" + curX + ": " + d[curX] + "%</div>";
      }
      else {
        // Otherwise get the x key and value (formatted to include commas after every third digit)
        theX = "<div>" +
          curX +
          ": " +
          parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }
      // return the end
      return theState + theX + theY;
    });
  
    // Call tooltip
  svg.call(toolTip);

  // dry!

  // x min and max
  function xMinMax() {
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });

    xMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }

  // y min and max
  function yMinMax() {
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });

    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }

  // change appearance of label text when clicked
  function labelChange(axis, clickedText) {
    // switch the currently active to inactive.
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    // switch clicked text to active
    clickedText.classed("inactive", false).classed("active", true);
  }

  // Start the actual scatter plot (yay!)

  // grab those x and y min values
  xMinMax();
  yMinMax();

  // Now we scale everything based on the min values
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin - labelArea, margin]);

  // Use the scales to create the axes sizes
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // Get the ticks for x and y
  function tickCount() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }
    else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tickCount();

  //  append axes with numbers, borders, and ticks
  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  // groups for dots and labels
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

  // append circles for each state
  theCircles
    .append("circle")
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
    // rules for mouse hover overing
    .on("mouseover", function(d) {
      // tooltip from before
      toolTip.show(d, this);
      // highlight the border of the data
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove the tooltip on mouse out
      toolTip.hide(d);
      // Remove highlight too
      d3.select(this).style("stroke", "#e3e3e3");
    });

  // Put state abbreviations in the center of each dot, so we can hover over em
  theCircles
    .append("text")
    .text(function(d) {
      return d.abbr;
    })
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
      return yScale(d[curY]) + circRadius / 2.5;
    })
    .attr("font-size", circRadius)
    .attr("class", "stateText")
    // More hover over rules
    .on("mouseover", function(d) {
      // show the tooltip
      toolTip.show(d);
      // highlight the border
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });

  // dynamic graphic things

  // Select all axis text and add this d3 click event.
  d3.selectAll(".aText").on("click", function() {
    var self = d3.select(this);

    // Run ONLY if its inactive
    if (self.classed("inactive")) {
      // Grab the name and axis of the label
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");

      // if x is in the saved axis, then
      if (axis === "x") {
        // make the curX the same as the name
        curX = name;

        // xaxis min and max
        xMinMax();

        // update x domain
        xScale.domain([xMin, xMax]);

        // use a simple transition when updating the axis
        svg.select(".xAxis").transition().duration(300).call(xAxis);

        // update location of the axes
        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        // change location of the state abbreviations too
        d3.selectAll(".stateText").each(function() {
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        labelChange(axis, self);
      }
      else {
        // now do the same with y axis
        curY = name;
        yMinMax();
        yScale.domain([yMin, yMax]);
        svg.select(".yAxis").transition().duration(300).call(yAxis);
        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[curY]);
            })
            .duration(300);
        });
        d3.selectAll(".stateText").each(function() {
          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[curY]) + circRadius / 3;
            })
            .duration(300);
        });
        labelChange(axis, self);
      }
    }
  });

  // window responsiveness on resize things
  d3.select(window).on("resize", resize);

  function resize() {
    // resize width, height, and y label
    width = parseInt(d3.select("#scatter").style("width"));
    height = width - width / 3.9;
    leftTextY = (height + labelArea) / 2 - labelArea;
    svg.attr("width", width).attr("height", height);
    xScale.range([margin + labelArea, width - margin]);
    yScale.range([height - margin - labelArea, margin]);

    // Now that the scales are done, change the xaxis and margins/labels
    svg
      .select(".xAxis")
      .call(xAxis)
      .attr("transform", "translate(0," + (height - margin - labelArea) + ")");

    svg.select(".yAxis").call(yAxis);

    // ticks
    tickCount();

    //labels
    xTextRefresh();
    yTextRefresh();

    // dot radii
    crGet();

    // locations/radii of circles
    d3
      .selectAll("circle")
      .attr("cy", function(d) {
        return yScale(d[curY]);
      })
      .attr("cx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", function() {
        return circRadius;
      });

    // location/size of state abbreviations
    d3
      .selectAll(".stateText")
      .attr("dy", function(d) {
        return yScale(d[curY]) + circRadius / 3;
      })
      .attr("dx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", circRadius / 3);
  }
}
