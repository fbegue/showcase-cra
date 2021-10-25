/* eslint-disable no-unused-expressions */
import React, {useState,useEffect,useRef} from 'react';
//import React from "react";
// import ReactDOM from "react-dom";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HC_more from 'highcharts/highcharts-more'
import {FriendsControl, PieControl} from "../../../index";
import highcharts3d from 'highcharts/highcharts-3d'
// import Drilldown from 'highcharts/drilldown'
import drilldown from 'highcharts/modules/drilldown.js';
import util from "../../../util/util";
//import {pieData,pieSeriesDrilldown,pieDataGuest,pieSeriesDrilldownGuest} from '../../../data/example/pieData'

//import {FriendsControl} from "../../../index";
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


let execute = false;
function syncCharts(e, chart) {
	if (!execute) {
		execute = true;
		if (e.type === 'drilldown') {
			Highcharts.charts.forEach(c => {
				//testing: not sure how to detect if multiple charts exist
				//even when not in view, seems like they're still around.
				//so just check for potential undefined error (as opposed to reading nav state)
				if (c && c !== chart) {
					var series = c.series[0],
						point = series.points[e.point.index];
					point.doDrilldown();
				}
			})
		} else {
			Highcharts.charts.forEach(c => {
				if (c) {c.drillUp();}
			});
		}

		execute = false;
	}
}

//testing: leaving this COMPLETELY static (no prop assignment below) will prevent rerender on chip click
//but then it's fucking useless isn't it?

var options = {
	className:null,
	credits: {enabled: false},
	chart: {
		type: 'pie',
		//https://api.highcharts.com/highcharts/chart.events
		events:{
			drilldown(e) {
				syncCharts(e, this);
			},
			drillup(e) {
				syncCharts(e, this);
			},
			//testing: chart events set drillstatus state
			// drilldown: function (e) {
			// 	console.log("drilldown select",e.point.name);
			// 	if(props.name){
			// 		//props.setCharts((prev) =>{return {...prev,[props.name]:{...prev[props.name],drill:'down'}}})
			// 		props.setDrillStatus((prev) =>{return {...prev,[props.name]:'down'}})
			// 	}
			// 	//handleClick(e.point.name)
			// },
			// drillup: function () {
			// 	console.log("drillup");
			// 	if(props.name){
			// 		//props.setCharts((prev) =>{return {...prev,[props.name]:{...prev[props.name],drill:'down'}}})
			// 		props.setDrillStatus((prev) =>{return {...prev,[props.name]:'up'}})
			// 	}
			// },
		},
		animation:{duration:2000},
		//renderTo: 'container',

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
			// startAngle:angle,
			cursor: 'pointer',
			depth: 55,
			// size: '120%'
			size: '80%'

		},
		series: {
			allowPointSelect: true,
			dataLabels: {
				//testing: allowOverlap not documented?
				allowOverlap:false,
				alignTo:"toPlotEdges",
				enabled: true,
				format: '{point.name} ({point.y})',
				distance: '-30',
				// crop: false,
				// overflow: "justify",
				// useHTML:true
			},

			// point: {
			// 	events: {
			// 		select: function (point) {
			// 			//console.log("chart event",chart);
			// 			console.log("point select",point);
			//
			// 		}
			// 	}
			// }
		}
	},
	// note: 3d pie chart

	// series: [{
	//     type: 'pie',
	//     name: 'Browser share',
	//     data:data
	// }]

	// series: props.series,
	// drilldown: props.drilldown
	// series:[{name: 'Families', colorByPoint: true, data:pieData}],
	// drilldown: pieSeriesDrilldown
	// series:[],
	// drilldown:[]
}

