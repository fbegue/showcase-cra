import React, { useState, useEffect } from 'react'
import { useTrail, useTransition, a } from '@react-spring/web'
import { config } from '@react-spring/web'
import styles from './styles.module.css'
import './index.css'
import data from './albums'
import LibGif from './libgif.gif'
// import NoteStream from './music.gif'
import NoteStream from './note_stream_1.gif'
import NetworkIcon from './network_1.gif'
import CalendarIcon from './calendar_1.gif'
import Logo from './soundfound_logo.gif'

//todo: https://loading.io/icon/
//Music (note),Calendar,Network

//todo: animated title
//https://loading.io/me/
//https://loading.io/asset/582116

//todo: alternative backgrounds
//https://loading.io/background/

const Trail = function(open){
	//const items = React.Children.toArray(children)

	var c1y = 0
	var c2y = -80
	var c3y = -160
	var items1 = []
	var items2 = []
	var items2a = []

	var y = 0

	// console.log(JSON.parse(JSON.stringify(data.albums)));

	//note: filter out comedy albums (quick hack)
	data.albums = data.albums.filter(a => {
		var flag = false
		a.artists[0].genres.forEach(g => {
			/* eslint-disable no-unused-expressions */
			g.name === 'comedy' && !flag ? (flag = true) : {}
		})
		return !flag
	})

	data.albums = data.albums.slice(0, 18)
	console.log(JSON.parse(JSON.stringify(data.albums)))

	data.albums.forEach(a => {
		var _l = (y / 80) % 3
		var left
		var top

		if (_l === 0) {
			left = 10
			top = c1y
			c1y = c1y - 160
		}
		//===================================
		else if (_l === 1) {
			left = 110
			top = c2y
			c2y = c2y - 160
		}
		//===================================
		else {
			left = 210
			top = c3y
			c3y = c3y - 160
		}

		var item = { y: y, left: left, top: top, url: a.images[0].url }
		items1.push(item)
		items2a.push(JSON.parse(JSON.stringify(item)))
		y = y + 80
	})

	console.log(data.albums.length)
	var visIndexer1 = [1, 2, 3, 5, 8, 9, 12, 13]

	items1.forEach((rec, i) => {
		if (visIndexer1.indexOf(i) !== -1) {
			rec.visibility = 'hidden'
		}
	})

	var visIndexer2 = [0, 4, 6, 7, 10, 11, 14]
	items2a.forEach((rec, i) => {
		if (visIndexer2.indexOf(i) !== -1) {
			rec.visibility = 'hidden'
		}
	})
	var items2 = items2a

	function randomIntFromInterval(min, max) {
		// min and max included
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	//const rndInt = randomIntFromInterval(1, 6)

	const [key, setKey] = useState(false)

	const trail = useTrail(items1.length, {
		config: { duration: 700 },
		// config: config.slow,
		opacity: open ? 1 : 0,
		height: open ? 110 : 0,
		from: { opacity: 0, x: 20, y: 10 },

		//todo: only affects first item b/c ... this state object
		//doesn't have unique state for each trail item???? idk

		//to: { opacity: 1},
		// onRest: () =>{
		//   console.log("setKey");
		//   setKey((prev) =>{return !prev})
		// },
		// loop:{reverse:key}

		//note: comment in for falling
		//to:{ opacity: 1,y:100}

		//todo: playing around with leaving
		//don't know how to delay between to phases, plus
		//making an array erases all other items except #1??
		// to:[{ opacity: 1,y:100},{ opacity: 0,y:200}],
		// to:{ opacity: 1,y:100},
		//trail:1000

		// from: { opacity: 0, x: 20},
		//to:[{ opacity: 1},{ opacity: 0}]
	})

	const trail2 = useTrail(items2.length, {
		config: { duration: 700 },
		delay: 500,
		//config: config.molasses,
		opacity: open ? 1 : 0,
		height: open ? 110 : 0,
		from: { opacity: 0, x: 20, y: 10 },
		//note: comment in for falling
		//to:{ opacity: 1,y:100}

		// reverse:true,
		//to:[{ opacity: 1},{ opacity: 0}]
	})

	return (
		<div style={{ opacity: '.3' }}>
			{/*testing: set explicit width for 100% */}
			<div style={{ position: 'absolute',width:"6em" }}>
				{trail.map(({ height, ...style }, index) => (
					<a.div
						key={index}
						className={styles.trailsText}
						style={{
							...style,
							left: items1[index].left,
							top: items1[index].top,
							visibility: items1[index].visibility ? items1[index].visibility : 'initial',
						}}>
						<a.div style={{ height }}>
							{/* <div style={{position:"absolute",top:0,fontSize:"25px"}}>
                <div>{items1[index].y} |
                {items1[index].top}|{items1[index].left}
                </div>
              </div> */}
							<img style={{ height: '1em' }} src={items1[index].url} />
						</a.div>
					</a.div>
				))}
			</div>
			<div style={{ position: 'absolute',width:"6em", left: 0, top: 15 }}>
				{trail2.map(({ height, ...style }, index) => (
					<a.div
						key={index}
						className={styles.trailsText}
						style={{
							...style,
							left: items2[index].left,
							top: items2[index].top,
							visibility: items2[index].visibility ? items2[index].visibility : 'initial',
						}}>
						<a.div style={{ height }}>
							{/* <div style={{position:"absolute",top:0,fontSize:"25px"}}>
                <div>{items2[index].y} |
                {items2[index].top}|{items2[index].left}
                </div>
              </div> */}

							<img style={{ height: '1em' }} src={items2[index].url} />
						</a.div>
					</a.div>
				))}
			</div>
		</div>
	)
}

export default function App() {
	const [open, set] = useState(true)
	const [isLoaded, setIsLoaded] = useState(false)

	const LibItemNoteStream = () => (
		<div className="item" style={{ display: 'flex', flexDirection: 'column' }}>
			<div>Import your Spotify Library</div>
			<div style={{ display: 'flex' }}>
				<div>
					<img style={{ height: '3em' }} src={LibGif} />
				</div>
				<div style={{ marginTop: '-3em', marginLeft: '-1em' }}>
					<img style={{ height: '10em' }} src={NoteStream} />
				</div>
			</div>
		</div>
	)

	const LibItem = () => (
		<div className="item" style={{ display: 'flex', flexDirection: 'column' }}>
			<div style={{ display: 'flex' }}>
				<div>Import your Spotify Library</div>
				<div>
					<img style={{ height: '3em', marginTop: '-1em' }} src={LibGif} />
				</div>
			</div>
		</div>
	)

	const CompareItem = () => (
		<div className="item" style={{ display: 'flex' }}>
			<div>Compare with your friends</div>
			<div>
				<img style={{ height: '3em', marginTop: '-.5em' }} src={NetworkIcon} />
			</div>
		</div>
	)

	const LoveItem = () => (
		<div style={{ display: 'flex' }}>
			<div>Find shows you'll all love!</div>
			<div>
				<img style={{ height: '3em', marginTop: '-1em', marginLeft: '.5em' }} src={CalendarIcon} />
			</div>
		</div>
	)

	const data = isLoaded
		? [
			{ key: 1, content: LibItem },
			{ key: 2, content: CompareItem },
			{ key: 3, content: LoveItem },
		]
		: []

	const transitions = useTransition(data, {
		from: {
			opacity: 0,
			scale: 0.93,
		},
		enter: (msg, i) => [
			{
				delay: () => {
					return i * 2000
				},
				opacity: 1,
				scale: 1,
				config: { duration: 5000 },
			},
			{
				// config:{duration:5000},
				// scale:1
			},
		],
		// enter: (msg, i) => ({
		//   delay: () => {
		//     return i * 2000;
		//   },
		//   opacity: 1,
		//   // scale: 1,
		//   config:{duration:5000}
		// }),
	})
	const msgs = transitions((style, msg) => {
		return (
			<a.div
				key={msg.key}
				style={{ ...style, display: 'flex', justifyContent: 'center', fontSize: '1.2em' }}
				className="message-bubble">
				<msg.content />
			</a.div>
		)
	})

	useEffect(() => {
		console.log('componentDidMount')
		setIsLoaded(true)
		return function cleanup() {
			console.log('componentWillUnmount')
		}
	})

	return (
		<div style={{ position: 'relative'}}>
			<div style={{ zIndex: 10, top: '-1.5em',outline:"1px solid orange" }}>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div id="logo" style={{ display: 'flex', justifyContent: 'center' }}>
						{/* <div style={{ color: 'white', fontSize: '2em' }}>SOUNDFOUND</div> */}
						<div style={{position:"relative",width:"16em"}}>
							<img style={{ height: '4em' }} src={Logo} />
						</div>
					</div>
					<div id="items" style={{ marginTop: '5em', zIndex: 100, color: 'white' }}>
						{msgs}
					</div>
					<div id="login" style={{ display: 'flex', justifyContent: 'center', marginTop: '4em',bottom:"0px" }}>
						<button id="login-button">
							<div className="ButtonInner">
								<p> Log In</p>
							</div>
						</button>
					</div>
				</div>
			</div>
			<div
				id="background-trail"
				className={styles.container}
				style={{"position":"relative","zIndex":"1","height":"32em",
					"overflowY":"hidden","width":"22em","top":"-20em","outline":"1px solid blue"}}
				onClick={() => set(state => !state)}>
				<div style={{ paddingTop: '1em' }}>
					<Trail open={open}></Trail>
				</div>
			</div>
		</div>
	)
}
