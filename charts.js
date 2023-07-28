//page indicator
var i = 0

var interaction = false

// Function for First Scene
async function scene1() {

    d3.select("#graph").html("")

    // Country colors just in case
    const country_color = ["#d50000","#d6007d","#0a7287","#ff8400","#0a7334","#0c1ba1","#49b402","#6500ff","#3e2c0e","#c376e2"];

    // SVG parameters
    var margin = 50,
        height = 400,
        width = 700;

    // Initialize data variable from csv from github
    data = await d3.csv("https://yh12chang.github.io/USData.csv");

    // Arrays to store the mapped data
    var date_data = []
        new_cases = [],
        cum_cases = [],
        new_deaths = [],
        cum_deaths = [];

    // Map the data into arrays for easier use
    data.map(function(d) {
        date_data.push(new Date(d.Date_reported))
        new_cases.push(parseFloat(d.New_cases)),
        cum_cases.push(parseFloat(d.Cumulative_cases)),
        new_deaths.push(parseFloat(d.New_deaths)),
        cum_deaths.push(parseFloat(d.Cumulative_deaths))
    });

    // Get the max new cases per day
    new_max = parseFloat(d3.max(new_cases))

    // Max Cumulative cases value for axis reference
    cum_max = parseFloat(d3.max(cum_cases))

    // Convert dates in the data to be usable for tick markers
    dates = d3.extent(data, function(d) {
        return new Date(d.Date_reported)
    })
    
    // X axis scaleTime
    const x = d3.scaleTime().domain(dates).range([0, width - margin])

    // Right Y axis linearly scale barplots
    const y = d3.scaleLinear().domain([0, new_max + new_max*0.1]).range([height - margin/2, 0])
    
    // Cumulative cases data scale for left axis
    const y_cum = d3.scaleLinear().domain([0, cum_max + cum_max*0.1]).range([height, 0])

    // Base SVG to call when updating plot
    var svg = d3.select("#graph")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
        // .attr("viewBox", "0 0 1000 725")
        // .attr("preserveAspectRatio", "xMinYMin meet")
        .append("g")
        .attr("transform", "translate(" +2*margin+ ", " +margin+ ")")

    var clip = svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width-2*margin)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0)

    var bar = svg.append("g")
        .attr("clip-path", "url(#clip)")

    // Add the barchart with animations
    bar.attr("class", "case-plot")
        .selectAll().data(data).enter().append("rect")
        .attr("x", function(d, i) {
            return x(new Date(d.Date_reported))
        })
        .attr("y", function(d) {
            return y(0)
        })
        .attr("height", 0)
        .transition()
        .duration(800)
        .delay(180)
        .attr("y", function(d, i) {
            return y(d.New_cases)
        })
        .attr("width", (width+2*margin)/new_cases.length)
        .attr("height", function(d,i) {
            return height - margin/2 - y(d.New_cases)
        })
        .style("fill", "rgb(24, 139, 135)");

    
    // // Add the line chart with animations
    // const line = d3.line()
    //     .x(function(d) { return x(new Date(d.Date_reported)) })
    //     .y(function(d) { return y_cum(d.Cumulative_cases) })

    // svg.selectAll().data(data).enter()
    //     .append("path")
    //     .transition()
    //     .duration(2000)
    //     .delay(180)
    //     .attr("fill", "none")
    //     .attr("stroke", "grey")
    //     .attr("stroke-width", 1)
    //     .attr("d", line(data))

    // // Vertical Right Axis
    // d3.select("#graph")
    //     .append("g")
    //     .attr("transform", "translate(" +(width)+ ", " +margin*2/3+ ")")
    //     .call(d3.axisRight(y).tickFormat(d3.format("~s")))
    //     .style("color", "rgb(29, 29, 29)");

    // Horizontal Axis
    d3.select("#graph")
        .append("g")
        .attr("class", "hor-axis")
        .attr("transform", "translate(" +(2*margin)+ ", " +(height + margin/2)+ ")")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x))
        .style("color", "rgb(29, 29, 29)");

    d3.select("#graph")
        .append("text")
        .attr("transform", "translate("+margin*2/3+", "+(2*margin+height)*3/5+")rotate(270)")
        .text("Number of New Cases")
        .style("color", "rgb(29, 29, 29)")
        .style("opacity", 0)
        .style("font-size", 12)
        .transition()
        .duration(1000)
        .style("opacity", 1);


    d3.select("#graph")
        .append("text")
        .attr("transform", "translate("+(margin + width/2)+", "+(height + margin*3/2)+")")
        .text("Dates")
        .style("color", "rgb(29, 29, 29)")
        .style("opacity", 0)
        .style("font-size", 12)
        .transition()
        .duration(1000)
        .style("opacity", 1);

    // Vertical Left Axis
    d3.select("#graph")
        .append("g")
        .attr("class", "vert-axis")
        .attr("transform", "translate(" +2*margin+ ", " +margin+ ")")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y).tickFormat(d3.format("~s")))
        .style("color", "rgb(29, 29, 29)");


    // Legend

        // Circle color indicator
    d3.select("#graph").append("g")
        .attr("id", "legend-cases")
        .append("circle")
            .attr("cx", 3*margin)
            .attr("cy", margin+20)
            .attr("r", 4)
            .style("fill", "rgb(24, 139, 135)")
            .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 1)

        // Text
    d3.select("#legend-cases").append("text")
        .attr("x", 3*margin + 20)
        .attr("y", margin+25)
        .text("Cases per Day")
        .style("opacity", 0)
        .style("font-size", 12)
        .transition()
        .duration(1000)
        .style("opacity", 1)
   
    // Annotations

        // Get Max Date and Value of new cases
        // "new_max" is the value for the maximum new cases\
    const max_ind = new_cases.indexOf(new_max) // Get the index of the max cases
    const max_date = date_data[max_ind] // Get the date the max new cases occured

    const formatTime = d3.timeFormat("%B %d, %Y")

    const annotations = [{
        note: {
            label: new_max.toLocaleString("en-US") + " New cases on " + String(formatTime(max_date)),
            title: "Largest Number of New COVID-19 Cases in the US",
            wrap: 200,
            padding: 7
        },
        // type: d3.annotationCalloutCircle,
        // subject: {
        //     radius: 10,
        // },
        connector: {
            end: "dot"
        },
        color: ["rgb(255, 34, 0)"],
        x: x(max_date),
        y: y(new_max),
        dy: 30,
        dx: -30
    }];

    const makeAnnotations = d3.annotation()
        .annotations(annotations)

    svg.append("g")
        .attr("class", "annotation-scene1")
        .call(makeAnnotations)
        .style("opacity", 0)
        .style("font-size", 12)
        .transition()
        .duration(600)
        .delay(800)
        .style("opacity", 1)

};



