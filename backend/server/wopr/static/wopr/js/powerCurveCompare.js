
//parsing the data
var powerCurve1Dict = [];
var powerCurve2Dict = [];
var referenceCurve1Dict = [];
var referenceCurve2Dict = [];
for (var i1 in powerJSarray1) {
    powerCurve1Dict.push({"time":powerJSarray1[i1].ts, "windspeed":powerJSarray1[i1].nws, "netpower":powerJSarray1[i1].kw_net, "expectedpower":powerJSarray1[i1].kw_exp});
}
for (var i2 in powerJSarray2) {
    powerCurve2Dict.push({"time":powerJSarray2[i2].ts, "windspeed":powerJSarray2[i2].nws, "netpower":powerJSarray2[i2].kw_net, "expectedpower":powerJSarray2[i2].kw_exp});
}
for (var i3 in referenceJSarray1) {
    referenceCurve1Dict.push({"windspeed":referenceJSarray1[i3].nws_bin, "expectedpower":referenceJSarray1[i3].kw})
}
for (var i4 in referenceJSarray2) {
    referenceCurve2Dict.push({"windspeed":referenceJSarray2[i4].nws_bin, "expectedpower":referenceJSarray2[i4].kw});
}

//page margins
var margin = {
    top: 60,
    right: 25,
    bottom: 60,
    left: 60
};

//attach the svg
var width = 960 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;
var svg = d3.select("#powerCurve").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var biggestXfirstSet = d3.max(powerCurve1Dict, function(d){
    return d.windspeed;
}) + 1;
var biggestXsecondSet = d3.max(powerCurve2Dict, function(d) {
    return d.windspeed;
}) + 1;
//use the first one, replace it with the value of the second one if needed
if (biggestXsecondSet > biggestXfirstSet) {
    biggestXfirstSet = biggestXsecondSet;
}

//we set up the x scale to plot values from 0 to the biggest windspeed to a range from 0 to the graph width
var x = d3.scale.linear()
    .range([0, width])
    .domain([0, biggestXfirstSet]);


//we then do the exact same with the Y axis, but with net power
var biggestYfirstSet = d3.max(powerCurve1Dict, function(d) {
    return d.netpower;
}) + 1;
var biggestYsecondSet = d3.max(powerCurve2Dict, function(d) {
    return d.netpower;
}) + 1;
if (biggestYsecondSet > biggestYfirstSet) {
    biggestYfirstSet = biggestYsecondSet;
}

var y = d3.scale.linear()
    .range([height, 0])
    .domain([0, biggestYfirstSet]);

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

//initializing the y axis with the y scale we just created
var yAxis = d3.svg.axis()
    .orient("left")
    .scale(y);

//add the y axis to the graph
var appendedY = svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + 60 + "," + 0 + ")")
    .call(yAxis);

//Y axis label
svg.append("text")
    .attr("transform", "translate(" + (0) + " ," + (height/2) + ")")
    .style("text-anchor", "middle")
    .text("Power");
//this is done in two parts because .text() won't accept newline characters
svg.append("text")
    .attr("transform", "translate(" + (0) + " ," + ((height/2) + 20) + ")") //positioned 20 pixels lower
    .style("text-anchor", "middle")
    .text("(kW)");


//set up the values on the reference curve based on the data that's bound (d)
var referenceline = d3.svg.line()
    .x(function(d) { return x(d.windspeed); })
    .y(function(d) { return y(d.expectedpower); });


//add horizontal gridlines to make the graph more readable
svg.append("g")			
.attr("class", "grid")
.call(d3.svg.axis().orient("left").scale(y)
    .orient("left")
    .tickSize(-width, 0, 0)
    .tickFormat(""))
.attr("transform", "translate(" + 60 + "," + 0 + ")");



//data for turbine 1
var blueDots = svg.selectAll(".blue.dot")
    .data(powerCurve1Dict)
    .enter()
    .append("g");

svg.selectAll(".blue.dot")
    .data(powerCurve1Dict)
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

//data for turbine 2
var greenDots = svg.selectAll(".green.dot")
    .data(powerCurve2Dict)
    .enter()
    .append("g");
    
svg.selectAll(".green.dot")
    .data(powerCurve2Dict)
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
        .style("fill", "green");


//reference curve for turbine 1
svg.append("path")
        .datum(referenceCurve1Dict)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("transform", "translate(60, 0)")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", referenceline);
//reference curve for turbine 2
svg.append("path")
        .datum(referenceCurve2Dict)
        .attr("fill", "none")
        .attr("stroke", "purple")
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
//expected power for turbine 1
var redrect = legend
      .append("rect")
          .attr("x", 75)
          .attr("y", 25)
          .attr("width", 10)
          .attr("height", 10)
          .style("fill", "red");
//actual power for turbine 1     
var bluerect = legend
        .append("rect")
          .attr("x", 75)
          .attr("y", 42)
          .attr("height",10)
          .attr("width",10)
          .style("fill", "blue");

//expected power for turbine 2
var purplerect = legend
      .append("rect")
          .attr("x", 75)
          .attr("y", 58)
          .attr("width", 10)
          .attr("height", 10)
          .style("fill", "purple");
//actual power for turbine 2     
var greenrect = legend
        .append("rect")
          .attr("x", 75)
          .attr("y", 76)
          .attr("height",10)
          .attr("width",10)
          .style("fill", "green");



//expected power for turbine 1
var expectedText1 = legend
    .append("text")
    .attr("x", 90)
    .attr("y", 35)
    .style("text-anchor", "start")
    .text("Expected Power (Turbine 1)");
//actual power for turbine 1
var actualText1 = legend
    .append("text")
    .attr("x", 90)
    .attr("y", 52)
    .style("text-anchor", "start")
    .text("Actual Power (Turbine 1)");

//expected power for turbine 2
var expectedText2 = legend
    .append("text")
    .attr("x", 90)
    .attr("y", 69)
    .style("text-anchor", "start")
    .text("Expected Power (Turbine 2)");
//actual power for turbine 2
var actualText2 = legend
    .append("text")
    .attr("x", 90)
    .attr("y", 86)
    .style("text-anchor", "start")
    .text("Actual Power (Turbine 2)");


