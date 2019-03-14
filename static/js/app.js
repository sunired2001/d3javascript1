function buildMetadata(sample) {

  var url = "/metadata/" + sample
  divul = d3.select("#sample-metadata")
  divul.html("")
  d3.json(url).then(function (data) {
    Object.entries(data).forEach(([key, value]) => {
      divul.append("p").text(key + ":" + value)

    })
  })


  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`

  // Use `.html("") to clear any existing metadata

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
  var url = "/samples/" + sample
  var labels = []
  var values = []
  var hovertext1 = []
  d3.json(url).then(function (data) {

    data.forEach(function (data) {
      console.log(data)

      labels.push(data.otu_ids)
      values.push(data["sample_values"])
      hovertext1.push(data["otu_labels"])
    })
    Plotly.purge("pie")
    var trace = [{
      labels: labels.slice(0,9),
      values: values.slice(0,9),
      hovertext:hovertext1.slice(0,9),
      type: "pie"
    }];
    var layout = {

      height: 600,
      width: 800

    };
    Plotly.plot("pie", trace, layout);
    Plotly.purge("bubble")
    bubbledata = [
      {
        'x': labels,
        'y': values,
        'hovertext': hovertext1,
        'mode': 'markers',
        'type': "bubble",
        'marker': {
          'color': labels,
          'size': values

        }
      }
    ]

    Plotly.plot("bubble", bubbledata);


  })
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