async function scene1_5() {

    d3.selectAll(".annotation-scene1")
        .transition()
        .duration(400)
        .attr("transform", "translate("+0+", "+-200+")")
        .style("opacity", 0)

    // Country colors just in case
    const country_color = ["#d50000","#d6007d","#0a7287","#ff8400","#0a7334","#0c1ba1","#49b402","#6500ff","#3e2c0e","#c376e2"];

    // SVG parameters
    var margin = 50,
        height = 400,
        width = 700;

    // Initialize data variable from csv from github
    data = await d3.csv("https://yh12chang.github.io/USData.csv");

    // Arrays to store the mapped data
    var date_data = []
        new_cases = [],
        cum_cases = [],
        new_deaths = [],
        cum_deaths = [];

    // Map the data into arrays for easier use
    data.map(function(d) {
        date_data.push(new Date(d.Date_reported))
        new_cases.push(parseFloat(d.New_cases)),
        cum_cases.push(parseFloat(d.Cumulative_cases)),
        new_deaths.push(parseFloat(d.New_deaths)),
        cum_deaths.push(parseFloat(d.Cumulative_deaths))
    });

    // Get the max new cases per day
    new_max = parseFloat(d3.max(new_cases))

    // Max Cumulative cases value for axis reference
    cum_max = parseFloat(d3.max(cum_cases))

    // Convert dates in the data to be usable for tick markers
    dates = d3.extent(data, function(d) {
        return new Date(d.Date_reported)
    })

    zoom_date = ["07/01/2021", "04/01/2022"]

    dates_filter = d3.extent(zoom_date, function(d) {
        return new Date(d)
    })

    // X axis scaleTime
    const x = d3.scaleTime().domain(dates).range([0, width - margin])

    // Right Y axis linearly scale barplots
    const y = d3.scaleLinear().domain([0, new_max + new_max*0.1]).range([height - margin/2, 0])

    console.log(x(dates_filter[1])-x(dates_filter[0]))

    // Base SVG to call when updating plot
    var svg = d3.select("#graph")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
        .append("g")
        .attr("transform", "translate(" +2*margin+ ", " +margin+ ")")

    // Annotations

    // Get Max Date and Value of new cases
    // "new_max" is the value for the maximum new cases\
    const max_ind = new_cases.indexOf(new_max) // Get the index of the max cases
    const max_date = date_data[max_ind] // Get the date the max new cases occured

    const formatTime = d3.timeFormat("%B %d, %Y")

    const annotations = [{
        note: {
            label: "The US experienced rapid growth in cases between July 2021 to April 2022",
            title: "Worst Months of the COVID-19 Cases",
            wrap: margin*3,
            padding: 5
        },
        type: d3.annotationCalloutRect,
        subject: {
            width: x(dates_filter[1]) - x(dates_filter[0]),
            height: height - margin
        },
        color: ["grey"],
        x: x(dates_filter[0]),
        y: margin/2,
        dy: 0,
        dx: 4*margin
    }];

    const makeAnnotations = d3.annotation()
        .annotations(annotations)

    svg.append("g")
        .attr("class", "annotation-scene1-5")
        .call(makeAnnotations)
        .style("opacity", 0)
        .style("font-size", 12)
        .transition()
        .duration(500)
        .attr("x", x(max_date))
        .attr("y", height - margin)
        .style("opacity", 1)
}







