import React, { useState, useEffect, useMemo } from 'react'
import useMeasure from 'react-use-measure'
import {a, useTransition} from "react-spring";

import useMedia from './useMedia'
//import data from './data'
import styles from './styles.module.css'

export default function Masonry(props) {

	var uHeight = 150
	const columns = 3;
	//note: this width divided by # of columns = the width of one item
	// const width = 200;
	const width = 280;

	// const [items, set] = useState(data)

	const [items, set] = useState([])
	const [page, setPage] = useState(1)
	// useEffect(() => {
	//
	// 	var temp = props.data.map(r =>{return {css:r.images[0].url,height:uHeight}})
	//
	// 	set(temp)
	// }, [])

	var pageSize = 6;
	var _t = props.data.map(r =>{return {css:r.images[0].url,height:uHeight}})

	//todo: brain isn't working, just make the damn page value change on each interval iteration
	//figure something weird about using state inside an interval?
	function pageTurner(page){

		if (_t.length > pageSize) {
			if (page === 1) {
				_t = _t.slice(0, pageSize)
			} else {
				console.log("slice start index", pageSize * (page - 1));
				console.log("slice end index", (page) * pageSize);
				_t = _t.slice(pageSize * (page - 1), (page) * pageSize)
			}
		}
		set(_t)
		debugger
		setPage(page + 1)
		debugger
	}
	useEffect(() => {
		pageTurner(page)
	}, [])

	useEffect(() => {
		const t = setInterval(() => {
			pageTurner(page)
		}, 2000)
		return () => clearInterval(t)
	}, [])

	// Hook5: Form a grid of stacked items using width & columns we got from hooks 1 & 2
	const [heights, gridItems] = useMemo(() => {
		let heights = new Array(columns).fill(0) // Each column gets a height starting with zero
		let gridItems = items.map((child, i) => {
			const column = heights.indexOf(Math.min(...heights)) // Basic masonry-grid placing, puts tile into the smallest column using Math.min
			const x = (width / columns) * column // x = container width / number of columns * column index,
			const y = (heights[column] += child.height / 2) - child.height / 2 // y = it's just the height of the current column
			return { ...child, x, y, width: width / columns, height: child.height / 2 }
		})
		return [heights, gridItems]
	}, [columns, items, width])
	// Hook6: Turn the static grid values into animated transitions, any addition, removal or change will be animated
	const transitions = useTransition(gridItems, {
		key: (item) => item.css,
		from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
		enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
		update: ({ x, y, width, height }) => ({ x, y, width, height }),
		leave: { height: 0, opacity: 0 },
		config: { mass: 5, tension: 500, friction: 100,duration:300 },
		trail: 25,
	})
	// Render the grid
	return (
		<div  className={styles.list} style={{ height: Math.max(...heights),outline:"1px solid blue" }}>
			{transitions((style, item) => (
				<a.div style={style}>
					<div style={{ backgroundImage: `url(${item.css}?auto=compress&dpr=2&h=500&w=500)` }} />
				</a.div>
			))}
		</div>
	)
}
