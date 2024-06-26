(function () {
    /* ----------------------- Dynamic dimensions ----------------------- */
    const aspectRatio = 0.7;
    const container = document.getElementById("environmental-justice-bar-chart");
    const containerWidth = container.offsetWidth;
    const containerHeight = containerWidth * aspectRatio;
    const dynamicMargin = {
        top: containerHeight * 0.1,
        right: containerWidth * 0.18,
        bottom: containerHeight * 0.1,
        left: containerWidth * 0.05,
    };
    const width = containerWidth - dynamicMargin.left - dynamicMargin.right;
    const height = containerHeight - dynamicMargin.top - dynamicMargin.bottom;

    /* ----------------------- Append SVG object ----------------------- */
    const svg = d3
        .select("#environmental-justice-bar-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .append("g")
        .attr("transform", `translate(${dynamicMargin.left},${dynamicMargin.top})`);

    /* ----------------------- Setup the scales and axes ----------------------- */
    const x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);
    const x1 = d3.scaleBand().padding(0.1);
    const y = d3.scaleLinear().rangeRound([height, 0]);
    const xAxis = d3.axisBottom(x0);
    const yAxis = d3.axisLeft(y).tickFormat(d => `${d}%`);

    /* ----------------------- Tooltip Setup ----------------------- */
    const tooltip = d3.select("#tooltip").style("opacity", 0);

    /* ----------------------- Load and process the CSV data ----------------------- */
    d3.csv("./data/environmental-justice/environmental-justice3.csv", function(d) {
        return {
            Category: d.Category,
            Subcategory: d.Subcategory,
            Percentage: +d.Percentage,
        };
    }).then(function (data) {
        const categories = Array.from(new Set(data.map(d => d.Category)));
        const subcategories = Array.from(new Set(data.map(d => d.Subcategory)));

        x0.domain(categories);
        x1.domain(subcategories).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(data, d => d.Percentage)]).nice();

        const nestedData = d3.group(data, d => d.Category);

        const categoryGroup = svg.selectAll(".categoryGroup")
            .data(nestedData)
            .enter().append("g")
            .attr("class", "categoryGroup")
            .attr("transform", d => `translate(${x0(d[0])},0)`)
    
        categoryGroup.selectAll("rect")
            .data(d => d[1])
            .enter().append("rect")
            .attr("x", d => x1(d.Subcategory))
            .attr("y", d => y(d.Percentage))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - y(d.Percentage))
            .attr("fill", "#69b3a2")
            .on("mouseover", function(event, d) {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(`Subcategory: ${d.Subcategory}<br/>Percentage: ${d.Percentage}%`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                tooltip.transition().duration(500).style("opacity", 0);
            });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
    });
})();