function PieChart3D(props) {
	//console.log("PieChart3D | render",props);

	var piecontrol = PieControl.useContainer()
	let friendscontrol = FriendsControl.useContainer()

	//testing:
	// options.chart.options.chart.className = props.name
	//options.chart.options.chart.className = props.name

	//var {ignored} = util.useTestPieEvent()

	const elementRef = useRef();
	//console.log("elementRef",elementRef);


	useEffect(() => {
		console.log("PieChart3D | data update",props.series);

		//testing:
		//elementRef.current.chart.series[0].data BECOMES the the drilldown data (so we can't check it)
		//don't update unless chart is looking at families (and therefore not drilled down

		//testing: (init junk data)
		// if(props.series[0].data.length > 0 && elementRef.current.chart.series[0].name === 'Families')

		//testing: only update if for real data, and only check that we're in families if the chart has been inited already
		if(props.series[0].data.length > 0 && (elementRef.current.chart.series[0] ? elementRef.current.chart.series[0].name === 'Families':true))
		{
			console.log("$made update",elementRef.current.chart.options.chart.className);
			//debugger;
			//testing: playing around w/ proper init instead of junk data below
			elementRef.current.chart.addSeries(props.series[0])
			elementRef.current.chart.update({drilldown:props.drilldown})

			//testing: by point? could probably locate w/in chart.series...
			///https://api.highcharts.com/class-reference/Highcharts.Chart#addSeriesAsDrilldown
			// props.drilldown.series.forEach(s =>{
			// 	elementRef.current.chart.addSeriesAsDrilldown(point, data)
			// })

			//testing: update junk data as init
			//elementRef.current.chart.update({series:props.series,drilldown:props.drilldown})
			// setTimeout(e =>{
			// 	elementRef.current.chart.update({series:props.series,drilldown:props.drilldown})
			// },1000)

		}

		//todo: warning about complex compare
		//(props.series is always re-created on each render)
	},[props.series[0].data,props.drilldown]);


	//todo: diagnose slowness
	//
	//have tried:
	//Set the overall animation for all chart updating
	//https://api.highcharts.com/highcharts/chart.animation

	//init animation (seems fine tho..)
	//(also, docs point to wrong thing - click on example? )
	//https://api.highcharts.com/highcharts/plotOptions.series.animation

	useEffect(() => {
		debugger;
		if(friendscontrol.families.length > 0){
			console.log("PieChart3D | family update",friendscontrol.families);
			if( Highcharts.charts.length > 2){
				debugger;
			}
			var c = null;
			//testing: doesn't matter which chart I pick of the two since they will reflect each other
			for(var x = 0; x <Highcharts.charts.length; x++){
				Highcharts.charts[x] ? c = Highcharts.charts[x]:{};
			}
			if(c){
				var series = c.series[0]
				//todo: to use this array of selected families for drilldown
				//doesn't really make sense = can't drilldown to more than one point
				var dataPoint  = series.data.filter(r =>{return r.name === friendscontrol.families[0]})
				//piecontrol.setAllowUpdate(false)
				console.log("$made family update",elementRef.current.chart.options.chart.className);
				dataPoint[0].doDrilldown(false);
			}
		}else{
			//if update causes no families to be selected, we need to return to top view
			elementRef.current.chart.drillUp()
		}
	},[friendscontrol.families]);


	var offset = 180;
	// const [angle, setAngle] = useState(offset);
	// const [allowUpdate, setAllowUpdate] = useState(false);

	//putting Firefox first means we'll measure what I consider 'backwards'
	//so need to reverse order of input elements. b/c 0 is the top of the pie,
	//I always add offset = starting point of

	//testing: angleMap
	useEffect(() => {

		let angleMap = {
			Firefox:0 + offset,
			IE: .45 * 360 + offset
		  }
		console.log(angleMap);

		setTimeout(e =>{
		setAngle(angleMap['IE'])
		},2000)
  },[]);



	const drillUp = () =>{
		//console.log("chart",chart.chart.series[0]);
		//if (chart.chart.drilldownLevels.length > 0) {
		// chart.chart.drillUp();
		///}
		elementRef.current.chart.drillUp()
	}

	const drillDown = () =>{

		console.log("drill",elementRef.current.chart.series[0].data[1]);
		elementRef.current.chart.series[0].data[1].doDrilldown(false);
		//elementRef.current.chart.get('rock').points[1].doDrilldown(false);
		//elementRef.current.chart.drillUp()
	}


	//const toggleAllow= () =>{piecontrol.setAllowUpdate(prev => !prev)}


	const setAngle = () =>{
		elementRef.current.chart.update({plotOptions:{pie:{startAngle:90}}})
	}

	return(
		<div>
			{/* testing: restore */}
			<div>{props.name}</div>
			{/*<div>{options.series[0].data.length}</div>*/}
			<button style={{position:"absolute",zIndex:100,marginTop:"10em"}} onClick={() =>{drillUp()}} >drillUp</button>
			<button style={{position:"absolute",zIndex:100,marginTop:"8em"}} onClick={() =>{drillDown()}} >drillDown</button>
			{/*<button style={{position:"absolute",zIndex:100,marginTop:"4em"}} onClick={() =>{setAngle()}} >setAngle</button>*/}
			{/*<button style={{position:"absolute",zIndex:100,marginTop:"6em"}} onClick={() =>{toggleAllow()}} >toggleAllow {piecontrol.allowUpdate.toString()}</button>*/}
			{/*<button style={{position:"absolute",zIndex:100,marginTop:"4em"}} onClick={() =>{tryUpdate()}} >tryUpdate</button>*/}
			<div >
				<HighchartsReact  ref={elementRef} highcharts={Highcharts}
					// allowChartUpdate={piecontrol.allowUpdate}
								  allowChartUpdate={false}
					//  callback={() =>{setTimeout(e =>{},1000)}}
								  callback={() =>{console.log("chart init render finished");}}
					// immutable={true}
					// updateArgs={[false,false,false]}
					//  options={{...options,series:props.series,drilldown:props.drilldown}}

					//testing: junk init
					// 			  options={{...options,series:[{name: 'Families', colorByPoint: true,
					// 					  data:[{"name": "rock", "drilldown": "rock", "id": "3","y": 17},{"name": "pop", "drilldown": "pop", "id": "4","y": 21}]}]
					// 				  ,drilldown:{series:[]}}}

					 			  options={{...options,	chart:{...options.chart,className:props.name},series:[],drilldown:{series:[]}}}

				/>
			</div>

		</div>)

}
export default PieChart3D;
