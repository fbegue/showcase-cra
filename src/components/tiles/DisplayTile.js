import React, {} from 'react';
import BubbleFamilyGenreChips from "../chips/BubbleFamilyGenreChips";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
function DisplayTile(props) {

	// let paperStyle = {padding:".2em .5em .2em .5em",width:"fit-content"}
	let paperStyle = {padding:".2em .5em .2em .5em",margin:".2em",width:"fit-content"}

	return(<div style={{paddingLeft:".5em",paddingRight:".5em"}}>

		<div style={{"position":"absolute","right":"0px","zIndex":"30"}}>	{props.tile && props.tile.id}</div>
		{props.tile &&
		<div style={{display:"flex"}}>
			<div style={{display:"flex",flexDirection:"column",marginRight:"1em"}}>
				<div style={{paddingBottom:".5em"}}>
					<Paper elevation={3} style={paperStyle}>
						<Typography variant="subtitle1">
							{props.tile.name}
						</Typography>
					</Paper>
				</div>
				<div>
					{
						(props.tile.type === 'artist' || props.tile.type === 'album') && <img style={{width:"15em",height:"15em"}} src={props.tile.images[0].url}/>
					}
					{
						props.tile.type === 'track' && <img style={{width:"15em",height:"15em"}} src={props.tile.album.images[0].url}/>
					}


				</div>
			</div>
			<div>
				<Paper elevation={3} style={paperStyle}>
					<Typography variant="subtitle1">
						Top Genres
					</Typography>
				</Paper>
				{
					props.tile.type === 'artist' ?
						//todo: feels weird contraining like this here
						// style={{width:"10em"}}
						<div>
							{/*familyAgg: {props.tile.familyAgg}*/}
							<BubbleFamilyGenreChips height={"15em"} families={[]} familyDisabled={true} genres={props.tile.genres} flexDirection={'column'}/>
						</div>
						:
					<div style={{display:"flex"}}>
						{props.tile.artists.map((a) =>
							<div id={a.id} style={{width:"10em"}}>
								<Paper elevation={3} style={paperStyle}><Typography variant="subtitle1">{a.name}
								{/*| familyAgg: {a.familyAgg}*/}

								</Typography></Paper>
								<BubbleFamilyGenreChips height={"15em"}  families={[]} familyDisabled={true} genres={a.genres} flexDirection={'column'}/>
							</div>
						)}
					</div>
				}
			</div>

		</div>
		}
	</div>)
}
export default DisplayTile;

