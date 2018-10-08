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
      if (key === "WFREQ") {
        console.log(value);
        buildGauge(value);
      };
    });
    // Use d3 to select the panel with id of `#sample-metadata` 
    // Use `.html("") to clear any existing metadata
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    //console.log(sample.WFREQ.value)
    //buildGauge(sample.WFREQ);
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
    
    var values = arrSamplesAll.map(sample => sample.value)
    var labels = arrSamplesAll.map(sample => sample.label)
    var ids = arrSamplesAll.map(sample => sample.id)
    // console.log(values)
    // console.log(labels)    
    
    //setup custom color array
    colors = colorArray

    // @TODO: Build a Bubble Chart using the sample data
    var scatterData = [{
      "x": ids,
      "y": values,
      "mode": "markers",
      "type": "scatter",
      "ids":  ids,
      "hovertext": labels,
      "hoverinfo":"x+y+text",
      "marker": {
        "symbol": "circle",
        "opacity": 0.6,
        "size": values, 
        "sizeref": 2,
        "sizemin": 4,
        "sizemode": "diameter",
        "color": ids,
        "colorscale": "Portland",
        },
    }]

    var scatterLayout = {
      "xaxis": {
        "visible": true,
        "title": "OTU ID",
        "color": "black",
      }
    }
    Plotly.newPlot("bubble",scatterData, scatterLayout, {responsive: true})

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pieData = [{
      "values": arrSliceTen(values),
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

   }
   Plotly.newPlot("pie", pieData, pieLayout, {responsive: true})

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
