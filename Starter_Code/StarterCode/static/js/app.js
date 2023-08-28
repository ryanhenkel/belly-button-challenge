//Define the URL for the JSON file
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//Initialize the function using D3
function init() {
    const dropdownMenu = d3.select("#selDataset");

    d3.json(url).then(data => {
        const names = data.names;
        names.forEach(name => dropdownMenu.append("option").text(name).property("value", name));

//Initiate visualizations
        const name = names[0];
        demo(name);
        bar(name);
        bubble(name);
    });
}

//Display demo
function demo(selectedValue) {
    d3.json(url).then(data => {
        const metadata = data.metadata;
        const obj = metadata.find(meta => meta.id == selectedValue);

        const metadataDiv = d3.select("#sample-metadata");
        metadataDiv.html("");
        Object.entries(obj).forEach(([key, value]) => metadataDiv.append("h5").text(`${key}: ${value}`));
    });
}

//Display bar chart
function bar(selectedValue) {
    d3.json(url).then(data => {
        const samples = data.samples;
        const obj = samples.find(sample => sample.id === selectedValue);

        const trace = [{
            x: obj.sample_values.slice(0, 10).reverse(),
            y: obj.otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
            text: obj.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            marker: { color: "rgb(200,50,200)" },
            orientation: "h"
        }];
        Plotly.newPlot("bar", trace);
    });
}

//Display bubble
function bubble(selectedValue) {
    d3.json(url).then(data => {
        const samples = data.samples;
        const obj = samples.find(sample => sample.id === selectedValue);

        const trace = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
                size: obj.sample_values,
                color: obj.otu_ids,
                colorscale: "Viridis"
            }
        }];

        const layout = { xaxis: { title: "OTU ID" } };
        Plotly.newPlot("bubble", trace, layout);
    });
}

function optionChanged(params) {
    demo(params);
    bar(params);
    bubble(params);
}
init();