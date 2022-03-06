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
	var pageSize = 6;
	//todo: adjust pageInterval based on total # of items?
	var pageInterval = 5000;
	var t = JSON.parse(JSON.stringify(props.data.map(r =>{return {css:r.images[0].url,height:uHeight}})))
	var _t = props.data.map(r =>{return {css:r.images[0].url,height:uHeight}})

	//note: turn pages
	function pageTurner(page){
		if ( t.length > pageSize) {
			if (page === 1) {
				_t = t.slice(0, pageSize)
			} else {
				//console.log("slice start index", pageSize * (page - 1));
				//console.log("slice end index", (page) * pageSize);
				_t = t.slice(pageSize * (page - 1), (page) * pageSize)
			}
		}
		//todo: skip any that don't fit and reset
		if(_t.length <= pageSize - 1){
			setPage(1);
			_t = t.slice(0, pageSize)
		}
		set(_t)
	}

	//note: use page to increment range finder (transition 1 at a time)
	//todo: in my head this was a grid where 1 would fade and another would come in it's place
	//but obvs thats not the purpose of this guy (probably a non-transitions thing?)

	function pageTurnerSimple(page){
		var startind = -1;
		var endind = 5;
		if ( t.length > pageSize) {
			_t = t.slice(startind + page, endind + page)
		}
		set(_t)
	}

	useEffect(() => {pageTurner(page)}, [])
	useEffect(() => {
		const t = setInterval(() => {
			//note: not guarantee state val update, so store temp val
			var _p = null;
			setPage((prev) =>{_p = prev+ 1;return _p})
			pageTurner(_p)
		}, pageInterval)
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


	function randomIntFromInterval(min, max) { // min and max included
		return Math.floor(Math.random() * (max - min + 1) + min)
	}
	var random = (a,b) =>{
		const rndInt = randomIntFromInterval(1, 2)
		if(rndInt ===1){return -1}else{return 1}
	}
	const transitions = useTransition(gridItems, {
		key: (item) => item.css,
		// from:() => ({ opacity: 0 }),
		// enter:() => ({ opacity: 1 }),
		 from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
		 enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
		update: ({ x, y, width, height }) => ({ x, y, width, height }),
		leave: { opacity: 0 },
		config: { mass: 5, tension: 500, friction: 100,duration:300 },
		trail: 70,
		//'randomly' sort the order of transitions
		sort:random
	})
	// Render the grid
	return (
		//,outline:"1px solid blue"
		<div  className={styles.list} style={{ height: Math.max(...heights)}}>
			{transitions((style, item) => (
				<a.div style={style}>
					<div style={{ backgroundImage: `url(${item.css}` }} />
				</a.div>
			))}
		</div>
	)
}
