/* eslint-disable no-unused-expressions */
import _ from "lodash";
// import ChipsArray from "../components/utility/ChipsArray";
import React, {useContext,useState,useEffect} from "react";
import tables from "../storage/tables";
import {families as systemFamilies, familyColors} from "../families";
import {Highlighter, StatControl,FriendsControl,Control} from "../index";
import {Context} from "../storage/Store";
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR,TILES,EVENTS_VAR,STATS,CHIPFAMILIES,CHIPGENRES} from "../storage/withApolloProvider";
const uuid = require('react-uuid')

//this is going to be harder b/c we already setup familyAgg ...somewhere? whereTF did I set that up
//anyways now that I'm on my 3rd 'get some data' about these playlists I'm wondering if I should
//be trying to set this up in a different way..


//for each artist, for each genre, make a map entry where the weight of the genre is multiplied by the artistFreq
//todo: problem here tho is that a single artist just completely dominates?
//like if the idea is to give the 'top genres' then technically it is correct to let one artist dominate
//but really shouldn't I at least be looking at like 'top 3 artist's genres'?


function makeRank2(array,artistFreq){
	var gamap = {};

	//console.log("makeRank",JSON.parse(JSON.stringify(array)));
	//console.log(artistFreq);

	array.forEach(e =>{
		if(e.genres){
			e.genres.forEach(g =>{
				if(!(gamap[g.name])){
					gamap[g.name] = 1 * (artistFreq[e.id] ? artistFreq[e.id]:1)
				}
			})
		}
	})

	if (!(_.isEmpty(gamap))) {
		//convert map to array (uses entries and ES6 'computed property names')
		//and find the max
		var arr = [];
		Object.entries(gamap).forEach(tup => {
			var r = {[tup[0]]: tup[1]};
			arr.push(r);
		});
		var arrSorted = _.sortBy(arr, function (r) {
			return Object.values(r)[0]
		}).reverse()
		//var f =
		//console.log("%", f);
		//return Object.keys(m)[0];
		// console.log("$gamap",gamap);
		// console.log("$gamap",arrSorted);
		return arrSorted;
	}
};

//todo: started to make this general but got this familyAgg in here
//basically: iterate thru an array, creating a map of every item @ id, multiplying the value based on artistFreq
//returns a sorted array of those key-value pairs

var key_makeRank = "familyAgg"
function makeRank(array,artistFreq){
	var pamap = {};
	//console.log("makeRank",JSON.parse(JSON.stringify(array)));
	//console.log(artistFreq);

	array.forEach(e =>{

		//console.log("$",e.familyAgg);
		//if we have the key we're interested in w/ non-null value
		if(e.familyAgg !== null){
			//if we haven't defined it yet on the map
			if (!(pamap[e[key_makeRank]])) {

				//todo: how to weight w/ artistFreq
				//array should be unique artists, so just multiply by frequency to weight them?
				//if there is a artistFreq def for them (there should always be right? when is this not true?)

				if(artistFreq[e.id]){
					pamap[e[key_makeRank]] = artistFreq[e.id]

				}else{
					pamap[e[key_makeRank]] = 1
				}
			} else {
				if(artistFreq[e.id]){
					pamap[e[key_makeRank]] = pamap[e[key_makeRank]] + artistFreq[e.id]
				}else{
					pamap[e[key_makeRank]]++;
				}
			}
		}
	})

	if (!(_.isEmpty(pamap))) {
		//convert map to array (uses entries and ES6 'computed property names')
		//and find the max
		var arr = [];
		Object.entries(pamap).forEach(tup => {
			var r = {[tup[0]]: tup[1]};
			arr.push(r);
		});
		//todo: could offer this
		// var m = _.maxBy(arr, function (r) {
		// 	return Object.values(r)[0]
		// });
		//instead this for now
		var arrSorted = _.sortBy(arr, function (r) {
			return Object.values(r)[0]
		}).reverse()
		//var f =
		//console.log("%", f);
		//return Object.keys(m)[0];

		return arrSorted;

	}
	return null;
}


//----------------------------------------

