import React, {useState} from "react";
import {VictoryLabel, VictoryPie,VictoryContainer} from "victory";
import {familyColors} from "../../families";
import { Highlighter} from "../../index";

function VictoryPieChart(props) {

	const [families, selectFamilies] = useState([]);
	let highlighter = Highlighter.useContainer();

	// const getLabel = (datum) =>{
	// 	return datum.x
	// }

	//common
	//https://formidable.com/open-source/victory/docs/common-props/
	//label
	//https://formidable.com/open-source/victory/docs/victory-label/
	//pie
	//https://formidable.com/open-source/victory/docs/victory-pie

	return(
		<VictoryPie
			containerComponent={<VictoryContainer responsive={false}/>}
			width={550}
			height={550}
			padding={{ left: 80, right: 100 }}
			//padding={60}
			labels={({ datum }) =>datum.x}
			labelComponent={ <VictoryLabel
				backgroundStyle={{ fill: "pink" }}
				backgroundPadding={5}
				style={{padding:"5px",margin:"5px"}}
				textAnchor="start"
				verticalAnchor="middle"
			/>}
			data={props.pieData}
			// padAngle={2}
			innerRadius={80}
			animate={{
				duration: 2009, easing: "linear"
			}}
			style={{
				data: {fill: (d) => familyColors[d.slice.data.x]}
			}}
			events={[{
				target: "data",
				eventHandlers: {
					onClick: () => {
						return [{
							mutation: (props) => {
								console.log("onClick | ", props.datum);
								var ret = null;
								if (families.indexOf(props.datum.x) === -1) {
									selectFamilies([...families, props.datum.x])
									ret = {
										style: Object.assign({}, props.style, {
											stroke: "black",
											strokeWidth: 2
										})
									};
								} else {
									selectFamilies(families.filter(f => {
										return f !== props.datum.x
									}))
									ret = {
										style: Object.assign({}, props.style, {
											stroke: "none",
											strokeWidth: 2
										})
									};
								}
								return ret;
							}
						}];
					},
					onMouseOver: () => {
						return [{
							mutation: (props) => {
								//console.log("onMouseOver | control", highlighter.hoverState);
								//console.log(props);
								//props.datum is the target releated to the event
								//we happen to be storing the family name as the x value
								//testing: setting single value in an array for now
								//maybe increase # of values allowed eventually for some fancy reason...

								highlighter.setHoverState([props.datum['x']])
								return {
									style: Object.assign({}, props.style, {stroke: "black", strokeWidth: 2})
								};
							}
						}];
					},
					onMouseOut: () => {
						return [{
							mutation: () => {
								//console.log("onMouseOut | control", highlighter.hoverState);
								return null;
							}
						}];
					}
				}
			}]}
		/>
	)
}
export default VictoryPieChart;


