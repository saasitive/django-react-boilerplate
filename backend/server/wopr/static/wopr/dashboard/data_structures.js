/*******************************************
    Data Structures Used In Dashboard
*******************************************/

/* See the link below about public and private variables in Javascript Classes
https://stackoverflow.com/questions/436120/accessing-private-member-variables-from-prototype-defined-functions */

// Constructor for the class D3ChartComponent
function D3ChartComponent(container, state){

    // Set the global variable reference to this instance
    chartComponent = this;

    this._chartData = window[state.dataSource_name]

    this._hotComponent = window[state.hot_reference_name]

    // Container and state used by GoldenLayout
    this._container = container; 
    this._state = state;

    // Config for the D3 Chart
    this._d3ChartConfig = {
      title: state.title,
      siteid: state.siteid
    };

    // Title of the GoldenLayout container
    this._container.setTitle(this._d3ChartConfig.title + ' for Site ' + this._d3ChartConfig.siteid);

    // Bind the function drawChart to an event 'open' of the container
    this._container.on( 'open', this._drawChart.bind( this ));
};

// Checks if the component has an svg tag added, if so, it removes it first before calling _drawChart()
D3ChartComponent.prototype.renderSVG = function(){
    this._svg.remove();
    this._drawChart();
}

// Draws the D3Chart of the Edits Allocation Tab
D3ChartComponent.prototype._drawChart = function() {

    if(this._svg){
      this._svg.selectAll("*").remove();
    }

    let data = this._chartData;

    let svg_height = (Math.round((24 + data.length) / 24) * 100).toString() + '%';

    // Reference the private variables of the class for the scope of the D3 functions inside _drawChart()
    let container = this._container;

    // Select the parent div of the container
    d3.select(container.getElement()[0]).attr('style', 'width: 100%; height: 100%;'); 

    this._main_view = d3.select(container.getElement()[0]).append('div').attr('style', 'overflow-y: auto; height: 95%; width: 100%').attr('id', 'main_view');
    this._xaxis_div = d3.select(container.getElement()[0]).append('div').attr('style', 'width:100%; height: 5%;').attr('id', 'xaxis_div');

    // Add the svg element
    let svg = this._svg = d3.select(container.getElement()[0].firstChild).append('svg')
    .attr("class", 'content-svg')
    .attr('id', 'content-svg')
    .attr("height", svg_height)
    .attr("width", '100%');

    /**
    if(parseFloat(container.getElement()[0].firstElementChild.firstElementChild.clientHeight) < 1387){
      this._svg.style('width', '1100px');
      this._svg.style('height', '1400px');
    }
     */

    this._xaxis_svg = this._xaxis_div.append('svg')
    .attr("width", '100%')
    .attr("height", '100%');

    // Define the div for the tooltip
    removeTooltip();
    this._tooltip = tooltip = d3.select('.container-fluid').append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
    
    // Define margin, width, and height
    let margin = {top: 20, right: 20, bottom: 20, left: 70};
    let width = parseInt(this._svg.style("width"), 10) - margin.left - margin.right;
    let height = parseInt(this._svg.style("height"), 10) - margin.top - margin.bottom;

    // (width, height);


    // Link to reference: https://bl.ocks.org/vwochnik/712c8131afc9b0be7f57a3dde95be47a
    // Create the selector
    let selection = this._selection = this._svg.append('path')
    .attr('class', 'selection')
    .attr('visibility', 'hidden');

    let _rect = this._rect;

    // svg._groups[0][0].parentNode.scrollTop

    let startSelection = this._startSelection = function(start) {
      selection.attr('d', _rect(start[0], start[0] + svg._groups[0][0].parentNode.scrollTop, 0, 0))
                  .attr('visibility', 'visible');
    };

    let moveSelection = this._moveSelection = function(start, moved){
      selection.attr("d", _rect(start[0], start[1] + svg._groups[0][0].parentNode.scrollTop, moved[0]-start[0], moved[1]-start[1]));
    };

    let endSelection = this._endSelection = function(start, end, mouseDragFlag) {
      selection.attr("visibility", "hidden");
      if(mouseDragFlag == 1){
        rectPointsSelector(start, end, svg);
      }
    };

    let mouseDragFlag = 0;

    this._svg.on("mousedown", function() {
      _resetRect();
      let subject = d3.select(window), parent = this.parentNode,
          start = d3.mouse(parent);
        startSelection(start);
        subject.on("mousemove.selection", function() {
            mouseDragFlag = 1;
            moveSelection(start, d3.mouse(parent));
          }).on("mouseup.selection", function() {
            endSelection(start, d3.mouse(parent), mouseDragFlag);
            mouseDragFlag = 0;
            subject.on("mousemove.selection", null).on("mouseup.selection", null);
        });
    });


    // Date and time range boundaries used by the xScale
    this.fromTime = moment.utc(ts_start_global).tz(timezone);
    this.toTime = moment.utc(ts_end_global).tz(timezone);

    // Get the number of ten minutes in the duration
    this.numOfTenMinutesInDuration = Date.minutesBetween(this.fromTime, this.toTime) / 10;

    // Get the width of a full 10 min block
    let widthOfTenMinuteBlock = width / this.numOfTenMinutesInDuration;

    // console.log(width, widthOfTenMinuteBlock);

    // Define the X and y scales
    let xScale =  this.xScale = d3.scaleTime()
              .domain([this.fromTime, this.toTime])
              .range([0, width]);

    let yScale = this.yScale = d3.scaleBand()
              .domain([...chartData.map(function(entry){
                return ("Turbine " + entry.turbine);
              })])
              .rangeRound([0, height])
              .padding([0.85]);
    
    if(this._chartData.length < 5){
      yScale.padding([100]);
    }


    let main_content = this._svg.append('g')
    .attr('class', 'main_content')
    .attr('transform', `translate(${margin.left}, 0)`)

    // Add the y axis to the left without any transformation
    main_content.append('g')
    .attr("class", "axis axis--y")
    .attr("id", 'y-axis')
    .attr("color", "white")
    .call(d3.axisLeft(yScale));

    // Apply a class to each tick to make it non selectable, and able to edit by turbine
    d3.selectAll('.axis.axis--y>g.tick>text').attr('class', 'unselectable').on("click", function(text, index, nodeListSet){
      console.log(text);
    });

    // Add the x axis to the bottom using transformation
    this._xaxis_svg.append('g')
    .attr("class", "axis axis--x")
    .attr("color", "white")
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisBottom(xScale)); //.ticks(d3.timeMinute.every(10))); // Change this to manually adjust the x-axis ticks

    // Apply a class to each tick to make it non selectable, and able to edit by turbine
    d3.selectAll('.axis.axis--x>g.tick>text').attr('class', 'unselectable').on("click", function(text, index, nodeListSet){
      console.log(text);
    });
    
    data.forEach(function (turbine) {

      let g = main_content.append('g').attr('class', 'g-' + turbine.turbine).on('click',function(){
      })

      let translation_y = 0;

      /**
       for(let i = 0; i < data.length; i++){
        if(i > 0)
          translation_y -= (16/i);
      }

      if(translation_y < 0)
        translation_y = 0;
       */

      // 20, 12.5, 7.5, 5, 2.5, 0

      // Create the bar
      g.append('g').selectAll("rect")
      .data(turbine.data)
      .enter()
      .append('rect')
      .attr('transform', `translate(${2.5 * stroke_width}, ${translation_y})`)
      .attr("class", "rect-points")
      .attr('x', function(point){
        return xScale(moment(point.ts_start_UTC).tz(timezone));
      })
      .attr('y', function(point){
        return yScale("Turbine " + point.turbine);
      })
      .attr("width", function(point){
        let start = moment(point.ts_start_UTC).tz(timezone);
        let end = moment(point.ts_end_UTC).tz(timezone);

        if(Date.minutesBetween(start, end) <= 0){
          return 0;
        }
        // Means that each rect is super small
        if(widthOfTenMinuteBlock * Date.minutesBetween(start, end) / 10 - stroke_width < 0)
          return (widthOfTenMinuteBlock * Date.minutesBetween(start, end) / 10);
        
        // Else, give space for the stroke_width to make it look nicer
        return (widthOfTenMinuteBlock * Date.minutesBetween(start, end) / 10) - stroke_width;
      })
      .attr("height", 10)  // the width of the horizontal bar

      // Determine the color of the bar
      .style("fill", function(point){
        return point.stateColor;
      })
      .on("mouseover", function(point, index) {

        d3.select(this).attr("stroke", "blue").attr("stroke-width",stroke_width);

        let show = true;
        chartComponent._handleToolTip(show, point, index, this);

        })					
      .on("mouseout", function(point, index) {

        d3.select(this).attr("stroke", "none")

        let show = false;
        chartComponent._handleToolTip(show, point, index, this); 

      })
      .on("click", function(point, index){


        d3.selectAll('rect').on("mouseover", function(point, index) {
          d3.select(this).attr("stroke", "blue").attr("stroke-width",stroke_width);
        })					
        .on("mouseout", function(point, index) {
          d3.select(this).attr("stroke", "none")
        });

        d3.select(this).attr("stroke", "red").attr("stroke-width",stroke_width)
        .on("mouseout", function(point, index) {
            
        })
        .on("mouseover", function(point, index) {
          
        });

        // call the global function to select the cell in the table and move the viewport
        selectAndScrollToCell(point, index);

        let show = true;
        chartComponent._handleToolTip(show, point, index, this);
        
        

      });

    });
    
    // Bind function calls D3ChartComponent._setSize() whenever the layout size changes
    this._container.on( 'resize', this._sizeCallBack.bind( this ) );

}

