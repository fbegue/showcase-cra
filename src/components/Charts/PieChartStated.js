import React, {useState,useEffect} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HC_more from 'highcharts/highcharts-more'
import './PieChart.css'
//import {FriendsControl} from "../../index";
import _ from "lodash";

HC_more(Highcharts)

function PieChart(props) {

	var comp = "PieChart"
	let chart = null;
	// if(props.data.series[0].data.length >0){
	// 	debugger
	// }
	//console.log(comp + " | render");


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

	//let friendscontrol = FriendsControl.useContainer()

	var exPieData = [
		{
			"name": "rock",
			"drilldown": "rock",
			"id": "3",
			"y": 2,
			"color": "#cf9e2a"
		},
		{
			"name": "world",
			"drilldown": "world",
			"id": "12",
			"y": 1,
			"color": "#FFF"
		}
	];

	let [pieOptions,setPieOptions] = React.useState(
	 {
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
						// click: function (event) {
						// 	var sel = event.point.name;
						// 	friendscontrol.setFamilies((prevState => {
						// 		//console.log("prev",prevState);
						// 		if(!(prevState.includes(sel))){
						//
						// 			event.point.select(true,true)
						// 			return [...prevState,sel]}
						// 		else{
						//
						// 			event.point.select(false,true)
						// 			return prevState.filter(r =>{return r !== sel})}
						// 	}));
						// }
					}
				}
			}
		},
		credits: {enabled: false},
		 series: props.data.series
		 //series:[{data:exPieData}]
	})

	//console.log("$pieOptions init",pieOptions);

	useEffect(() => {
		//console.log("$! set data...",props.data.series);
		if(props.data.series[0].data[0] !== undefined){
				setPieOptions(prev =>{
					return {...prev,series:props.data.series}
				})
		}
	},[props.data.series]);

	function change(){
		setPieOptions(prev =>{
			var newVal = prev.series[0].data.slice(1)
			// console.log("prev",prev);
			// console.log("newVal",newVal);
			var wrap = [{data:newVal}]
			// return {...prev,series:[...prev.series[0].data.slice(1)]}
			return {...prev,series:wrap}

		})
	}
	// useEffect(() => {
	// 	const myInterval = setInterval(() =>{
	// 		if(pieOptions?.series?.[0].data.length >0){
	// 			change()
	// 		}
	// 	}, 2000);
	// },[]);

	return(
		<div>
			{/*<button style={{zIndex:1000,position:"absolute"}} onClick={() =>{handleChange()}}>change</button>*/}
			{/*setChart(a)*/}
			<div >

				<HighchartsReact  ref={a => chart = a} highcharts={Highcharts}
								  allowChartUpdate={true}
								  // options={{...pieOptions,series:props.data.series}} />
								  options={pieOptions} />
			</div>


	</div>)

}
export default PieChart;
