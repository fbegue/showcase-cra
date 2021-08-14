import React, {useContext, useEffect} from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {GLOBAL_UI_VAR,CHIPGENRESRANKED} from "../storage/withApolloProvider";
import {Context} from "../storage/Store";
import {FriendsControl, StatControl} from "../index";
import {useReactiveVar} from "@apollo/react-hooks";
import Paper from '@material-ui/core/Paper';
//import GenreChipsSmartRanked from "./chips/GenreChipsSmartRanked";
//import GenreChipsSmart from "./chips/GenreChipsSmart";
import BubbleFamilyGenreChips from "./chips/BubbleFamilyGenreChips";

function InfoPanel(props) {

	let statcontrol = StatControl.useContainer();
	let friendscontrol = FriendsControl.useContainer()
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	const chipGenresRanked = useReactiveVar(CHIPGENRESRANKED);
	//console.log("$InfoPanel",chipGenresRanked);
	const [globalState, globalDispatch] = useContext(Context)

	const [statCards, setStatCards] = React.useState([]);

	//todo: what is this for?
	const [filter, setFilter] = React.useState(null);

	function ListArtists(props){
		return (
			<div>
				{props.artists.map((item,i) => (
					<div key={item.artist.id}>{item.artist.name}</div>
				))}
			</div>
		)
	}

	function ListTracks(props){
		return (
			<div>
				{props.tracks.map((item,i) => (
					<div key={i}>{item.name}</div>
				))}
			</div>
		)
	}

	function ListGenres(props){
		return (
			<div>
				{props.genres.map((item,i) => (
					<div>{item.name}</div>
				))}
			</div>
		)
	}

	useEffect(() => {

		var _statCards = [];
		console.log("$contextStats",statcontrol.stats.name);
		switch(statcontrol.stats.name) {
			case 'artists_saved':
				_statCards.push({label: "top genres", value: null})
				_statCards.push({label: "test2", value: null})
				_statCards.push({label: "test23", value: null})
				break;
			case 'playlists':
				var source = globalState[globalUI.user.id + "_playlists_stats"];
				_statCards.push({label: "Created", value: source.created, width: "120px"})
				_statCards.push({label: "Followed", value: source.followed, width: "120px"})
				_statCards.push({label: "Collaborating", value: source.collaborative, width: "120px"})
				// eslint-disable-next-line no-unused-expressions
				source.recent ? _statCards.push({label: "Recently Modified", value: source.recent.playlist_name, width: "240px"}):{};
				// items.push({label:"Most Active",value:null})
				// eslint-disable-next-line no-unused-expressions
				source.oldest ? _statCards.push({label: "Oldest", value: source.oldest.playlist_name, width: "240px"}):{};
				break;
			case 'tracks_saved':
				var source = globalState[globalUI.user.id + "_tracks_stats"];
				_statCards.push({
					label: "Favorite Artists",
					value: <ListArtists artists={source.artists_top} />,
					width: "240px"
				})

				//todo: doesn't make any sense if I'm already sorting by latest in table right?
				//_statCards.push({label: "Recently Saved", value: <ListTracks tracks={source.recent} />, width: "240px"})
				break;
			case 'home':
			case 'Home':
			case 'user1':
			case 'friends':
				console.log('stats: ignoring ' + statcontrol.stats.name);
				break;
			default:
				console.log('default', statcontrol.stats);
				break;
		}

		//user selection required: favorite playlists
		//Favorite Artists (copy from above)
		//todo: was trying to make quick comp here for display
		// _items.push({label:"Top Artists",value:<ListArtists artists={source.artists_top}/>,width:"240px"})
		// _items.push({label:"Common Saved Artists",value:_common.length,width:"120px"})


		// _items.push({label:"Common Saved Tracks",value:source.followed,width:"120px"})
		// //todo:  # of + link to table which auto-filters on
		// _items.push({label:"Collaborative Playlists:",value:source.collaborative,width:"120px"})

		setStatCards(_statCards)
		return function cleanup() {
			console.log("componentWillUnmount");
		};
	},[statcontrol.stats.name,friendscontrol.selectedTabIndex,filter]);


	return(

		<div style={{display:"flex"}}>
			<div style={{display:"flex",flexDirection:"column"}}>
				<div style={{height:"5em"}}>
					{statCards.length > 0 &&
					<div style={{display:"flex", flexWrap:"wrap",width:"480px"}}>
						{statCards.map((item,i) => (
							<div key={i} style={{width:item.width, padding:"5px"}}>
								<Card>
									<CardContent>
										<Typography variant="subtitle1" component={'span'} >{item.label}:{'\u00A0'}</Typography>
										{/*todo: color should be typo color prop set in MUI theme*/}
										<Typography variant="subtitle1" component={'span'} ><span style={{color:'#3f51b5'}}>{item.value}</span></Typography>
									</CardContent>
								</Card>
							</div>
						))}
					</div>}
				</div>

			</div>

			<div style={{margin:"1em"}}>
				<div style={{padding:"2px",position:"relative",top:"-10px",color:"white",height:"20px",width:"6.2em"}}>
					<Paper elevation={3}>
						<Typography variant="subtitle1">
							Top Genres
						</Typography>
					</Paper>
				</div>
				{/*<div style={{marginTop:".5em"}}><GenreChipsSmartRanked chipData={chipGenresRanked}/></div>*/}
				<BubbleFamilyGenreChips families={[]} familyDisabled={true} occurred={true} clearable={false}  genres={chipGenresRanked} flexDirection={'column'}/>

				{/*<Paper elevation={3} style={{padding:"3px"}}>*/}
				{/*	<ChipsArray chipData={genres}/>*/}
				{/*</Paper>*/}
			</div>
		</div>)
}
export default InfoPanel;

