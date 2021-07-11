/* eslint-disable no-unused-expressions */
import React, {useState,useEffect} from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import {familyColors,families as systemFamilies} from '../../families'
import {FriendsControl,Control} from "../../index";
const useStyles = makeStyles({
	chip: {
		//customize normal/hovered colors
		backgroundColor: "var(--background-color)",
		boxShadow: "var(--box-shadow)",
		"&:hover": {
			backgroundColor: "var(--background-color-hover)"
		},
		// override focus color change (just keep it the same on focus)
		"&:focus": {
			backgroundColor: "var(--background-color)"
		}
	}
});

function BubbleFamilyGenreChips(props) {

	const classes = useStyles();
	let friendscontrol = FriendsControl.useContainer()
	let control = Control.useContainer()

	const makeStyle = (fam,which) =>{

		//use fam to set colors
		var defaultSt = {
			"--background-color-hover": familyColors[fam + "2"],
			"--background-color":  familyColors[fam],
			"--box-shadow": "rgba(33, 203, 243, .3)"
		};

		//clicked simply keeps it's hover color
		var clickedSt = {
			"--background-color-hover": familyColors[fam],
			"--background-color": familyColors[fam],
			"--box-shadow":   "inset 0px 0px 5px black"
		};
		if(which === 'default'){return defaultSt}else{return clickedSt}
	}

	const map = {};
	const map2 = {};
	var initColorState = {};
	//var initClickedState = {};
	systemFamilies.forEach(fam =>{
		map[fam] = {default: makeStyle(fam,'default'),clicked:makeStyle(fam,'clicked') }
	})
	systemFamilies.forEach(fam =>{
		initColorState[fam] = map[fam]['default']
		//initClickedState[fam] = false;
	})

	//-------------------------------------------------------------------------------
	//todo: not sure what to do with so many genres when multiple families selected
	//from all families, filter out
	//1) included in dataset produced during events calc
	//2) genres are from selected
	var toMap = systemFamilies;
	toMap = toMap.filter(f =>{return props.families.indexOf(f) !== -1})
	//console.log("$toMap",toMap);
	var _genres = [];
	//console.log(props.genres);
	//

	// for (var k in props.genreArtist){
	// 	//todo: lol reconstucting this b/c I don't standardize anything that I'm passing around this mf
	// 	var famOfArtistFromGenre = props.genreArtist[k][0].familyAgg;
	// 	if(toMap.indexOf(famOfArtistFromGenre) !== -1 && friendscontrol.families.indexOf(famOfArtistFromGenre) !== -1 ){_genres.push({name:k,family:famOfArtistFromGenre})}
	// }

	var initGColorState = {};

	if(!(props.genres)){
		//not loaded yet
	}else{
		props.genres.forEach(g =>{
			if(props.familyDisabled || props.occurred){
				_genres.push(g)
			}else{
				if(toMap.indexOf(g.family_name) !== -1 && friendscontrol.families.indexOf(g.family_name) !== -1 ){_genres.push(g)}
			}
		})

		//testing: exact same code, just with extra 'genre' prop to drill thru and limiter

		if(props.occurred){

			_genres.forEach(gOb =>{
				map2[gOb.genre.name] = {default: makeStyle( gOb.genre.family_name,'default'),clicked:makeStyle(gOb.genre.family_name,'clicked')}
			})
			_genres.forEach(gOb =>{
				initGColorState[gOb.genre.name] = map2[gOb.genre.name]['default']
			})

			_genres = _genres.slice(0,5)
		}
		else{
			_genres.forEach(gOb =>{
				map2[gOb.name] = {default: makeStyle(gOb.family_name,'default'),clicked:makeStyle(gOb.family_name,'clicked') }
			})
			_genres.forEach(gOb =>{
				initGColorState[gOb.name] = map2[gOb.name]['default']
			})
		}

	}


	const [color, setColor] = useState(initColorState);
	const [gcolor, setGColor] = useState(initGColorState);

	const handleClick = (fam) => {
		//todo: this is a pretty shifty way of getting the value (which I can't set) here...
		console.log("handleClick", fam);
		//var sel = e.target.innerText;

		if(!(friendscontrol.families.includes(fam))){
			setColor({ ...color, [fam]: map[fam]["clicked"] });
			friendscontrol.setFamilies((prevState => {return [...prevState,fam] }));
		}else{
			setColor({ ...color, [fam]: map[fam]["default"] });
			friendscontrol.setFamilies((prevState => {return prevState.filter(r =>{return r !== fam}) }));
		}

		//if it's not clicked yet, set the new color to clicked and update it's clicked status to true
		//otherwise, do the opposite
		// if (!clicked[sel]) {
		// 	setColor({ ...color, [sel]: map[sel]["clicked"] });
		// 	setClicked({ ...clicked, [sel]: true });
		// } else {
		// 	setColor({ ...color, [sel]: map[sel]["default"] });
		// 	setClicked({ ...clicked, [sel]: false });
		// }
	};

	const handleGClick = (gOb) => {
		console.log("handleGClick",gOb);
		//testing: includes works?

		var family_name = null;
		var genre_name = null;
		var genre = null
		if(props.occurred){
			family_name = gOb.genre.family_name
			genre_name = gOb.genre.name
			genre = gOb.genre
		}else{
			family_name = gOb.family_name
			genre_name = gOb.name
			genre = gOb;
		}



		if(!(friendscontrol.genres.includes(genre))){
			setGColor({ ...gcolor, [genre_name]: map[family_name]["clicked"] });
			if(friendscontrol.families.indexOf(family_name) === -1){
				//note: if you click on just a genre (from info panel or events list) need to add required families
				handleClick(family_name)
			}
			friendscontrol.setGenres((prevState => {return [...prevState,genre] }));
		}else{
			setGColor({ ...gcolor, [genre_name]: map[family_name]["default"] });
			//var newval  = prevState.filter(r =>{return r !== gOb.name});
			//todo: actually not sure about removing the last family that doesn't match
			//sort of makes sense when it was added as a result of genre selection
			//but especially not if you started with family selection first
			//handleClick({target:{innerText:family_name}})
			friendscontrol.setGenres((prevState => {return prevState.filter(r =>{return r.name !== genre_name}) }));

		}

	};

	const resetSelections = () =>{
		setColor(initColorState);
		friendscontrol.setFamilies([]);
		friendscontrol.setGenres([]);
	}

	//todo: gcolor not getting set on time?
	//somehow setting init state for gcolor just isn't taking ...
	const getGColor = (gOb) =>{

		if(props.occurred){
			if(gcolor[gOb.genre.name]){return gcolor[gOb.genre.name]}
			return initGColorState[gOb.genre.name]
		}else{
			if(gcolor[gOb.name]){return gcolor[gOb.name]}
			return initGColorState[gOb.name]
		}

	}


	return(<div>
		{/*todo: not sure this flexDirection is effective here*/}
		<div style={{display:"flex",flexDirection:props.flexDirection,flexWrap:"wrap"}}>
				{toMap.map((fam,i) =>
					<div  style={{display:"flex"}} onClick={() =>{handleClick(fam)}}>
						<Chip
							// className={classes.chip}
							className={[classes.chip,"famChip"].join(' ')}
							label={fam}
							style={color[fam]}
							key={i}
						/>
						{ props.removable ? <div style={{"left":"-8px","position":"relative"}}><HighlightOffIcon fontSize={'small'}/> </div> : ""}
					</div>
				)}
			{ props.clearable ? <div  onClick={() =>{resetSelections()}}><HighlightOffIcon fontSize={'small'}/>Clear</div>:""}
		</div>

		{props.seperator ? <div style={{height:"1em"}}>{'\u00A0'}</div>:"" }


		{/*className={'genreChipContainer'}*/}
		<div style={{display:"flex",flexDirection:props.flexDirection,flexWrap:"wrap"}} >
			{_genres.map((gOb,i) =>
				<div style={{display:"flex"}} onClick={() =>{handleGClick(gOb)}}>
					<Chip
						// className={[classes.chip,"genreChip"].join(' ')}
						className={classes.chip}
						key={i}
						// className={'genreChip'}
						label={
							props.occurred ? gOb.genre.name + " (" + gOb.occurred.toString() + ")"
								: gOb.name
						}

						style={getGColor(gOb)}
						// style={initGColorState[gOb.name]}
						// style={gcolor[gOb.name]}
						// style={{"--background-color2":"blue"}}
					/>
					{ props.removable ? <div style={{"left":"-8px","position":"relative"}}><HighlightOffIcon fontSize={'small'}/> </div> : ""}
				</div>
			)}
		</div>

	</div>)
}
export default BubbleFamilyGenreChips;