// Function for Second Scene
async function scene2() {
    // d3.select("#graph").html("")

    d3.selectAll(".annotation-scene1")
        .transition()
        .duration(400)
        .attr("transform", "translate("+0+", "+-200+")")
        .style("opacity", 0)

    d3.selectAll(".annotation-scene1-5")
        .transition()
        .duration(400)
        .attr("transform", "translate("+0+", "+-200+")")
        .style("opacity", 0)
    

    // Country colors just in case
    const country_color = ["#d50000","#d6007d","#0a7287","#ff8400","#0a7334","#0c1ba1","#49b402","#6500ff","#3e2c0e","#c376e2"];

    // SVG parameters
    var margin = 50,
        height = 400,
        width = 700;

    // Initialize data variable from csv from github
    data = await d3.csv("https://yh12chang.github.io/USData.csv");

    // Arrays to store the mapped data
    var date_data = []
        new_cases = [],
        cum_cases = [],
        new_deaths = [],
        cum_deaths = [];

    // Map the data into arrays for easier use
    data.map(function(d) {
        date_data.push(new Date(d.Date_reported))
        new_cases.push(parseFloat(d.New_cases)),
        cum_cases.push(parseFloat(d.Cumulative_cases)),
        new_deaths.push(parseFloat(d.New_deaths)),
        cum_deaths.push(parseFloat(d.Cumulative_deaths))
    });

    // Get the max new cases per day
    new_max = parseFloat(d3.max(new_cases))

    // Max Cumulative cases value for axis reference
    death_max = parseFloat(d3.max(new_deaths))

    // Convert dates in the data to be usable for tick markers
    zoom_date = ["07/01/2021", "04/01/2022"]

    dates = d3.extent(zoom_date, function(d) {
        return new Date(d)
    })

    num_data_points = (dates[1].getTime() - dates[0].getTime()) / (1000 * 3600 * 24)
    
    // X axis scaleTime
    const x = d3.scaleTime().domain(dates).range([0, width - 2*margin])

    // Right Y axis linearly scale barplots
    const y = d3.scaleLinear().domain([0, new_cases +  new_cases*0.1]).range([height - margin/2, 0])
    
    // Cumulative cases data scale for left axis
    const y_cum = d3.scaleLinear().domain([0, cum_max + cum_max*0.1]).range([height, 0])

    // Base SVG to call when updating plot
    var svg = d3.select("#graph")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
        .append("g")
        .attr("transform", "translate(" +2*margin+ ", " +margin+ ")")
        
    // var clip = svg.append("defs").append("clipPath")
    //     .attr("id", "clip")
    //     .append("rect")
    //     .attr("width", width-2*margin)
    //     .attr("height", height)
    //     .attr("x", 0)
    //     .attr("y", 0)

    

    // Add the barchart with animations
    d3.select(".case-plot")
        .selectAll("rect")
        .transition()
        .duration(1000)
        .attr("x", function(d, i) {
            return x(new Date(d.Date_reported))
        })
        .attr("width", (width + 2*margin)/(num_data_points*2))
        // .append("g").attr("clip-path", "url(#clip)" )

    

    // Horizontal Axis
    d3.select("#graph").select(".hor-axis")
        .transition().duration(800)
        .call(d3.axisBottom(x))

    // Annotations

        // Get Max Date and Value of new cases
        // "new_max" is the value for the maximum new cases\
    const max_ind = new_cases.indexOf(new_max) // Get the index of the max cases
    const max_date = date_data[max_ind] // Get the date the max new cases occured

    const formatTime = d3.timeFormat("%B %d, %Y")

    filter_date = ["12/01/2021", "03/01/2022"]

    filter_dates = d3.extent(filter_date, function(d) {
        return new Date(d)
    })

    const annotations = [{
        note: {
            label: "The US had rapid increase in new COVID-19 cases during early December of 2021 to March of 2022",
            title: "Rapid Growth in COVID-19 Cases",
            wrap: margin*3,
            padding: 10
        },
        type: d3.annotationCalloutRect,
        subject: {
            width: x(filter_dates[1]) - x(filter_dates[0]),
            height: height - margin,
        },
        color: ["grey"],
        x: x(filter_dates[0]),
        y: margin/2,
        dy: margin*2,
        dx: -margin
    }];

    const makeAnnotations = d3.annotation()
        .annotations(annotations)

    svg.append("g")
        .attr("class", "annotation-scene2")
        .call(makeAnnotations)
        .style("opacity", 0)
        .style("font-size", 12)
        .transition()
        .duration(600)
        .delay(800)
        .style("opacity", 1)

};





