import React, {useState,useEffect,useRef} from 'react';
//import React from "react";
// import ReactDOM from "react-dom";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HC_more from 'highcharts/highcharts-more'

import highcharts3d from 'highcharts/highcharts-3d'
// import Drilldown from 'highcharts/drilldown'
import drilldown from 'highcharts/modules/drilldown.js';
//import './PieChart.css'

// import samplePieData from './data'
// import _ from "lodash";

HC_more(Highcharts)
highcharts3d(Highcharts)
drilldown(Highcharts)


//api
//https://api.highcharts.com/highcharts/plotOptions.pie

//codesandbox: piechart-stacked (broken css grid stack attempt)
//source
//https://jsfiddle.net/gspd2ua6/10/

//source
//https://codepen.io/djtechnoo/pen/KKNNbGN
//https://www.highcharts.com/blog/tutorials/animation-with-highcharts-to-create-a-lottery-wheel/


function PieChart3D(props) {
	let chart = null;
	var offset = 180;

	//console.log("$drill",props.drilldown);

	//putting Firefox first means we'll measure what I consider 'backwards'
	//so need to reverse order of input elements. b/c 0 is the top of the pie,
	//I always add offset = starting point of

	const [angle, setAngle] = useState(offset);

	var options = {
		credits: {enabled: false},
		chart: {
			animation: {
				duration: 1500,
			},
			//renderTo: 'container',
			type: 'pie',
			backgroundColor: 'rgba(0,0,0,0)',
			//todo: tried to remove all extra white space ala this example
			//https://www.highcharts.com/forum/viewtopic.php?t=22877

			plotBackgroundColor: null,
			plotBorderWidth: null,
			//backgroundColor: 'black',
			margin: [0,0,0,0],
			spacingTop: 0,
			spacingBottom: 0,
			spacingLeft: 0,
			spacingRight: 0,
			options3d: {
				enabled: true,
				alpha: 65,
				beta: 0
			}
		},
		title: {text: undefined},
		legend: {
			enabled:false,
			align: 'left',
			layout: 'vertical',
			verticalAlign: 'mididle',
			borderWidth: 0,
			margin: 0,
			labelFormatter: function () {
				return '<b>' + this.name + ' - ' + this.y + '%</b><br/> $' + this.value + '';
			},
			itemMarginTop: 5,
			itemMarginBottom: 5,
			itemStyle: {
				fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
				fontSize: '12px'
			}
		},
		accessibility: {
			point: {
				valueSuffix: '%'
			}
		},
		tooltip: {
			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		},
		plotOptions: {
			pie: {
				// allowPointSelect: true,
				// todo: don't think I'm seeing this shadow here
				shadow:true,
				startAngle:angle,
				cursor: 'pointer',
				depth: 55,
				// size: '120%'
				size: '100%'
			},
			series: {
				allowPointSelect: true,
				dataLabels: {
					//testing: allowOverlap not documented?
					allowOverlap:false,
					alignTo:"toPlotEdges",
					enabled: true,
					format: '{point.name} ({point.y})',
					distance: '-50',
					// crop: false,
					// overflow: "justify",
					// useHTML:true
				},
				point: {
					events: {
						select: function () {
							console.log("chart event",chart);
							// if (chart.chart.drilldownLevels.length > 0) {
							// 	chart.chart.drillUp();
							// }
						}
					}
				}
			}
		},
		// note: 3d pie chart

		// series: [{
		//     type: 'pie',
		//     name: 'Browser share',
		//     data:data
		// }]

		series: props.series,
		drilldown: props.drilldown
	}

	const elementRef = useRef();

// 	useEffect(() => {

// 		let angleMap = {
// 			Firefox:0 + offset,
// 			IE: .45 * 360 + offset
// 		  }
// 		console.log(angleMap);

// 		setTimeout(e =>{
// 		setAngle(angleMap['IE'])
// 		},2000)
//   },[]);


	const drillUp = () =>{
		//console.log("chart",chart.chart.series[0]);
		//if (chart.chart.drilldownLevels.length > 0) {
		// chart.chart.drillUp();
		///}
		elementRef.current.chart.drillUp()
	}

	return(
		<div>
			{/* testing: restore */}
			<button style={{position:"relative",zIndex:50}} onClick={() =>{drillUp()}} >drillUp</button>
			<div >
				<HighchartsReact  ref={elementRef} highcharts={Highcharts}
								  allowChartUpdate={true}
					// todo: there's just nothing here lol
					// options={{...pieOptions,series:data.series}} />
								  options={options} />
			</div>

		</div>)

}
export default PieChart3D;
