async function createMap() {
    const heat_color = ["#ef3c18","#ef6a18","#ffa600","#ff7c43","#f95d6a","#d45087","#a05195","#665191","#2f4b7c","#003f5c"];
    const country_color = ["#d50000","#d6007d","#0a7287","#ff8400","#0a7334","#0c1ba1","#49b402","#6500ff","#3e2c0e","#c376e2"];

    var margin = { top: 50, left: 50, right: 50, bottom: 50 },
        height = 600 - margin.top - margin.bottom,
        width = 900 - margin.left - margin.right;

    var svg = d3.select("#map")
            // .select(".map-viz")
            // .append("svg")
            .attr("class", "world-map")
            // .attr("height", "60%")
            // .attr("width", "90%")
            .attr("viewBox", "0 0 900 600")
            .attr("preserveAspectRatio", "xMinYMin meet")
            // .attr("max-height", height + margin.top + margin.bottom)
            // .attr("max-width", width + margin.right + margin.left)
            .append("g");

    var projection = d3.geoMercator().scale(140).translate([(width + margin.left*2) / 2, (height + margin.top*2) / 1.43])
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
    covid.on("mouseover", onMouseOver).on("mousemove", onMouseMove).on("mouseout", onMouseOut);


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
      var x = event.clientX - (parseFloat(tooltip.style("width")) + parseFloat(tooltip.style("padding")))/2;
      var y = event.clientY - 110;

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
      var x = event.clientX - parseFloat(tooltip.style("width"))/2;
      var y = event.clientY - 110;

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

    
};

// Initiate the function
function displayMap(show) {
  if (show == true) {
    init()
  }
  
}



// var margin = { top: 50, left: 50, right: 50, bottom: 50 },
//     height = 600 - margin.top - margin.bottom,
//     width = 900 - margin.left - margin.right;

// var svg = d3.select(".map-viz")
//         .append("svg")
//         .attr("class", "world-map")
//         // .attr("height", "60%")
//         // .attr("width", "90%")
//         .attr("viewBox", "0 0 900 600")
//         .attr("preserveAspectRatio", "xMinYMin meet")
//         // .attr("max-height", height + margin.top + margin.bottom)
//         // .attr("max-width", width + margin.right + margin.left)
//         .append("g")

// const path = d3.geoPath(d3.geoMercator().scale(140).translate([(width + margin.left*2) / 2, (height + margin.top*2) / 1.43]));

// d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(data => {
//     const countries = topojson.feature(data, data.objects.countries).features;
//     console.log(countries);
    
//     svg.selectAll("path")
//       .data(countries)
//       .enter().append("path")
//       .attr("class", "country")
//       .attr("d", path)
//       .on("mouseover", function(d) {
//         console.log(d)
//         d3.select(this).classed("selected", true)
//       })
//       .on("mouseout", function(d) {
//         d3.select(this).classed("selected", false)
//       });
// });





// Promise.all([
//     d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
//     d3.csv("top10data.csv")
// ]).then(([data, coviddata]) => {
//     ready(null, data, coviddata)
// });

// function ready (error, data, coviddata) {
//     var countries = topojson.feature(data, data.objects.countries).features;

//     svg.selectAll("path")
//       .data(countries)
//       .enter().append("path")
//       .attr("class", "country")
//       .attr("d", path)
//       .on("mouseover", function(d) {
//         console.log(d)
//         d3.select(this).classed("selected", true)
//       })
//       .on("mouseout", function(d) {
//         d3.select(this).classed("selected", false)
//       });
      
      
//       svg.selectAll(".covid-data")
//         .data(coviddata)
//         .enter().append("circle")
//         .attr("r", 2)
//         .attr("cx", 10)
//         .attr("cy", 10)
// }