// Function for Second Scene
async function scene3() {

    d3.selectAll(".annotation-scene2")
        .transition().duration(500)
        .style("opacity", 0)

    // Country colors just in case
    const country_color = ["#d50000","#d6007d","#0a7287","#ff8400","#0a7334","#0c1ba1","#49b402","#6500ff","#3e2c0e","#c376e2"];

    // SVG parameters
    var margin = 50,
        height = 400,
        width = 700;

    // Initialize data variable from csv from github
    data = await d3.csv("https://yh12chang.github.io/USData.csv");

    // Arrays to store the mapped data
    var date_data = []
        new_cases = [],
        cum_cases = [],
        new_deaths = [],
        cum_deaths = [];

    // Map the data into arrays for easier use
    data.map(function(d) {
        date_data.push(new Date(d.Date_reported))
        new_cases.push(parseFloat(d.New_cases)),
        cum_cases.push(parseFloat(d.Cumulative_cases)),
        new_deaths.push(parseFloat(d.New_deaths)),
        cum_deaths.push(parseFloat(d.Cumulative_deaths))
    });

    // Get the max new cases per day
    new_max = parseFloat(d3.max(new_cases))

    // Max Cumulative cases value for axis reference
    death_max = parseFloat(d3.max(new_deaths))

    // Convert dates in the data to be usable for tick markers
    zoom_date = ["07/01/2021", "04/01/2022"]

    dates = d3.extent(zoom_date, function(d) {
        return new Date(d)
    })

    num_data_points = (dates[1].getTime() - dates[0].getTime()) / (1000 * 3600 * 24)
    
    // X axis scaleTime
    const x = d3.scaleTime().domain(dates).range([0, width - 2*margin])

    // Right Y axis linearly scale barplots
    const y = d3.scaleLinear().domain([0, death_max + death_max*0.1]).range([height - margin/2, 0])

    // Base SVG to call when updating plot
    var svg = d3.select("#graph")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
        .append("g")
        .attr("transform", "translate(" +2*margin+ ", " +margin+ ")")

    var clip = svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width-2*margin)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0)

    var bar = svg.append("g")
        .attr("clip-path", "url(#clip)")
        

    // Add the barchart with animations
    bar.attr("class", "death-plot")
        .selectAll().data(data).enter().append("rect")
        .attr("x", function(d, i) {
            return (x(new Date(d.Date_reported)) + (width + 2*margin)/(num_data_points*2))
        })
        .attr("y", function(d) {
            return y(0)
        })
        .attr("height", 0)
        .transition()
        .duration(800)
        .delay(180)
        .attr("y", function(d, i) {
            return y(d.New_deaths)
        })
        .attr("width", (width + 2*margin)/(num_data_points*2))
        .attr("height", function(d,i) {
            return height - margin/2 - y(d.New_deaths)
        })
        .style("fill", "rgb(255, 132, 0)");

    // Lower the opacity of new case bar charts
    d3.select(".case-plot")
        .selectAll("rect")
        .transition().duration(500)
        .style("opacity", 0.3)

    // Vertical Right Axis
    d3.select("#graph")
        .append("g")
        .attr("transform", "translate(" +(width)+ ", " +margin+ ")")
        .transition().duration(1000)
        .call(d3.axisRight(y).tickFormat(d3.format("~s")))
        .style("color", "rgb(29, 29, 29)");

    // Vertical Right Axis Title
    d3.select("#graph")
        .append("text")
        .attr("transform", "translate("+(width + margin)+", "+(height/2 - margin/2)+")rotate(90)")
        .text("Number of New Deaths")
        .style("color", "rgb(29, 29, 29)")
        .style("opacity", 0)
        .style("font-size", 12)
        .transition()
        .duration(1000)
        .style("opacity", 1);


    // Legend

        // Adjust legend opacity
    d3.select("#legend-cases")
        .transition()
        .duration(700)
        .style("opacity",0.3)

        // Create legend indicator for new deaths
    d3.select("#graph").append("g")
        .attr("id", "legend-deaths")
        .append("circle")
            .attr("cx", 3*margin)
            .attr("cy", margin + 45)
            .attr("r", 4)
            .style("fill", "rgb(255, 132, 0)")
            .style("opacity", 0)
        .transition()
        .duration(700)
        .style("opacity", 1)
    
        // Text
    d3.select("#legend-deaths").append("text")
        .attr("x", 3*margin + 20)
        .attr("y", margin+50)
        .text("Deaths per Day")
        .style("opacity", 0)
        .style("font-size", 12)
        .transition()
        .duration(700)
        .style("opacity", 1)

    

   
    // Annotations

        // Get Max Date and Value of new cases
        // "new_max" is the value for the maximum new cases\
    const max_ind = new_deaths.indexOf(4076) // Get the index of the max cases
    const max_date = date_data[max_ind] // Get the date the max new cases occured

    console.log((max_date))

    const formatTime = d3.timeFormat("%B %d, %Y")

    const annotations = [{
        note: {
            label: "4,076 People were recorded dead due to COVID-19 on " + String(formatTime(max_date)),
            title: "COVID-19 Death Count",
            wrap: 150,
            padding: 0
        },
        connector: {
            end: "dot"
        },
        color: ["rgb(255, 34, 0)"],
        x: x(max_date)+(width + 2*margin)/(num_data_points*2),
        y: y(4076),
        dy: -5,
        dx: -90
    }];

    const makeAnnotations = d3.annotation()
        .annotations(annotations)

    svg.append("g")
        .attr("class", "annotation-scene3")
        .call(makeAnnotations)
        .style("opacity", 0)
        .style("font-size", 12)
        .transition()
        .duration(600)
        .delay(800)
        .style("opacity", 1)

};