D3ChartComponent.prototype._removeSVG = function(){
  this._svg.remove();
}

D3ChartComponent.prototype._rect = function(x, y, w, h) {
  return "M"+[x,y]+" l"+[w,0]+" l"+[0,h]+" l"+[-w,0]+"z";
}

D3ChartComponent.prototype._handleToolTip = function (show, point, index, rect) {
  if(show){

    let stateColorScheme = window['stateColorScheme'];
    let systemColorScheme = window['systemColorScheme'];
    let system_list = getListOfSystemDescription(systemColorScheme);
    system_list.forEach(function(description){
      description['color'] = getSystemInfo(description['systemid'], systemColorScheme)['color'];
    });

    let power_diff = round(1 - point.kw_net / point.kw_exp, 2), color, sign;
    if(power_diff < 0){
      color = 'red';
      sign = '+';
    }
    else if(power_diff > 0){
      color = 'green';
      sign = '-'
    }
    else{
      color = 'white';
      sign = ''
    }

    let pageX, pageY;
    if(d3.event){
      pageX = d3.event.pageX;
      pageY = d3.event.pageY;
    }
    else{
      pageX = parseInt(tooltip.style('left').split('px')[0], 10);
      pageY = parseInt(tooltip.style('top').split('px')[0], 10);

    }
    
    if(pageX / $(window).width() >= 0.80){
      pageX = $(window).width() * 0.80;
    }
    if(pageY / $(window).height() > 1){
      pageY -= 300;
    }

    tooltip.transition()		
          .duration(200)		
          .style("opacity", 1)
          .style('display', 'block');		
          tooltip.html('<i class="fas fa-edit"></i><br/><b>ts_start: </b><br/>' + point.ts_start_string + "<br/>" + '<b>ts_end: </b><br/>' + point.ts_end_string + "<br/><b>" + 'Power Diff: </b>' + 
          '<p style="color:' + color +  ';">' + sign + power_diff + '</p>'
          + "<b>" + "Avg. Windspeed : </b>" + round(point.windspeed, 2) + '</br></br>'
          + "<b id='state-tooltip'>" + "State : <p style='color:" + point.stateColor + ";'>" + point.state + "</p></b>"
          + "<b id='system-tooltip'>" + "System : <p style='color:" +  point.systemColor + ";'>" + point.system + "</p></b>" + "<br/>")
            .style("left", (pageX) + "px")		
            .style("top", (pageY) + 10 + "px");

    document.getElementsByClassName('fas fa-edit')[0].addEventListener("click", function(){          

      $('.tooltip>.fas.fa-edit').replaceWith('<div class="min-tooltip-options"></div>');

      $('.min-tooltip-options').append('<button id="detailed-edit-btn" class="btn btn-warning">Detailed Edit</button>');

      $('#detailed-edit-btn').on("click", function(){
        editingTooltip(point);
      });

      $('.tooltip').append('<button class="btn btn-success" id="min-tooltip-finish-btn">Finish Editing</button>');
      $('#min-tooltip-finish-btn').on("click", function(){
        D3ChartComponent.prototype._handleToolTip(show, point, index, rect);
      });

      $('#state-tooltip>p').replaceWith('<select id="min-tooltip-state" style="height: 25px; background-color:' + point.stateColor +';"></select>')

      // Change the background color on change of the selected option (state change)
      $('#min-tooltip-state').on('change', function(){
        let color_of_selected = $('#min-tooltip-state>option:selected')[0].style['background-color'];
        $('#min-tooltip-state').css({'background-color': color_of_selected, 'border-color': color_of_selected});
        let oldValue = point.state;
        point.state = $('#min-tooltip-state')[0].selectedOptions[0].text;
        point.stateColor = $('#min-tooltip-state')[0].selectedOptions[0].style['background-color'];

        $('g.g-'+ point.turbine.toString(10) +'>g>rect').each(function(index, rect){
          if(_.isEqual(rect.__data__, point)){
            rect.style.fill = point.stateColor;
          }
        })

        let obj = {turbine: point.turbine, ts_start: point.ts_start.toISOString(), ts_end: point.ts_end.toISOString(),
                              column: 'state', oldValue: oldValue, newValue: point.state}
        changesArray.push(obj);
        changesSaved = false;
        applyChanges(changesArray, data);
        

        if(hotComponent && !hotComponent.table.isDestroyed){
          let tableSchema = generateTableData(data);

          tableData = tableSchema['tableData'];
          columnsHeader = tableSchema['columnsHeader'];
          columnsMeta = tableSchema['columnsMeta'];

          hotComponent._tableData = tableData;
          hotComponent.table.updateSettings({
              data: hotComponent._tableData,
              colHeaders: columnsHeader,
              columns: columnsMeta,
          });
        }


      });

      stateColorScheme.forEach(function(state_object){
        if(state_object.state === point.state){
          $('#min-tooltip-state').append('<option selected="selected" style="background-color:' + state_object.color + ' ; color: black;">' + state_object.state  +  '</option>')
        }
        else{
          $('#min-tooltip-state').append('<option style="background-color:' + state_object.color + ' ; color: black;">' + state_object.state  +  '</option>')
        }
      });
      $('#system-tooltip>p').replaceWith('<select id="min-tooltip-system" style="height: 25px; background-color:' + point.systemColor +';"></select>');
      
      // Change the background color on change of the selected option (system change)
      $('#min-tooltip-system').on('change', function(){
        let color_of_selected = $('#min-tooltip-system>option:selected')[0].style['background-color'];
        $('#min-tooltip-system').css({'background-color': color_of_selected, 'border-color': color_of_selected});
        let oldValue = point.system;
        point.system = $('#min-tooltip-system')[0].selectedOptions[0].getAttribute('description');
        point.systemColor = $('#min-tooltip-system')[0].selectedOptions[0].style['background-color'];

        let obj = {turbine: point.turbine, ts_start: point.ts_start.toISOString(), ts_end: point.ts_end.toISOString(),
          column: 'system', oldValue: oldValue, newValue: point.system}
        changesArray.push(obj);
        changesSaved = false;
        applyChanges(changesArray, data);

        if(hotComponent && !hotComponent.table.isDestroyed){
          let tableSchema = generateTableData(data);

          tableData = tableSchema['tableData'];
          columnsHeader = tableSchema['columnsHeader'];
          columnsMeta = tableSchema['columnsMeta'];

          hotComponent._tableData = tableData;
          hotComponent.table.updateSettings({
              data: hotComponent._tableData,
              colHeaders: columnsHeader,
              columns: columnsMeta,
          });
        }


      });
      system_list.forEach(function(system_object){
        if(system_object.description == point.system){
          $('#min-tooltip-system').append('<option selected="selected" description="'+ system_object.description +'" style="background-color:' + system_object.color + ' ; color: black;">' + system_object.system + ' - ' + system_object.description.split('-').pop()  +  '</option>')
        }
        else{
          $('#min-tooltip-system').append('<option description="'+ system_object.description +'" style="background-color:' + system_object.color + ' ; color: black;">' + system_object.system + ' - ' + system_object.description.split('-').pop()  +  '</option>')
    
        }
      });

    });
  }
  else{
    tooltip.transition()		
    .duration(200)		
    .style("opacity", 0)
    .style('display', 'none');
  }
}