/*note: chooses data based on:
* - statcontrol.stats.name (current tab)
* 	- has extra tab step for friends
* - statcontrol.mode (custom/context) */
function chooseData(statcontrol,friendscontrol,globalState,globalUI){

	var data_user = [];
	var data_guest = [];

	//console.log("chooseData",statcontrol.stats.name);
	//console.log("guest:",friendscontrol.guest.id);

	//todo: duplicate code in reducer
	var contextFilter = function(key,rec) {
		var t = rec['source'] === key
		// if (key === 'top') {
		// 	t = rec['term'] !== null
		// } else {
		// 	t = rec['source'] === key
		// }
		if (statcontrol.mode) {
			if (key) {return t}
			else {return true}
		}
	}

	//set data pointer based on current tab
	switch(statcontrol.stats.name) {
		case "artists_saved":
			//data = globalState[globalUI.user.id + "_artists"].filter(i =>{return i.source === 'saved'})
			//data = tables["users"][globalUI.user.id]["artists"].filter(contextFilter.bind(null,'saved'))
			data_user = globalState[globalUI.user.id + "_artists"].filter(contextFilter.bind(null,'saved'))
			break;
		case "artists_top":
			data_user = globalState[globalUI.user.id + "_artists"].filter(contextFilter.bind(null,'top'))
			break;
		case "artists_recent":
			data_user = globalState[globalUI.user.id + "_artists"].filter(contextFilter.bind(null,'recent'))
			break;
		case "playlists":
			//todo: may not have been stated yet
			if (tables["users"][globalUI.user.id]["playlists"]) {
				data_user = tables["users"][globalUI.user.id]["playlists"].filter(contextFilter.bind(null,null))
			}
			break;
		case "tracks_recent":
			data_user = globalState[globalUI.user.id + "_tracks"].filter(contextFilter.bind(null,'recent'))
			break;
		case "tracks_saved":
			data_user = globalState[globalUI.user.id + "_tracks"].filter(contextFilter.bind(null,'saved'))
			break;
		case "artists_friends":
		case "playlists_friends":
		case "tracks_friends":
		case "albums_friends":
			var key = null;
			switch(statcontrol.stats.name) {
				case "artists_friends":
					key = '_artists';break;
				case "playlists_friends":
					key = '_playlists';break;
				case "albums_friends":
					key = '_albums';break;
				case "tracks_friends":
					key = '_tracks';break;
				default:
				// code block
			}
			//console.log({friendscontrol},key);
			console.log("friendscontrol.selectedTabIndex choose key:",key);

			//need to dedupe if we're not filtering by source
			if(friendscontrol.sourceFilter ===  'both'){
				console.log("sourceFilter set to both");
				data_user = globalState[globalUI.user.id + key]
				data_guest = globalState[friendscontrol.guest.id + key]
				//todo: uniqBy at this stage makes sense, right?
				data_user = _.uniqBy(data_user,'id')
				data_guest  = _.uniqBy(data_guest,'id')
			}else{
				console.log("sourceFilter on:",friendscontrol.sourceFilter);
				data_user = globalState[globalUI.user.id + key].filter(contextFilter.bind(null,friendscontrol.sourceFilter))
				data_guest = globalState[friendscontrol.guest.id + key].filter(contextFilter.bind(null,friendscontrol.sourceFilter))
			}


			console.log("friendscontrol.families",friendscontrol.families);
			console.log("friendscontrol.genres",friendscontrol.genres);

			var famCtrlFilter = function(r){
				var some = false;
				if(r.type === 'artist'){
					if (friendscontrol.families.indexOf(r.familyAgg) !== -1) {some = true;}
				}
				//playlist, track
				else{
					for(var x = 0; x < r.artists.length; x++){
						if (friendscontrol.families.indexOf( r.artists[x].familyAgg) !== -1) {some = true;break;}
					}
				}
				return some
			}
			var genreCtrlFilter = function(r){
				if(r.type === 'artist'){
					var some = false;
					for(var y = 0; y < r.genres.length; y++){
						if (friendscontrol.genres.indexOf(r.genres[y].name) !== -1) {
							some = true;break;
						}
					}
				}
				//playlist, tracks
				else{
					//check selected genres against any artist of the playlist or track
					for(var x = 0; x < r.artists.length; x++){
						for(var y = 0; y < r.artists[x].genres.length; y++){
							if (friendscontrol.genres.indexOf(r.artists[x].genres[y].name) !== -1) {
								some = true;break;
							}
						}
						//break out of artists loop if one of their genre's passed
						if(some){break}
					}
				}
				return some
			}

			if(friendscontrol.families.length > 0){
				data_user = data_user.filter(famCtrlFilter)
				data_guest  = data_guest.filter(famCtrlFilter)
			}
			if(friendscontrol.genres.length > 0){
				data_user = data_user.filter(genreCtrlFilter)
				data_guest  = data_guest.filter(genreCtrlFilter)
			}
			break;

		default:
			console.warn("skipped stat re-render for: " + statcontrol.stats.name)
			break;
	}



	return {data_user,data_guest}
}

//todo: in every case, null familyAgg doesn't quite make sense?
// think this was a notee to myself that I was getting some nulls that shouldn't be there?

