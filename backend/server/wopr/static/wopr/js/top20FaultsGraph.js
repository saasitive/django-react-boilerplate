
                        var jsdict = []

                        // First way to make js dictionary
                        /*
                        durationsJSarray.sort(function(a,b){return a.eventid-b.eventid});
                        turbinesJSarray.sort(function(a,b){return a.eventid-b.eventid});
                        for (var key in durationsJSarray) {
                            jsdict.push({"eventid":durationsJSarray[key].eventid,"totalDuration":durationsJSarray[key].totalDuration, "numTurbines":turbinesJSarray[key].numTurbines});
                        }*/

                        // Other way to make js dictionary

                        for (var key in durationsJSarray) {
                            jsdict.push({"eventid":durationsJSarray[key].eventid,"totalDuration":durationsJSarray[key].totalDuration, "numTurbines":turbinesJSarray.find(o => o.eventid === durationsJSarray[key].eventid).numTurbines});
                        }

                        // Make graph

                        //sort bars based on value of duration
                        jsdict = jsdict.sort(function (a, b) {
                        return d3.descending(a.totalDuration, b.totalDuration);
                        })

                        //set up svg using margin conventions (leave room for labels)
                        var margin = {
                        top: 60,
                        right: 25,
                        bottom: 60,
                        left: 60
                        };

                        var width = 960 - margin.left - margin.right,
                        height = 500 - margin.top - margin.bottom;

                        var svg = d3.select("#top20FaultsGraph").append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                        //make scales 
                        var x = d3.scale.linear()
                        .range([0, width])
                        .domain([0, d3.max(jsdict, function (d) {
                            return d.totalDuration;
                        }) + 1 ]);

                        var y = d3.scale.ordinal()
                        .rangeRoundBands([height, 0], .1)
                        .domain(jsdict.map(function (d) {
                            return d.eventid;
                        }));

                        var maxNumTurbines = d3.max(jsdict, function (d) {
                            return d.numTurbines;
                        });

                        var t = d3.scale.linear()
                        .range([0, width])
                        .domain([0, maxNumTurbines + 1])
                                    
                        //make y axis to show bar names
                        var yAxis = d3.svg.axis()
                        .scale(y)
                        //no tick marks
                        .tickSize(0)
                        .orient("left");

                        var gy = svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)

                        // make top axis to show number of turbines
                        var topAxis = d3.svg.axis()
                            .orient("top")
                            .scale(t)
                            .ticks(maxNumTurbines+2) 
                            .tickFormat(d3.format("d"));

                        svg.append("g")
                        .attr("class", "top axis")
                        .call(topAxis);

                        // add a label for the top axis
                        svg.append("text")
                        .attr("transform", "translate(" + (width / 2) + " ," + (-40) + ")")
                        .style("text-anchor", "middle")
                        .text("Number of Turbines")

                        // make bottom axis to show number of hours
                        var bottomAxis = d3.svg.axis()
                            .orient("bottom")
                            .scale(x);

                        svg.append("g")
                        .attr("class", "bottom axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(bottomAxis);

                        // add a label for the bottom axis
                        svg.append("text")
                        .attr("transform", "translate(" + (width / 2) + " ," + (height + 50) + ")")
                        .style("text-anchor", "middle")
                        .text("Hours")

                        // add vertical grid lines
                        function make_gridlines(){
                        return d3.svg.axis().orient("bottom").scale(x);
                        }
                        svg.append("g")
                        .attr("class", "grid")
                        .attr("transform", "translate(0," + height + ")")
                        .call(make_gridlines().tickSize(-height, 0,0).tickFormat(""));


                        var bars = svg.selectAll(".bar")
                        .data(jsdict)
                        .enter()
                        .append("g")

                        //append turbines bars
                        bars.append("rect")
                        .attr("class", "barT")
                        .attr("y", function (d) {
                            return y(d.eventid) ;
                        })
                        .attr("height", y.rangeBand()) 
                        .attr("x", 1)
                        .attr("width", function (d) {
                            return t(d.numTurbines);
                        });

                        //append duration bars
                        bars.append("rect")
                        .attr("class", "barD")
                        .attr("y", function (d) {
                            return y(d.eventid)+5 ; // +5 to make bars slimmer
                        })
                        .attr("height", y.rangeBand()-10) // -10 to make bars slimmer
                        .attr("x", 1)
                        .attr("width", function (d) {
                            return x(d.totalDuration);
                        });



                        //add a value label in each bar
                        bars.append("text")
                        .attr("class", "label")
                        //y position of the label is halfway down the bar
                        .attr("y", function (d) {
                            return y(d.eventid) + y.rangeBand() / 2 + 4;
                        })
                        //x position is 5 pixels from the left of the bar
                        .attr("x", function (d) {
                            //return x(d.totalDuration) + 3;
                            return 5;
                        })
                        .text(function (d) {
                            return d.totalDuration + "  hours";
                        });

                        /*
                        // Make a legend
                        var legend = svg.selectAll(".legend")
                        .data(jsdict)
                        .enter()
                        .append("g")

                            legend.apend("rect")
                                .attr("fill", color)
                                .attr("width", 20)
                                .attr("height", 20)
                                .attr("y", 0)
                                .attr("x", 0);

                            legend.append("text")
                                .attr("class", "label")
                                .attr("y", function (d, i) {
                                    return i * legspacing - 46;
                                })
                                .attr("x", 30)
                                .text("hi");
                        */