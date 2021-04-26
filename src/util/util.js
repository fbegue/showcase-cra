/* eslint-disable no-unused-expressions */
import _ from "lodash";
import ChipsArray from "../ChipsArray";
import React, {useContext,useState,useEffect} from "react";
import tables from "../storage/tables";
import {families as systemFamilies, familyColors} from "../families";
import {Highlighter, StatControl,FriendsControl,Control} from "../index";
import {Context} from "../storage/Store";
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR,TILES,EVENTS_VAR,NODES_VAR} from "../storage/withApolloProvider";
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


function chooseData(statcontrol,friendscontrol,globalState,globalUI){

	var data_user = [];
	var data_guest = [];

	console.log("chooseData",statcontrol.stats.name);
	console.log("guest:",friendscontrol.guest.id);

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
		case "friends":
			var key = null

			//todo: add more keys
			switch(friendscontrol.selectedTabIndex) {
				case 1:
					//artists
					key = '_artists'
					break;
				case 3:
					//artists
					key = '_tracks'
					break;
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
			if(d.type === 'track'){
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
					//todo: restore
					// //testing: only genres from highlighted family
					// if(highlighter.hoverState[0] === a.familyAgg){
					// 	_genres = _genres.concat(a.genres)
					// }

				});

			}

				//todo: familyAgg is good enough signifier here to determine 'artist' type?
			//artists
			else if(d.familyAgg && d.familyAgg !== null){

				//testing:
				//compare maps of each person for each family
				//compare the total # of artists for each family for each user:
				//- if both USER and GUEST have a decent number, that's an interesting genre for them to talk about
				//- if neither do - it's not
				//- and then something something math

				//note: will always be arrays of length 1
				if (!map[d.familyAgg]) {
					map[d.familyAgg] = {artists:{}}
				} else {
					//map[d.familyAgg].artists.push(a)
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
	const [vennData, setVennData] = useState([]);
	//const [tiles, setTiles] = useState([]);


	useEffect(() => {

		var tempPieData = [];
		console.log("useEffect",statcontrol.stats.name);
		console.log("$friendscontrol",friendscontrol.guest);
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
		if(statcontrol.stats.name === "playlists"){
			debugger;
		}

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

		//note: directly modifies tempPieData,bubbleData
		var producePieData = function(maporarr,key,owner,){
			//set pie data: here you can see the pie chart ignoring the actual occurence value of the artists,
			//and is instead just proportioning slices based on # of artists in the family



			var map = {};
			var arr = null;
			if(owner === 'shared') {
				arr = maporarr
				arr.forEach(a =>{
					map[a.familyAgg] ? map[a.familyAgg].push(a):map[a.familyAgg] = [];
				})

				Object.keys(map).forEach(fam =>{
					tempPieData.push({x:fam,y:map[fam].length})
				})

			}else{
				map = maporarr;
				//console.log('map',map);
				Object.keys(map).forEach(fam =>{

					tempPieData.push({x:fam,y:Object.keys(map[fam][key]).length})

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
			tempPieData = tempPieData.filter(r =>{
				if(friendscontrol.families.length === 0 || friendscontrol.families[0] === 'all'){
					return true;
				}
				else{
					return friendscontrol.families.indexOf(r.x) !== -1
				}
			})

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


		//create arrays for each user's map
		var au = null;var ag = null;
		if(statcontrol.stats.name === "playlists"){
			console.log("skip");
		}else{
			let {artists_user,artists_guest} = getFriendsArtists(map_user,map_guest)
			au = artists_user;ag = artists_guest
		}


		console.log("user",au);
		console.log("guest",ag);
		switch(statcontrol.stats.name) {
			case "artists_top":
			case "artists_recent":
			case "artists_saved":
			case "tracks_recent":
			case "tracks_saved":
				producePieData(map_user,'artists')
				produceBubbleDataArtists(map_user)
				_tiles = au
				break;
			case "playlists":
				//for pie, we can describe a playlist using more than 1 slice
				producePieData(map_user,'playlists')
				produceBubbleDataPlaylists(map_user)
				_tiles = data_user
				break;
			case "friends":

				//testing: complete wipe = lose cool animation when changing filters?
				//or is there none anyways? proper test

				bubbleData.forEach(series =>{series.data = []})
				_tiles = [];

				console.log("friendscontrol.compare",friendscontrol.compare);

				//this switch was only concerned with providing tiles for different friends compare options
				switch (friendscontrol.compare) {
					case 'all':
						var uniqAll = _.uniqBy(au.concat(ag),'id')
						produceBubbleDataFriendsArtists(uniqAll)
						producePieData(map_guest,'artists','all')
						_tiles = uniqAll
						//_tiles = [];
						// tiles.forEach(a =>{
						// 	uniqAll.forEach(ae =>{
						// 		if(){}
						// 	})
						// })
						break;
					//	todo:
					case 'diff':
						//var uniqAll = _.uniqBy(au.concat(ag),'id')
						break;
					case 'shared':
						var _shared = _.uniqBy(au.concat(ag),'id').filter(r =>{return r.shared})
						produceBubbleDataFriendsArtists(_shared)
						producePieData(_shared,'artists','shared')
						//testing:
						_tiles = _shared
						//_tiles = _tiles.slice(0,_tiles.length -2)
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


		bubbleData = bubbleData.filter(r =>{return !(r.data.length === 0)})
		//console.log("f",friendscontrol.families);
		bubbleData = bubbleData.filter(r =>{
			if(friendscontrol.families.length === 0 || friendscontrol.families[0] === 'all'){
				return true;
			}
			else{
				return friendscontrol.families.indexOf(r.name) !== -1
			}
		})

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
		//console.log("bubbleData",bubbleData);
		setBubbleData(bubbleData);
		setVennData(series_sample);


		//------------------------------------------------------------------------

		var a1 = {
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/0fA0VVWsXO9YnASrzqfmYu"
			},
			"followers": {
				"href": null,
				"total": 4737416
			},
			"genres": [
				{
					"id": 23,
					"name": "rap",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 1275,
					"name": "ohio hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 6,
					"name": "hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				}
			],
			"href": "https://api.spotify.com/v1/artists/0fA0VVWsXO9YnASrzqfmYu",
			"id": "testtesttest0fA0V",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/4cb57ae1ef87546455db9cf65ba414c311ff459a",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/805d1c319fe812f65f680b039a480dcc8c2bdd84",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/550bfaa6e0d866c4fa96ba59e3de1d4df6ac5dbc",
					"width": 160
				}
			],
			"name": "Ttest Cudi",
			"popularity": 87,
			"type": "artist",
			"uri": "spotify:artist:0fA0VVWsXO9YnASrzqfmYu",
			"familyAgg": "hip hop",
			"source": "saved",
			"owner": "user"
		};
		var a2 = {
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/4SOtk3HtPYKqxnVuxNBMti"
			},
			"href": "https://api.spotify.com/v1/artists/4SOtk3HtPYKqxnVuxNBMti",
			"id": "4SOtk3HtPYKqxnVuxNBMti",
			"name": "Donovan Woods",
			"type": "artist",
			"uri": "spotify:artist:4SOtk3HtPYKqxnVuxNBMti",
			"genres": [
				{
					"id": 1126,
					"name": "deep new americana",
					"family_id": null,
					"family_name": null
				},
				{
					"id": 49,
					"name": "indie folk",
					"family_id": 15,
					"family_name": "folk"
				},
				{
					"id": 1178,
					"name": "neo mellow",
					"family_id": null,
					"family_name": null
				},
				{
					"id": 1417,
					"name": "indiecoustica",
					"family_id": null,
					"family_name": null
				},
				{
					"id": 68,
					"name": "stomp and holler",
					"family_id": 15,
					"family_name": "folk"
				},
				{
					"id": 189,
					"name": "canadian indie",
					"family_id": 12,
					"family_name": "world"
				},
				{
					"id": 141,
					"name": "acoustic pop",
					"family_id": 1,
					"family_name": "pop"
				},
				{
					"id": 1445,
					"name": "canadian singer-songwriter",
					"family_id": null,
					"family_name": null
				},
				{
					"id": 1373,
					"name": "indie anthem-folk",
					"family_id": null,
					"family_name": null
				},
				{
					"id": 1137,
					"name": "new americana",
					"family_id": null,
					"family_name": null
				}
			],
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/008d482bacc20706b3aff014456c40a5afcff2a7",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/bbcb801f90c638e48fda013afeac7aa7ae2d5509",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/5c6f48c5e30882f2fe83a72bf2b85345358f258f",
					"width": 160
				}
			],
			"familyAgg": "folk"
		}

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
		//friendscontrol.compare
		friendscontrol.families,
		friendscontrol.selectedTabIndex,friendscontrol.sourceFilter]);

	//todo: add back highlighter
	//highlighter.hoverState,
	//todo: previously was detecting node changes
	//JSON.stringify(globalState.node)]



	//console.log("returns",{bubble:bubbleData,pie:pieData,genres:genres});
	return {bubbleData:bubbleData,pieData:pieData,genres:genres,vennData:vennData}
}

function useProduceEvents(){

	console.log("$useProduceEvents");

	let control = Control.useContainer();
	let statcontrol = StatControl.useContainer();
	//let highlighter = Highlighter.useContainer();
	let friendscontrol = FriendsControl.useContainer()
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	const [globalState, globalDispatch] = useContext(Context);
	const events = useReactiveVar(EVENTS_VAR);
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

				let  {data_user,data_guest} = chooseData(statcontrol,friendscontrol,globalState,globalUI)
				//console.log("$$data_user",data_user);

				//todo: skipping friends related stuff rn
				//console.log("$$data_guest",data_guest);

				var dataset = null;

				if(data_guest.length === 0){
					dataset = data_user
					console.log("$$dataset is just data_user");
				}else{
					let {map_user,map_guest} = getFriendsMaps(data_user,data_guest)
					let {artists_user,artists_guest} = getFriendsArtists(map_user,map_guest)

					//testing: copied from above, just w/out setting bubbles,pie and tiles
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

				//extrapolate families/genres based on supplied data type
				var families = [];
				dataset.forEach(r =>{
					//artists or tracks
					if(r.familyAgg){
						families.indexOf(r.familyAgg) === -1 ? families.push(r.familyAgg):{};
						//playlists
					}else if(r.artists){
						//todo: we're not doing any weighting on the artist's ratio of tracks here
						//so just one song from one genre from one family get in

						r.artists.forEach(a =>{
							families.indexOf(a.familyAgg) === -1 ? families.push(a.familyAgg):{};
						})
					}
				});
				families = families.filter(e => e !== null)

				if(friendscontrol.families.length === 0 || friendscontrol.families[0] === 'all'){
					//console.log("$$families",families);
				}else{
					families = friendscontrol.families
					//console.log("$$families overruled by friendscontrol",families);
				}

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

				//todo: implement control.genreSens,control.artistSens, filters

				if(families.length > 0){
					//for every event, if any of the performances has a familyAgg
					//that is within our filtered set, keep the event
					events = events.filter(e =>{
						var some = false;
						for(var x = 0; x < e.performance.length;x++){
							//console.log("e",e.performance[x].artist.familyAgg);
							if(families.indexOf(e.performance[x].artist.familyAgg) !== -1){
								some = true;
								break;
							}
						}
						return some;
					})
				}else{
					//console.log("$$no families to filter on!");
				}

				//console.log("$$events",jstr(events));
				EVENTS_VAR(events)

			}//else
		},
		[statcontrol.stats.name,statcontrol.mode,
			friendscontrol.compare,friendscontrol.families,friendscontrol.selectedTabIndex,friendscontrol.sourceFilter,
			control.metro,control.startDate,control.endDate,control.genreSens,control.artistSens,
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

function prepTracks(rowData){
	//console.log("$prepTracks",rowData);
	var genres = [];
	rowData.artists.forEach(a =>{
		genres = genres.concat(a.genres)
	});
	genres = _.uniqBy(genres, function(n) {return n.id;});
	//return <div></div>
	return(<ChipsArray chipData={genres}/>)
}

export default {
	familyFreq,makeRank,makeRank2,prepTracks,useProduceData,useProduceEvents
}
