import React, {useEffect, useRef, useState} from 'react'
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import './BottomSheet.css'
import {GLOBAL_UI_VAR,CHIPGENRESRANKED} from "../../storage/withApolloProvider";
import {Context} from "../../storage/Store";
import {FriendsControl, StatControl, TabControl, TileSelectControl} from "../../index";
import {useReactiveVar} from "@apollo/react-hooks";
import useMeasure from "react-use-measure";
import {a, useSpring} from "react-spring";
import DisplayDetailRow from "../tiles/DisplayDetailRow";
import api from '../../api/api'
import BubbleFamilyGenreChips from "../chips/BubbleFamilyGenreChips";
const { DateTime } = require("luxon");

export default function Example() {

	let statcontrol = StatControl.useContainer();
	let friendscontrol = FriendsControl.useContainer()
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	const chipGenresRanked = useReactiveVar(CHIPGENRESRANKED);
	let tileSelectControl = TileSelectControl.useContainer();

	const sheetRef = useRef()
	const [open, setOpen] = useState(false);
	const onDismiss = () =>{
		console.log("onDismiss");
		tileSelectControl.selectTile(false)
		setOpen(false)
	}

	const [artistInfo, setArtistInfo] = useState(false);
	let req = {auth:globalUI};

	useEffect(e =>{
		api.getArtistInfo({...req,artist:tileSelectControl.tile})
			.then(r =>{
				r.yearEarly = DateTime.fromISO(r.release_range.earliest.release_date).year
				r.yearLate = DateTime.fromISO(r.release_range.latest.release_date).year
				setArtistInfo(r)
				setOpen(tileSelectControl.tile)
			},e =>{
				console.error(e);
			})

	},[tileSelectControl.tile])

	let root = document.documentElement;
	root.style.setProperty('--rsbs-handle-bg', 'white');
	root.style.setProperty('--rsbs-backdrop-bg', 'rgba(0, 0, 0, 0)');
	//note: percent at end determines height of split point
	root.style.setProperty('--rsbs-bg', 'linear-gradient(0deg, rgba(102,102,102,1) 0%, rgba(0,0,0,1) 75%)');

	return (
		<div  style={{marginTop:"7em",outline:"1px solid blue"}}>
			{/*<button onClick={() => setOpen(true)}>Open</button>*/}
			<BottomSheet open={open} ref={sheetRef} blocking={false} onDismiss={onDismiss}>
				{/*<div style={{height:"100px",outline:"1px solid red"}}>Expand to full height</div>*/}
				{tileSelectControl.tile &&
				<div style={{marginTop:"-1em"}}>
					{
						tileSelectControl.tile.type === 'artist' ?
							//todo: something off about the space from the top here
							//it's definitely responding to different height chips - but is acting strange
							// style={{width:"10em"}}
							<div style={{display:"flex",flexDirection:"column"}}>
								{/*style={{background:"black",color:"white"}}*/}
								<div>&nbsp;</div>
								<div className={'artist-detail-text'} style={{background:"black"}}>{tileSelectControl.tile.name}</div>
								<div style={{marginTop:"1em"}}>
									<DisplayDetailRow item={tileSelectControl.tile}/>
								</div>
								{artistInfo &&
								<div>
									<div>onTour: {artistInfo?.onTourUntil ? 'until ' + artistInfo.onTourUntil:'no'}</div>
									<div>Years Active:
										{artistInfo.yearEarly} - {artistInfo.yearLate}
									</div>

									<div>Popularity:
										index: {artistInfo.popularity}
										followers: {artistInfo.followers.total}
									</div>
								</div>
								}

							</div>
							:
							<div style={{display:"flex",flexDirection:"column"}}>
								{tileSelectControl.tile.artists.map((a) =>
									<div id={a.id} style={{width:"10em"}}>
										<DisplayDetailRow item={a}/>
									</div>
								)}
							</div>
					}
				</div>
				}
			</BottomSheet>
		</div>
	)
}
