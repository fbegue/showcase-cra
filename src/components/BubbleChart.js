import React, {} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HC_more from 'highcharts/highcharts-more'
HC_more(Highcharts)

function BubbleChart(props) {

	//console.log("BubbleChart",props);
	//const [legend, setLegend] = useState(false);

	//todo:is there a need for legend at all?
	///if you have genres appearing, you just put the family on top
	// can dynamically enable/disable (had issue using as state prop from stats though?)

	//For modifying the chart at runtime: See the class reference.
	//https://api.highcharts.com/class-reference/classes.list


	return(<div>
		<div>
			{/*<button onClick={() =>{setLegend(!legend)}}>legend</button>*/}
			<HighchartsReact highcharts={Highcharts} options={props.options} />
		</div>
	</div>)
}
export default BubbleChart;
