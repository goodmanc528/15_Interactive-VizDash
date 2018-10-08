function buildGauge(sample) {

// Capture Wash Frequency, 0-9
var level = sample;

// Trig to calc meter point
var degrees = 10 - level,
     radius = .5;
var radians = degrees * Math.PI / 11;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.035 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'Belly Button Wash Frequency (days per wash)',
    text: level,
    // hoverinfo: 'text+name'},
},
  { values: [65/9, 65/9, 65/9, 65/9, 65/9, 65/9, 65/9, 65/9,65/9, 65],
  rotation: 90,
  text: ['8-9', '7-8','6-7','5-6','4-5','3-4','2-3','1-2','0',''],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:colorArrayGuage},
//   labels: ['8-9', '7-8','6-7','5-6','4-5','3-4','2-3','1-2','0',''],
  hoverinfo: 'skip',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: 'Belly Button Wash Frequency (days per wash)',
//   height: 650,
//   width: 650,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};
Plotly.newPlot('gauge', data, layout, {responsive: true});
}