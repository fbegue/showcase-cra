import React, {useContext, useEffect, useMemo, useState} from 'react';
import UserTile from "../utility/UserTile";
import {a, useTransition} from "react-spring";
import styles from "./FriendsDisplay.tiles.module.css";
import PulseSpinnerSpring from '../springs/PulseSpinnerSpring'
import {Context} from "../../storage/Store";

function FriendsDisplay(props) {
	//console.log("FriendsDisplay | users",props.users);

	const columns = 3;
	//note: this width divided by # of columns = the width of one item
	const width = 350;
	//note: replaced all references to data-height (designed to be unique values 300-500) with uHeight
	const uHeight = 195;


	//testing:
	// const [query, setQuery] = React.useState("Dan");
	const [query, setQuery] = React.useState("");
	const [items, set] = useState(props.users)

	//testing:
	let t1 = {
		"display_name": "First Lastt1",
		"id": "T1123028477",
		"external_urls": {
		"spotify": "https://open.spotify.com/user/123028477#2"
	},
		"href": "https://api.spotify.com/v1/users/123028477#2",
		"type": "user",
		"uri": "spotify:user:123028477TEST2",
		"images": [
		{
			"height": null,
			"url": "https://picsum.photos/id/237/200/300",
			"width": null
		}
	],
		"friend": true,
		"x": 0,
		"y": 0,
		"width": 125,
		"height": 97.5
	}
	let t2 = {
		"display_name": "First Lastt2",
		"id": "T2123028477",
		"external_urls": {
			"spotify": "https://open.spotify.com/user/123028477#2"
		},
		"href": "https://api.spotify.com/v1/users/123028477#2",
		"type": "user",
		"uri": "spotify:user:123028477TEST2",
		"images": [
			{
				"height": null,
				"url": "https://picsum.photos/id/237/200/300",
				"width": null
			}
		],
		"friend": true,
		"x": 0,
		"y": 0,
		"width": 125,
		"height": 97.5
	}

	//testing: why on earth are these giving me duplicate key errors???
	// items.push(t1)
	// items.push(t2)

	// items.push({...t1,"id": "T3123028477","display_name": "First Lastt3"})
	// items.push({...t1,"id": "T4123028477","display_name": "First Lastt4"})
	// items.push({...t1,"id": "T5123028477","display_name": "First Lastt5"})

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


	const [globalState, globalDispatch] = useContext(Context);

	return(
		<div>
			{props.users.length === 0 && <div>So lonely ...</div> }
		<div className={styles.list} style={{ height: Math.max(...heights) }}>
			{/*<div className={styles.list} style={{ height:"20em" }}>*/}
			{transitions((style, item) => (
				<a.div style={style} onClick={() =>{props.onClick(item)}}>
					{/*todo: just looking at artists rn*/}
					{/*{!(globalState[item.id + "_artists"]) && <PulseSpinnerSpring fontSize={'50px'}/>}*/}
					<UserTile loaded={globalState[item.id + "_artists"]} item={item}/>
				</a.div>
			))}
		</div>
	</div>)
}
export default FriendsDisplay;
