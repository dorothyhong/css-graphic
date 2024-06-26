(function () {
    // Dynamic dimensions 
    const aspectRatio = 0.7;
    const container = document.getElementById("environmental-justice-bar-chart");
    const containerWidth = container.offsetWidth;
    const containerHeight = containerWidth * aspectRatio;
    const dynamicMargin = {
        top: containerHeight * 0.1,
        right: containerWidth * 0.3, // Adjusted for legend or labels
        bottom: containerHeight * 0.2,
        left: containerWidth * 0.2,
    };

    const width = containerWidth - dynamicMargin.left - dynamicMargin.right;
    const height = containerHeight - dynamicMargin.top - dynamicMargin.bottom;

    // Append SVG object 
    const svg = d3
        .select("#environmental-justice-bar-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .append("g")
        .attr("transform", `translate(${dynamicMargin.left},${dynamicMargin.top})`);

    // Load and process the CSV data
    d3.csv("./data/environmental-justice/environmental-justice3.csv").then(function (data) {
        // Extract categories and subcategories
        let categories = [...new Set(data.map(d => d.Category))];
        let subcategories = [...new Set(data.map(d => d.Subcategory))];

        // Create scales
        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.Percentage)])
            .range([0, width]);

        const y0 = d3.scaleBand()
            .domain(categories)
            .rangeRound([0, height])
            .paddingInner(0.1);

        const y1 = d3.scaleBand()
            .domain(subcategories)
            .padding(0.05)
            .rangeRound([0, y0.bandwidth()]);

        const color = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(subcategories);

        // Add the bars
        const barsGroups = svg.selectAll(".category-group")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "category-group")
            .attr("transform", d => `translate(0, ${y0(d.Category)})`);

        barsGroups.selectAll(".bar")
            .data(d => subcategories.map(subcategory => {
                let datum = data.find(dat => dat.Subcategory === subcategory && dat.Category === d.Category);
                return { subcategory, percentage: datum ? datum.Percentage : 0 };
            }))
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", d => y1(d.subcategory))
            .attr("width", d => x(d.percentage))
            .attr("height", y1.bandwidth())
            .attr("fill", d => color(d.subcategory));

        // Add the X Axis
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y0));

        // Optional: Add legend if needed
    });
})();