// Callback function whenever the container is resized
D3ChartComponent.prototype._sizeCallBack = function () {  

    this.xScale = d3.scaleTime()
    .domain([this.fromTime, this.toTime])
    .range([0, parseInt(this._svg.style("width"), 10) - 90]);

    d3.select('g.axis.axis--x')
    .attr('transform', `translate(70, 0)`)
    .call(d3.axisBottom( this.xScale)); 
    
    this.yScale =  d3.scaleBand()
    .domain(chartData.map(function(entry){
      return ("Turbine ") + entry.turbine;
    }))
    .rangeRound([0, parseInt(this._svg.style("height"), 10) - 40])
    .padding([0.85]);

    if(this._chartData.length < 5){
      yScale.padding([100]);
    }
    
    // Add the y axis to the left without any transformation
    d3.select('g.axis.axis--y')
    .call(d3.axisLeft(this.yScale));

    // Get the width of the chart
    let width = (parseInt(this._container.width, 10) - 90);

    // Get the width of a full 10 min block
    let widthOfTenMinuteBlock = width / this.numOfTenMinutesInDuration;

    // Assign to a variable in the scope of this function
    let xScale = this.xScale, yScale = this.yScale;

    d3.selectAll('.rect-points')
    .attr('transform', `translate(${2.5 * stroke_width}, ${0})`)
    .attr('x', function(point){
      return xScale(moment(point.ts_start_UTC).tz(timezone));
    })
    .attr('y', function(point){
      return yScale("Turbine " + point.turbine);
    })
    .attr("width", function(point){
      let start = moment(point.ts_start_UTC).tz(timezone);
      let end = moment(point.ts_end_UTC).tz(timezone);

      if(Date.minutesBetween(start, end) <= 0){
        return 0;
      }
      // Means that each rect is super small
      if(widthOfTenMinuteBlock * Date.minutesBetween(start, end) / 10 - stroke_width < 0)
        return (widthOfTenMinuteBlock * Date.minutesBetween(start, end) / 10);
      
      // Else, give space for the stroke_width to make it look nicer
      return (widthOfTenMinuteBlock * Date.minutesBetween(start, end) / 10) - stroke_width;
    })
    .attr("height", 10);  // the width of the horizontal bar
}

