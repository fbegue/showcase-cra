import React, { useState, useEffect, useMemo } from 'react'
import useMeasure from 'react-use-measure'
import {a, useTransition} from "react-spring";
import doubleDown from '../../assets/double_chevron_down.png'
import styles from './styles.module.css'
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import {GridControl, StatControl, TabControl} from "../../index";

const usePaperStyles = makeStyles({
	root: {
		background: 'lightgrey',
		borderRadius: 3,
		border: 0,
		//todo: explicit uHeight/width repeated (below)
		height:230/2,
		width:230/2,
		color: 'black',
		padding: '0 6px',
		boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
	}
});

export default function Masonry(props) {

	let statcontrol = StatControl.useContainer();
	let gridControl = GridControl.useContainer()
	let tabcontrol = TabControl.useContainer()

	var uHeight = 230
	const columns = 2;
	const width = 230;

	const [items, set] = useState([])
	var pageSize = 4;

	const classes = usePaperStyles();

	//note: incoming data contains all possible (some maybe empty) type record sets
	//if a set has < pageSize -1 , we're going to skip it's display
	var reduced = [];
	var validReduced = []
	Object.keys(props.data).forEach(type =>{
		if(props.data[type].length > 0 && props.data[type].length >=pageSize){
			reduced = reduced.concat(props.data[type].slice(0,pageSize))
			validReduced.push(type)
		}else{
			console.warn("reduced skipped",type);
		}
	})

	//todo: need to come up with more coherant strategy for displaying multiple types of records

	var t = JSON.parse(JSON.stringify(reduced.map(r =>{
		return {type:r.type,css: r.images? r.images[0].url:r.album.images[0].url,height:uHeight}})))
	var _t = reduced.map(r =>{return {type:r.type,css: r.images? r.images[0].url:r.album.images[0].url,height:uHeight}})


	//todo: repeated from ContextStats select options
	var userContextDropdownOps = {
		"artist":{value:'artists_saved',title:'Saved Artists',style:null},
		"track":{value:'tracks_saved',title:<span style={{paddingRight:".5em"}}>Saved Tracks</span>,style:null},
		"album":{value:'albums_saved',title:'Saved Albums',style:null},
	}

	var sharedContextDropdownOps =
		{
			"artist":{value:'artists_friends',title:'Shared Artists',style:null},
			"track":{value:'tracks_friends',title:'Shared Tracks',style:null},
			"album":{value:'albums_friends',title:'Shared Albums',style:null},
		}

	const handleMoreClick = function(replaced){
		var name = ""
		if(props.databind === 'user'){
			name =  userContextDropdownOps[replaced.type].value
		}else{
			name =  sharedContextDropdownOps[replaced.type].value
		}
		debugger
		gridControl.setCollapse(true)
		statcontrol.setStats({name:name})

	}

	//todo: when it's only artists, we should just flip thru all artists
	//note: turn pages, but the last one is always a link out to length of type
	function pageTurner(page){

		if (page === 1) {
			_t = t.slice(0, pageSize)
		} else {
			//console.log("slice start index", pageSize * (page - 1));
		//	console.log("slice end index", (page) * pageSize);
			_t = t.slice(pageSize * (page - 1), (page) * pageSize)
		}

		var replaced = _t.pop()
		//console.log("$replaced",replaced);

		// 	let styles = {
		// 		paperContainer: {
		// 			backgroundImage: `url(${replaced.css})`,
		// 			color:'blue',
		// 			outline: "1px solid blue"
		// 		}
		// 	};

		_t.push({content:
				<div onClick={() =>{handleMoreClick(replaced)}} style={{color:"white",height:uHeight,width:width,position:"relative"}}>
					{/*<Paper  styles={styles.paperContainer} elevation={3}>*/}
						<div style={{"position":"absolute","left":"20%","top":"18%",display:"flex",flexDirection:"column",zIndex:2}} >
							<div>
								<Typography variant="h5">
									{
										<div style={{visibility: ((props.data[page - 1].length - pageSize) > 0) ? 'visible':'hidden'}}>
										+{props.data[page - 1].length - pageSize} </div>
									}
								</Typography>
							</div>
								<div style={{"marginLeft":"1em",marginTop:".5em"}}>
									<img style={{height:"1.7em",width:"1.7em"}} src={doubleDown}/>
									{/*{replaced ? replaced.css:"n/a"}*/}
								</div>
						</div>
					{/*testing: this is a weird zoomed in version but looks cool I guess? lol*/}
					{/*todo: dynamic text color over image vesus: ehhhh */}
					{/*relies on jquery: https://github.com/Aerolab/midnight.js*/}
					{/*you provide options: https://github.com/bgrins/TinyColor @ mostReadable*/}
					{/*{"padding":"2px","background":"#524e4ea3","borderRadius":"5px"}*/}
					{replaced ?<img src={ replaced.css} style={{width:"100%","top":"-25%","left":"-25%",opacity:".5"}}/>:<div></div> }

					{/*<div style={{height:uHeight,width:width,position:"absolute",backgroundImage:"url(" + replaced.css + ")",opacity:'.3',zIndex:1}}>&nbsp;</div>*/}
					{/*</Paper>*/}
				</div>,height:uHeight})

		set(_t)
	}



	useEffect(() => {
		pageTurner(props.type)
	}, [props.data,props.type])

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
					{
						item.css ? <div style={{ backgroundImage: `url(${item.css}` }} />
							: <div>{item.content}</div>
					}
				</a.div>
			))}
		</div>
	)
}
