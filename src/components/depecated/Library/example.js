import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Library from "./Library";
import React from "react";

{/*	todo: library's width is really odd = paper fills up that space
		so just cutting it off for now but yeah...*/}
{/*same with my little label here*/}

<div style={{margin:"1em",width:"32.5em"}}>
	<div style={{padding:"2px",position:"relative",top:"-10px",color:"white",height:"20px",width:"6.2em"}}>
		<Paper elevation={3}>
			<Typography variant="subtitle1">
				My Favorites
			</Typography>
		</Paper>
	</div>
	<Paper elevation={3} style={{padding:"3px"}}>
		<Library />
	</Paper>
</div>