function getFriendsMaps(data_user,data_guest){

	var map_user = {}
	var map_guest =  {};
	var createMap = function(arr,map){

		arr.forEach(d =>{
			//todo: this is many artists from many tracks
			//the abstraction is always going to not-perfectly represent the tracks themselves

			//artists,tracks
			/** map
			 *  {
			 *      <family> = {
			 *          artists: {
			 *              <artist_name>:[<artist>]
			 *          }
			 *      },
			 *      ...
			 *  }
			 * */
			//playlists
			/** map
			 *  {
			 *      <family> = {
			 *          playlists: [
			 *              <playlist_name>
			 *          ]
			 *
			 *
			 *      },
			 *      ...
			 *  }
			 * */
			if(d.type === 'track' || d.type === 'album'){
				d.artists.forEach(a =>{
					if(a.familyAgg && a.familyAgg !== null){
						if (!map[a.familyAgg]) {
							map[a.familyAgg] = {artists:{}}
						} else {
							//map[a.familyAgg].artists.push(a)
							if(map[a.familyAgg].artists[a.name]){map[a.familyAgg].artists[a.name].push(a)}
							else{map[a.familyAgg].artists[a.name] = [a]}
						}
					}
				});

			}
				//todo: familyAgg is good enough signifier here to determine 'artist' type?
			//artists
			else if(d.familyAgg && d.familyAgg !== null){

				//note: will always be arrays of length 1

				//if the family doesn't exist, create it with one artist
				if (!map[d.familyAgg]) {
					map[d.familyAgg] = {artists:{[d.name]:[d]}}
				} else {
					//if the artist is defined, push one
					//otherwise do the 1 artist init as above
					if(map[d.familyAgg].artists[d.name]){map[d.familyAgg].artists[d.name].push(d)}
					else{map[d.familyAgg].artists[d.name] = [d] }
				}
			}
			else if(d.artists) {
				//playlists
				//todo: hard part is representing a playlist proportionately within itself
				//I have the familyAgg for each artist - so just make a ranking of these then using the artistFreq
				var rank = makeRank(d.artists, d.artistFreq, "familyAgg");
				//console.log("rank",rank);

				//testing: non-proportionate ranks
				//with bubble data, the playlist needs to be contained within a single family bubble
				//b/c otherwise it will be represented in more than a single node. with playlist ranking,
				//this means that I have to choose whatever fam represents the genre the most.
				//the values will all be equal for the node sizes b/c nothing else makes sense
				//(I can't really talk about the family content of a playlist I've already decided would be described by it's top rank)

				for (var x = 0; x < rank.length && x < 3; x++) {
					var fam = Object.keys(rank[x])[0];
					//!(map[fam]) ? map[fam] = 1 : map[fam]++
					if (!map[fam]) {
						map[fam] = {playlists:[d.name]}
					} else {
						map[fam].playlists.push(d.name)
						// if(map[fam].playlists[d.name]){map[fam].playlists[d.name]++}
						// else{map[fam].playlists[d.name] = 1 }
					}
				}
			}else{
				console.warn("malformed data passed to pie, skipped item");
				// console.error("malformed data passed to pie, skipped item: ",d);
			}

		})
	}
	createMap(data_user,map_user)
	createMap(data_guest,map_guest)
	// console.log("new map",map_user);
	// console.log("new guest map",map_guest);
	return {map_user,map_guest}

}

function getFriendsArtists(map_user,map_guest){
	var artists_user = [];
	var artists_guest = [];
	Object.keys(map_user).forEach(fam =>{
		//for each artist key on a fam

		Object.keys(map_user[fam].artists).forEach(aname =>{
			artists_user.push(map_user[fam].artists[aname][0])
		})
	});
	Object.keys(map_guest).forEach(fam =>{
		Object.keys(map_guest[fam].artists).forEach(aname =>{
			artists_guest.push(map_guest[fam].artists[aname][0])
		})
	});

	var shared = _.intersectionBy(artists_user,artists_guest,'id');
	var sharedMap = _.keyBy(shared,'id')
	var dif_user = _.differenceBy(artists_user,shared,'id');
	var dif_userMap = _.keyBy(dif_user,'id')
	var dif_guest = _.differenceBy(artists_guest,shared,'id');
	var dif_guestMap = _.keyBy(dif_guest,'id')

	//mark the arrays with the info produced by the above lodash ops
	artists_user.forEach(a =>{
		sharedMap[a.id] ? a.shared = true:{}
		dif_userMap[a.id] ? a.owner = 'user':{}
	})
	artists_guest.forEach(a =>{
		sharedMap[a.id] ? a.shared = true:{}
		dif_guestMap[a.id] ? a.owner = 'guest':{}
	})

	return {artists_user,artists_guest};

}


