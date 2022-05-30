import React, {useState,useEffect} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HC_more from 'highcharts/highcharts-more'
import './PieChart.css'
import {FriendsControl} from "../../index";
import _ from "lodash";
HC_more(Highcharts)

function PieChartAPIControlled(props) {

	let chart = null;


	//todo: keep looking to minmize extra space as much as possible
	//- set margins x
	//https://api.highcharts.com/highcharts/chart.margin

	//- adjust distance of labels from data?
	//- don't show labels if the slice is big enough to put the label inside it?


	//todo: refreshes causing chart issue (just annoying)
	//believe I could fix it with some kind of gating around the update cycle
	//https://stackoverflow.com/questions/53773491/dynamically-update-highcharts-chart-in-react

	//let [allowChartUpdate, setUpdate] = useState(false);

	//todo: very basic example of updating data

	//examples of different ways to update data
	//https://stackoverflow.com/questions/56246267/add-new-data-to-a-highchart-pie-chart-dynamically

	//in react, need to create a ref to the element in order to interact with the chart via setData, etc.
	//https://stackoverflow.com/questions/46805086/change-series-data-dynamically-in-react-highcharts-without-re-render-of-the-char

	let friendscontrol = FriendsControl.useContainer()

	const pieOptions = {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie',
			height:325,
			width:360,
			margin: [0, 0, 0, 0],
			animation: {
				duration: 1500,
			},
			backgroundColor: 'rgba(0,0,0,0)'
		},
		title: {text: undefined},

		tooltip: {
			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		},
		// accessibility: {
		// 	point: {
		// 		valueSuffix: '%'
		// 	}
		// },
		plotOptions: {
			pie: {
				//note: enabling this will mess up multiselect
				allowPointSelect: false,
				cursor: 'pointer',
				//testing: lines w/ pie names
				dataLabels: {
					enabled: true,

					//todo: labels enabled / label inside = weird things happen to chart size
					//just an alternative to a legend somewhere... might just be easier to go with that
					//https://api.highcharts.com/highcharts/plotOptions.pie.dataLabels

					//https://www.highcharts.com/forum/viewtopic.php?t=42724
					 distance:-80,
					format: '<b>{point.name}</b>: {point.percentage:.1f} %'
					// format: '<b>{point.name}</b>'
				}
			},
			series: {
				cursor: 'pointer',
				// events: {

				// },
				point: {
					events: {
						click: function (event) {
							var sel = event.point.name;
							friendscontrol.setFamilies((prevState => {
								//console.log("prev",prevState);
								if(!(prevState.includes(sel))){

									event.point.select(true,true)
									return [...prevState,sel]}
								else{

									event.point.select(false,true)
									return prevState.filter(r =>{return r !== sel})}
							}));
						}
					}
				}
			}
		},
		credits: {enabled: false}
	}

	// const handleChange = () =>{
	// 	//setUpdate(true)
	// 	console.log("handleChange",chart);
	// 	console.log(chart.chart.series[0]);
	// 	var d = chart.chart.series[0].data;
	// 	chart.chart.series[0].setData(chart.chart.series[0].data.slice(0,d.length-1))
	// 	//setUpdate(false)
	// }


	//note: deprecated? idk what the whole idea was here

	// useEffect(() => {
	// 	//console.log("$! set data...",props.data.series);
	// 	if(props.data.series.data[0] !== undefined){
	// 		console.log("$! set data",props.data.series);
	// 		chart.chart.series[0].setData(props.data.series.data);
	//
	// 		//programatically select/deselect points to account for family chip removal from tiles area
	//
	// 		chart.chart.series[0].points.forEach((p,i)=>{
	// 			//console.log(friendscontrol.families);
	// 			var f = _.find(friendscontrol.families, function(o) { return o === p.name });
	// 			//if the family isn't in friendscontrol, deselect in chart
	//
	// 			//todo: no idea why select false never works?
	// 			//https://api.highcharts.com/class-reference/Highcharts.Point#select
	//
	// 			 if(f === undefined) {
	// 				 debugger;
	// 			 	chart.chart.series[0].data[i].select(false);
	//
	// 				}
	// 			 else{
	// 				 debugger;
	// 			 	chart.chart.series[0].data[i].select(true)}
	// 		})
	// 	}
	//
	// },[props.data.series]);

	useEffect(() => {

		if(props.data.series.data[0] !== undefined){
			// console.log("$! set data",props.data.series);
			// chart.chart.series[0].setData(props.data.series.data);

			//note: there is currently no case in which you click on a family chip in ContextStats but aren't removing
			//programatically deselect points to account for family chip removal from tiles area

			chart.chart.series[0].points.forEach((p,i)=>{
				var f = _.find(friendscontrol.families, function(o) { return o === p.name });
				if(f === undefined) {
					chart.chart.series[0].data[i].select(false,true);
				}
			})
		}
	},[friendscontrol.families]);

	// useEffect(() => {
	// 	//console.log("$! set data...",props.data.series);
	// 	if(props.data.series.data[0] !== undefined){
	// 		console.log("$! set data",props.data.series);
	// 		chart.chart.series[0].setData(props.data.series.data);
	// 	}
	// },[props.data.series]);






	return(
		<div>
			{/*<button style={{zIndex:1000,position:"absolute"}} onClick={() =>{handleChange()}}>change</button>*/}
			{/*setChart(a)*/}
			<div >
				<HighchartsReact  ref={a => chart = a} highcharts={Highcharts}
								  allowChartUpdate={true}
								  options={{...pieOptions,series:props.data.series}} />
			</div>

	</div>)

}
export default PieChartAPIControlled;
