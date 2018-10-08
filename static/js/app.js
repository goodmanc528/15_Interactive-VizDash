function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample

  d3.json(`/metadata/${sample}`).then(function(response) {
    //console.log(response);
    var sampleMD = d3.select("#sample-metadata")
    sampleMD.html("")
    var table = sampleMD.append("table");
    Object.entries(response).forEach(([key, value]) => {
      var row = table.append("tr");
      var cell = row.append("td").text(key+": "+value).append("br")

    });
    // Use d3 to select the panel with id of `#sample-metadata` 
    // Use `.html("") to clear any existing metadata
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
}

function arrSliceTen(array) {
  return array.slice(1,11)
}

function buildCharts(sample) {
  var url = `/samples/${sample}`
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function(response) {
    //console.log(response)
    arrSamplesAll = []
    var value = response.sample_values
    var id = response.otu_ids
    var label = response.otu_labels
    
    for (i =0; i < value.length; i++){
      arrSamplesAll.push({id: id[i], label: label[i], value: value[i]})
    }
    arrSamplesAll.sort(function(i, j){return j.value - i.value});
    
    var values = []
    var labels = []
    var ids = []
    
    arrSamplesAll.forEach(sample => {
    // arrSamplesTT.forEach(sample => {
      values.push(sample.value)
      ids.push(sample.id)
      labels.push(sample.label)
    })
    // console.log(values)
    // console.log(labels)    
    
    colors = colorArray

    // @TODO: Build a Bubble Chart using the sample data
    var scatterData = [{
      "x": ids,
      "y": values,
      "mode": "markers",
      "type": "scatter",
      "marker": {
        "symbol": "circle",
        "opacity": 0.6,
        "size": values, 
        "sizeref": 2,
        "sizemin": 4,
        "sizemode": "diameter",
        "color": ids,
        "colorscale": "Portland",
        //"autocolorscale": true
        },
    }]
    // @TODO: Build a Pie Chart
    var pieData = [{
      "values": arrSliceTen(values),
      // "values": arrSamplesAll.values,
      "labels": arrSliceTen(ids),
      "name": "Belly Button Data",
      "hovertext": arrSliceTen(labels),
      "hoverinfo": "label+text+value+percent",
      "type": "pie",
      "marker": {
        "colors": colorArray
      } 
   }]
   var pieLayout = {
     title: `Sample: ${sample}`
   }
   Plotly.newPlot("pie", pieData, pieLayout)
   Plotly.newPlot("bubble",scatterData)
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