/***************************************
        Creating the HandsonTable
***************************************/
  
HandsonTableComponent = function (container, state){
  
  // Assign reference to global variable in dashboard.html
  if(state.reference_name)
    window[state.reference_name] = this;

  // Assign a reference to the D3ChartComponent
  if(state.chart_reference_name){
    this._chartComponent = window[state.chart_reference_name]
    // Make this instance known to the D3ChartComponent
    this._chartComponent._hotComponent = this;
  }

  if(state.dataSource_name)
    this._tableData = window[state.dataSource_name];

  if(state.headers_name)
    this._columnsHeader = window[state.headers_name];
    
  if(state.columnsMeta)
    this._columnsMeta = window[state.columnsMeta];

  // The svg tag and the parent div lm_content of the container
  this._hotDiv = null, this._lm_content = null;

  // Container and state used by GoldenLayout
  this._container = container;
  this._state = state;

  // HandsonTable configurations
  this._HOTConfig = {
    data: this._tableData,
    colHeaders: this._columnsHeader,
    columns: this._columnsMeta,
    manualColumnFreeze: true,
    manualColumnResize: true,
    manualRowResize: true,
    rowHeaders: true,
    contextMenu: true,
    comments: true,
    
    
    // API reference of HandsonTable hooks and events here: https://handsontable.com/docs/6.2.2/Hooks.html

    // Catching afterSelection event
    afterSelection: (startRow, startColumn, endRow, endColumn) => {

      let tableData = this._tableData;

      // Get all the selected cells
      this.table.getSelected().forEach(function(array){

        var startRow = array[0], 
        startColumn = array[1], 
        endRow = array[2], 
        endColumn = array[3];

        // Change each rect to look like it has been "clicked"
        _clickARect(startRow, startColumn, endRow, endColumn, tableData);

      });
    },

    afterChange: (changes, source) => {
      
      if(source === "UndoRedo.undo")
        return;

      if(changes){
        changes.forEach(([row, column, oldValue, newValue]) => {
          if(oldValue === newValue)
            return;

          if(column.indexOf('state') !== -1 || column.indexOf('system') !== -1){

            changesSaved = false;
            // Regex
            let turbineNumber = column.replace(/\D/g, "");

            if(column.indexOf('state') !== -1 && turbineNumber >= 1){
              // Have to change the color for now
              let stateInfo = getStateInfo(newValue, window['stateColorScheme']);
              let dataTurbineToChange = data.filter(obj=> obj['turbine'] == turbineNumber);
              if((dataTurbineToChange.length > 0 && dataTurbineToChange[0]['data'])){
                dataTurbineToChange[0]['data'][row]['color'] = stateInfo['color'];
                dataTurbineToChange[0]['data'][row]['stateid'] = stateInfo['code'];
                dataTurbineToChange[0]['data'][row]['state'] = stateInfo['state'];
              
              
                changesArray.push({turbine: turbineNumber, ts_start: dataTurbineToChange[0]['data'][row]['ts_start_UTC'], ts_end: dataTurbineToChange[0]['data'][row]['ts_end_UTC'],
                              column: 'state', oldValue: oldValue, newValue: newValue})
              }
            }
            else if(column.indexOf('system') !== -1 && turbineNumber >= 1){
              let dataTurbineToChange = data.filter(obj=> obj['turbine'] == turbineNumber);


              if((dataTurbineToChange.length > 0 && dataTurbineToChange[0]['data'])){
                // Have to change the systemid in data
                dataTurbineToChange[0]['data'][row]['system'] = newValue;
                
                changesArray.push({turbine: turbineNumber, ts_start: dataTurbineToChange[0]['data'][row]['ts_start_UTC'], ts_end: dataTurbineToChange[0]['data'][row]['ts_end_UTC'],
                column: 'system', oldValue: oldValue, newValue: newValue})
              }
            }
          }
            
        });     
        applyChanges(changesArray, data);
        if(sceneNum == 3){
          setTimeout(function(){
            chartComponent._chartData = generateChartData(data);
            chartComponent.renderSVG();
          }, 0);
       }
      }

    },
  };

  // Goldenlayout Container title
  this._container.setTitle(this._state.title);

  // Bind the function _drawTable to an event "open" of the container
  this._container.on( 'open', this._drawTable.bind( this ));
};

