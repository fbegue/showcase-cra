import React, {} from 'react';
import BubbleFamilyGenreChips from "../chips/BubbleFamilyGenreChips";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
function DisplayDetailRow(props) {


	// let paperStyle = {padding:".2em .5em .2em .5em",width:"fit-content"}
	let paperStyle = {padding:".2em .5em .2em .5em",margin:".2em",width:"max-content"}

	return(<div style={{paddingLeft:".5em",paddingRight:".5em"}}>
		<div style={{"position":"absolute","right":"0px","zIndex":"30"}}>	{props.item && props.item.id}</div>
		{props.item &&
		//	testing:
		<div style={{display:"flex"}}>
				{/*<div style={{paddingBottom:".5em"}}>*/}
				{/*	<Paper elevation={3} style={paperStyle}>*/}
				{/*		<Typography variant="subtitle1">*/}
				{/*			{props.item.name}*/}
				{/*		</Typography>*/}
				{/*	</Paper>*/}
				{/*</div>*/}
			<div style={{"paddingTop":".2em","paddingBottom":".2em"}}>
				{/*familyAgg: {props.item.familyAgg}*/}
				<BubbleFamilyGenreChips
					families={[]} familyDisabled={true}genres={props.item.genres}
					flexDirection={'row'} alignItems={'center'} maxWidth={'20em'}
					pre={
						<div >
							<Paper elevation={3} style={paperStyle}>
								<Typography variant="subtitle1">
									{props.item.name}
								</Typography>
							</Paper>
						</div>
					} />
			</div>
		</div>
		}
	</div>)
}
export default DisplayDetailRow;