async function scene4() {
    // Remove Annotations from previous scene
    d3.selectAll(".annotation-scene3")
        .transition()
        .duration(700)
        .attr("transform", "translate("+0+", "+-100+")")
        .style("opacity", 0)   

    //Change plot opacity for both case and death
    d3.select(".case-plot").selectAll("rect")
        .transition()
        .duration(700)
        .style("opacity", 0.8)
    
    d3.select(".death-plot").selectAll("rect")
        .transition()
        .duration(700)
        .style("opacity", 0.8)


    // Change legend opacity and translate up 20 px
    d3.select("#legend-cases")
        .transition()
        .duration(700)
        .attr("transform", "translate("+0+", "+-25+")")
        .style("opacity", 0.8)

    d3.select("#legend-deaths")
        .transition()
        .duration(700)
        .attr("transform", "translate("+120+", "+-48+")")
        .style("opacity",0.8)

    // SVG parameters
    var margin = 50,
        height = 400,
        width = 700;

    // Initialize data variable from csv from github
    data = await d3.csv("https://yh12chang.github.io/USData.csv");

    // Arrays to store the mapped data
    var date_data = []
        new_cases = [],
        cum_cases = [],
        new_deaths = [],
        cum_deaths = [];

    // Map the data into arrays for easier use
    data.map(function(d) {
        date_data.push(new Date(d.Date_reported))
        new_cases.push(parseFloat(d.New_cases)),
        cum_cases.push(parseFloat(d.Cumulative_cases)),
        new_deaths.push(parseFloat(d.New_deaths)),
        cum_deaths.push(parseFloat(d.Cumulative_deaths))
    });

    // Get the max new cases per day
    new_max = parseFloat(d3.max(new_cases))

    // Max Cumulative cases value for axis reference
    death_max = parseFloat(d3.max(new_deaths))

    // Convert dates in the data to be usable for tick markers
    zoom_date = ["07/01/2021", "04/01/2022"]

    dates = d3.extent(zoom_date, function(d) {
        return new Date(d)
    })

    num_data_points = (dates[1].getTime() - dates[0].getTime()) / (1000 * 3600 * 24)
    
    // X axis scaleTime
    const x = d3.scaleTime().domain(dates).range([0, width - 2*margin])

    // Right Y axis linearly scale barplots
    const y = d3.scaleLinear().domain([0, death_max + death_max*0.1]).range([height - margin/2, 0])

    // Base SVG to call when updating plot
    var svg = d3.select("#graph")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
        .append("g")
        .attr("transform", "translate(" +2*margin+ ", " +margin+ ")")



    // Annotations

        // Get Max Date and Value of new cases
        // "new_max" is the value for the maximum new cases\
    const max_ind = new_cases.indexOf(new_max) // Get the index of the max cases
    const max_date = date_data[max_ind] // Get the date the max new cases occured

    const formatTime = d3.timeFormat("%B %d, %Y")

    filter_date = ["12/01/2021", "04/01/2022"]

    filter_dates = d3.extent(filter_date, function(d) {
        return new Date(d)
    })

    const annotations = [{
        note: {
            label: "From December 2021 to April 2022 were the hardest months for the US, experiencing the most deaths and cases per day.",
            title: "The Hardest Months for USA",
            wrap: margin*3,
            padding: 10
        },
        type: d3.annotationCalloutRect,
        subject: {
            width: x(filter_dates[1]) - x(filter_dates[0]),
            height: height - margin,
        },
        color: ["grey"],
        x: x(filter_dates[0]),
        y: margin/2,
        dy: margin/2 - 10,
        dx: -margin
    }];

    const makeAnnotations = d3.annotation()
        .annotations(annotations)

    svg.append("g")
        .attr("class", "annotation-scene2")
        .call(makeAnnotations)
        .style("opacity", 0)
        .style("font-size", 12)
        .transition()
        .duration(600)
        .delay(500)
        .style("opacity", 1)
}


function scene5() {

    // SVG parameters
    var margin = 50,
        height = 400,
        width = 700;

    d3.select("#graph")
        .selectAll("g")
        .transition()
        .duration(800)
        .style("opacity", 0)

    d3.select("#graph")
        .selectAll("text")
        .transition()
        .duration(800)
        .style("opacity", 0)

    d3.select("#graph").selectAll("g").transition().delay(800).remove()
    d3.select("#graph").selectAll("text").transition().delay(800).remove()

    var textSlide = d3.select("#graph")
        .append("g").attr("id", "closing-text")

    textSlide.append("text")
        .style("font-weight", "bold")
        .attr("x", width/2 - margin)
        .attr("y", margin)
        .attr("dy", "0em")
        .text("TIME FOR YOU TO EXPLORE!")
        .style("opacity", 0)

    textSlide.append("text")
        .attr("x", margin*3)
        .attr("y", height*1/4)
        .attr("dy", "0em")
        .text("Next, you will now be provided with a world map showcasing 10 countries")
        .style("opacity", 0)

    textSlide.append("text")
        .attr("x", width/2 - margin + 10)
        .attr("y", height*1/4)
        .attr("dy", "1.5em")
        .text("with the most COVID-19 cases.")
        .style("opacity", 0)

    textSlide.append("text")
        .attr("x", margin*2)
        .attr("y", height*1/4)
        .attr("dy", "4em")
        .text("Each of the circles represent the number of new COVID-19 cases per country. Each circle are")
        .style("opacity", 0)

    textSlide.append("text")
        .attr("x", margin)
        .attr("y", height*1/4)
        .attr("dy", "5.5em")
        .text("clickable and will display the country's new cases and new deaths plot here.")
        .style("opacity", 0)

    d3.select("#closing-text")
        .selectAll("text")
        .transition()
        .duration(800)
        .style("font-color", "grey")
        .style("opacity", 1) 
}




