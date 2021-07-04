import React, { useState, useEffect } from 'react'
// import { useTransition, animated } from '@react-spring/web'
import {animated, useTransition} from "react-spring";
import data from './data2'
import styles from './Library.module.css'
import './Library.css'
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
//source: https://react-spring.io/hooks/use-transition
//todo: couldn't totally dry test b/c couldn't set init rows to subset or else = horizontal? lol

function Library() {
	//const [rows, set] = useState([data[0]])
	function getDim(n) {
		// n.width = 50
		n.height = 150
	}
	function getRows(rows) {
		rows.forEach(n => {
			getDim(n)
		})
		return rows
	}

	//todo: fake library data

	var artists_fake = [
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/07d5etnpjriczFBB8pxmRe"
			},
			"followers": {
				"href": null,
				"total": 347810
			},
			"genres": [
				{
					"id": 643,
					"name": "alternative r&b",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 6,
					"name": "hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 162,
					"name": "underground hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 50,
					"name": "neo soul",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 23,
					"name": "rap",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 1118,
					"name": "chicago rap",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 8,
					"name": "r&b",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 1295,
					"name": "pop r&b",
					"family_id": 1,
					"family_name": "pop"
				},
				{
					"id": 1132,
					"name": "indie r&b",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 30,
					"name": "southern hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 1184,
					"name": "indie soul",
					"family_id": null,
					"family_name": null
				}
			],
			"href": "https://api.spotify.com/v1/artists/07d5etnpjriczFBB8pxmRe",
			"id": "07d5etnpjriczFBB8pxmRe",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/44b2af225e5a8f0c215965d542e8ab9d00311b5f",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/bf22986c64f734e4afc5f399213ccaaea6b24cdf",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ad9f49a3937cea57380538a9d84d726163638e05",
					"width": 160
				}
			],
			"name": "BJ The Chicago Kid",
			"popularity": 70,
			"type": "artist",
			"uri": "spotify:artist:07d5etnpjriczFBB8pxmRe",
			"familyAgg": "hip hop",
			"source": "saved",
			"release_range": {
				"earliest": "Sat May 29 2021 10:34:40 GMT-0400 (Eastern Daylight Time)",
				"latest": "Sat May 29 2021 10:34:40 GMT-0400 (Eastern Daylight Time)"
			}
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/0L8ExT028jH3ddEcZwqJJ5"
			},
			"followers": {
				"href": null,
				"total": 16017232
			},
			"genres": [
				{
					"id": 3,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 35,
					"name": "funk metal",
					"family_id": 8,
					"family_name": "metal"
				},
				{
					"id": 1119,
					"name": "permanent wave",
					"family_id": null,
					"family_name": null
				},
				{
					"id": 27,
					"name": "funk rock",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 43,
					"name": "alternative rock",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/0L8ExT028jH3ddEcZwqJJ5",
			"id": "0L8ExT028jH3ddEcZwqJJ5",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/89bc3c14aa2b4f250033ffcf5f322b2a553d9331",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/7251ac7f3c0262cfcfad32e214deda639a2b4b46",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/8def8c4db6061deb04daca08e43bcde57181ec8b",
					"width": 160
				}
			],
			"name": "Red Hot Chili Peppers",
			"popularity": 87,
			"type": "artist",
			"uri": "spotify:artist:0L8ExT028jH3ddEcZwqJJ5",
			"familyAgg": "rock",
			"source": "saved",
			"release_range": {
				"earliest": "Sat May 29 2021 10:34:40 GMT-0400 (Eastern Daylight Time)",
				"latest": "Sat May 29 2021 10:34:40 GMT-0400 (Eastern Daylight Time)"
			}
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/0Nrwy16xCPXG8AwkMbcVvo"
			},
			"followers": {
				"href": null,
				"total": 160061
			},
			"genres": [
				{
					"id": 1122,
					"name": "modern blues rock",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 3,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1123,
					"name": "modern hard rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1121,
					"name": "modern alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1124,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 104,
					"name": "garage rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1120,
					"name": "alternative roots rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 228,
					"name": "punk blues",
					"family_id": 10,
					"family_name": "blues"
				}
			],
			"href": "https://api.spotify.com/v1/artists/0Nrwy16xCPXG8AwkMbcVvo",
			"id": "0Nrwy16xCPXG8AwkMbcVvo",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/cb2f7f6fb66d88dbda1f6c4f8bb6704dfa686e11",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/9937b25a458938fbd729e50067237bce6affbab3",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/b499bbd12d96af33750f9acfccd22408ec3b4816",
					"width": 160
				}
			],
			"name": "Black Pistol Fire",
			"popularity": 58,
			"type": "artist",
			"uri": "spotify:artist:0Nrwy16xCPXG8AwkMbcVvo",
			"familyAgg": "rock",
			"source": "saved",
			"release_range": {
				"earliest": "Sat May 29 2021 10:34:40 GMT-0400 (Eastern Daylight Time)",
				"latest": "Sat May 29 2021 10:34:40 GMT-0400 (Eastern Daylight Time)"
			}
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/12Chz98pHFMPJEknJQMWvI"
			},
			"followers": {
				"href": null,
				"total": 6439233
			},
			"genres": [
				{
					"id": 3,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1119,
					"name": "permanent wave",
					"family_id": null,
					"family_name": null
				},
				{
					"id": 1124,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/12Chz98pHFMPJEknJQMWvI",
			"id": "12Chz98pHFMPJEknJQMWvI",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/12450535621500d6e519275f2c52d49c00a0168f",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/17f00ec7613d733f2dd88de8f2c1628ea5f9adde",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/2da69b7920c065afc835124c4786025820adab8c",
					"width": 160
				}
			],
			"name": "Muse",
			"popularity": 81,
			"type": "artist",
			"uri": "spotify:artist:12Chz98pHFMPJEknJQMWvI",
			"term": "long",
			"source": "top",
			"familyAgg": "rock"
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/2kGBy2WHvF0VdZyqiVCkDT"
			},
			"followers": {
				"href": null,
				"total": 615039
			},
			"genres": [
				{
					"id": 153,
					"name": "freak folk",
					"family_id": 15,
					"family_name": "folk"
				},
				{
					"id": 68,
					"name": "stomp and holler",
					"family_id": 15,
					"family_name": "folk"
				},
				{
					"id": 49,
					"name": "indie folk",
					"family_id": 15,
					"family_name": "folk"
				},
				{
					"id": 15,
					"name": "indie pop",
					"family_id": 1,
					"family_name": "pop"
				},
				{
					"id": 16,
					"name": "indie rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 44,
					"name": "chamber pop",
					"family_id": 1,
					"family_name": "pop"
				}
			],
			"href": "https://api.spotify.com/v1/artists/2kGBy2WHvF0VdZyqiVCkDT",
			"id": "2kGBy2WHvF0VdZyqiVCkDT",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/fc49de93fd4b99de3d42520199e2e203e07c8fa0",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/d7627fcbd9838fec2cb054cc3965467bf6da734e",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/6b08f006e3a1d344f76fa81e8bbf999ae7b64c50",
					"width": 160
				}
			],
			"name": "Father John Misty",
			"popularity": 66,
			"type": "artist",
			"uri": "spotify:artist:2kGBy2WHvF0VdZyqiVCkDT",
			"term": "long",
			"source": "top",
			"familyAgg": "folk"
		}
	]

	// const [rows, set] = useState(getRows(data))
	//  testing: bugs stacking
	//const [rows, set] = useState(getRows([data[0]]))

	const [rows, set] = useState(getRows(artists_fake))
	const [count, inc] = useState(1)

	function add() {
		inc(count + 1)
		console.log(count)
		set([...rows, data[count]])
	}
	function remove() {
		console.log('remove')
		set(rows => {
			return rows.filter(r => {
				return r !== rows[rows.length - 1]
			})
		})
	}

	useEffect(() => {
		// const t = setInterval(() => set(shuffle), 2000)
		// return () => clearInterval(t)
	}, [])

	let height = 0
	let startX = 0;
	// let width = 100;
	let width = 85;
	const transitions = useTransition(
		rows.map(data => ({ ...data, x: (startX += width) - width })),
		{
			key: (item) => item.name,
			from: { height: 0, opacity: 0 },
			leave: { height: 0, opacity: 0 },
			enter: ({ x, height }) => ({ x, height, opacity: 1 }),
			update: ({ x, height }) => ({ x, height }),
		}
	)

	const changeIndex = (item) =>{
		console.log("changeIndex",item);
	}



	const showInitState = {0:false,1:false,2:false,3:false,4:false}
	const [show, setShow] = useState(showInitState);
	const showInfo = (index,mode) =>{
		//console.log("showInfo");
		var _s = JSON.parse(JSON.stringify(showInitState))
		_s[index] = mode
		setShow(_s)
	}
	return (
		<div>
			{' '}
			{/*<button onClick={remove}>remove</button>*/}
			{/*<button onClick={add}>add</button>*/}
			<div  className={'libraryRow'}>
				{/*style={{ height }} */}
				{/*note: without an explicit height on the list, whole component won't take up room properly*/}
			 <div className={styles.list} style={{height:"10em"}} >
				{transitions((style, item, t, index) => (
					//marginTop:index+"em"
					<animated.div className={styles.card} style={{...style}} >
						<div className={styles.cell} >
							{/*todo: what was this showInfo? just me testin stuff?*/}
							<div className={'detailsFade'} onMouseEnter={() =>{showInfo(index,true)}} onMouseLeave={() =>{showInfo(index,false)}}/>
							<div className={styles.details}
								 style={{ backgroundImage: `url(${item.images[0].url})`, backgroundSize: "cover",
							display:"flex",flexDirection:"column"}}>

								{/*note: marginTop auto on flex to force to bottom*/}
								<div style={{marginTop:"auto",visibility:show[index] ? 'visible':'hidden',display:"flex",flexDirection:"column",}}>
									<div style={{display:"flex"}}>
										<div style={{flexGrow:"1"}}>{'\u00A0'}</div>
										<div style={{paddingBottom:".7em"}}><PlayCircleFilledWhiteIcon  fontSize="large" style={{ color: 'white' }} /></div>
									</div>
									<div  className={'libraryTile'} >
										<div style={{padding:"2px",background:"rgb(128 128 128 / .7)",position:"relative",top:"-10px",color:"white",height:"20px"}}>{item.name}</div>
									</div>
								</div>

								{/*testing: detailsFade working */}
								{/*<div style={{marginTop:"auto"}}>*/}
								{/*{true && <div className={'detailsFade'}>*/}
								{/*	<PlayCircleFilledWhiteIcon style={{ color: 'white' }} />/>*/}
							    {/* <div  className={'libraryTile'} >*/}
								{/*	<div style={{padding:"2px",background:"rgb(128 128 128 / .7)",position:"relative",top:"-10px",color:"white",height:"20px"}}>{item.name}</div>*/}
								{/*</div>*/}
								{/*</div>}*/}
								{/*</div>*/}

							</div>
						</div>
					</animated.div>
				))}
			</div>
			</div>
		</div>
	)
}

export default Library
