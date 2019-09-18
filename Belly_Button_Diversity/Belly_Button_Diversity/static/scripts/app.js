function buildMetadata(sample) {
	var panel = d3.select("#sample-metadata");
	panel.html(function (d) {
		return "";
	});

	d3.json("/metadata/" + sample).then((sampleData) => {
		d3.entries(sampleData).forEach((data) => {
			panel.append("p").text(`${data.key}: ${data.value}`);
		});
	});
}

function buildCharts(sample) {

	// Use `d3.json` to fetch the sample data for the plots
	d3.json("/samples/" + sample).then((data) => {
		otuIds = data.otu_ids.slice(0, 10);
		sampleValues = data.sample_values.slice(0, 10);
		otuLabels = data.otu_labels.slice(0, 10);

		// Build a Pie Chart
		var pieTrace = {
			labels: otuIds,
			values: sampleValues,
			type: 'pie',
			hoverinfo: otuLabels
		};

		var pieData = [pieTrace];
		var pieLayout = {
			title: "Pie Chart"
		};

		Plotly.newPlot("pie", pieData, pieLayout);


		// Build a Bubble chart
		otuIds = data.otu_ids;
		sampleValues = data.sample_values;
		otuLabels = data.otu_labels;

		var bubbleTrace = {
			x: otuIds,
			y: sampleValues,
			text: otuLabels,
			mode: "markers",
			marker: {
				color: otuIds,
				size: sampleValues
			}
		};

		var bubbleData = [bubbleTrace];
		var bubbleLayout = {
			title: "Bubble Chart"
		}

		Plotly.newPlot("bubble", bubbleData, bubbleLayout);

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