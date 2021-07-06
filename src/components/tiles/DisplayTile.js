import React, {} from 'react';
import BubbleFamilyGenreChips from "../chips/BubbleFamilyGenreChips";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
function DisplayTile(props) {
	return(<div style={{paddingLeft:".5em",paddingRight:".5em"}}>
		{props.tile &&
		<div style={{display:"flex", justifyContent:"space-between"}}>
			<div style={{display:"flex",flexDirection:"column"}}>
				<div style={{paddingBottom:".5em"}}>
					<Paper elevation={3} style={{padding:".2em"}}>
						<Typography variant="subtitle1">
							{props.tile.name}
						</Typography>
					</Paper>
				</div>
				<div>
					<img style={{width:"15em",height:"15em"}} src={props.tile.images[0].url}/>
				</div>
			</div>
			<div>
				<Paper elevation={3}>
					<Typography variant="subtitle1">
						Top Genres
					</Typography>
				</Paper>
				<div style={{width:"10em"}}>
					<BubbleFamilyGenreChips families={[]} familyDisabled={true} genres={props.tile.genres} flexDirection={'column'}/>
				</div>
				<button style={{marginTop:"4em"}}onClick={() =>{props.handleToggleDrawer()}}>return</button>
			</div>

		</div>
		}
	</div>)
}
export default DisplayTile;

