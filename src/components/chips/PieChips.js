/* eslint-disable no-unused-expressions */
import React, {useState,useEffect,useRef,createRef} from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import PropTypes from 'prop-types';
import _ from 'lodash'
//import {PieControl} from "../../index";
import {familyColors,families as systemFamilies} from '../../util/families'
import {FriendsControl,Control} from "../../index";
import makeChipStyle from "./makeChipStyle";
//import OVERFLOW_VAR from '../../storage/withApolloProvider'
import {CHIPGENRESCOLORMAP,CHIPGENRESCOMBINEDMAP} from '../../storage/withApolloProvider'
import {useReactiveVar} from "@apollo/react-hooks";
//import MoreChips from "../utility/Menu/MoreChips";
const useStyles = makeStyles({
	chip: {
		//customize normal/hovered colors
		backgroundColor: "var(--background-color)",
		boxShadow: "var(--box-shadow)",
		//this css prop is only visible when variant=default
		// borderColor: "#7f7f7f",
		borderColor:"#4e4949",

		"&:hover": {
			backgroundColor: "var(--background-color-hover)",
			cursor:"pointer"
		},
		// override focus color change (just keep it the same on focus)
		"&:focus": {
			backgroundColor: "var(--background-color)"
		},
		//todo: really just don't get this shit
		// outlined:{
		// 	// border: "1px solid rgba(0, 0, 0, 0.23)"
		// 	// outline: "none",
		// 	borderColor: "#9ecaed",
		// 	boxShadow: "0 0 10px #9ecaed"
		// }

	}
});


function useOnScreen(ref) {

	const [isIntersecting, setIntersecting] = useState(false)

	const observer = new IntersectionObserver(
		([entry]) => setIntersecting(entry.isIntersecting)
	)

	useEffect(() => {
		observer.observe(ref.current)
		// Remove the observer as soon as the component is unmounted
		return () => { observer.disconnect() }
	}, [])

	return isIntersecting
}