function useProduceData(){
	//so basically:
	// when you're only selecting data from one tab or switching between tabs, we only look at one node's data at a time
	// when you start combining tabs, the logic switches to accommodate many different item types

	let statcontrol = StatControl.useContainer();
	const [globalState, globalDispatch] = useContext(Context);
	let highlighter = Highlighter.useContainer();
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	let friendscontrol = FriendsControl.useContainer()
	const tiles = useReactiveVar(TILES);

	const [pieData, setPieData] = useState([]);
	const [genres, setGenres] = useState([]);
	const [bubbleData, setBubbleData] = useState([]);
	const [friendStats, setFriendStats] = useState([]);
	const [vennData, setVennData] = useState([]);
	//const [tiles, setTiles] = useState([]);


	var stats = [];
	useEffect(() => {

		var tempPieData = [];


		console.log("useProduceData",statcontrol.stats.name);
		//console.log("guest",friendscontrol.guest);
		friendscontrol.guest.id ? console.log("guest:",friendscontrol.guest.id):{};
		//console.log("tables",tables);

		//set data pointer based on current tab
		let  {data_user,data_guest} = chooseData(statcontrol,friendscontrol,globalState,globalUI)

		console.log("data source switched | user:",data_user);
		console.log("data source switched | guest",data_guest);
		//based on the type of data coming in,
		//create a map for pie and bubblechart to unwrap later
		//todo: in every case, null familyAgg doesn't quite make sense?
		// think this was a notee to myself that I was getting some nulls that shouldn't be there?

		//todo: can decide to (initally) hide certain series w/ series property: visible
		//by default, toggleable by clicking on legend item
		var _genres =[];

		let {map_user,map_guest} = getFriendsMaps(data_user,data_guest)

		console.log("map_user",map_user);
		console.log("map_guest",map_guest);
		//todo: could (initally) hide certain series w/ series property: visible
		//by default, toggleable by clicking on legend item

		//setup base values for bubblechart
		var d = [];
		systemFamilies.forEach(f =>{
			d.push({id:uuid(),name:f,color:familyColors[f + "2"],	type: "packedbubble",data:[]})
		})
		var bubbleData = JSON.parse(JSON.stringify(d));
		var relativeScale = 100;
		var scale = [50,200,350,500]

		var _tiles = [];

		//----------------------------------------------------------------------
		//note: helper functions directly modifies tempPieData,bubbleData
		//do to laziness, I split how I'm handling the processing for single versus friends comparison
		//where friends are always processing combination arrays while single is always the maps we produced earlier

		/** producePieData
		 *  @desc read the maps produced above to output pieData respresenting # of artists in each family */
		var producePieData = function(maporarr,key,owner,){

			var map = {};
			var arr = null;
			if(owner === 'shared') {
				arr = maporarr
				arr.forEach(a =>{
					map[a.familyAgg] ? map[a.familyAgg].push(a):map[a.familyAgg] = [];
				})

				Object.keys(map).forEach(fam =>{
					tempPieData.push({name:fam,y:map[fam].length})
				})

			}else{
				map = maporarr;
				//console.log('map',map);
				Object.keys(map).forEach(fam =>{

					tempPieData.push({name:fam,y:Object.keys(map[fam][key]).length})

					// if(owner && owner !== 'all'){
					// 	//any family w/ no entries
					// 	var aname = Object.keys(map[fam][key])[0] || null;
					//
					// 	if(aname && map[fam][key][aname][0].owner === owner){
					// 		tempPieData.push({x:fam,y:Object.keys(map[fam][key]).length})
					// 	}
					// }else{
					// 	tempPieData.push({x:fam,y:Object.keys(map[fam][key]).length})
					// }
				});
			}

			//copy/adapted from below
			// tempPieData = tempPieData.filter(r =>{
			// 	if(friendscontrol.families.length === 0 || friendscontrol.families[0] === 'all'){
			// 		return true;
			// 	}
			// 	else{
			// 		return friendscontrol.families.indexOf(r.x) !== -1
			// 	}
			// })

		}

		var produceBubbleDataArtists = function(map){
			//set bubble data: on the other hand, we need the occurrence values in order to size the inner bubbles
			Object.keys(map).forEach(fam =>{
				var series = _.find(bubbleData, function(o) { return o.name === fam });
				series.data = []
				Object.keys(map[fam].artists).forEach(aname =>{
					series.data.push({name:aname,
						value:scale[map[fam].artists[aname] -1 ],
						color:familyColors[fam]
					})
				})
			});
		}

		var produceBubbleDataPlaylists = function(map){
			Object.keys(map).forEach(fam =>{
				var series = _.find(bubbleData, function(o) { return o.name === fam });
				series.data = []
				map[fam].playlists.forEach(aname =>{
					series.data.push({name:aname,
						//'value of playlist' doens't make sense here
						// value:map[fam].playlists.length * relativeScale,
						value:1 * relativeScale,
						color:familyColors[fam]
					})
				})
			});
		}


		/** produceBubbleDataFriendsArtists
		 *  notice that I only produce bubble data for artists EVER
		 *  i.e. even for tracks/albums bubbledata is simply an abstraction of the available artists
		 * */
		//album[artist][0][familyagg]
		//track[artist][0][familyagg]
		//if(a.type === 'track' || a.type === 'album'){}
		var produceBubbleDataFriendsArtists = function(arr){
			function getClassName(a){
				if(a.shared){return 'shared'}
				else if(a.owner === 'user'){return 'difUser'}
				else if(a.owner === 'guest'){return 'difGuest'}
				else{return null}
			}
			arr.forEach(a =>{


				var series = _.find(bubbleData, function(o) { return o.name === a.familyAgg });

				series.data.push({name:a.name, value:scale[0],
					color:familyColors[a.familyAgg],owner:a.owner,className:getClassName(a)
				})
			});
		}



		//----------------------------------------------------------------------

		//note: setup ... various objects to filter on later
		//the big idea here is to create the correct overarching datasets and create
		//tiles, bubbles and pie data from contexts, and then apply filters later.
		//in the case of friends, we apply the friendscontrols right now to further reduce
		//the set we're filtering on later

		//todo: feels like this should be combined with switch below
		//but not sure if object type switch are shared like data producers - if so then combine

		var au = null;var ag = null;

		switch (statcontrol.stats.name) {
			case "artists_top":
			case "artists_recent":
			case "artists_saved":
			case "artists_friends":
				//all artists require map => array producer
				var {artists_user,artists_guest} = getFriendsArtists(map_user,map_guest)
				au = artists_user;ag = artists_guest;
				break;
			case "albums_saved":
			case "tracks_recent":
			case "tracks_saved":
				//this is just the raw track/album data for the user
				au = data_user; ag = data_guest;break;
			case "playlists":
				//this is just the raw playlist data for the user
				au = data_user; ag = data_guest;break;
			//todo: broken
			case "playlists_friends":
			case "tracks_friends":
			case "albums_friends":
			default:
				var {artists_user,artists_guest} = getFriendsArtists(map_user,map_guest)
				au = artists_user;ag = artists_guest;
				break;
		}

		console.log("set up data targets:");
		console.log("user",au);
		console.log("guest",ag);

		//note: use maps to produce pie and bubble data
		//for friends, change the input to these produce functions based on friendscontrol.compare

		//todo: looks like we have bubble for artists/playlists and then friends has it's own permutation of artists
		//#1) combine friends artists/playlists
		//#2) expand playlists to do friends as well
		//debugger;

		// const tileFilter = (tile) =>{
		// 	debugger;
		// 	console.log(tile);
		// }
		switch(statcontrol.stats.name) {
			case "albums_saved":
			case "artists_top":
			case "artists_recent":
			case "artists_saved":
			case "tracks_recent":
			case "tracks_saved":
				producePieData(map_user,'artists')
				produceBubbleDataArtists(map_user)
				// _tiles = au.filter(tileFilter)
				_tiles = au
				break;
			case "playlists":
				//for pie, we can describe a playlist using more than 1 slice
				producePieData(map_user,'playlists')
				produceBubbleDataPlaylists(map_user)
				_tiles = data_user
				break;
			case "artists_friends":
			case "playlists_friends":
			case "tracks_friends":
			case "albums_friends":

				//note: processed friendscontrol.selectedTabIndex above, so assume correct object types are here
				//testing: complete wipe = lose cool animation when changing filters?
				//or is there none anyways? proper test

				bubbleData.forEach(series =>{series.data = []})

				//todo: tiles are always setup above for friends?
				//_tiles = [];


				console.log("friendscontrol.compare",friendscontrol.compare);

				//based on friendscontrol.compare settings, provide bubble producer with sensible array to process
				switch (friendscontrol.compare) {
					case 'all':
						var uniqAll = _.uniqBy(au.concat(ag),'id')
						produceBubbleDataFriendsArtists(uniqAll)
						tempPieData = [];

						// debugger;
						// if(data_user[0].type === ('album' || 'track')){
						if(data_user[0].type === 'album' || data_user[0].type === 'track'){

							//testing: for tracks/albums we need to specify a different tile setup
							_tiles = _.uniqBy(data_user.concat(data_guest),'id')
						}else{_tiles = uniqAll}
						//producePieData(map_guest,'artists','all')
						break;
					//	todo:
					case 'diff':
						//var uniqAll = _.uniqBy(au.concat(ag),'id')
						break;
					case 'shared':
						var _shared = _.uniqBy(au.concat(ag),'id').filter(r =>{return r.shared})
						produceBubbleDataFriendsArtists(_shared)
						tempPieData = [];
						//producePieData(_shared,'artists','shared')
						if(_shared[0].type === ('album' || 'track')){
							//testing: for tracks/albums we need to specify a different tile setup
							_tiles = _.uniqBy(data_user.concat(data_guest),'id')
						}else{_tiles = _shared}

						break;
					case 'user':
						produceBubbleDataFriendsArtists(au)
						producePieData(map_user,'artists','user')
						_tiles = au
						break;
					case 'guest':
						produceBubbleDataFriendsArtists(ag)
						producePieData(map_guest,'artists','guest')
						_tiles = ag
						break;
				}

				// switch (statcontrol.stats.name) {
				// 	case "artists_top":
				// 	case "artists_recent":
				// 	case "artists_saved":
				// 	case "tracks_recent":
				// 	case "tracks_saved":{console.log();break;}
				// 	default:{console.log("skipped tile change for");break;}
				// }


				break;
			default:
				console.warn("skipped stat re-render for: " + statcontrol.stats.name)
				break;
		}

		//-------------------------------------------------------------------------------
		//note: series of different filters to apply produced pie, bubble and tile data

		// bubbleData = bubbleData.filter(r =>{return !(r.data.length === 0)})
		// //console.log("f",friendscontrol.families);
		// bubbleData = bubbleData.filter(r =>{
		// 	if(friendscontrol.families.length === 0){
		// 		return true;
		// 	}
		// 	else{
		// 		return friendscontrol.families.indexOf(r.name) !== -1
		// 	}
		// })


		//todo: dynamic family/genre chips
		//families is easy b/c I can just loop thru the bubbledata results

		//venn
		var series_sample = [
			{
				type: 'venn',
				name:'Pop',
				data: [{
					sets: ['User'],
					value: 2,

				}, {
					sets: ['Guest'],
					value: 2
				},{
					sets: ['User', 'Guest'],
					value: 1.5,
					name: 'Shared',
					// events: {click: function () {
					// 		console.log("click shared");
					// 		friendscontrol.setCompare('shared')}},
				}]
			}
		]

		//console.log("tempPieData",tempPieData);
		setPieData(tempPieData);
		setGenres(_genres)

		//todo: expand on concept

		var _stats = {};
		var max = null

		bubbleData.forEach(s =>{
			max === null ? max = s:{};
			s.data.length > max.data.length ? max = s:{}
		})
		//console.log("$max",max);
		_stats.max = max;
		STATS(_stats);
		// setFriendStats(_stats)
		setBubbleData(bubbleData);
		setVennData(series_sample);


		//------------------------------------------------------------------------

		//testing: small amount of tiles
		//todo: so I can go between user and guest w/ this reduced set
		//but shared doesn't work, not sure about all
		//when I take this out though....idfk
		//_tiles = _tiles.slice(0,10)

		//pretty sure this is for initialization?
		if(tiles.length === 0){
			console.log("tiles init");
			TILES(_tiles);
		}else{

			//var test = [1,2,3,4]
			//var filt = tiles.filter((r,i) =>{return !(test.includes(i))});

			console.log("$util updated tiles",_tiles);
			//console.log("current tiles",tiles);
			TILES(_tiles)

			//testing: manipulation strategy to allow preservation of items that need to be kept during transition
			// var add = _.differenceBy(_tiles,tiles,'id');
			// var remove = _.differenceBy(tiles,_tiles,'id');
			// var removeIds = remove.map(r =>{return r.id})
			// console.log("add",add);
			// console.log("remove",remove);
			//
			//  var filt = tiles.filter((r,i) =>{return !(removeIds.includes(r.id))});
			//  filt = filt.concat(add)
			//  TILES(filt)

			//testing: see if i force a delay, maybe I can figure out what's going on
			//but the delay only works the first time? idfk

			// remove.forEach(tmove =>{
			// 	setTimeout(e =>{
			// 		console.log("set");
			// 		TILES(tiles.filter(t =>{return t.id !== tmove.id}))
			// 	},5000)
			// })
			// add.forEach(t =>{
			// 	setTimeout(e =>{
			// 		TILES([...tiles,t])
			// 	},1000)
			// })


			//testing: sanity dupe check
			// function hasDuplicates(a) {
			// 	return _.uniq(a).length !== a.length;
			// }
			// console.log("dupe?",hasDuplicates(filt));

			// console.log("result",filt);
			// TILES(filt)

			//---------------------
			//testing: # of contextStats remounts = 1 + # of removed OR added elements?
			// var test = [1,2,3]
			// setTiles((tiles) =>{
			// 	return tiles.filter((r,i) =>{return !(test.includes(i))})
			// });
			//
		}


		//return {bubble:bubbleData,pie:tempPieData,genres:_genres}

	},[
		statcontrol.stats.name,statcontrol.mode,
		friendscontrol.compare,friendscontrol.families,friendscontrol.genres,
		friendscontrol.selectedTabIndex,friendscontrol.sourceFilter]);

	//todo: add back highlighter
	//highlighter.hoverState,
	//todo: previously was detecting node changes
	//JSON.stringify(globalState.node)]



	//console.log("returns",{bubble:bubbleData,pie:pieData,genres:genres});
	return {bubbleData:bubbleData,pieData:pieData,genres:genres,vennData:vennData,friendStats:friendStats}
}

