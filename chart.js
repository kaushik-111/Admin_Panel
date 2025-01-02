window.onload = function () {

    var dps = []; // dataPoints
    var chart = new CanvasJS.Chart("chartContainer", {

      data: [{
        type: "line",
        dataPoints: dps
      }]
    });

    var xVal = 0;
    var yVal = 100;
    var updateInterval = 1000;
    var dataLength = 12; // number of dataPoints visible at any point

    var updateChart = function (count) {

      count = count || 1;

      for (var j = 0; j < count; j++) {
        yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
        dps.push({
          x: xVal,
          y: yVal
        });
        xVal++;
      }

      if (dps.length > dataLength) {
        dps.shift();
      }

      chart.render();
    };

    updateChart(dataLength);
    setInterval(function () { updateChart() }, updateInterval);

  }


  // ui elements

  //bar chart

  var data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [{
      label: "Dataset #1",
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 2,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)",
      data: [65, 59, 20, 81, 56, 55, 40],
    }]
  };
  
  var options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        stacked: true,
        grid: {
          display: true,
          color: "rgba(255,99,132,0.2)"
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };
  
  new Chart('chart', {
    type: 'bar',
    options: options,
    data: data
  });


  /////////////////////// Class Chart
/**
 *
 * @param config - {selector: string, width: number, height: number}
 * @param circleParams - {radiusX, radiusY}
 * @param sectorParams - {percents: [], fill: [], stroke: []}
 * @constructor
 */
var ChartSVG = function (config, circleParams, sectorParams) {
	///// Creation of elements
	try {
		this.wrapperNodeSelector = config.selector || '';
		this.makeNode(config.width, config.height);
		this.makeCircle(this.width / 2, this.height / 2, circleParams.radiusX, circleParams.radiusY);
		this.makeSectors(sectorParams);
		return this.node;
	} catch (e) {
		console.error(e);
		let errNode = document.createElement('div');
		errNode.className = 'chart-error';
		errNode.innerText = 'Error Chart: ' + e.message;
		return errNode;
	}
	///// !Creation of elements
};

ChartSVG.prototype.makeSVGElement = function (tag, attrs) {
	let el = document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (let k in attrs) {
		el.setAttribute(k, attrs[k]);
	}
	return el;
};

ChartSVG.prototype.makeNode = function (width, height) {
	if (typeof width !== 'number' || typeof height !== 'number') {
		throw new Error('Wrong chart width & height definition!')
	}

	this.width = width;
	this.height = height;
	this.node = this.makeSVGElement("svg", {
		width: this.width,
		height: this.height
	});

};
// Create and append main circle
ChartSVG.prototype.makeCircle = function (x, y, radiusX, radiusY) {

	if (typeof x !== 'number' || typeof y !== 'number' || typeof radiusX !== 'number' || typeof radiusY != 'number') {
		throw new Error('Wrong circle definition!')
	}

	let mainCircle = this.makeSVGElement("ellipse", {
		cx: x,
		cy: y,
		rx: radiusX,
		ry: radiusY,
		style: 'fill:none;stroke:none'
	});

	this.cx = x;
	this.cy = y;
	this.rx = radiusX;
	this.ry = radiusY;

	$(mainCircle).appendTo($(this.node));
};
// !Create and append main circle


/**
 * // Define sectors
 * @param sectorParams
 */
ChartSVG.prototype.makeSectors = function (sectorParams) {

	let arPercents = sectorParams.percents,
		arSectorColors = sectorParams.fill,
		arStrokeColors = sectorParams.stroke;

	let sumPercents = arPercents.reduce(function (a, b) {
		return a + b;
	});

	if (sumPercents > 100) {
		throw new Error('Wrong sectors percents definition!')
	}

	arPercents.push(100 - sumPercents);

	const FULL_CIRCLE = 360;

	var _self = this,
		sectors = [];

	arPercents.map((sectorPercent, i) => {

		let isFirst = (i === 0),
			isLargeArc = (sectorPercent >= 50) ? '1' : '0',

			// Angle depends of previous sector
			angleDegree = (isFirst ? 90 : sectors[i - 1].a) - FULL_CIRCLE * sectorPercent * 0.01,

			// Convert from polar coordinates
			angleRadians = (Math.PI / 180) * (angleDegree),
			xCartesius = _self.rx * Math.cos(angleRadians),
			yCartesius = _self.ry * Math.sin(angleRadians);

		var d = "M " + _self.cx + "," + _self.cy + "";

		d += (isFirst) ? (" L " + _self.cx + ", " + (_self.cy - _self.ry) + " ") : (" L " + sectors[i - 1].x + ", " + sectors[i - 1].y + " ");

		d += " A " + _self.rx + " " + _self.ry + " 0 " + isLargeArc + " 1 " + (_self.cx + xCartesius) + "," + (_self.cy - yCartesius) + " Z";

		sectors.push({
			x: _self.cx + xCartesius,
			y: _self.cy - yCartesius,
			a: angleDegree
		});

		let sector = _self.makeSVGElement('path', {
			style: 'fill:' + arSectorColors[i] + ';stroke:' + arStrokeColors[i] + ';stroke-width:1',
			d: d,
			'data-order': i
		});


		var css = '<style>' +
			_self.wrapperNodeSelector + ' path[data-order="' + i + '"]{    animation-name: spin' + i + ';}' +
			'@keyframes spin' + i + ' {' +
			'  from {transform:rotate(' + angleDegree + 'deg) scale(0) }\n' +
			'  to {transform:rotate(0deg)  scale(1) }' +
			'}</style>';

		$(css).appendTo('head');

		setTimeout(function () {
			$(sector).appendTo($(_self.node));
		}, i * 500);


	});
};