// Create interactable plot according to data and remove the map
async function interactablePlot(input ,index) {
    // Remove Map SVG
    d3.select(".chart-container").selectAll("g").transition().duration(600).style("opacity", 0)
    d3.select(".chart-container").style("padding", 0).style("padding", 0).style("background-color", "white")

    d3.select("#map").remove()

    d3.select("#graph").transition().duration(1000).style("opacity", 1)


// Implement interactable Graph here

    // Country colors just in case
    const country_color = ["#d50000","#d6007d","#0a7287","#ff8400","#0a7334","#0c1ba1","#49b402","#6500ff","#3e2c0e","#c376e2"];

    // SVG parameters
    var margin = 50,
        height = 400,
        width = 700;

    // Initialize data variable from csv from github
    link = "https://yh12chang.github.io/" + input.Country_code + "Data.csv"
    data = await d3.csv(link);

    // Arrays to store the mapped data
    var date_data = []
        new_cases = [],
        cum_cases = [],
        new_deaths = [],
        cum_deaths = [];

    // Map the data into arrays for easier use
    data.map(function(d) {
        date_data.push(new Date(d.Date_reported))
        new_cases.push(parseFloat(d.New_cases)),
        cum_cases.push(parseFloat(d.Cumulative_cases)),
        new_deaths.push(parseFloat(d.New_deaths)),
        cum_deaths.push(parseFloat(d.Cumulative_deaths))
    });

    console.log(parseFloat(d3.max(new_deaths)))

    // Get the max new cases per day
    new_max = parseFloat(d3.max(new_cases))

    // Max Cumulative cases value for axis reference
    cum_max = parseFloat(d3.max(cum_cases))

    // Convert dates in the data to be usable for tick markers
    dates = d3.extent(data, function(d) {
        return new Date(d.Date_reported)
    })
    
    // X axis scaleTime
    var x = d3.scaleTime().domain(dates).range([0, width - 2*margin])

    // Horizontal Axis
    var xAxis = d3.select("#graph")
        .append("g")
        .attr("class", "hor-axis")
        .attr("transform", "translate(" +(2*margin)+ ", " +(height + margin/2)+ ")")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x))
        .style("color", "rgb(29, 29, 29)");
    d3.select("#graph")
        .append("text")
        .attr("transform", "translate("+(margin + width/2)+", "+(height + margin*3/2)+")")
        .text("Dates")
        .style("color", "rgb(29, 29, 29)")
        .style("opacity", 0)
        .style("font-size", 12)
        .transition()
        .duration(1000)
        .style("opacity", 1);

    // Right CASES Y axis linearly scale barplots
    const y = d3.scaleLinear().domain([0, new_max + new_max*0.1]).range([height - margin/2, 0])

    // Vertical Left Axis
    d3.select("#graph")
        .append("g")
        .attr("class", "vert-axis")
        .attr("transform", "translate(" +2*margin+ ", " +margin+ ")")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y).tickFormat(d3.format("~s")))
        .style("color", "rgb(29, 29, 29)");
    d3.select("#graph")
        .append("text")
        .attr("transform", "translate("+margin*2/3+", "+(2*margin+height)*3/5+")rotate(270)")
        .text("Number of New Cases")
        .style("color", "rgb(29, 29, 29)")
        .style("opacity", 0)
        .style("font-size", 12)
        .transition()
        .duration(1000)
        .style("opacity", 1);

    // Legend
        // Circle color indicator
    d3.select("#graph").append("g")
        .attr("id", "legend-cases")
        .append("circle")
            .attr("cx", 3*margin)
            .attr("cy", margin+20)
            .attr("r", 4)
            .style("fill", country_color[index])
            .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 0.8)
        // Text
    d3.select("#legend-cases").append("text")
        .attr("x", 3*margin + 20)
        .attr("y", margin+25)
        .text("Cases per Day")
        .style("opacity", 0)
        .style("font-size", 12)
        .transition()
        .duration(1000)
        .style("opacity", 1)


    // Max Cumulative cases value for axis reference
    death_max = parseFloat(d3.max(new_deaths))

    console.log(death_max)

    // Right DEATHS Y axis linearly scale barplots
    const y_death = d3.scaleLinear().domain([0, death_max + death_max*0.2]).range([height - margin/2, 0])

    // Vertical Right Axis
    d3.select("#graph")
        .append("g")
        .attr("transform", "translate(" +(width)+ ", " +margin+ ")")
        .transition().duration(1000)
        .call(d3.axisRight(y_death).tickFormat(d3.format("~s")))
        .style("color", "rgb(29, 29, 29)");

    // Vertical Right Axis Title
    d3.select("#graph")
        .append("text")
        .attr("transform", "translate("+(width + margin)+", "+(height/2 - margin/2)+")rotate(90)")
        .text("Number of New Deaths")
        .style("color", "rgb(29, 29, 29)")
        .style("opacity", 0)
        .style("font-size", 12)
        .transition()
        .duration(1000)
        .style("opacity", 1);

    // Create legend indicator for new deaths
    d3.select("#graph").append("g")
        .attr("id", "legend-deaths")
        .append("circle")
            .attr("cx", 3*margin)
            .attr("cy", margin + 45)
            .attr("r", 4)
            .style("fill", "grey")
            .style("opacity", 0)
        .transition()
        .duration(700)
        .style("opacity", 0.5)
    
        // Text
    d3.select("#legend-deaths").append("text")
        .attr("x", 3*margin + 20)
        .attr("y", margin+50)
        .text("Deaths per Day")
        .style("opacity", 0)
        .style("font-size", 12)
        .transition()
        .duration(700)
        .style("opacity", 1)


