import Tooltip from "@material-ui/core/Tooltip";
import React from "react";

export default function Avatar(props) {
	let fallback = 'https://via.placeholder.com/150';
	// const {src} = useImage({
	// 	srcList: props.rec.user.images[0].url ? [props.rec.user.images[0].url,fallback]:fallback
	// })

	return props.rec.user.images[0].url
		? <Tooltip title={props.rec.reason}>
			<img style={{width: "50px",height:"50px",borderRadius: "50%"}} src={props.rec.user.images[0].url} />
		</Tooltip>
		: <Tooltip title={props.rec.reason}>
			<img style={{width: "50px",height:"50px",borderRadius: "50%"}} src={fallback} />
		</Tooltip>
	// return <Suspense fallback={""}>
	// 	<Tooltip title={props.rec.reason}>
	// 		<img style={{width: "50px",borderRadius: "50%"}} src={src} />
	// 	</Tooltip>
	// </Suspense>
}
