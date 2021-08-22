
//parse the data
var powerCurveDict = [];
var referenceCurveDict = [];
for (var iteration in powerJSarray) {
    powerCurveDict.push({"time":powerJSarray[iteration].ts, "windspeed":powerJSarray[iteration].nws, "netpower":powerJSarray[iteration].kw_net, "expectedpower":powerJSarray[iteration].kw_exp});
}
for (var iter in referenceJSarray) {
    referenceCurveDict.push({"windspeed":referenceJSarray[iter].nws_bin, "expectedpower":referenceJSarray[iter].kw})
}

//set up page margins
var margin = {
    top: 60,
    right: 25,
    bottom: 60,
    left: 60
};

var width = 960 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;
var svg = d3.select("#powerCurve").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//we set up the x scale to plot values from 0 to the biggest windspeed to a range from 0 to the graph width
var x = d3.scale.linear()
    .range([0, width])
    .domain([0, d3.max(powerCurveDict, function (d) {
        return d.windspeed;
    }) + 1 ]);

//same with the y axis, but with height and net power
var y = d3.scale.linear()
    .range([height, 0])
    .domain([0, d3.max(powerCurveDict, function (d) {
        return d.netpower;
    }) + 1 ]);

//initializing the x axis using the previously created scale
var xAxis = d3.svg.axis()
    .orient("bottom")
    .scale(x);

//adding the axis to the graph
var appendedX = svg.append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(" + 60 + "," + height + ")")
    .call(xAxis);

//X axis label
svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + 50) + ")")
    .style("text-anchor", "middle")
    .text("Wind Speed (m/s)");

var yAxis = d3.svg.axis()
    .orient("left")
    .scale(y);

var appendedY = svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + 60 + "," + 0 + ")")
    .call(yAxis);

//Y axis label
svg.append("text")
    .attr("transform", "translate(" + (0) + " ," + (height/2) + ")")
    .style("text-anchor", "middle")
    .text("Power");

svg.append("text")
    .attr("transform", "translate(" + (0) + " ," + ((height/2) + 20) + ")")
    .style("text-anchor", "middle")
    .text("(kW)");

//set up the values on the reference curve based on the data that's bound (d)
var referenceline = d3.svg.line()
    .x(function(d) { return x(d.windspeed); })
    .y(function(d) { return y(d.expectedpower); });


svg.append("g")			
.attr("class", "grid")
.call(d3.svg.axis().orient("left").scale(y)
    .orient("left")
    .tickSize(-width, 0, 0)
    .tickFormat(""))
.attr("transform", "translate(" + 60 + "," + 0 + ")");



//plot the data
var blueDots = svg.selectAll(".blue.dot")
    .data(powerCurveDict)
    .enter()
    .append("g");

svg.selectAll(".blue.dot")
    .data(powerCurveDict)
    .enter().append("circle")
        .attr("class", "dot")
        .attr("transform", "translate(60, 0)")
        .attr("r", 2)
        .attr("cx", function (d) {
            return x(d.windspeed);
        })
        .attr("cy", function (d) {
            return y(d.netpower) ;
        })
        .style("fill", "blue");
//draw the reference curve
svg.append("path")
        .datum(referenceCurveDict)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("transform", "translate(60, 0)")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", referenceline);

//legend
var legend = svg.append("g")
	  .attr("class", "legend")
	  .attr("x", width - 65)
	  .attr("y", 25)
	  .attr("height", 100)
	  .attr("width", 100);
//expected power color
var redrect = legend
      .append("rect")
          .attr("x", 75)
          .attr("y", 25)
          .attr("width", 10)
          .attr("height", 10)
          .style("fill", "red");
//actual power color        
var bluerect = legend
        .append("rect")
          .attr("x", 75)
          .attr("y", 42)
          .attr("height",10)
          .attr("width",10)
          .style("fill", "blue");

var expectedText = legend
    .append("text")
    .attr("x", 90)
    .attr("y", 35)
    .style("text-anchor", "start")
    .text("Expected Power");

var actualText = legend
    .append("text")
    .attr("x", 90)
    .attr("y", 52)
    .style("text-anchor", "start")
    .text("Actual Power");