// Create the SVG Plots
    // append the svg object to the body of the page
    var svg = d3.select("#graph")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
        .append("g")
        .attr("transform", "translate(" +2*margin+ ", " +margin+ ")")


    // Create clipping Boundary
    var clip = svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width-2*margin)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0)

    // var brush = d3.brushX()
    //     .extent( [0, 0], [width, height])
    //     .on("end", updateChart)


    // Add the path for clip boundary
    var bar = svg.append("g")
        .attr("clip-path", "url(#clip)")

    // Add the CASES barchart with animations
    bar.attr("class", "case-plot")
        .selectAll("rect").data(data).enter().append("rect")
        .attr("x", function(d, i) {
            return x(new Date(d.Date_reported))
        })
        .attr("y", function(d) {
            return y(0)
        })
        .attr("height", 0)
        .transition()
        .duration(800)
        .delay(180)
        .style("opacity", 0.8)
        .attr("y", function(d, i) {
            return y(d.New_cases)
        })
        .attr("width", (width+2*margin)/new_cases.length)
        .attr("height", function(d,i) {
            return height - margin/2 - y(d.New_cases)
        })
        .style("fill", country_color[index]);

    // Add the DEATHS barchart with animations
    bar.attr("class", "death-plot")
        .selectAll().data(data).enter().append("rect")
        .attr("x", function(d, i) {
            return (x(new Date(d.Date_reported)) + (width + 2*margin)/(num_data_points*2))
        })
        .attr("y", function(d) {
            return y_death(0)
        })
        .attr("height", 0)
        .transition()
        .duration(800)
        .delay(180)
        .style("opacity", 0.3)
        .attr("y", function(d, i) {
            return y_death(d.New_deaths)
        })
        .attr("width", (width + 2*margin)/(num_data_points*2))
        .attr("height", function(d,i) {
            return height - margin/2 - y_death(d.New_deaths)
        })
        .style("fill", "grey");

    // // Add brushing to the plot
    // bar.append("g")
    //     .attr("class", "brush")
    //     .call(brush)

    // // Function that set idletimeout to null
    // var idleTimeout
    // function idled() { idletimeout = null;}

    // function updateChart() {
    //     extent = d3.event.selection

    //     if (!extent) {
    //         if (!idletimeout) return idleTimeout = setTimeout(idled, 350);
    //         x.domain(dates)
    //     }
    //     else {
    //         x.domain([ x.invert(extent[0], x.invert(extent[1])) ])
    //         bar.select(".brush").call(brush.move, null)
    //     }

    //     xAxis.transition().duration(1000).call(d3.axisBottom(x))

    //     bar.selectAll("rect")
    //         .transition().duration(1000)
    //         .attr("x", function(d, i) {
    //             return x(new Date(d.Date_reported))})
    // }

    
    d3.select(".visualization").append("svg").attr("id", "map")
}





