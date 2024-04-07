const margin = { top: 20, right: 20, bottom: 70, left: 70 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select("#chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").then(function(data) {

  const xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.Year - 1), d3.max(data, d => d.Year + 1)])
    .range([0, width]);

  const yScale = d3.scaleTime()
    .domain([d3.max(data, d => new Date(d.Seconds * 1000)), d3.min(data, d => new Date(d.Seconds * 1000))])
    .range([0, height]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  svg.append("g")
    .call(yAxis);

  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.Year))
    .attr("cy", d => yScale(new Date(d.Seconds * 1000)))
    .attr("r", 5)
    .attr("data-xvalue", d => d.Year)
    .attr("data-yvalue", d => new Date(d.Seconds * 1000))
    .on("mouseover", function(event, d) {
      const tooltip = d3.select("#tooltip")
        .attr("data-year", d.Year)
        .style("opacity", 0.9)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 25 + "px")
        .html(`${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}`);
    })
    .on("mouseout", function() {
      d3.select("#tooltip").style("opacity", 0);
    });

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 20)
    .attr("text-anchor", "middle")
    .text("Year");

  svg.append("text")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 20)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Time in Minutes");
});
