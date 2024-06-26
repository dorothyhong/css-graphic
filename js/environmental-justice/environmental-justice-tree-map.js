(function () {
    // Dynamic dimensions
    const aspectRatio = 0.6;

    // Get the container and its dimensions
    const container = document.getElementById("environmental-justice-tree-map");
    const containerWidth = container.offsetWidth;
    const containerHeight = containerWidth * aspectRatio;

    // Calculate the dynamic margins
    const dynamicMargin = {
        top: containerHeight * 0.02,
        right: containerWidth * 0.02,
        bottom: containerHeight * 0.05,
        left: containerWidth * 0.02,
    };

    // Calculate the width and height for the inner drawing area
    const width = containerWidth - dynamicMargin.left - dynamicMargin.right;
    const height = containerHeight - dynamicMargin.top - dynamicMargin.bottom;

    // Color scale for continents
    const colorScale = d3.scaleOrdinal()
        .domain(["Asia", "Americas", "Europe", "Africa", "Oceania"])
        .range(["#eb5250", "#6298c6", "#75bf70", "#ae71b6", "#f38f53"]);

    // Append SVG object
    const svg = d3
        .select("#environmental-justice-tree-map")
        .append("svg")
        .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .append("g")
        .attr("transform", `translate(${dynamicMargin.left},${dynamicMargin.top})`);

    // Define tooltip element
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Load data from CSV
    d3.csv("./data/environmental-justice/environmental-justice2.csv").then((data) => {
        // Convert data types if necessary
        data.forEach(d => {
            d['Metric Ton'] = +d['Metric Ton']; // Convert Metric Ton to numeric
        });

        // Create treemap layout
        const root = d3.hierarchy({children: data})
            .sum(d => d['Metric Ton']);

        d3.treemap()
            .size([width, height])
            .padding(5)
            (root);

        const formatNumber = d3.format(",.1f");

        // Create rectangles for each data node
        svg.selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .attr("fill", d => colorScale(d.data.Continent)) // Color based on continent
            .on("mouseover", function (event, d) {
                // Show tooltip
                tooltip.style("opacity", 0.9);

                // Position tooltip
                tooltip.html(
                    `
                    <div class="tooltip-title"><span class="color-legend" style="background-color: ${colorScale(
                        d.data.Continent
                        )};"></span>${d.data.Continent}</div>
            
                    <table class="tooltip-content">
                        <tr>
                        <td>
                            Amount
                        </td>
                        <td class="value"><strong>${formatNumber(d.data['Metric Ton'])}</strong></td> 
                        </tr>
                    </table>`
                )
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mousemove", function (event, d) {
                // Update tooltip position
                tooltip.style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function () {
                // Hide tooltip
                tooltip.style("opacity", 0);
            });

    // Add text labels
    svg.selectAll(".node-label")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("class", "node-label")
        .attr("x", d => d.x0 + 5) // Slightly offset from the top left corner
        .attr("y", d => d.y0 + 15) // Slightly offset from the top left corner
        .attr("fill", "white") // Text color set to white
        .attr("font-size", d => {
            // Calculate font size based on rectangle area, with a min and max
            const area = (d.x1 - d.x0) * (d.y1 - d.y0);
            const minFontSize = 8;
            const maxFontSize = 16;
            const scale = d3.scaleSqrt()
                .domain([100, 10000]) // Adjust this domain depending on your dataset values
                .range([minFontSize, maxFontSize]);
            return scale(area) + "px";
        })
        .text(d => d.data.Continent) // Display continent names
        .append("tspan") // Append tspan for the metric tons value
        .attr("x", d => d.x0 + 5) // Aligned with the title
        .attr("dy", "1.2em") // Offset on the next line under the title
        .text(d => `${formatNumber(d.data['Metric Ton'])} MT`); // Display the metric tons value


    }).catch(error => {
        console.error("Error loading the data: ", error);
    });

})();
