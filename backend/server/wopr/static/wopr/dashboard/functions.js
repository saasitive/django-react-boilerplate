/******************************************
          Date Utility Functions
 *****************************************/

/* Change the format of the date to yyyy:mm:dd HH:MM: */
function formatDate(current_datetime){
  return current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes()
}

/* Change the timezone */
function changeTimezone(tz, csrf_token){

  d3.select('.container-fluid').attr('style', 'display: none;');            
  let element = d3.select('#content-wrapper').append('div').attr('class', 'loader');

  $.ajax({
    url: "timezone/",
      data:{
          timezone: tz,
          csrfmiddlewaretoken: csrf_token
      },
      type: "POST",
      
      success: function (response) {
        
        $('#timezone-display').text('All times are on ' + tz + '.').css("font-weight","Bold");
        if(typeof timezone != 'undefined'){
          timezone = tz;
        }

        if(typeof data != 'undefined' && data){
          data = dataChangeTimezone(data, timezone);
          unmodifiedData = dataChangeTimezone(unmodifiedData, timezone);

          // Saves the data array in IndexedDB for caching later
          saveData(unmodifiedData).then(function(result){
            console.log(result);
            let message = 'Data is saved in IndexedDB.'  
            console.log(message);
          }); 



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

          if(sceneNum == 0 || sceneNum == 3){
            chartData = chartDataChangeTimezone(chartData, timezone);
            element.remove();
            d3.select('.container-fluid').attr('style', 'display: block;');
            chartComponent._chartData = chartData;
            removeTooltip();
            chartComponent.renderSVG();
          }
        }
        
        if(element){
          element.remove();
          d3.select('.container-fluid').attr('style', 'display: block;');
        }
      }
  });
}

/* Get the minutes in between two dates */
Date.minutesBetween = function( date_from, date_to ) {

  date_from_local = new Date(date_from);
  date_to_local = new Date(date_to);

  //Get 1 minute in milliseconds
  var one_minute=1000*60;

  // Convert both dates to milliseconds
  var date_from_ms = date_from_local.getTime();
  var date_to_ms = date_to_local.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date_to_ms - date_from_ms;
    
  // Convert back to days and return
  return Math.round(difference_ms/one_minute); 
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}


/******************************************
          Date Exporting Functions
 *****************************************/

// Function called to export the data to csv
function exportToCSV(data, siteid){
  if(data.length > 0){
    let items = _.cloneDeep(data);

    items.forEach(function(v){
      v.ts_start_string = v.ts_start_string.replace(', ', ' ');
      v.ts_end_string = v.ts_end_string.replace(', ', ' ');
      delete v.ts_start_UTC;
      delete v.ts_end_UTC;
    });
  
    let csvContent = "data:text/csv;charset=utf-8,";
    var header = ["ts_start", "ts_end", "periodid", "kw_exp","kw_net", "windspeed"];
    for (let i = 0; i < 47; i++){
      header.push('state' + (i+1).toString(10));
      header.push('system' + (i+1).toString(10)); 
    }
    header = header.join(",");
    csvContent += header + "\r\n";

    items.forEach(function(rowObject){
      var arr = Object.keys(rowObject).map(function(k) { return rowObject[k]; });
      let row = arr.join(",");
      csvContent += row + "\r\n";
    }); 

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", 'Site ' + siteid.toString(10) + " Edits Allocation.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv".
  }
};

/*******************************************************
      Functions Altering the D3Chart or HandsonTable
*******************************************************/

function selectAndScrollToCell(point, index){
  if(hotComponent && !hotComponent.table.isDestroyed){
    let column = 2*(point.turbine) + 2;

    let minRow = hotComponent._tableData.findIndex(obj => obj['ts_start_string'] == point['ts_start_string']); 
    let maxRow = hotComponent._tableData.findIndex(obj => obj['ts_end_string'] == point['ts_end_string']); 

    hotComponent.table.selectCell(minRow, column, maxRow, column + 1, true, false);
    hotComponent.table.scrollViewportTo(minRow - 4, column - 2);
  }
};

