import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import {getAvatarSRC} from "./AvatarGenreator";

//note: watch this funny props.rec; expects to be rec:{user:<userOb>}
//this is do to eventlist having to push that extra reason prop
export default function Avatar(props) {

	return(
		//props.rec.user.images[0].url ?

		//todo: pretty sure I have reason built into only EVENTLIST Avatars
		//so not having a reason it fine!
		// || 'ERROR'
	<div style={{width: props.dim ||"50px"}} >
		<Tooltip title={props.rec.reason}>
			<img style={{width: props.dim ||"50px",height:props.dim ||"50px",borderRadius: "50%"}} src={getAvatarSRC(props.rec.user)} />
		</Tooltip>
	</div>

		// : <Tooltip title={props.rec.reason || 'ERROR'}>
		// 	<img style={{width: "40px",height:"40px",borderRadius: "50%"}} src={fallback} />
		// </Tooltip>

		// return <Suspense fallback={""}>
		// 	<Tooltip title={props.rec.reason}>
		// 		<img style={{width: "50px",borderRadius: "50%"}} src={src} />
		// 	</Tooltip>
		// </Suspense>
	)
}
