// set svg variables and margins
var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// set svg container attribues
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// svg and d3 function
var svg = d3
  .select('#scatter')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

// chart group
var chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);


d3.csv('assets/data/data.csv').then(function(myData) {

    // number conversion. data parsing change string to numeric value
    myData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;

    });

    // x func
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(myData, d => d.poverty)*0.9,
            d3.max(myData, d => d.poverty)*1.1])
        .range([0, width]);

    // y func
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(myData, d => d.healthcare)*1.1])
        .range([height, 0]);  

    // func for circles
    chartGroup.selectAll('circle')
        .data(myData)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d.poverty))
        .attr('cy', d => yLinearScale(d.healthcare))
        .attr('r', 12)
        .attr('fill', 'blue')
        .attr('opacity', '.6');

    // add state abrv to circles
    chartGroup.selectAll('text.text-circles')
        .data(myData)
        .enter()
        .append('text')
        .classed('text-circles',true)
        .text(d => d.abbr)
        .attr('x', d => xLinearScale(d.poverty))
        .attr('y', d => yLinearScale(d.healthcare))
        .attr('dy',5)
        .attr('text-anchor','middle')
        .attr('font-size','12px')
        .attr('fill', 'white');

    // set axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // x axis
    chartGroup.append('g')
        .attr('transform', `translate(0, ${height})`)
        .style('font-size', '16px')
        .call(bottomAxis);

    // y axis
    chartGroup.append('g')
        .style('font-size', '16px')
        .call(leftAxis);
     
    // y axis
    chartGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 30 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .classed('aText', true)
        .text('Lacking Healthcare (%)');

    // x axis
    chartGroup.append('text')
        .attr('y', height + margin.bottom/2 - 10)
        .attr('x', width / 2)
        .attr('dy', '1em')
        .classed('aText', true)
        .text('Poverty Rate (%)');

    // linear regression
    linearRegression = ss.linearRegression(myData.map(d => [d.poverty, d.healthcare]));
    linearRegressionLine = ss.linearRegressionLine(linearRegression);

    regressionPoints = {
        const: firstX = myData[0].poverty,
        const: lastX = myData.slice(-1)[0].poverty,
        const: xCoordinates = [firstX, lastX],

        return: xCoordinates.map(d => ({
            x: d,
            y: linearRegressionLine(d)
        }))
    };

    line = d3.line()
        .x(d => xLinearScale(d.poverty))
        .y(d => yLinearScale(d.healthcare));


    console.log(linearRegression);
    // m 0.6710235228227461
    // b 2.6515679410939974

    chartGroup.append('path')
        .classed('regressionLine', true)
        .datum(regressionPoints)
        .attr('d', line);
});

// linReg code seems to be doing the right things but I just cant seem to get the line to plot and I need to turn the homework in so ¯\_(ツ)_/¯