function _clickARect(startRow, startColumn, endRow, endColumn, tableData){

  d3.selectAll('rect').attr("stroke", "none")// Clear all selected rect

  // d3.selectAll('rect').filter(function(d, i){return i == row;}).dispatch('click'); // simulates a click of the rect tag but goes on an infinite loop
  let minRow = startRow, maxRow = endRow, minColumn = startColumn, maxColumn = endColumn;

  // Backwards selection(s)
  if(startRow > endRow){
    minRow = endRow;
    maxRow = startRow;
  }

  if(startColumn > endColumn){
    minColumn = endColumn;
    maxColumn = startColumn;
  }

  for(let i = minColumn; i <= maxColumn; i++){
    for(let j = minRow; j <= maxRow; j++){

      // User selected either a turbine state or system column
      if(i >= 4){

        let selectedColumn = i;
        // If the user selects a system column
        if(i % 2 != 0)
          selectedColumn -= 1;

        // Revert back the column number to the corresponding turbine number        
        let turbine_num = (selectedColumn - 2) / 2

        // Set all rect points stroke to red if it lies within the date that the user clicked
        d3.selectAll('g.g-' + turbine_num+ '>g>rect').filter(function(d, i){return  moment.utc(tableData[j]['ts_start_UTC']).tz(timezone) >= d['ts_start'] && moment.utc(tableData[j]['ts_end_UTC']).tz(timezone) <= d['ts_end'] ? true : false ;}).attr('stroke', 'red').attr('stroke-width', stroke_width);
      }
    }
  }
}

function rectPointsSelector(start, end, svg){
  
  _resetRect();

  let rectx_start = start[0], rectx_end = end[0], recty_start = start[1] + svg._groups[0][0].parentNode.scrollTop, recty_end = end[1] + svg._groups[0][0].parentNode.scrollTop;
  
  if(Math.abs(rectx_end - rectx_start) <= 10 && Math.abs(recty_end - recty_start) <= 10){ // handle a click
    return
  }

  console.log(rectx_start, recty_start, rectx_end, recty_end);

  for(let i = 0; i < d3.selectAll('.rect-points')._groups[0].length; i++){
    let x_start = d3.selectAll('.rect-points')._groups[0][i].getBBox()['x'];
    let x_end = d3.selectAll('.rect-points')._groups[0][i].getBBox()['x'] + d3.selectAll('.rect-points')._groups[0][i].getBBox()['width'];
    let y_start = d3.selectAll('.rect-points')._groups[0][i].getBBox()['y'];
    let y_end = d3.selectAll('.rect-points')._groups[0][i].getBBox()['y'] + d3.selectAll('.rect-points')._groups[0][i].getBBox()['height'];

    // Check each corner of the selector to see if it overlaps with a data point
    let overlap = false;
    if(rectx_start >= x_start && rectx_start <= x_end && recty_start >= y_start && recty_start <= y_end){ // top-left corner
      overlap = true;
    }
    else if(rectx_end >= x_start && rectx_end <= x_end && recty_start >= y_start && recty_start <= y_end){ // top-right corner
      overlap = true;
    }
    else if(rectx_start >= x_start && rectx_start <= x_end && recty_end >= y_start && recty_end <= y_end){ // bottom-left corner
      overlap = true;
    }
    else if(rectx_end >= x_start && rectx_end <= x_end && recty_end >= y_start && recty_end <= y_end){ // bottom-right corner
      overlap = true;
    }

    
    if(overlap)
      d3.selectAll('.rect-points')._groups[0][i].dispatchEvent(new MouseEvent('click', {clientX: x_start, clientY: y_start}))

  }
  
}
function _resetRect(){
  
  tooltip.transition()		
    .duration(200)		
    .style("opacity", 0)
    .style('display', 'none');
  
  d3.selectAll('rect').attr("stroke", "none")
  .on("mouseover", function(point, index) {

    d3.select(this).attr("stroke", "blue").attr("stroke-width",stroke_width);

    let show = true
    chartComponent._handleToolTip(show, point, index, this);

    })					
  .on("mouseout", function(point, index) {

    d3.select(this).attr("stroke", "none");
    
    let show = false
    chartComponent._handleToolTip(show, point, index, this);
  })
}