let arPercents = [10, 20, 30], // % of main chart for each sector, except last that counts automatically
	sectorColors = ['rgba(134,211,255,0.75)', 'rgba(255,157,141,0.75)', 'rgba(176,255,140,0.75)', 'rgba(149,170,255,0.75)'],
	strokeColors = ['rgb(134,211,255)', 'rgb(255,157,141)', 'rgb(176,255,140)', 'rgb(149,170,255)'];

let chartNode = new ChartSVG(
	{selector: '#chart-wrapper', width: 400, height: 250},
	{radiusX: 100, radiusY: 100},
	{percents: arPercents, fill: sectorColors, stroke: strokeColors}
);



$("#chart-wrapper").append($('<div class="chart-example-block"><h3></h3></div>').append($(chartNode)))
	.append($('<div class="chart-example-block"><h3></h3></div>').append($(chartNode2)));


  
//overall


    var dataset = [{
        name: 'Pass',
        percent: 70,
        
    }, {
        name: 'Fail',
        percent: 30
    }];

    var pie = d3.layout.pie()
      .value(function (d) {
          return d.percent;
      })
      .sort(null)
      .padAngle(.03);

    var w = 300,
      h = 300;

    var outerRadius = w / 2;
    var innerRadius = 100;

    var color = d3.scale.ordinal().range(["#697060", "#4a433d"]);

    var arc = d3.svg.arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    var svg = d3.select("#chartO")
      .append("svg")
      .attr({
          width: w,
          height: h,
          class: 'shadow'
      }).append('g')
      .attr({
          transform: 'translate(' + w / 2 + ',' + h / 2 + ')'
      });
    var path = svg.selectAll('path')
      .data(pie(dataset))
      .enter()
      .append('path')
      .attr({
          d: arc,
          fill: function (d, i) {
              return color(d.data.name);
          }
      });

    path.transition()
      .duration(1000)
      .attrTween('d', function (d) {
          var interpolate = d3.interpolate({
              startAngle: 0,
              endAngle: 0
          }, d);
          return function (t) {
              return arc(interpolate(t));
          };
      });

    var restOfTheData = function () {
        var text = svg.selectAll('text')
          .data(pie(dataset))
          .enter()
          .append("text")
          .transition()
          .duration(200)
          .attr("transform", function (d) {
              return "translate(" + arc.centroid(d) + ")";
          })
          .attr("dy", ".4em")
          .attr("text-anchor", "middle")
          .text(function (d) {
              return d.data.percent + "%";
          })
          .style({
              fill: '#fff',
              'font-size': '14px'
          });

        var legendRectSize = 20;
        var legendSpacing = 7;
        var legendHeight = legendRectSize + legendSpacing;

        var legend = svg.selectAll('.legend')
          .data(color.domain())
          .enter()
          .append('g')
          .attr({
              class: 'legend',
              transform: function (d, i) {
                  //Just a calculation for x & y position
                  return 'translate(-35,' + ((i * legendHeight) - 65) + ')';
              }
          });
        legend.append('rect')
          .attr({
              width: legendRectSize,
              height: legendRectSize,
              rx: 20,
              ry: 20
          })
          .style({
              fill: color,
              stroke: color
          });

        legend.append('text')
          .attr({
              x: 30,
              y: 15
          })
          .text(function (d) {
              return d;
          }).style({
              fill: '#16140d',
              'font-size': '16px'
          });
    };

    setTimeout(restOfTheData, 1000);

    var percent_val = 0;
    var degrees_val = 0;
    
    $('.circle').each(function() {
      percent_val = $(this).find('span').text().replace('%','');
      degrees_val = (percent_val * 0.01) * 360;
    
      if (percent_val > 50) {
        $(this).find('.pie.big').attr('style','display: block;');
        $(this).append('<style>.pie.big:before{ transform: rotate('+degrees_val+'deg); -moz-transform: rotate('+degrees_val+'deg); -ms-transform: rotate('+degrees_val+'deg); -o-transform: rotate('+degrees_val+'deg); -webkit-transform: rotate('+degrees_val+'deg); }</style>');
      }
      else {
        $(this).find('.pie.small').attr('style','display: block;');
        $(this).append('<style>.pie.small:before{ transform: rotate('+degrees_val+'deg); -moz-transform: rotate('+degrees_val+'deg); -ms-transform: rotate('+degrees_val+'deg); -o-transform: rotate('+degrees_val+'deg); -webkit-transform: rotate('+degrees_val+'deg); }</style>');
      }
    });