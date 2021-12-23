import React, {useState,useEffect,useRef} from 'react';
//import React from "react";
import ReactDOM from "react-dom";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HC_more from 'highcharts/highcharts-more'
import highcharts3d from 'highcharts/highcharts-3d'
import drilldown from 'highcharts/modules/drilldown.js';
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
							drilldowns = {
								'Rock': {
									name: 'RockG',
									color: '#3150b4',
									dataLabels: {formatter: function() {return this.point.label}},
									data: [
										/*  ['User1', 2], ['User2', 3] */
										{name: 'User1', y:2,label:"Alternative"},
										{name: 'User2', y: 3,label:"Alternative"}
									]
								},
								'Pop': {
									name: 'PopG',
									color: '#3150b4',
									dataLabels: {formatter: function() {return this.point.label}},
									data: [
										{name: 'User1', y:2,label:"Glam"},
										{name: 'User2', y: 3,label:"Teenage"}
									]
								}
							},
							drilldowns2 = {
								'Rock': {
									name: 'RockG',
									color: '#50B432',
									dataLabels: {formatter: function() {return this.point.label;}},
									data: [
										{name: 'User1', y:6,label:"Modern"},
										{name: 'User2', y: 7,label:"Modern"}
									]
								},
								'Pop': {
									name: 'PopG',
									color: '#50B432',
									dataLabels: {formatter: function() {return this.point.label}},
									data: [
										{name: 'User1', y:10,label:"Glam"},
										{name: 'User2', y: 2,label:"Teenage"}
									]
								}
							},
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
		series: [{
			name: 'Rock',
			color: '#3150b4',
			data: [{
				name: 'User1',
				y: 5,
				drilldown: true
			}, {
				name: 'User2',
				y: 5,
				drilldown: true
			}]
		},{
			name: 'Pop',
			color: '#50B432',
			data: [{
				name: 'User1',
				y: 15,
				drilldown: true
			}, {
				name: 'User2',
				y: 7,
				drilldown: true
				// testing:
			}]
		},
			{
				name: 'Pop',
				color: '#50B432',
				data: [{
					name: 'User1',
					y: 15,
					drilldown: true
				}, {
					name: 'User2',
					y: 7,
					drilldown: true
				}]
			}],

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