// Function to create the map
async function createMap() {
    d3.select("#map").html("")

    const heat_color = ["#ef3c18","#ef6a18","#ffa600","#ff7c43","#f95d6a","#d45087","#a05195","#665191","#2f4b7c","#003f5c"];
    const country_color = ["#d50000","#d6007d","#0a7287","#ff8400","#0a7334","#0c1ba1","#49b402","#6500ff","#3e2c0e","#c376e2"];

    var margin = { top: 50, left: 50, right: 50, bottom: 50 },
        height = 600 - margin.top - margin.bottom,
        width = 900 - margin.left - margin.right;

    // var svg = d3.select("#graph")
    //     .attr("class", "world-map")
    //     .attr("height", 600)
    //     .attr("width", 900)
    //     .attr("viewBox", "0 0 900 600")
    //     .attr("preserveAspectRatio", "xMinYMin meet")
    //     .append("g");

    var svg = d3.select("#map")
            // .select(".map-viz")
            // .append("svg")
            .attr("class", "world-map")
            .attr("height", 600)
            .attr("width", 900)
            .attr("viewBox", "0 0 900 600")
            .attr("preserveAspectRatio", "xMinYMin meet")
            // .attr("max-height", height + margin.top + margin.bottom)
            // .attr("max-width", width + margin.right + margin.left)
            .append("g");


    d3.select(".visualization")
        .style("margin", "0 auto")
        .style("max-width", 900)
        .style("max-height", 600)
        .style("padding", "10px")

    d3.select(".chart-container")
        .style("padding-top", "50px")
        .style("padding-bottom", "50px")
        .transition()
        .duration(800)
        .style("background-color", "#d5ecf0")

    // d3.select(".world-map")
    //     .style("max-width", 900)
    //     .style("max-height", 600)

    // d3.select(".map-viz")
    //     .style("margin", "0 auto")
    //     .style("max-width", 900)
    //     .style("max-height", 600)
    //     .style("padding", "10px")
    
    // d3.select(".map-container")
    //     .style("padding-top", "60px")
    //     .style("padding-bottom", "60px")
    //     .transition()
    //     .duration(800)
    //     .style("background-color", "#d5ecf0")
    
    d3.select(".world-map")
        .style("max-width", 900)
        .style("max-height", 600)

    var projection = d3.geoMercator().scale(140).translate([(width + margin.right*2) / 2, (height + margin.top*2) / 1.43])

    const path = d3.geoPath(projection);

    data = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
    coviddata = await d3.csv("https://yh12chang.github.io/top10data.csv");
    
    const countries = topojson.feature(data, data.objects.countries).features;
    console.log(countries);
    console.log(coviddata)
    
    svg.selectAll("path")
      .data(countries)
      .enter().append("path")
      .attr("class", "country")
      .attr("d", path)
      .style("opacity", 0)
      .transition()
      .duration(800)
      .style("opacity", 1)


    // Radial COVID Cases Representation
    var covid = svg.selectAll(".covid-data-circles")
        .data(coviddata)
        .enter().append("circle")
        .attr("r", 0)
        .attr("cx", function(d) {
          var coords = projection([d.Longitude, d.Latitude])
          return coords[0]
        })
        .attr("cy", function(d) {
          var coords = projection([d.Longitude, d.Latitude])
          return coords[1]
        })
        .attr("opacity", "0")
        .attr("fill", function(d,i) {
          return country_color[i]
        })
        .style("opacity", 0)
    
    // Initial Transition of COVID Cases
    covid.transition()
      .duration(1000)
      .delay(function(d,i) { return (i * (1000 / 4) + 400); })
      .attr("r", function(d) {
        return d.Cumulative_cases/1400000
      })
      .style("opacity", 0.7)

    // Country Label Dots
    svg.selectAll(".country-circles")
      .data(coviddata)
      .enter().append("circle")
      .attr("r", 3)
      .attr("cx", function(d) {
        var coords = projection([d.Longitude, d.Latitude])
        return coords[0]
      })
      .attr("cy", function(d) {
        var coords = projection([d.Longitude, d.Latitude])
        return coords[1]
      })
      .attr("fill", "rgb(27, 27, 27)")
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .delay(function(d,i) { return (i * (1000 / 4) + 400); })
      .style("opacity", 1)

    

    // On Mouse Over/Out
    // covid.on("mouseover", function(d) {
    //     console.log(d)
    //     d3.select(this).classed("selected", true)
    //   })
    //   .on("mouseout", function(d) {
    //     d3.select(this).classed("selected", false)
    //   })

    // Initiate the actions of mouse interaction
    covid.on("mouseover", onMouseOver).on("mousemove", onMouseMove).on("click", onMouseClick).on("mouseout", onMouseOut);


    // Tooltip
    var tooltip = d3.select(".map-viz")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("max-width", "130px")
      .style("padding", "10px")
      .style("background-color", "#e3e3e3")
      .style("border-radius", "2px")
      .style("text-align", "left")
      .style("border-style", "solid")
      .style("border-color", "rgb(90, 90, 90)")
      .style("font-family", "san-serif")
      .style("font-size", "12px")
      .style("line-height", "17px")
      .style("visibility", "hidden")
      .text("");
    

    // Mouse Over Handler
    function onMouseOver(d, i) {
      var x = event.pageX - (parseFloat(tooltip.style("width")) + parseFloat(tooltip.style("padding")))/2;
      var y = event.pageY-100;

      d3.select(this).classed("selected", true);


      tooltip.html("NAME: " + "<br/>" + d.Country + "<br/>" + "TOTAL CASES: " + "<br/>" + d.Cumulative_cases);
      
      tooltip.append("div").attr("class", "tooltip:after")
        .style("width", "0")
        .style("height", "0")
        .style("border-left", "50px solid transparent")
        .style(("border-right", "50px solid transparent"))
      
      tooltip.style("left", x + "px")
        .style("top",y + "px")
        .style("visibility", "visible");
    }


    // Mouse Move Handler
    function onMouseMove(d, i) {
      var x = event.pageX - parseFloat(tooltip.style("width"))/2;
      var y = event.pageY-100;

      tooltip.html("NAME: " + "<br/>" + d.Country + "<br/>" + "TOTAL CASES: " + "<br/>" + d.Cumulative_cases);
      tooltip.style("left", x + "px")
        .style("top",y + "px")
        .style("visibility", "visible");
    }


    // Mouse Out Handler
    function onMouseOut(d, i) {
      d3.select(this).classed("selected", false)
      tooltip.style("visibility", "hidden")
    }
    
    function onMouseClick(d, i) {
        d3.select(this).classed("selected", false)
        tooltip.style("visibility", "hidden")
        interactablePlot(d, i)
    }


};






// Scene with Map Interaction charts and 
async function scene6() {

    interaction = true

    // d3.select("#graph").selectAll("text").transition().duration(300).attr("transform", "translate("+50+", "+0+")").style("opacity", 0)

    // d3.select("#graph").style

    d3.select("#graph").remove()

    d3.select(".visualization").append("svg").attr("id", "graph").attr("opacity", 0)
    
    createMap()
}


// Array of Functions
var scenes = [
    scene1,
    scene1_5, 
    scene2, 
    scene3,
    scene4,
    scene5,
    scene6
];

// Call the First Scene on Load
scene1();

function changePage(direction) {
    i = i+direction;
    if (scenes[i] == undefined) {
        i = i - direction
    }
    scenes[i]()
}

function resetVis() {
    if (interaction == true) {
        // remove plot
        d3.select("#graph").remove()
        d3.select(".visualization").append("svg").attr("id", "graph").style("opacity", 0)
        // show the map
        createMap()
    }
    else {
        // display the direction portion of the martini structure
        scene1()
        i = 0
    }
}