function useProduceEvents(){

	let control = Control.useContainer();
	let statcontrol = StatControl.useContainer();
	//let highlighter = Highlighter.useContainer();
	let friendscontrol = FriendsControl.useContainer()
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);

	const [globalState, globalDispatch] = useContext(Context);
	//const events = useReactiveVar(EVENTS_VAR);
	console.log("$useProduceEvents",control.dataLoaded);

	//const nodes = useReactiveVar(NODES_VAR);

	//todo: context versus custom: these all trigger events recalc in CONTEXT mode but not in CUSTOM

	//we'll use agg to source our data when in custom mode
	//var n = _.find(	globalState.nodes, {name:"agg"})

	useEffect(() => {

			//true = context mode
			if(!(statcontrol.mode)){
				console.log("useProduceEvents skips b/c we're in custom mode");
			}else{

				function jstr(a){return JSON.parse(JSON.stringify(a))}
				var events = jstr(tables['events']);

				//console.log("$$current events",events);

				//todo: filter on this later
				var cids = control.metro.map( i => i.id);

				//note: chooose data based on tab
				let  {data_user,data_guest} = chooseData(statcontrol,friendscontrol,globalState,globalUI)
				//console.log("$$data_user",data_user);
				//console.log("$$data_guest",data_guest);

				//todo: skipping friends related stuff rn
				//console.log("$$data_guest",data_guest);

				var dataset = null;

				//note: if single user, skip
				// with valid guest_data from chooseData, use friendscontrol.compare to create dataset
				if(data_guest.length === 0){
					dataset = data_user
					console.log("$$dataset is just data_user");
				}else{
					let {map_user,map_guest} = getFriendsMaps(data_user,data_guest)
					let {artists_user,artists_guest} = getFriendsArtists(map_user,map_guest)

					//todo: copied from above, just w/out setting bubbles,pie and tiles
					switch (friendscontrol.compare) {
						case 'all':
							dataset = _.uniqBy(artists_user.concat(artists_guest),'id')
							break;
						//	todo:
						case 'diff':
							//var uniqAll = _.uniqBy(artists_user.concat(artists_guest),'id')
							break;
						case 'shared':
							dataset = _.uniqBy(artists_user.concat(artists_guest),'id').filter(r =>{return r.shared})
							break;
						case 'user':
							dataset =artists_user
							break;
						case 'guest':
							dataset =artists_guest
							break;
					}
					console.log("$$dataset set for friends",dataset);
				}


				var familyArtist = {};
				var genreArtist  = {};
				//id of every primary artist's related_artist, mapped to the primary
				var relatedArtist = {};
				var allArtist = {};

				const processRelated = (a) =>{
					if(a.related_artists){
						a.related_artists.forEach(ra =>{
							relatedArtist[ra.id] ? relatedArtist[ra.id].push(a):relatedArtist[ra.id]  = [a]
						})
					}
					else{
						// console.log("no related",a)
					}
				}



				//note: create maps for easier events filtering later
				dataset.forEach(r =>{
					if(r.type === 'artist'){
						familyArtist[r.familyAgg] ? familyArtist[r.familyAgg].push(r):familyArtist[r.familyAgg] = [r]
						r.genres.forEach(g =>{
							genreArtist[g.name] ? genreArtist[g.name].push(r):genreArtist[g.name] = [r]
						})
						//allArtist[r] ? allArtist[r] = r:allArtist[r]
						allArtist[r.id] = r
						//processRelated(r)
					}else if(r.type === 'playlist' || r.type === 'track'){
						//todo: we're not doing any weighting on the artist's ratio of tracks here
						//so just one song from one genre from one family get in
						r.artists.forEach(a =>{
							familyArtist[a.familyAgg] ? familyArtist[a.familyAgg].push(r):familyArtist[a.familyAgg] = [r]

							//todo: someone is coming back without genres:[] when it has none
							if(!a.genres){console.warn("problem artist record:",a)}
							else{
								a.genres.forEach(g =>{
									genreArtist[g.name] ? genreArtist[g.name].push(r):genreArtist[g.name] = [r]
								})
							}
							//processRelated(r)
							allArtist[r.id] = r
						})
					}
				});


				console.log("$$set new chip families/genres");
				console.log("CHIPFAMILIES",Object.keys(familyArtist));
				console.log("CHIPGENRES",genreArtist);
				// console.log(relatedArtist);
				CHIPFAMILIES(Object.keys(familyArtist))
				CHIPGENRES(genreArtist)

				//debugger;
				//filter out by date/metro and sort by date


				function byDate(e){
					return (new Date(e.start.datetime) >= control.startDate) && (control.endDate ? (new Date(e.start.datetime) <= control.endDate):true)
				}
				events = events.filter(e =>cids.indexOf(e.metro_id) !== -1)
					.filter(byDate)
					.sort((e1,e2) =>{return new Date(e1.start.datetime) - new Date(e2.start.datetime) })

				//todo: strange error here when ... my date result returns to little of # of results?
				//noticed when testin large cleveland pull - if my date range was real small it would start to duplicate event entries?
				events = _.sortedUniqBy(events,e =>{return e.id})

				//---------------------------------------------------------------------------------
				//note: series of different filters to apply to events set

				//note: for speed, mark the performances with all possible filtered categories
				//then later, based on control values, actually apply the filter

				events.forEach(e =>{
					e.friends = [];
					for(var x = 0; x < e.performance.length;x++){
						var a = e.performance[x].artist;

						//if my input dataset set had a artist defined for a genre
						//record it and - if asked to later - use that to filter for exactGenreMatch
						a.genre_match = [];
						a.genres.forEach(g =>{
							genreArtist[g.name] ?  a.genre_match = a.genre_match.concat(genreArtist[g.name]):{};
						})
						a.related_match = [];
						// if(relatedArtist[a.id]){
						relatedArtist[a.id] ? a.related_match.push(relatedArtist[a.id][0]):{};
						// }
						// relatedArtist[a.id] ? a.related_match.push(a):{};

						allArtist[a.id] ? a.exact_match = allArtist[a.id]:{};
						//familyArtist[a.familyAgg]

						//testing: good of n^ as any to insert guest avatars in
						//todo: different objects besides artists

						globalUI.user.related_users.filter(r =>{return r.friend}).forEach(f =>{
							if(globalState[f.id + '_artists']){
								globalState[f.id + '_artists'].forEach(fa =>{
									fa.id === a.id ? e.friends.push(f):{}
								})
							}
						})
					}
				})


				// console.log("friendscontrol.families",friendscontrol.families);
				// console.log("friendscontrol.genres",friendscontrol.genres);
				//console.log("control.genreSens",control.genreSens);
				//console.log("control.artistSens",control.artistSens);

				//todo: DISABLED
				//there may be a condition above that prevents this record from being included, but when related artists is activated,
				//add it back in / prevent it from being pulled out
				//testing: actually going to be difficult to find a related w/out the genre right?
				//so think only way to really test this is to turn OFF any genres stuff, then include this one?
				//but the use case there is just: ONLY show me concerts from related artists? that's strange isn't it?

				// var includesRelated = events.filter(e =>{
				// 	var some = false;
				// 	for(var x = 0; x < e.performance.length;x++) {
				// 		var a = e.performance[x].artist;
				// 		if (a.related_match.length > 0) {
				// 			a.useRelatedArtistMatch = true;
				// 			some = true;
				// 			break;
				// 		}
				// 	}
				// 	return some
				// })
				// console.log("$includesRelated",includesRelated);

				//note: control.genresens
				//instead of acting like this is 1/3 similar options, just going to disable the genreSens control completely
				//when we've selected a genre OR FAMILY to filter on

				if(friendscontrol.genres.length > 0){
					console.log("$$friendscontrol.genres overrides genreSens",friendscontrol.genres);
					events = events.filter(e =>{
						var some = false;
						for(var x = 0; x < e.performance.length;x++) {
							var a = e.performance[x].artist;
							for (var y = 0; y < a.genres.length; y++) {
								if (friendscontrol.genres.indexOf(a.genres[y].name) !== -1) {
									console.log(a.genres[y].name);
									a.useSelectedGenreMatch = true;
									some = true;
									break;
								}
							}
							if (some === true) {break;}
						}
						// if(some === true){debugger}
						return some;
					})
				}else if(friendscontrol.families.length > 0){
					console.log("$$friendscontrol.families overrides genreSens",friendscontrol.families);
					events = events.filter(e =>{
						var some = false;
						for(var x = 0; x < e.performance.length;x++) {
							var a = e.performance[x].artist;
							if (friendscontrol.families.indexOf(a.familyAgg) !== -1) {
								a.useSelectedFamilyMatch = true;
								some = true;
								break;
							}
							if (some === true) {break;}
						}
						//if(some === true){debugger}
						return some;
					})
				}else{
					events = events.filter(e =>{
						var some = false;
						for(var x = 0; x < e.performance.length;x++) {
							var a = e.performance[x].artist;

							if(control.genreSens === 'exact'){
								if(a.genre_match.length > 0){
									a.useExactGenreMatch = true;
									some = true;break;
								}
							}else if(control.genreSens === 'related'){
								//if the familyAgg of any of the performances has been alluded to in familyArtist, we keep it
								if(Object.keys(familyArtist).indexOf(a.familyAgg) !== -1){
									a.useRelatedGenreMatch = true;
									some = true;break;
								}
							}
						}
						return some
					})
				}


				//note: control.artistSens
				events = events.filter(e =>{
					var some = false;
					for(var x = 0; x < e.performance.length;x++) {
						var a = e.performance[x].artist;

						if(control.artistSens === 'exact'){
							if(a.exact_match){
								a.useExactArtistMatch = true;
								some = true;break;
							}
						}else{return true}
					}
					return some
				})

				//---------------------------------------------------------------------------------

				//debugger;
				//console.log("$$events",jstr(events));
				console.log("$$events",events);
				EVENTS_VAR(events)

			}//else in context mode
		},
		[statcontrol.stats.name,statcontrol.mode,
			friendscontrol.compare,friendscontrol.families,friendscontrol.genres,friendscontrol.selectedTabIndex,friendscontrol.sourceFilter,
			control.metro,control.startDate,control.endDate,control.genreSens,control.artistSens,control.dataLoaded,
			tables['events']
		]
	)

}

