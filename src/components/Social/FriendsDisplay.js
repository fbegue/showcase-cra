import React, {useEffect, useMemo, useState} from 'react';
import UserTile from "../utility/UserTile";
import {a, useTransition} from "react-spring";
import styles from "./FriendsDisplay.tiles.module.css";
function FriendsDisplay(props) {
	console.log("FriendsDisplay | users",props.users);

	const columns = 4;
	//note: this width divided by # of columns = the width of one item
	const width = 500;
	//note: replaced all references to data-height (designed to be unique values 300-500) with uHeight
	const uHeight = 195;


	//testing:
	// const [query, setQuery] = React.useState("Dan");
	const [query, setQuery] = React.useState("");
	const [items, set] = useState(props.users)



	var testQuery = (t) =>{
		if(query === ""){return true}else{
			//console.log("$$user",t);
			//console.log("$q",query);
			var pat = "^" + query.toLowerCase();
			var re = new RegExp(pat,"g");
			return t.id === query.toLowerCase() || re.test(t.id) || (t.display_name && re.test(t.display_name.toLowerCase()));
		}
	}

	useEffect(() => {
		set(props.users.filter(testQuery))
	}, [query,props.users])


	const [heights, gridItems] = useMemo(() => {
		let heights = new Array(columns).fill(0) // Each column gets a height starting with zero
		let gridItems = items
			//.filter(testQuery)
			.map((child, i) => {
				const column = heights.indexOf(Math.min(...heights)) // Basic masonry-grid placing, puts tile into the smallest column using Math.min
				const x = (width / columns) * column // x = container width / number of columns * column index,
				const y = (heights[column] += uHeight / 2) - uHeight / 2 // y = it's just the height of the current column
				return { ...child, x, y, width: width / columns, height: uHeight / 2 }
			})
		return [heights, gridItems]
	}, [columns, items, width])
	// Hook6: Turn the static grid values into animated transitions, any addition, removal or change will be animated
	const transitions = useTransition(
		gridItems,
		{
			key: (item) => item.id,
			from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
			enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
			update: ({ x, y, width, height }) => ({ x, y, width, height }),
			leave: { height: 0, opacity: 0 },
			config: { mass: 5, tension: 500, friction: 100 },
			trail: 25,
		})



	return(<div>
		<div className={styles.list} style={{ height: Math.max(...heights) }}>
			{/*<div className={styles.list} style={{ height:"20em" }}>*/}
			{transitions((style, item) => (
				<a.div style={style} onClick={() =>{props.onClick(item)}}>
					<UserTile item={item}/>
				</a.div>
			))}
		</div>
	</div>)
}
export default FriendsDisplay;