function PieChips(props) {

	const classes = useStyles();
	let friendscontrol = FriendsControl.useContainer()
	let control = Control.useContainer();
	const chipGenresColorMap = useReactiveVar(CHIPGENRESCOLORMAP)
	const chipGenresSharedMap= useReactiveVar(CHIPGENRESCOMBINEDMAP)
	//console.log("$PieChips | props",props);
	//testing:

	//let pieDataSum = props.pieData.reduce((prev,curr) =>{return {y:prev.y + curr.y}}).y
	// let pieDataMap = {}; props.pieData.forEach(f =>{pieDataMap[f.name] = f.y;})

	//note: reduce throws error on an empty array
	let pieDataMap = {};
	let pieDataSum = 0;
	if(props.pieData.length > 0){
		pieDataSum = props.pieData.reduce((prev,curr) =>{return {y:prev.y + curr.y}}).y
		debugger;
		pieDataMap = _.reduce(props.pieData , function(obj,param) {
			obj[param['name']] = param.y
			return obj;
		}, {});
	}
	const map = {};
	const map2 = {};
	var initColorState = {};
	//var initClickedState = {};
	systemFamilies.forEach(fam =>{
		map[fam] = {default: makeChipStyle(fam,'default'),clicked:makeChipStyle(fam,'clicked') }
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


	var familiesChipWidthMap = {"r&b":50,"rock":50,
		"hip hop":70,
		"folk":50,"electro house":105,"pop":50,
		"blues":60,"jazz":50,"world":70}

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
				if(!(props.genresDisabled)){
					_genres.push(g)
				}

			}else{
				if(toMap.indexOf(g.family_name) !== -1 && friendscontrol.families.indexOf(g.family_name) !== -1 ){_genres.push(g)}
			}
		})

		//testing: exact same code, just with extra 'genre' prop to drill thru and limiter

		if(props.occurred){

			_genres.forEach(gOb =>{
				map2[gOb.genre.name] = {
					default: makeChipStyle(gOb.genre.family_name,'default', chipGenresColorMap[gOb.genre.name]),
					clicked:makeChipStyle(gOb.genre.family_name,'clicked',chipGenresColorMap[gOb.genre.name])}
			})
			_genres.forEach(gOb =>{
				initGColorState[gOb.genre.name] = map2[gOb.genre.name]['default']
			})

			_genres = _genres.slice(0,5)
		}
		else{
			_genres.forEach(gOb =>{
				map2[gOb.name] = {
					default: makeChipStyle(gOb.family_name,'default',chipGenresColorMap[gOb.name]),
					clicked:makeChipStyle(gOb.family_name,'clicked',chipGenresColorMap[gOb.name]) }
			})
			_genres.forEach(gOb =>{
				initGColorState[gOb.name] = map2[gOb.name]['default']
			})
		}

	}

	//todo: should put this in above loop
	_genres.forEach(gOb =>{
		gOb.y = chipGenresSharedMap[gOb.name].length
	})

	var pieDataGenreSum = 0;
	if(_genres.length > 0){
		pieDataGenreSum = props.pieData.reduce((prev,curr) =>{return {y:prev.y + curr.y}}).y
		// pieDataMap = _.reduce(props.pieData , function(obj,param) {
		// 	obj[param['name']] = param.y
		// 	return obj;
		// }, {});
	}

	//todo: wtf was this for?
	var varied = [];
	if(props.genresFilter){
		varied = _.intersectionBy(_genres,props.genresFilter,'id')
	}


	const [color, setColor] = useState(initColorState);
	const [gcolor, setGColor] = useState(initGColorState);

	//testing:
	//var piecontrol = PieControl.useContainer()

	const handleClick = (fam) => {
		//todo: this is a pretty shifty way of getting the value (which I can't set) here...
		console.log("handleClick", fam);
		//var sel = e.target.innerText;

		if(!(friendscontrol.families.includes(fam))){
		//if(!(_.find(friendscontrol.families,r =>{return r.id === fam}))){
			setColor({ ...color, [fam]: map[fam]["clicked"] });
			//piecontrol.setAllowUpdate(false)
			friendscontrol.setFamilies((prevState => {
				var ret = [...prevState,fam];return ret
			}));
		}else{
			setColor({ ...color, [fam]: map[fam]["default"] });
			friendscontrol.setFamilies((prevState => {
				var ret= prevState.filter(r =>{return r !== fam})
				//testing: you can only do 1 family at a time rn anyways
				//when all families are unclicked, deselect all genres
				if(ret.length === 0){

					console.log("reset genres selection on family deselect");
					friendscontrol.setGenres([]);
					setGColor(initGColorState);
				}
				return ret
			}));
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

		if(!(_.find(friendscontrol.genres,r =>{return r.id === genre.id}))){

			setGColor({ ...gcolor, [genre_name]: map[family_name]["clicked"] });


			if(friendscontrol.families.indexOf(family_name) === -1){

				//note: auto-add-family
				//if you click on just a genre (from info panel or events list) need to add required families

				//todo: edgecase issue: An artist w/ genres from 2 + n families
				//todo: still auto-adding family, but set familiesDisabled = true
				//LCD Soundsystem
				//clicking on 'indie pop' adds that genre and the 'pop' family - but b/c the artist was
				//assigned familyAgg = 'rock', the tiles will filter it out based on the fact that
				//friendscontrol.families is non-empty, so tiles should only be from that family

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

	//===============================================================================
	function   isEllipsisActive(e) {
		return e.offsetHeight < e.scrollHeight || e.offsetWidth < e.scrollWidth;
	}

	let myContainer = useRef(null);
	//const [overflowActive, setOverflowActive] = useState(false);
	useEffect(() => {
		//console.log("PieChips | setOverflowActive",isEllipsisActive(myContainer));
		//props.setOverflowActive(isEllipsisActive(myContainer))

		//todo: while tryingn to use reactive var its updating incorrectly in InfoPanel before this useEffect executes
		//OVERFLOW_VAR(isEllipsisActive(myContainer))
		//props.setOverflowActive(isEllipsisActive(myContainer))
	});

	//testing: trying to check if elements are visible
	//https://stackoverflow.com/questions/45514676/react-check-if-element-is-visible-in-dom
	// const visRef = useRef()
	// const isVisible = useOnScreen(visRef)

	//testing:have an array of references
	//https://dev.to/ajsharp/-an-array-of-react-refs-pnf
	const refs = useRef(_genres.map(() => createRef()))

	useEffect(() => {
		//console.log("BubbleFamilyGenreChips | refs",refs);
		//todo: but can't check the hook useOnScreen in a callback
		//const isVisible = useOnScreen(refs[0])
	});
//===============================================================================

	function filterOut(fam){
		return friendscontrol.families.length > 0 ? friendscontrol.families.indexOf(fam) !== -1:true;
	}
	return(<div>

		{/*note: not sure how to get flex to respect any sort of height unless you specify it here */}
		{/*todo: not sure this flexDirection is effective here*/}


		{/*<div ref={visRef}>{isVisible && `Yep, I'm on screen`}</div>*/}
		<div  style={{display:"flex",flexDirection:props.flexDirection,flexWrap:"wrap"}}>
			{toMap.filter(filterOut).sort((a1,a2) =>{return  pieDataMap[a2] - pieDataMap[a1]}).map((fam,i) =>
				<div  key={i} style={{display:"flex"}} onClick={() =>{handleClick(fam)}}>
					<Chip
						// className={classes.chip}
						className={[classes.chip,"famChip"].join(' ')}
						label={<span> {fam} <span style={{fontWeight:"bold"}}> {Math.round( pieDataMap[fam]/pieDataSum * 100) + "%"} </span></span>}
						// label={fam + " (" +  Math.round( pieDataMap[fam]/pieDataSum * 100) + "%)"}
						//	label={Math.round( pieDataMap[fam]/pieDataSum * 100) + "%" + " " + fam}
						style={color[fam]}
						key={i}
					/>
					{ props.removable ? <div style={{"left":"-8px","position":"relative"}}><HighlightOffIcon fontSize={'small'}/> </div> : ""}
				</div>
			)}
			{/*testing: */}
			{_genres.sort((a,b) =>{return b.y - a.y}).map((gOb,i) =>
				{
					return (
						<div key={i}  ref={refs.current[i]} onClick={() =>{handleGClick(gOb)}}>
							<Chip
								// className={[classes.chip,"genreChip"].join(' ')}
								className={classes.chip}
								key={i}

								// className={'genreChip'}
								variant={
									props.varied ?
										_.find(varied, r =>{return r.id === gOb.id}) ? "outlined" :"default"
										:"default"}
								label={
									props.occurred ? gOb.genre.name + " (" + gOb.occurred.toString() + ")"
										: gOb.name + " " + Math.round(chipGenresSharedMap[gOb.name].length/pieDataGenreSum * 100) + "%"
								}

								style={getGColor(gOb)}
								// style={initGColorState[gOb.name]}
								// style={gcolor[gOb.name]}
								// style={{"--background-color2":"blue"}}
							/>
							{ props.removable ? <div style={{"left":"-8px","position":"relative"}}><HighlightOffIcon fontSize={'small'}/> </div> : ""}
						</div>
					)
				}
			)}

			{ props.clearable ? <div  onClick={() =>{resetSelections()}}><HighlightOffIcon fontSize={'small'}/>Clear</div>:""}
		</div>

		{props.seperator ? <div style={{height:"1em"}}>{'\u00A0'}</div>:"" }


		{/*className={'genreChipContainer'}*/}
		{/*note: set height | height:"17em"*/}
		{/*height:'4em' || 'initial'*/}
		{/*<div ref={ref => (myContainer= ref)}  style={{display:"flex",flexDirection:props.flexDirection,flexWrap:"wrap",*/}
		{/*	alignItems: props.alignItems || "initial",overflow:'hidden',*/}
		{/*	maxWidth: props.maxWidth || 'initial',paddingBottom:".5em"}} >*/}
		{/*	{props.pre}*/}
		{/*	{_genres.map((gOb,i) =>*/}
		{/*		{*/}
		{/*			return (*/}
		{/*				<div key={i}  ref={refs.current[i]} onClick={() =>{handleGClick(gOb)}}>*/}
		{/*					<Chip*/}
		{/*						// className={[classes.chip,"genreChip"].join(' ')}*/}
		{/*						className={classes.chip}*/}
		{/*						 key={i}*/}

		{/*						// className={'genreChip'}*/}
		{/*						variant={*/}
		{/*							props.varied ?*/}
		{/*								_.find(varied, r =>{return r.id === gOb.id}) ? "outlined" :"default"*/}
		{/*								:"default"}*/}
		{/*						label={*/}
		{/*							props.occurred ? gOb.genre.name + " (" + gOb.occurred.toString() + ")"*/}
		{/*								: gOb.name*/}
		{/*						}*/}

		{/*						style={getGColor(gOb)}*/}
		{/*						// style={initGColorState[gOb.name]}*/}
		{/*						// style={gcolor[gOb.name]}*/}
		{/*						// style={{"--background-color2":"blue"}}*/}
		{/*					/>*/}
		{/*					{ props.removable ? <div style={{"left":"-8px","position":"relative"}}><HighlightOffIcon fontSize={'small'}/> </div> : ""}*/}
		{/*				</div>*/}
		{/*			)*/}
		{/*		}*/}
		{/*	)}*/}
		{/*</div>*/}
		{/*<div style={{zIndex:50,height:"2em"}}>*/}
		{/*	/!*{overflowActive.toString()}*!/*/}

			{/*{ overflowActive ? <MoreChips/> : "here"}*/}
		{/*</div>*/}

	</div>)
}

PieChips.propTypes = {
	//constrain the genres displayed by these families
	families: PropTypes.array,
	//don't apply any family constraints (still requires [] families)
	familyDisabled:PropTypes.bool,
	//constrain the genres displayed by these genres
	genresFilter:PropTypes.array,
	//apply genresFilter to mark variants (EventList only)
	varied:PropTypes.bool,
	//pool of genres to filter on
	genres: PropTypes.array,
	//button for resetting families/genres
	clearable: PropTypes.bool,
	//each chip's little x symbol
	removable :PropTypes.bool,
	//display dataset which includes occurence values
	occurred:PropTypes.bool,
	more:PropTypes.bool,
	seperator: PropTypes.bool


}
export default PieChips;