// _drawTable function
HandsonTableComponent.prototype._drawTable = function() {
  // Select the parent div of the container
  this._lm_content = this._container.getElement()[0];

  // Create the HandsonTable
  this.table = new Handsontable(this._lm_content, this._HOTConfig);

  // Bind function calls HandsonTable._setSize() whenever the layout size changes
  this._container.on( 'resize', this._sizeCallBack.bind( this ) );

  this._container.on( 'destroy', this._destroyTable.bind(this));
};

HandsonTableComponent.prototype._destroyTable = function () {
  if(!this.table.isDestroyed){
    this.table.destroy();
  }
}

// Callback function whenever the container is resized
HandsonTableComponent.prototype._sizeCallBack = function () {

  this.table.updateSettings({
    width: parseInt(this._container.width, 10),
    height: parseInt(this._container.height, 10)

  });
    this.table.render();
    this.table.render();

};

/***************************************
      Creating the Site Map
***************************************/
 
SiteMapClass = function (container, state){
  // Set the global variable reference to this instance    
  this._container = container;
  this._state = state;
   
  //Title of GoldenLayout container
  this._container.setTitle('Map for Site ' + this._state.siteid);
   
    //Bind drawChart to open of container
    this._container.on('open', this._myDrawMap.bind(this));
   
   
};
   
