import React, {useState,useEffect,useRef} from 'react';
//import React from "react";
import ReactDOM from "react-dom";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HC_more from 'highcharts/highcharts-more'
import highcharts3d from 'highcharts/highcharts-3d'
import drilldown from 'highcharts/modules/drilldown.js';
import {series,drilldowns as exDrilldowns,drilldowns2 as exDrilldowns2} from "./StackedBarDrill/exampleStackedBarData";
HC_more(Highcharts)
highcharts3d(Highcharts)
drilldown(Highcharts)

//src:
//https://semantia.com.au/articles/highcharts-drill-down-stacked-columns/

function StackedBarDrill(props) {
	const elementRef = useRef();
	const config = {
		chart: {
			 height:200,
			type: 'bar',
			spacingTop: 0,
			spacingRight: 0,
			spacingBottom: 0,
			spacingLeft: 0,
			events: {
				drilldown: function (e) {
					if (!e.seriesOptions) {

						/*   console.log('drilldown',e.point.name); */
						//todo: need to recieve name of clicked on series,
						//not the point itself

						/* var target = e.point.name; */
						var target = e.point.series.name;
						/* e.point.series.name = e.point.name
						=== "User1" ? "Rock":"Pop"; */

						console.log('drilldown',target);

						//note: the data has to be split b/c I need to add two series


						var chart = this,
							drilldowns =exDrilldowns,
							drilldowns2 = exDrilldowns2,
							series = drilldowns[target],
							series2 = drilldowns2[target];
						chart.addSingleSeriesAsDrilldown(e.point, series);
						chart.addSingleSeriesAsDrilldown(e.point, series2);
						chart.applyDrilldown();

					}

				}
			}
		},
		credits: {enabled: false},
		title: {text:undefined},
		xAxis: {
			//visible: false,
			labels:{ enabled:true,align:"left",distance:100,
				//y:-60,
				x:10,
				// docs on HTML:
				//https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#html
				useHTML:true,
				formatter:()=>{return '<span>UserName</span>'}},
			// testing: was trying to have both name label + have picture offset below it onto bar
			// formatter:()=>{return '<div>UserName</div><div style="color:orange">UserName</div>'
			//}},
			title:{ enabled:false},
			lineWidth: 0,
			minorGridLineWidth: 0,
			lineColor: 'transparent',
			minorTickLength: 0,
			tickLength: 0

		},
		yAxis: {
			visible: false,
			// labels:{ enabled:false},
			// title:{ enabled:false}
		},
		legend: {
			enabled: false,
		},
		series: series,
		drilldown: {
			series: []
		},
		plotOptions: {
			bar: {
				grouping: true,
				groupPadding:0.5,
				// height of one bar
				pointWidth:80,
				stacking: 'normal',
				dataLabels: {
					// value of subsection of bar
					//   enabled: true,
				},
			}
		},
	};

	const addTest = () =>{
		console.log(elementRef.current.chart.series[0].data);
		var t = elementRef.current.chart.series[0].data
		var ex = {
			name: 'User3',
			y: 15,
			drilldown: true
		};
		elementRef.current.chart.series.forEach(s =>{
			s.addPoint(ex)
			//s.setData(t2);
		})
	}
	return(
		<div>
			<div >
				<button onClick={() =>{addTest()}}>Add User</button>
				<HighchartsReact  ref={elementRef} highcharts={Highcharts}
								  allowChartUpdate={true}
								  options={config} />
			</div>

		</div>)

}
export default StackedBarDrill;
