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
					{
						(props.tile.type === 'artist' || props.tile.type === 'album') && <img style={{width:"15em",height:"15em"}} src={props.tile.images[0].url}/>
					}
					{
						props.tile.type === 'track' && <img style={{width:"15em",height:"15em"}} src={props.tile.album.images[0].url}/>
					}

					{props.tile.id}
				</div>
			</div>
			<div>
				<Paper elevation={3}>
					<Typography variant="subtitle1">
						Top Genres
					</Typography>
				</Paper>
				{
					props.tile.type === 'artist' ?
						<div style={{width:"10em"}}>
							familyAgg: {props.tile.familyAgg}
							<BubbleFamilyGenreChips families={[]} familyDisabled={true} genres={props.tile.genres} flexDirection={'column'}/>
						</div>
						:
						<div style={{display:"flex"}}>
							{props.tile.artists.map((a) =>
								<div id={a.id} style={{width:"10em"}}>
									<Paper elevation={3}><Typography variant="subtitle1">{a.name} | familyAgg: {a.familyAgg}

									</Typography></Paper>
									<BubbleFamilyGenreChips families={[]} familyDisabled={true} genres={a.genres} flexDirection={'column'}/>
								</div>
							)}
						</div>
				}

				<button style={{marginTop:"4em"}}onClick={() =>{props.handleToggleDrawer()}}>return</button>
			</div>

		</div>
		}
	</div>)
}
export default DisplayTile;