function familyFreq(a){

	var ret = null;

	//a = JSON.parse(JSON.stringify(a));
	//console.log(JSON.parse(JSON.stringify(a)));
	// console.log("familyFreq",a.genres);
	// console.log("familyFreq",a.genres.length >0);

	if(a.genres && a.genres.length >0){
		var fmap = {};
		for (var z = 0; z < a.genres.length; z++) {
			if (a.genres[z].family_name) {
				if (!(fmap[a.genres[z].family_name])) {
					fmap[a.genres[z].family_name] = 1
				} else {
					fmap[a.genres[z].family_name]++;
				}
			}
		}

		//console.log("$fmap",fmap);

		//check the family map defined and see who has the highest score
		if (!(_.isEmpty(fmap))) {
			//convert map to array (uses entries and ES6 'computed property names')
			//and find the max
			var arr = [];
			Object.entries(fmap).forEach(tup => {
				var r = {[tup[0]]: tup[1]};
				arr.push(r);
			});
			//todo: could offer this
			var m = _.maxBy(arr, function (r) {
				return Object.values(r)[0]
			});
			var f = Object.keys(m)[0];
			//console.log("%", f);
			ret = f ;
		}
	}else{
		//if
		console.warn("no genres!",a.name);
	}
	ret ? a.familyAgg = ret:{};
	return ret;
}

// function prepTracks(rowData){
// 	//console.log("$prepTracks",rowData);
// 	var genres = [];
// 	rowData.artists.forEach(a =>{
// 		genres = genres.concat(a.genres)
// 	});
// 	genres = _.uniqBy(genres, function(n) {return n.id;});
// 	//return <div></div>
// 	return(<ChipsArray chipData={genres}/>)
// }

export default {
	familyFreq,makeRank,makeRank2,useProduceData,useProduceEvents
}