function applyChanges(changesArray, data){
  if(!changesArray || !changesArray.length > 0){
    changesArray = [];
    return;
  }
    
  changesArray.forEach(function(changeObj){

    let date_start = moment.utc(changeObj['ts_start']).tz(timezone),
    date_end = moment.utc(changeObj['ts_end']).tz(timezone);

    let dataTurbineToChange = data.filter(obj=> obj['turbine'] == changeObj['turbine']);

    if(dataTurbineToChange.length > 0 && dataTurbineToChange[0]['data']){
      let filtered = dataTurbineToChange[0]['data'].filter(obj => obj['ts_start'] >= date_start &&
                  obj['ts_end'] <= date_end);

      filtered.forEach(function(filtered_object){
        let objectToChange = dataTurbineToChange[0]['data'].find(obj => obj === filtered_object);
        //console.log(objectToChange);
        if(changeObj['column'] === 'state' && objectToChange){
          let stateInfo = getStateInfo(changeObj['newValue'], stateColorScheme);
          objectToChange['stateid'] = stateInfo['code'],
          objectToChange['stateColor'] = stateInfo['color'],
          objectToChange['state'] = stateInfo['state']
        }
        else if(changeObj['column'] === 'system' && objectToChange){
          // Implement get systemid based on description
          let systemInfo = getSystemInfo(changeObj['newValue'], systemColorScheme);
          objectToChange['system'] = changeObj['newValue'];
          objectToChange['systemid'] = systemInfo['systemid'];
          objectToChange['systemColor'] = systemInfo['color'];
        }
      });
    }

    //console.log(filtered);

  })
}

// Create the tooltip
function editingTooltip(point){
  $('.tooltip').css('display', 'none');
  $('.modal-title').text('Edit Timeslot(s) for Turbine ' + point.turbine);

  let system_list = getListOfSystemDescription(systemColorScheme);
  system_list.forEach(function(description){
    description['color'] = getSystemInfo(description['systemid'], systemColorScheme)['color'];
  });

  $('.modal-body>form>div').empty();
  $('.modal-body>form>div').append('<label for="ts-start-sel">Timestamp(s) (hold shift or ctrl or drag to select more than one):</label>')
  .append('<input style ="margin-bottom: 10px;" type="button" id="select_all" name="select_all" value="Select All"></input>')
  .append('<select class="form-control" multiple id="ts-start-sel"</select>');
  point.fine_data.forEach(function(object){
    $('#ts-start-sel').append('<option value="' + moment.utc(object.ts_start_UTC).tz(timezone).toISOString() + ';' + moment.utc(object.ts_end_UTC).tz(timezone).toISOString() + '">' + moment.utc(object.ts_start_UTC).tz(timezone).format("MM/DD/YYYY hh:mm A z")  +  '</option>')
  });

  $('.modal-body>form>div').append('<label for="state-sel">State:</label>').append('<select class="form-control" id="state-sel"</select>');
  stateColorScheme.forEach(function(state_object){
    if(state_object.state === point.state){
      $('#state-sel').append('<option selected="selected" style="background-color:' + state_object.color + ' ; color: black;">' + state_object.state  +  '</option>')
    }
    else{
      $('#state-sel').append('<option style="background-color:' + state_object.color + ' ; color: black;">' + state_object.state  +  '</option>')
    }
  });

  $('.modal-body>form>div').append('<label for="system-sel">System:</label>').append('<select class="form-control" id="system-sel"</select>');
  system_list.forEach(function(system_object){
    if(system_object.description == point.system){
      $('#system-sel').append('<option selected="selected" description="'+ system_object.description +'" style="background-color:' + system_object.color + ' ; color: black;">' + system_object.description  +  '</option>')
    }
    else{
      $('#system-sel').append('<option description="'+ system_object.description +'" style="background-color:' + system_object.color + ' ; color: black;">' + system_object.description  +  '</option>')

    }
  });

  let change = false;

  $('#modal-button').on("click dblclick", function(e){
    console.log("click");

    /*  Prevents default behaviour  */
    e.preventDefault();
  
    /*  Prevents event bubbling  */
    e.stopPropagation();

    e.stopImmediatePropagation();

    if($('select#ts-start-sel').val() == null){
      alert('Please select a time to edit!');
      return
    }

    $('select#ts-start-sel').val().forEach(function(ts){

      if(point.state != $('#state-sel').val() && $('#state-sel').val()){
        let obj = {turbine: point.turbine, ts_start: ts.split(';')[0], ts_end: ts.split(';')[1],
                              column: 'state', oldValue: point.state, newValue: $('#state-sel').val()}
        changesArray.push(obj);
        changesSaved = false;
        change = true;
      } 

      if(point.system != $('#system-sel').val() && $('#system-sel').val()){
        let obj = {turbine: point.turbine, ts_start: ts.split(';')[0], ts_end: ts.split(';')[1],
                              column: 'system', oldValue: point.system, newValue: $('#system-sel').val()}
        changesArray.push(obj);
        changesSaved = false;
        change = true;

      }       
    });

    if(change){
      change = false;
      applyChanges(changesArray, data);
      chartComponent._chartData = chartData =  generateChartData(data);
      removeTooltip();
      chartComponent.renderSVG();
      
      alert('Changes were successful.');

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
    }
  })

  $('#select_all').click( function() {
    $('#ts-start-sel option').prop('selected', true);
  });

  $('#editModal').on('hidden.bs.modal', function () {
    $('.tooltip').css('display', 'block');
    $('#modal-button').prop("onclick", null).off("click");
  })

  $('#editModal').modal('show')

}
/**********************************************
                Data Processing
**********************************************/

