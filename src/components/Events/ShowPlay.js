/* eslint-disable no-unused-expressions */
import AnimatedPlayBars from "../misc/AnimatedPlayBars";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import React from "react";
import {Control} from "../../index";
import api from "../../api/api";
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR} from "../../storage/withApolloProvider";


function ShowPlay(props){
	//console.log("showPlay",props.sub.display_name);

	let control = Control.useContainer()
	var oldId = null;
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);

	function handlePlay(item) {
		console.log("$handlePlay",item);
		api.getArtistTopTracks(({auth:globalUI,artist:item}))
			.then(r =>{
				control.setId(r[0].id)
				control.setPlayArtist(item.id)
				oldId === null ? oldId = r[0].id:{}

				//pause/unpause the same track
				if(oldId === r[0].id){
					control.togglePlay((prevPlay) =>{return !(prevPlay)})
				}else{
					//if we changed play track id, only toggle true if we were already paused
					oldId = r[0].id;
					if(!(control.play)){control.togglePlay(true)}
				}

				//!(control.play) ? control.togglePlay(true):{};

			})
	}
	//console.log("$showPlay",props.sub);
	var iconProps = {
		fontSize:'inherit',style:{fontSize:"40px",opacity:"80%",marginLeft:"-5px",marginTop:"22px"},color:'secondary',display:"block !important"
	}
	return <div>
		<div >
			{/*todo: assuming no genres = tried to locate in spotify but couldn't find it, so can't play*/}
			<div>
				{/*todo: put back somewhere*/}
				{/*<div>*/}
				{/*	<img onClick={() => openInNewTab("spotify:artist:" + sub.artist.id)} src={spotifyLogo}*/}
				{/*		 style={{"position":"absolute",left:"-2em",overlap="rectangle"zIndex:"10",height:"1.5em",width:"1.5em"}}*/}
				{/*	/>*/}
				{/*</div>*/}
				{(props.sub.artist.genres.length >0 ?
						<div style={{display:"flex"}}>
							<div className={'inner-skip'}>
								{control.play && control.playArtist === props.sub.artist.id ?
									// <div  onClick={() => handlePlay(props.sub.artist)} style={{marginTop:"2em"}}>
									// 	<AnimatedPlayBars/>
									// </div>

									<div  id={'pause-icon'} onClick={() => handlePlay(props.sub.artist)}>
									<PauseCircleOutlineIcon {...iconProps } />
									</div>


									// <ApplyPulse target={
									// 	<PauseCircleOutlineIcon fontSize={'inherit'} style={{fontSize:"30px"}} color={'secondary'} onClick={() => handlePlay(props.sub.artist)}></PauseCircleOutlineIcon>
									// }/>
									:
									<div id={'play-icon'}>
										<PlayCircleOutlineIcon {...iconProps } onClick={() => handlePlay(props.sub.artist)}></PlayCircleOutlineIcon>
									</div>

									// <ApplyPulse target={
									// 	<PlayCircleOutlineIcon fontSize={'inherit'} style={{fontSize:"30px"}} color={'secondary'} onClick={() => handlePlay(props.sub.artist)}></PlayCircleOutlineIcon>
									// }/>
								}
							</div>
						</div>:<div></div>
				)}
			</div>
		</div>
	</div>
	// return <span>{props.sub.displayName}</span>
	// return (props.sub.artist.spotifyTopFive ? <PlayCircleOutlineIcon onClick={() => handlePlay(props.sub.artist)}> </PlayCircleOutlineIcon>:{})
};

export default ShowPlay
