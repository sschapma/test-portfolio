/*jshint esversion: 6 */
let width = '100%',
    height = '100%';

let projection = d3.geo.mercator()
                        .center([-30, 45])
                        .scale(230)
                        .rotate([0, 0]);

let tooltip = d3.select("body").append('div').attr('class', 'tooltip');
let showTooltip = (d) => {
  let year = new Date(d.properties.year);
  let toolTipTemplate = `<div>${d.properties.name}, ${year.getFullYear()}</div>
                         <div>Mass: ${d.properties.mass/1000}kg</div>
                         <div>Type: ${d.properties.recclass}</div>`;
  tooltip.html(toolTipTemplate)
          .style('left', (d3.event.pageX + 10) + 'px')
          .style('top', (d3.event.pageY + 10) + 'px')
          .style('display', 'block');
};
let hideTooltip = (d) => {
  tooltip.style('display', 'none');
};

let svg = d3.select(".container").append("svg").attr("width", width).attr("height", height);

let path = d3.geo.path().projection(projection);

let worldMapData = 'https://gist.githubusercontent.com/d3noob/5189184/raw/1e263cb5ccbb0551819e420df31a35fd3d4188f3/world-110m2.json';
let meteorData = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json';

let g = svg.append("g");

d3.json(worldMapData, (error, topology) => {
  g.selectAll('path')
    .data(topojson.object(topology, topology.objects.countries).geometries)
    .enter().append('path')
    .attr('d', path);
  d3.json(meteorData, (error, data) => {
    g.selectAll('circle')
      .data(data.features)
      .enter()
      .append('circle')
      .attr('cx', (d) => {
        return projection([d.properties.reclong, d.properties.reclat])[0];
      }).attr('cy', (d) => {
        return projection([d.properties.reclong, d.properties.reclat])[1];
      }).attr('r', (d) => { return Math.sqrt(d.properties.mass/1000); })
        .attr('class', 'meteor')
        .on('mouseover', showTooltip)
        .on('mouseout', hideTooltip);
    });

 let zoom = d3.behavior.zoom()
    .on("zoom",() => {
      g.attr("transform","translate("+d3.event.translate.join(",")+")scale("+d3.event.scale+")");
      g.selectAll("path")
       .attr("d", path.projection(projection));
    });
  svg.call(zoom);
});