function processDataArray(rawDataList){

  // CLear the data array
  let global_data_array =  [];

  // Create the data array to hold the values
  rawDataList.forEach(function(turbine, index){      

    // Create a temporary object
    let turbineObjectRaw = _.omit(turbine, ['data', 'nws']);
    turbineObjectRaw['data'] = [];
    turbineObjectRaw['edited'] = false;

    // Populate the data array inside the turbine object
    for(let i = 0; i < turbine['data'].length; i++){

      // Get the state information (color, description etc.)
      let stateInfo = getStateInfo(turbine['data'][i]['stateid'], stateColorScheme);

      // Get the system information (color)
      let systemInfo = getSystemInfo(turbine['data'][i]['systemid'], systemColorScheme)

      // Create a moment.js date based on the UTC date string received from database
      let ts_start_moment = moment.utc(turbine['data'][i]['ts_start']).tz(timezone);
      let ts_end_moment = moment.utc(turbine['data'][i]['ts_end']).tz(timezone);
      
      // Format the objects inside the array, add variables here to use in either the HandsonTable or the D3 chart
      
      turbineObjectRaw.data.push({

        ts_start: ts_start_moment,
        ts_start_string: ts_start_moment.format("MM/DD/YYYY hh:mm A z"),
        ts_start_UTC: turbine['data'][i]['ts_start'],

        ts_end: ts_end_moment,
        ts_end_string: ts_end_moment.format("MM/DD/YYYY hh:mm A z"),
        ts_end_UTC: turbine['data'][i]['ts_end'],

        periodid: turbine['data'][i]['periodid'],
        kw_exp: turbine['data'][i]['kw_exp'],
        kw_net: turbine['data'][i]['kw_net'],
        windspeed: turbine['data'][i]['nws'],
        stateid: turbine['data'][i]['stateid'],
        state: stateInfo['state'],
        system: systemInfo['description'],
        systemid: turbine['data'][i]['systemid'],
        turbine: turbine.turbine,
        stateColor: stateInfo['color'],
        systemColor: systemInfo['color']
      });

    }

    global_data_array.push(turbineObjectRaw);
  });
  
  return global_data_array;
}

/* Get hex color for the corresponding state */
function getStateInfo(stateid, stateColorScheme){
  for(let i = 0; i < stateColorScheme.length; i++){
    if(stateColorScheme[i]['code'] == stateid || stateColorScheme[i]['state'] == stateid){
      return stateColorScheme[i];
    }
  }
  return stateColorScheme[stateColorScheme.length - 1];
}

