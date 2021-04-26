import React, {useMemo} from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {useReactiveVar} from "@apollo/react-hooks";
import {TILES} from "../storage/withApolloProvider";
import {a, useTransition} from "react-spring";
function Main(props) {
	const tiles = useReactiveVar(TILES);
	console.log("$$tiles",tiles);
	const columns = 4;
	//note: this width divided by # of columns = the width of one item
	const width = 559;

	//note: replaced all references to data-height (designed to be unique values 300-500) with uHeight

	// const uHeight = 480;
	const uHeight = 260;


	const [heights, gridItems] = useMemo(() => {
		let heights = new Array(columns).fill(0) // Each column gets a height starting with zero
		let gridItems = tiles
			// .filter(i =>{return i.term === term})
			// .filter(i =>{return families.length === 0 ? true: families.indexOf(i.familyAgg) !== -1})
			.map((child, i) => {
				const column = heights.indexOf(Math.min(...heights)) // Basic masonry-grid placing, puts tile into the smallest column using Math.min
				const xy = [(width / columns) * column, (heights[column] += uHeight / 2) - uHeight / 2] // X = container width / number of columns * column index, Y = it's just the height of the current column
				return { ...child, xy, width: width / columns, height: uHeight / 2 }
			})
		return [heights, gridItems]
	}, [columns, width,tiles])

	//todo: its definite useTransition that's causing crazy 'infinite?' execution here
	//the part thats fucky is that if it works without spring, it can't be a fluke that the state mgmt works, right?

	// Hook6: Turn the static grid values into animated transitions, any addition, removal or change will be animated
	const transitions = useTransition(
		gridItems,
		(item) => item.id,
		// (item) => uuid(),
		{
			from: ({ xy, width, height }) => ({ xy, width, height, opacity: 0 }),
			enter: ({ xy, width, height }) => ({ xy, width, height, opacity: 1 }),
			update: ({ xy, width, height }) => ({ xy, width, height }),
			leave: { height: 0, opacity: 0 },
			config: { mass: 5, tension: 500, friction: 100 },
			trail: 25
		})

	return(<div>
		<div  className="list" style={{height: Math.max(...heights)}}>
			{transitions.map(({item, props: {xy, ...rest}}) => (
				<a.div key={item.id}
					   style={{transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`), ...rest}}>
					{/*<div style={{backgroundImage: item.css}} />*/}
					{/*todo: sometimes [0] might not be the one I'm looking for?*/}

					<div>
						<img height={120} src={item.images[0] && item.images[0].url}/>
						<div style={{padding:"2px",background:"rgb(128 128 128 / .7)",position:"relative",top:"-43px",color:"white",height:"20px"}}>{item.name}</div>
					</div>

					{/*<div>{item.images[0].url}</div>*/}
				</a.div>
			))}
		</div>
		{/*{tiles.length > 0 &&*/}
		{/*<div style={{display:"flex", flexWrap:"wrap",width:"480px"}}>*/}
		{/*	{tiles.map((item,i) => (*/}
		{/*		//width:item.width,*/}
		{/*		<div key={item.id} style={{padding:"5px"}}>*/}
		{/*			<Card>*/}
		{/*				<CardContent>*/}
		{/*					<img height={120} src={item.images[0] && item.images[0].url}/>*/}
		{/*					<div style={{padding:"2px",background:"rgb(128 128 128 / .7)",position:"relative",top:"-43px",color:"white",height:"20px"}}>{item.name}</div>*/}
		{/*					/!*<Typography variant="subtitle1" component={'span'} >{item.name}:{'\u00A0'}</Typography>*!/*/}
		{/*					/!*<Typography variant="subtitle1" component={'span'} ><span style={{color:'#3f51b5'}}>{item.value}</span></Typography>*!/*/}
		{/*				</CardContent>*/}
		{/*			</Card>*/}

		{/*		</div>*/}
		{/*	))}*/}
		{/*</div>}*/}

		{/*{tiles.length > 0 &&*/}
		{/*<div style={{display:"flex", flexWrap:"wrap",width:"480px"}}>*/}
		{/*	{tiles.map((item,i) => (*/}
		{/*		//width:item.width,*/}
		{/*		<div key={item.id} style={{padding:"5px"}}>*/}
		{/*			<Card>*/}
		{/*				<CardContent>*/}
		{/*					<img height={120} src={item.images[0] && item.images[0].url}/>*/}
		{/*					<div style={{padding:"2px",background:"rgb(128 128 128 / .7)",position:"relative",top:"-43px",color:"white",height:"20px"}}>{item.name}</div>*/}
		{/*					/!*<Typography variant="subtitle1" component={'span'} >{item.name}:{'\u00A0'}</Typography>*!/*/}
		{/*					/!*<Typography variant="subtitle1" component={'span'} ><span style={{color:'#3f51b5'}}>{item.value}</span></Typography>*!/*/}
		{/*				</CardContent>*/}
		{/*			</Card>*/}

		{/*		</div>*/}
		{/*	))}*/}
		{/*</div>}*/}
	</div>)
}
export default Main;