SiteMapClass.prototype._myDrawMap = function(){
  this._lm_content = d3.select(this._container.getElement()[0]);
  this._myDiv = this._lm_content.append('div').attr("class", "SiteMapClass");
  this._myDiv = this._myDiv.attr("id", "mapid");

  console.log(this._state.siteid);
  
  var substationX = 0;
  var substationY = 0;
  var requestedId = this._state.siteid;
  //need to figure out where the substation is based on site id
  site_locations['locations'].forEach(function(element, index) {
    if (index < site_locations['locations'].length)
    {
      if (site_locations['locations'][index]['siteid'] == ('' + requestedId)) //found the index for the right substation
      {
        substationX = element.x;
        substationY = element.y;
      }
    }
  });

  
  var map = L.map('mapid', {
    center: [substationX, substationY],
    zoom: 13
  });
  
  //draw the map's background (landscape)
  var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>', maxZoom: 18, id: 'mapbox-streets-v8', accessToken: 'pk.eyJ1IjoibHRlbGxpb3R0IiwiYSI6ImNqcXY4N2dkYTBhNTg0NG5wYmRoZXVyNHoifQ._JCT8HvCYLYf8BbgkFLJ8g'});
  map.addLayer(layer);

  //drop a marker for the substation and label it
  var marker1 = new L.marker([substationX, substationY]);
  marker1.bindPopup('Substation');
   
  var turbineMarkers =  [];
  let averagePowerEfficiency = 0;

  
  // Added an if statement to check if the turbine_markers have been cached already or not

  if(data.length != 0 && turbine_markers_global.length == 0){ // not cached / not in session
    
    turbine_locations['' + this._state.siteid].forEach(function(element, index) {
      if(index < data.length){
        averagePowerEfficiency = 0;
        data[index]['data'].forEach(function(point){
          averagePowerEfficiency += (point.kw_net / point.kw_exp);
        })
        averagePowerEfficiency /= data[index]['data'].length;
        averagePowerEfficiency *= 100;
    
        //console.log(averagePowerEfficiency);
        if (averagePowerEfficiency >= 65)
        {
          turbineMarkers.push(new L.circle([element.x, element.y], {color: 'green', fillColor: 'green', radius: 25}).bindPopup(element.turbineid + "\nAverage Efficiency: " + averagePowerEfficiency));
      
        } else {
          turbineMarkers.push(new L.circle([element.x, element.y], {color: 'red', fillColor: 'red', radius: 25}).bindPopup(element.turbineid + "\nAverage Efficiency: " + averagePowerEfficiency));
      
        }
      }
    });
    turbine_markers_global = turbineMarkers;
  }
  else{ // cached/stored in session
    turbineMarkers = turbine_markers_global;
  }
   
  map.addLayer(marker1);
   
  for (var i = 0; i < turbineMarkers.length; i++)
  {
    map.addLayer(turbineMarkers[i]);
  }
   
  };