/* Get hex color for the corresponding system */
function getSystemInfo(system, systemColorScheme){
  for(let i = 0; i < systemColorScheme.length; i++){
    for(let j = 0; j < systemColorScheme[i]['descriptions'].length; j++){
      let description = _.clone(systemColorScheme[i]['descriptions'][j]);
      if(description['systemid'] == system || description['description'] == system){
        description['color'] = systemColorScheme[i]['color'];
        return description;
      }
    }
  }
  return {'system': 'No Production', 'color': '#FFFFFF', 'systemid': 11000}
}

/* Get the list of systems to be used in a dropdown list */
function getListOfSystemDescription(systemColorScheme){
  let description_list = [];
  for(let i = 0; i < systemColorScheme.length; i++){
    for(let j = 0; j < systemColorScheme[i]['descriptions'].length; j++){
      let description = systemColorScheme[i]['descriptions'][j];
      description_list.push(description);
    }
  }
  return description_list;
}

/* Generate the data to be used by the D3Chart */
function generateChartData(dataArray){

  let chartData = []

  let dataSrc = _.cloneDeep(dataArray);

  for(let turbineIndex = 0; turbineIndex < dataSrc.length; turbineIndex++){

    let current_state = '', current_system = '';
    let consecutive_count = 0;

    let turbineObjectChart = {
      'site': 1432,
      'turbine': dataSrc[turbineIndex].turbine,
      'data': [],
    }

    for(let dataIndex = 0; dataIndex < dataSrc[turbineIndex]['data'].length; dataIndex++){

      let data_point = dataSrc[turbineIndex]['data'][dataIndex];
      data_point['fine_data'] = [];

      let fine_data = {
        ts_start_UTC: data_point['ts_start_UTC'],
        ts_end_UTC: data_point['ts_end_UTC'],
      }

      // Condition to detect consecutive states and systemid
      if(current_state == data_point['stateid'] & current_system == data_point['systemid'] & dataIndex > 0){
        consecutive_count++;

        // Add the expected pwoer and actual power to get an average for the time being as well as the windspeed for the turbine
        turbineObjectChart['data'][ turbineObjectChart['data'].length - 1]['kw_net'] += data_point['kw_net'];
        turbineObjectChart['data'][ turbineObjectChart['data'].length - 1]['kw_exp'] += data_point['kw_exp'];
        turbineObjectChart['data'][ turbineObjectChart['data'].length - 1]['nws'] += data_point['nws'];
        turbineObjectChart['data'][ turbineObjectChart['data'].length - 1]['fine_data'].push(fine_data);

        // When it is the last data point and it is the same state
        if(dataIndex == dataSrc[turbineIndex]['data'].length - 1){
          // Get the last end UTC from fine_data
          let lengthOfFineData = turbineObjectChart['data'][ turbineObjectChart['data'].length - 1]['fine_data'].length;
          let ts_end_UTC = turbineObjectChart['data'][ turbineObjectChart['data'].length - 1]['fine_data'][lengthOfFineData - 1]['ts_end_UTC']

          turbineObjectChart['data'][ turbineObjectChart['data'].length - 1]['ts_end'] = moment.utc(ts_end_UTC).tz(timezone);
          turbineObjectChart['data'][ turbineObjectChart['data'].length - 1]['ts_end_UTC'] = ts_end_UTC;
          turbineObjectChart['data'][ turbineObjectChart['data'].length - 1]['ts_end_string'] = moment.utc(ts_end_UTC).tz(timezone).format("MM/DD/YYYY hh:mm A z");

          turbineObjectChart['data'][ turbineObjectChart['data'].length - 1]['kw_net'] /= consecutive_count;
          turbineObjectChart['data'][ turbineObjectChart['data'].length - 1]['kw_exp'] /= consecutive_count;
          turbineObjectChart['data'][ turbineObjectChart['data'].length - 1]['nws'] /= consecutive_count;
        }
      }
      // New State is detected
      else if(dataIndex > 0){
        current_state = data_point['stateid'];
        current_system = data_point['systemid'];
        
        // Get the last end UTC from fine_data
        let lengthOfFineData = turbineObjectChart['data'][ turbineObjectChart['data'].length - 1]['fine_data'].length;
        let ts_end_UTC = turbineObjectChart['data'][ turbineObjectChart['data'].length - 1]['fine_data'][lengthOfFineData - 1]['ts_end_UTC']

        turbineObjectChart['data'][ turbineObjectChart['data'].length - 1]['ts_end'] = moment.utc(ts_end_UTC).tz(timezone);
        turbineObjectChart['data'][ turbineObjectChart['data'].length - 1]['ts_end_UTC'] = ts_end_UTC;
        turbineObjectChart['data'][ turbineObjectChart['data'].length - 1]['ts_end_string'] = moment.utc(ts_end_UTC).tz(timezone).format("MM/DD/YYYY hh:mm A z");

        turbineObjectChart['data'][ turbineObjectChart['data'].length - 1]['kw_net'] /= consecutive_count;
        turbineObjectChart['data'][ turbineObjectChart['data'].length - 1]['kw_exp'] /= consecutive_count;
        turbineObjectChart['data'][ turbineObjectChart['data'].length - 1]['nws'] /= consecutive_count;

        consecutive_count = 1;
        data_point['fine_data'].push(fine_data);
        turbineObjectChart['data'].push(data_point);
      }
      // First point
      else{
        current_state = data_point['stateid'];
        current_system = data_point['systemid'];
        consecutive_count = 1;
        data_point['fine_data'].push(fine_data);
        turbineObjectChart['data'].push(data_point);
      }
    }
    
    chartData.push(turbineObjectChart);
  }
  return chartData;
}

