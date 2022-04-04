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
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import songkick_badge_pink from "../../assets/songkick_badge_pink.png";
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

		if(tileSelectControl.tile){

			// 	var ai = {...tileSelectControl.tile}
			// 	ai.yearEarly = DateTime.fromISO(ai.release_range.earliest.release_date).year
			// 	ai.yearLate = DateTime.fromISO(ai.release_range.latest.release_date).year
			// 	setArtistInfo(ai)
			// 	setOpen(tileSelectControl.tile)
			// }


			api.getArtistInfo({...req,artist:tileSelectControl.tile})
				.then(r =>{
					r.yearEarly = DateTime.fromISO(r.release_range.earliest.release_date).year
					r.yearLate = DateTime.fromISO(r.release_range.latest.release_date).year
					setArtistInfo({...tileSelectControl.tile,...r})
					setOpen(tileSelectControl.tile)
				},e =>{
					console.error(e);
				})
		}

	},[tileSelectControl.tile])

	let root = document.documentElement;
	root.style.setProperty('--rsbs-handle-bg', 'white');
	root.style.setProperty('--rsbs-backdrop-bg', 'rgba(0, 0, 0, 0)');
	//note: percent at end determines height of split point
	//https://cssgradient.io/
	root.style.setProperty('--rsbs-bg', 'linear-gradient(0deg, rgba(102,102,102,1) 0%, rgba(0,0,0,1) 75%)');
	// root.style.setProperty('--rsbs-bg', 'linear-gradient(0deg, rgba(0,0,0,1)  0%, rgba(102,102,102,1) 85%)');
	//root.style.setProperty('--rsbs-bg', 'linear-gradient(0deg, rgba(0,0,0,1)  0%, rgba(102,102,102,1) 85%)');

	function PaperDisplay(props) {
		return (
			<div style={{color:"transparent",height:"20px",marginBottom:"1em",width:"fit-content",...props.style}}>
				<Paper elevation={3}>
					<Typography style={{padding:"1px 4px"}} className={'artistInfo'} variant="subtitle1">
						{props.content}
					</Typography>
					<Typography style={{padding:"1px 4px"}} className={'artistInfo'} variant="subtitle1">
						{props.content}
					</Typography>
				</Paper>
			</div>
		)
	}
	function StatDisplay(props) {
		return (
			<div style={{flex:1,...props.style,display:"flex",flexDirection:"column"}}>
				<Typography component={'span'} className={'artistInfo-title'} >
					{props.title}
				</Typography>
				<Typography style={{marginTop:"-1em"}}   component={'span'} className={'artistInfo-value'} >
					{props.value}
				</Typography>
			</div>
		)
	}
	return (
		<div  className={'bottomSheet'} style={{marginTop:"7em",outline:"1px solid blue"}}>
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
								<div style={{display:"flex",height:"3em",alignItems:"center",marginTop:"-1em"}}>
									<div className={'artist-detail-text'} style={{background:"black"}}>{tileSelectControl.tile.name}</div>
									<div style={{flexGrow:"1"}}>&nbsp;</div>
									<div>
										<IconButton onClick={() =>{setOpen(false)}} color="primary"  >
											<ClearIcon />
										</IconButton>
									</div>
								</div>

								{/*style={{marginTop:"1em"}}*/}
								<div >
									<DisplayDetailRow item={tileSelectControl.tile}/>
								</div>
								{artistInfo &&
								<div className={'artistInfo'} style={{display:"flex",flexDirection:"row",flexWrap:"wrap",columnGap:"10px"}}>

											<StatDisplay title={'Years Active:'} value={artistInfo.yearEarly + "-" +  artistInfo.yearLate}/>

											<StatDisplay title={'Touring'}
														 value={
															 <div >
																 <div  style={{display:"flex",flexDirection:"column"}}>
																	 { artistInfo?.onTourUntil ?
																		 <div style={{display:"flex",flexDirection:"column"}}>
																			 <div style={{display:"flex",marginTop:".5em",height:"1.5em"}}>
																				 <div>until</div>
																				 <div style={{marginLeft:"1em",marginTop:"-.5em"}}>
																				 <img src={songkick_badge_pink} style={{height:"2em",width:"2em"}} /></div>
																			 </div>

																			 <div>{artistInfo.onTourUntil}</div>
																		 </div>

																		 :
																		 <div style={{display:"flex"}}>
																			 <div>N/A</div>
																		 <div style={{marginLeft:".5em"}}>
																		 <img src={songkick_badge_pink} style={{height:"2em",width:"2em"}} />
																		 </div>
																		 </div>
																	 }

																 </div>

															 </div>
														 }/>


											<StatDisplay title={'Popularity:'} value={
												<div  style={{display:"flex",flexDirection:"column"}}>
													<div>followers: {artistInfo.followers.total}</div>
													<div>index: {artistInfo.popularity}</div>
												</div>
											}/>
										{/*<StatDisplay title={'Another stat:'} value={*/}
										{/*	<div  style={{display:"flex",flexDirection:"column"}}>*/}
										{/*		<div>followers: {artistInfo.followers.total}</div>*/}
										{/*		<div>index: {artistInfo.popularity}</div>*/}
										{/*	</div>*/}
										{/*}/>*/}

								</div>
									// <div>
									// 	<div>onTour: {artistInfo?.onTourUntil ? 'until ' + artistInfo.onTourUntil:'no'}</div>
									// 	<div>Years Active:
									// 		{artistInfo.yearEarly} - {artistInfo.yearLate}
									// 	</div>
									//
									// 	<div>Popularity:
									// 		index: {artistInfo.popularity}
									// 		followers: {artistInfo.followers.total}
									// 	</div>
									// </div>
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
