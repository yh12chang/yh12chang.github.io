// Features of the annotation
const annotations = [
    {
      note: {
        label: "Here is the annotation label",
        title: "Annotation title"
      },
      x: 100,
      y: 100,
      dy: 100,
      dx: 60
    }
  ]
  
  // Add annotation to the chart
  const makeAnnotations = d3.annotation()
    .annotations(annotations)
  d3.select("#example1")
    .append("g")
    .call(makeAnnotations)