/* Generate the data to be used by the HandsOnTable */
function generateTableData(dataArray){

  let data = _.cloneDeep(dataArray);

  // Link for creating data models : https://handsontable.com/docs/6.2.2/tutorial-data-sources.html
  let header = ['Timestamp','Expected Power', 'Actual Power', 'WindSpeed'];

  data.forEach(function(turbine){
    header.push('(Turbine ' + (turbine.turbine) + ') <br /> State');
    header.push('(Turbine ' + (turbine.turbine) + ') <br /> System');

  }); 

  let tableData = [];
  // Look at the first turbine data
  data[0]['data'].forEach(function(eventObj){

    let model_object = {'ts_start_string': eventObj['ts_start_string'], 'ts_start_UTC': eventObj['ts_start_UTC'], 'ts_end_string': eventObj['ts_end_string'], 'ts_end_UTC': eventObj['ts_end_UTC'], 'periodid': eventObj['periodid'],
                            'kw_exp': eventObj['kw_exp'], 'kw_net': eventObj['kw_net'], 'windspeed': eventObj['windspeed']}

    // Iterate each turbine to find their state and system
    data.forEach(function(turbine){
      let same_periodid_object = turbine['data'].find(obj => obj['periodid'] === eventObj['periodid'] & obj['ts_start_string'] === eventObj['ts_start_string']);
      if(same_periodid_object){
        model_object['state' + (turbine.turbine)] = same_periodid_object['state'];
        model_object['system' + (turbine.turbine)] = same_periodid_object['system'];
      }
      else if(turbine['edited']){
        model_object['state' + (turbine.turbine)] = '';
        model_object['system' + (turbine.turbine)] = '';
      }
      else{
        model_object['state' + (turbine.turbine)] = 'No Data';
        model_object['system' + (turbine.turbine)] = 'No Data';
      }
    });

    tableData.push((model_object));
  });

  let _columnsMeta = [
    {data: 'ts_start_string', readOnly: true},
    {data: 'kw_exp', readOnly: true},
    {data: 'kw_net', readOnly: true},
    {data: 'windspeed', readOnly: true}
  ];

  // Iterate each turbine to find their states and system
  data.forEach(function(turbine){
    _columnsMeta.push({data: 'state' + turbine.turbine, type: 'dropdown', source: stateColorScheme.map(stateObj => stateObj.state), strict: true});
    _columnsMeta.push({data: 'system' + turbine.turbine,  type: 'dropdown', source: getListOfSystemDescription(systemColorScheme).map(systemDescriptionObj => systemDescriptionObj['description']), strict: true});
  });

  return {'tableData': tableData, 'columnsHeader': header, 'columnsMeta': _columnsMeta};

}         

