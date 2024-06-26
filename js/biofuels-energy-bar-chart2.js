(function () {
    /* ----------------------- Dynamic dimensions ----------------------- */
    const aspectRatio = 0.7;
  
    // Get the container and its dimensions
    const container = document.getElementById("biofuels-energy-bar-chart2");
    const containerWidth = container.offsetWidth; // Use offsetWidth for full element width
    const containerHeight = containerWidth * aspectRatio; // Calculate the height based on the width and aspect ratio
  
    // Calculate the dynamic margins
    const dynamicMargin = {
      top: containerHeight * 0.08,
      right: containerWidth * 0.05, // Adjust right margin if labels are too long
      bottom: containerHeight * 0.05,
      left: containerWidth * 0.3, // Increase left margin to fit labels
    };
  
    // Calculate the width and height for the inner drawing area
    const width = containerWidth - dynamicMargin.left - dynamicMargin.right;
    const height = containerHeight - dynamicMargin.top - dynamicMargin.bottom;
  
    // Append SVG object
    const svg = d3
      .select("#biofuels-energy-bar-chart2")
      .append("svg")
      .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .append("g")
      .attr("transform", `translate(${dynamicMargin.left},${dynamicMargin.top})`);
  
    /* ----------------------- Scales, axes, and color ----------------------- */
    const xScale = d3.scaleLinear().range([0, width]);
    const yScale = d3.scaleBand().range([0, height]).padding(0.1);
    const colorScale = d3
      .scaleOrdinal()
      .range([
        "#ae416c",
        "#c36043",
        "#799a6c",
        "#75bf70",
        "#f38f53",
        "#e16674",
        "#c1824b",
      ]); // Updated color range
    const formatDecimal = d3.format(".0f"); // Formatter to round to one decimal place
  
    /* ----------------------- Icon mapping ----------------------- */
  
    const yAxis = (g) =>
      g.call(
        d3.axisLeft(yScale).tickSizeOuter(0).tickSizeInner(0).tickPadding(5)
      );
  
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -dynamicMargin.top / 2) // Place below the chart
      .attr("class", "chart-labels")
      .attr("text-anchor", "middle") // Center the text
      .attr("fill", "#000") // Text color
      .text("Biofuel Yield (GJ/ha)");
  
    /* ----------------------- Loading and processing data ----------------------- */
    // This function creates a unique identifier by combining the feedstock and region
    function createUniqueId(d) {
      return d.feedstock + " (" + d.region + ")";
    }
  
    d3.csv("data/biofuels-energy3.csv", (d) => ({
      feedstock: d.Feedstock,
      region: d.Region,
      biofuelYield: +d["Biofuel Yield"],
    })).then((data) => {
      // Update scales and color domain
      xScale.domain([0, d3.max(data, (d) => d.biofuelYield)]);
      // Use the unique identifier function for the domain
      yScale.domain(data.map(createUniqueId));
      colorScale.domain(data.map((d) => d.feedstock));
  
      // Draw the y-axis with the unique identifier
      svg
        .append("g")
        .call(yAxis)
        .selectAll(".tick text")
        .attr("class", "chart-labels")
        .text((d) => d); // Only display the feedstock, omit the region part
  
      /* ----------------------- Drawing bars ----------------------- */
      svg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", (d) => yScale(createUniqueId(d))) // Use the unique identifier function
        .attr("width", (d) => xScale(d.biofuelYield))
        .attr("height", yScale.bandwidth())
        .attr("fill", (d) => colorScale(d.feedstock));
  
      /* ----------------------- Adding labels ----------------------- */
      svg
        .selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "chart-labels")
        .attr("x", (d) => xScale(d.biofuelYield) + 3)
        .attr("y", (d) => yScale(createUniqueId(d)) + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text((d) => formatDecimal(d.biofuelYield))
        .attr("fill", "#000");

    });
  })();
  
  