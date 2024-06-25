(async () => {
    // Load data from external sources
    const world = await d3.json("https://unpkg.com/world-atlas@1/world/110m.json");
    
    // Filter out Antarctica from the countries data
    const countries = topojson.feature(world, world.objects.countries).features.filter(d => d.id !== "010");


    const aspectRatio = 1; // Define an aspect ratio for the chart

    // Get the container and its dimensions
    const container = document.getElementById("environmental-justice-interactive-map2");
    const containerWidth = container.offsetWidth; // Use offsetWidth for full element width
    const containerHeight = containerWidth * aspectRatio; // Calculate the height based on the width and aspect ratio
  
    // Calculate the dynamic margins
    const dynamicMargin = {
      top: containerHeight * 0.02, // 5% of the container height
      right: containerWidth * 0.05, // 15% of the container width
      bottom: containerHeight * 0.02, // 10% of the container height
      left: containerWidth * 0.05, // 5% of the container width
    };
  
    // Calculate the width and height for the inner drawing area
    const width = containerWidth - dynamicMargin.left - dynamicMargin.right;
    const height = containerHeight - dynamicMargin.top - dynamicMargin.bottom;
  
    // Append SVG object
    const svg = d3
      .select("#environmental-justice-interactive-map2")
      .append("svg")
      .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .append("g")
      .attr("transform", `translate(${dynamicMargin.left},${dynamicMargin.top})`);
  
  
    // Create a projection and path generator for the world map
    const projection = d3.geoMercator()
      .translate([width / 2, height / 2])
      .scale((width - 1) / 2 / Math.PI);
  
    const path = d3.geoPath().projection(projection);
  
    // Create a path for each country
    svg.selectAll(".country")
      .data(countries)
      .enter().append("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("stroke-width", 0.5)
      .style("fill", "white") // Set fill color to white
      .style("stroke", "black"); // Set stroke color to black
  
    // Additional code for styling or interactions can be added here
  
  })();
  