function chartDataChangeTimezone(chartData, timezone){

  chartData.forEach(function(turbine, index){

    turbine['data'].forEach(function(data_point, i){

      data_point['ts_start'] = moment.utc(data_point['ts_start_UTC']).tz(timezone);
      data_point['ts_end'] = moment.utc(data_point['ts_end_UTC']).tz(timezone);

      data_point['ts_start_string'] = data_point['ts_start'].format("MM/DD/YYYY hh:mm A z");
      data_point['ts_end_string'] = data_point['ts_end'].format("MM/DD/YYYY hh:mm A z");
  
    })

  })

  return chartData;
}

function dataChangeTimezone(data, timezone){
  data.forEach(function(turbine, index){
    turbine['data'].forEach(function(data_point, i){

      data_point['ts_start'] = moment.utc(data_point['ts_start_UTC']).tz(timezone);
      data_point['ts_end'] = moment.utc(data_point['ts_end_UTC']).tz(timezone);

      data_point['ts_start_string'] = data_point['ts_start'].format("MM/DD/YYYY hh:mm A z");
      data_point['ts_end_string'] = data_point['ts_end'].format("MM/DD/YYYY hh:mm A z");
  
    });
  })
  return data;
}

function removeTooltip(){
  if(tooltip){
    tooltip.style('display', 'none');
    $('.tooltip').remove();
  }
}

function hideMenu(){
            
  if(tooltip){
    tooltip.style('display', 'none');
  }

  if($('#text').text() == '<'){
    $('#text').text('>');
    $('#menuContainer').css("display", "none");
    $('.golden-layout-container').css('width', '98.5%');
    $('.golden-layout-container').css('left', '1.2%');
           
  }
  else{
    $('#text').text('<');
    $('#menuContainer').css("display", "block");
    $('.golden-layout-container').css('width', '82%');
    $('.golden-layout-container').css('left', '18%');

  }

  if(goldenLayout){
    goldenLayout.destroy();
    goldenLayout.init();
  }
  
  if(tooltip){
    tooltip.style('display', 'none');
  }
  
}

function filterDataByRange(ts_start_moment, ts_end_moment, turbine_start, turbine_end, unmodifiedData){
  let filteredData = _.cloneDeep(unmodifiedData);

  filteredData.forEach(function(turbine_object){  // filter out the data that is not within the range
    turbine_object['data'] = turbine_object['data'].filter(obj => obj['ts_start'] >= ts_start_moment &&
    obj['ts_end'] <= ts_end_moment);
  })

  // filter the data array such that the turbine are within the turbine ranges start and end
  filteredData = filteredData.filter(obj => obj['turbine'] >= turbine_start && obj['turbine'] <= turbine_end)

  return filteredData;
}

// Function to save the data to the IndexedDB for caching
function saveData(data_orig){
  return new Promise(function (resolve){
    let data = _.cloneDeep(data_orig);
    data.forEach(function(turbine){
      turbine['data'].forEach(function(t){
        delete t.ts_start; delete t.ts_end
      });
    });

    const dbName = "data_storage";

    let request = window.indexedDB.open(dbName, 1),
        db, transaction, store, index;

    // Define handlers
    request.onerror = function(event) {
      // Handle errors.
      console.log("Request Error: " + event );
    };

    request.onupgradeneeded = function(event) {
      let db = request.result,
          store = db.createObjectStore("DataStore", { keyPath: "turbine"}),
          index = store.createIndex('data', 'data', {unique: false})
    };

    request.onsuccess = function(event){
      db = request.result;
      transaction = db.transaction('DataStore', "readwrite");
      store = transaction.objectStore('DataStore');
      index = store.index('data');

      db.onerror = (function(event){
        console.log("Database error: ", event);
      });

      data.forEach(function(turbine_data){
        store.put(turbine_data); 
      });

      transaction.oncomplete = (function(event){
        db.close();
      });
    }
  })
}

function formatDate(ts){
  let split = ts.split('/');

  let day = split[0];
  let month = split[1];
  split = split[2].split(' ');

  let year = split[0];
  
  split = split[1].split(':')

  let hour = split[0];
  let minute = split[1];

  let date = moment(new Date(month + '/' + day + '/' + year + ' ' + hour + ':' + minute)).tz(timezone);
  return date
}