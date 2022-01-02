/* eslint-disable no-unused-expressions */
import _ from "lodash";
// import ChipsArray from "../components/utility/ChipsArray";
import React, {useContext,useState,useEffect,useRef} from "react";
import tables from "../storage/tables";
import {families as systemFamilies, familyColors,familyIdMap} from "../families";
import {Highlighter, StatControl,FriendsControl,Control,TabControl,PieControl} from "../index";
import {Context} from "../storage/Store";
import {useReactiveVar} from "@apollo/react-hooks";
import {
	GLOBAL_UI_VAR, TILES, EVENTS_VAR, STATS, CHIPFAMILIES, CHIPGENRES,
	CHIPGENRESRANKED, CHIPFAMILIESRANKED, CHIPGENRESCOLORMAP, CHIPGENRESCOMBINEDMAP, BARDATA,BARDRILLDOWNMAP
} from "../storage/withApolloProvider";

import {data1} from './testData'
const uuid = require('react-uuid')
var tinycolor = require("tinycolor2");
const getPointSum = (data) =>{
	var t=0;
	data.forEach(s =>{t = t + s.data.length})
	return t
}

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
* - statcontrol.mode (custom/context)
* - BUT NOT COMPARE MODE b/c I need to process that later for some important reason I can't remember now
*  */

function chooseData(statcontrol,friendscontrol,tabcontrol,globalState,globalUI){

	var data_user = [];
	var data_guest = [];

	//console.log("chooseData",statcontrol.stats.name);
	//console.log("guest:",friendscontrol.guest.id);

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
		case "albums_saved":
			data_user = globalState[globalUI.user.id + "_albums"]
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
			//console.log("friendscontrol.selectedTabIndex choose key:",key);

			//todo: not applicable to USER b/c these are in seperate categories?
			//but here in USER v FRIEND, we give the option

			//need to dedupe if we're not filtering by source
			if(friendscontrol.sourceFilter ===  'both'){

				//console.log("sourceFilter set to both");
				data_user = globalState[globalUI.user.id + key]
				data_guest = globalState[friendscontrol.guest.id + key]
				//todo: uniqBy at this stage makes sense, right?
				data_user = _.uniqBy(data_user,'id')
				data_guest  = _.uniqBy(data_guest,'id')
			}else{
				//console.log("sourceFilter on:",friendscontrol.sourceFilter);
				data_user = globalState[globalUI.user.id + key].filter(contextFilter.bind(null,friendscontrol.sourceFilter))
				data_guest = globalState[friendscontrol.guest.id + key].filter(contextFilter.bind(null,friendscontrol.sourceFilter))
			}
			break;

		default:
			console.warn("skipped stat re-render for: " + statcontrol.stats.name)
			break;
	}

	//console.log("friendscontrol.families",friendscontrol.families);
	//console.log("friendscontrol.genres",friendscontrol.genres);

	//depreciated
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
				//testing: indexOf works?
				var f = _.find(friendscontrol.genres, function(o) { return o.id === r.genres[y].id });
				if (f) {
					some = true;break;
				}
			}
		}
		//playlist, tracks
		else{
			//check selected genres against any artist of the playlist or track
			for(var x = 0; x < r.artists.length; x++){
				for(var y = 0; y < r.artists[x].genres.length; y++){
					//testing: indexOf works?
					var f = _.find(friendscontrol.genres, function(o) { return o.id === r.artists[x].genres[y].id });
					if (f) {
						some = true;break;
					}
				}
				//break out of artists loop if one of their genre's passed
				if(some){break}
			}
		}
		return some
	}



	//if it does have a genre in that set, the item can't pass unless
	//at least one of it's genres are an exact match

	var exactMatchThru = function(genres){
		var pass = false;
		for(var x = 0; x < genres.length; x++) {
			if(friendscontrol.genres.indexOf(genres[x]) !== -1){
				pass = true; break;
			}
		}
		return pass
	}

	//otherwise, check every genre of the item, allowing certain items to pass thru to next check
	//to pass-thru, it must have NO genres with fams that are in the fam set from selected genres

	const doCheck = (gin) =>{
		friendscontrol.genres.forEach(g =>{
			if(gin.family_name === g.family_name){

			}
		})
	}
	var passThru = function(genres,filterFams){
		var passThru = true;
		for(var x = 0; x < genres.length; x++) {
			//if the family also has genres tho, need to check against those
			if(filterFams.indexOf(genres[x].family_name) !== -1){
				passThru = false;
			}
		}
		return passThru
	}
	var exactArtistMatch = function(genres){
		var ret = false;
		for(var x = 0; x < genres.length; x++) {

			if (_.find(friendscontrol.genres, function (fg) {
				return genres[x].id === fg.id
			})) {
				ret = true;
				break;
			}
		}
		return ret
	}
	//if any are an exact match to a selected one, let it thru

	var famGenreFilter = (r) =>{

		//set of families contained with selected genre list
		var filterFams = friendscontrol.genres.map(g =>{return g.family_name})

		//goal: when a genre is selected, perform filtering only on items
		//who's main family is referenced by said genre.

		if(friendscontrol.families.length > 0){
			switch (r.type) {
				case 'artist':

					if(friendscontrol.genres.length > 0){

						if(friendscontrol.families.indexOf(r.familyAgg) === -1){return false}

						if(exactArtistMatch(r.genres)){return true}

						if(passThru(r.genres,filterFams)){return true}

						return exactMatchThru(r.genres)

					}//no genres, so only return if item is in selected families
					else{

						return friendscontrol.families.indexOf(r.familyAgg) !== -1;
					}
				case 'playlist':
				case 'track':
				case 'album':

					var testId = '0x4zqBZSjYvVLuttqcfu9W';
				function testIf(id){
					if(id === testId){
						debugger
					}
				}
					if(friendscontrol.genres.length > 0){

						//testIf(r.id)

						//filter out records who don't have any artists in the familyAgg
						var flag = false;
						for(var x = 0; x < r.artists.length; x++){
							if(friendscontrol.families.indexOf(r.artists[x].familyAgg) !== -1){
								//testIf(r.id)
								flag = true;
							}
							if(flag){break;}
						}
						if(!(flag)){return false}

						//keep records who have an exact ARTIST match on our list of selected genres
						var exactFlag = false;
						for(var x = 0; x < r.artists.length; x++){
							if(exactArtistMatch(r.artists[x].genres)){
								exactFlag = true;
							}
							if(exactFlag){break;}
						}
						if(exactFlag){return true}


						//when one family has a genre specified but the other doesn't, we still want to show all
						//objects that belong to the family which doesn't have any genres specified - while filtering
						// on the genres for object's that belong to one of those families.

						//testIf(r.id)

						var exactMatchThruFlag = false;

						for(var x = 0; x < r.artists.length; x++){

							//are we filtering on genres for this artist's familyAgg
							if(filterFams.indexOf(r.artists[x].familyAgg) !== -1){

								//yes. so in order to pass, we need an exact match
								if(exactMatchThru(r.artists[x].genres)){
									//if even one artist has exact genres, break on this truth
									exactMatchThruFlag = true;
								}
							}
							else{
								//we don't care about genres for this artist.
								//as long as the familyAgg is within selected families, let it thru
								if(friendscontrol.families.indexOf(r.artists[x].familyAgg) !== -1){
									return true
								}
							}
							if(exactMatchThruFlag){break;}
						}

						if(exactMatchThruFlag){return true}


						//testIf(r.id)

						//deprcated: this is part of the above check now

						// var exactMatchThruFlag = false;
						// for(var x = 0; x < r.artists.length; x++){
						// 	if(exactMatchThru(r.artists[x].genres)){
						// 		exactMatchThruFlag = true;
						// 	}
						// 	if(exactMatchThruFlag){break;}
						// }
						//
						// return exactMatchThruFlag

					}//no genres, so only return if item is in selected families
					else{
						var flag2 = false;
						for(var x = 0; x < r.artists.length; x++){
							if(friendscontrol.families.indexOf(r.artists[x].familyAgg) !== -1){
								flag2 = true;
							}
							if(flag2){break;}
						}
						return flag2;
					}
			}//switch
		}else{
			//no families
			return true
		}
	}


	if(tabcontrol.tab === 1 && tabcontrol.section === 1){
		var checkboxFilter = (r) =>{

			if(!(friendscontrol.checkboxes['me']) && !(friendscontrol.checkboxes['spotify']) && !(friendscontrol.checkboxes['collab'])){
				return true
			}else{

				var me = false;
				var spotify = false;
				var collab = false;
				if(friendscontrol.checkboxes['me']){me = r.owner.id === globalUI.user.id}
				if(friendscontrol.checkboxes['spotify']){spotify = r.owner.id === "spotify"}
				if(friendscontrol.checkboxes['collab']){collab = r.collaborative}
				var ret = (me || spotify|| collab);
				return ret
			}
		}
		data_user = data_user.filter(checkboxFilter)
		//todo: not currently implemented for friends
		data_guest  = data_guest.filter(checkboxFilter)
	}

	var queryFilter = (t) =>{

		if(friendscontrol.query === ""){return true}else{
			//console.log("$$user",t);
			//console.log("$q",friendscontrol.query);
			var pat = "^" + friendscontrol.query.toLowerCase();
			var re = new RegExp(pat,"g");

			var toTest = t['name'].toLowerCase().split(" ")

			var flag = false;
			for(var x = 0; x < toTest.length; x++){
				if(re.test(toTest[x])){
					flag = true;
				}
				if(flag){break;}
			}
			return flag
		}
	}

	// if(friendscontrol.families.length > 0){
	// 	data_user = data_user.filter(famCtrlFilter)
	// 	data_guest  = data_guest.filter(famCtrlFilter)
	// }
	// if(friendscontrol.genres.length > 0){
	// 	data_user = data_user.filter(genreCtrlFilter)
	// 	data_guest  = data_guest.filter(genreCtrlFilter)
	// }

	data_user = data_user.filter(queryFilter)
	data_guest  = data_guest.filter(queryFilter)

	data_user = data_user.filter(famGenreFilter)
	data_guest  = data_guest.filter(famGenreFilter)



	var valueArr = data_user.map(function(item){ return item.id });
	var isDuplicate = valueArr.some(function(item, idx){
		return valueArr.indexOf(item) != idx
	});
	if(isDuplicate){

	}
	data_user = _.uniqBy(data_user,'id')



	return {data_user,data_guest}
}

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

			//testing: with tracks/albums abstracted to artists
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
			//artists
			else if(d.type === 'artist'){

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

function getFriendsItemMaps(data_user,data_guest){

	var map_user = {}
	var map_guest =  {};
	var createMap = function(arr,map){

		arr.forEach(d =>{

			if(d.type === 'track' || d.type === 'album'){
				d.artists.forEach(a =>{
					if(a.familyAgg && a.familyAgg !== null){
						if (!map[a.familyAgg]) {
							map[a.familyAgg] = {items:{}}
						} else {
							//map[a.familyAgg].artists.push(a)
							if(map[a.familyAgg].items[d.name]){map[a.familyAgg].items[d.name].push(d)}
							else{map[a.familyAgg].items[d.name] = [d]}
						}
					}
				});
			}
			else{
				console.warn("malformed data passed to getFriendsItemMaps, skipped item");
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

function getFriendsItems(map_user,map_guest){
	var items_user = [];
	var items_guest = [];
	Object.keys(map_user).forEach(fam =>{
		//for each item key on a fam

		Object.keys(map_user[fam].items).forEach(aname =>{
			items_user.push(map_user[fam].items[aname][0])
		})
	});
	Object.keys(map_guest).forEach(fam =>{
		Object.keys(map_guest[fam].items).forEach(aname =>{
			items_guest.push(map_guest[fam].items[aname][0])
		})
	});

	var shared = _.intersectionBy(items_user,items_guest,'id');
	var sharedMap = _.keyBy(shared,'id')
	var dif_user = _.differenceBy(items_user,shared,'id');
	var dif_userMap = _.keyBy(dif_user,'id')
	var dif_guest = _.differenceBy(items_guest,shared,'id');
	var dif_guestMap = _.keyBy(dif_guest,'id')

	//mark the arrays with the info produced by the above lodash ops

	items_user.forEach(a =>{
		sharedMap[a.id] ? a.shared = true:{}
		dif_userMap[a.id] ? a.owner = 'user':{}
	})
	items_guest.forEach(a =>{
		sharedMap[a.id] ? a.shared = true:{}
		dif_guestMap[a.id] ? a.owner = 'guest':{}
	})

	return {items_user,items_guest};

}

//todo: refactor

//both of these used to maintain dynamic return values, but both just rely on reactivevars now
//so basically, we invoke these hooks only where we know that ON EVERY RENDER, we need to check for dep change??

//useProduceData: ContextStats,Stats
//useProduceEvents: ContextStats,Stats

//currently useProduceEvents
//- handles one time graph data production (per friend)
//- reacts to anything that can change events

//in order to reduce # of calls to chooseData - which processes basically everything except a few event only filters
//- should just separate the event-only filters into useFilterEvents WHILE useProduceData will also be modifying them
//- not sure what I was doing with refs here...?

//currently useProduceData
//-produces tiles

function useProduceData(){
	//so basically:
	// when you're only selecting data from one tab or switching between tabs, we only look at one node's data at a time
	// when you start combining tabs, the logic switches to accommodate many different item types

	const [globalState, globalDispatch] = useContext(Context);
	let statcontrol = StatControl.useContainer();
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	let friendscontrol = FriendsControl.useContainer()
	let tabcontrol = TabControl.useContainer()
	//let highlighter = Highlighter.useContainer();
	const tiles = useReactiveVar(TILES);

	//testing: detect which dep change (with array of refs I guess?)
	//https://stackoverflow.com/questions/65255317/reactjs-how-do-i-know-which-dependency-made-the-useeffect-hook-run-trigger
	const prevVar1 = useRef();
	const prevVar2 = useRef();

	useEffect(() => {
		//useProduceData
		var tempPieData = [];

		//testing:
		// if(prevVar1.current !== friendscontrol.guest) {
		// 	console.log(prevVar1.current);
		// 	console.log(friendscontrol.guest);
		// 	debugger;
		// }
		// if(prevVar2.current !== var2) {
		// 		// 	// var2 has been changed
		// 		// }

		// and update the previous state
		prevVar1.current = friendscontrol.guest;
		//prevVar2.current = var2;

		console.log("useProduceData",statcontrol.stats.name);
		//console.log("guest",friendscontrol.guest);
		friendscontrol.guest.id ? console.log("guest:",friendscontrol.guest.id):{};
		//console.log("tables",tables);

		//set data pointer based on current tab
		let  {data_user,data_guest} = chooseData(statcontrol,friendscontrol,tabcontrol,globalState,globalUI)

		//determine incoming data object type (and don't try to check at a value that's not there)
		var objectType = null;
		if(data_user.length > 0){
			objectType = data_user[0].type
		}else if(data_guest.length > 0){
			objectType = data_guest[0].type
		}

		console.log("data object type",objectType);
		console.log("data source switched | user:",data_user);
		console.log("data source switched | guest",data_guest);


		//based on the type of data coming in,
		//create a map for pie and bubblechart to unwrap later
		//todo: in every case, null familyAgg doesn't quite make sense?
		// think this was a notee to myself that I was getting some nulls that shouldn't be there?

		//todo: can decide to (initally) hide certain series w/ series property: visible
		//by default, toggleable by clicking on legend item
		var _genres =[];


		let map_user= null;
		let map_guest= null;
		if(objectType === 'album' ||objectType === 'track'){
			let {map_user:map_userr,map_guest:map_guestr} = getFriendsItemMaps(data_user,data_guest)
			map_user = map_userr;map_guest = map_guestr
		}else{
			let {map_user:map_userr,map_guest:map_guestr} = getFriendsMaps(data_user,data_guest)
			map_user = map_userr;map_guest = map_guestr
		}
		// console.log("map_user",map_user);
		// console.log("map_guest",map_guest);
		var _tiles = [];
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
				const {items_user,items_guest} = getFriendsItems(map_user,map_guest);
				au = items_user; ag = items_guest;break;

		}

		//console.log("set up data targets:");
		// console.log("user",au);
		// console.log("guest",ag);

		//note: use maps to produce pie and bubble data
		//for friends, change the input to these produce functions based on friendscontrol.compare


		switch(statcontrol.stats.name) {
			case "artists_top":
			case "artists_recent":
			case "artists_saved":_tiles = au;break;
			case "albums_saved":
			case "tracks_recent":
			case "tracks_saved":_tiles = au;break;
			case "playlists":_tiles = data_user;break;
			case "artists_friends":
			case "playlists_friends":
			case "tracks_friends":
			case "albums_friends":
				switch (friendscontrol.compare) {
					case 'all':
						if(objectType === 'album' ||objectType === 'track'){
							_tiles = _.uniqBy(data_user.concat(data_guest), 'id')
						} else {
							var uniqAll = _.uniqBy(au.concat(ag), 'id')
							_tiles = uniqAll
						}
						break;
					//	todo:
					case 'diff':
						//var uniqAll = _.uniqBy(au.concat(ag),'id')
						break;
					case 'shared':
						if(objectType === 'album' ||objectType === 'track'){
							_tiles = _.uniqBy(data_user.concat(data_guest), 'id').filter(r => {return r.shared})
						} else {
							var _shared = _.uniqBy(au.concat(ag), 'id').filter(r => {return r.shared})
							_tiles = _shared
						}
						break;
					case 'user':
						_tiles = au;break;
					case 'guest':
						_tiles = ag;break;
				}
				break;
			default:
				console.warn("skipped stat re-render for: " + statcontrol.stats.name)
				break;
		}
		//-------------------------------------------------------------------------------

		//todo: expand on dynamic stats collection concept?
		//think this makes more sense in useProduceGraphData

		// var _stats = {};
		// var max = null
		// bubbleData.forEach(s =>{
		// 	max === null ? max = s:{};
		// 	s.data.length > max.data.length ? max = s:{}
		// })
		//
		// _stats.max = max;
		// STATS(_stats);

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

			//testing: sanity dupe check
			// function hasDuplicates(a) {
			// 	return _.uniq(a).length !== a.length;
			// }
			// console.log("dupe?",hasDuplicates(filt));

			// console.log("result",filt);
			// TILES(filt)
		}


		//return {bubble:bubbleData,pie:tempPieData,genres:_genres}

	},[
		statcontrol.stats.name,statcontrol.mode,
		friendscontrol.compare,friendscontrol.families,friendscontrol.genres,
		friendscontrol.selectedTabIndex,friendscontrol.sourceFilter,friendscontrol.checkboxes,friendscontrol.query]);

	//todo: add back highlighter
	//highlighter.hoverState,
	//todo: previously was detecting node changes
	//JSON.stringify(globalState.node)]



	//console.log("returns",{bubble:bubbleData,pie:pieData,genres:genres});
	return {}
}

var lastTab = null;
var prevBarUsersNum = null;
function useProduceEvents(){
	let control = Control.useContainer();
	let statcontrol = StatControl.useContainer();
	//let highlighter = Highlighter.useContainer();
	let friendscontrol = FriendsControl.useContainer()
	let tabcontrol = TabControl.useContainer()
	//var piecontrol = PieControl.useContainer()
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	// const piedata = useReactiveVar(PIEDATA);
	// const piedatadrilldown = useReactiveVar(PIEDATADRILLDOWN);
	// const piedataguest = useReactiveVar(PIEDATAGUEST);
	// const piedatadrilldownguest = useReactiveVar(PIEDATADRILLDOWNGUEST);

	const [globalState, globalDispatch] = useContext(Context);
	//console.log("$useProduceEvents",control.dataLoaded);


	//const nodes = useReactiveVar(NODES_VAR);

	//todo: context versus custom: these all trigger events recalc in CONTEXT mode but not in CUSTOM

	//we'll use agg to source our data when in custom mode
	//var n = _.find(	globalState.nodes, {name:"agg"})

	useEffect(() => {
			//useProduceEvents
			function jstr(a){return JSON.parse(JSON.stringify(a))}
			let  {data_user,data_guest} = chooseData(statcontrol,friendscontrol,tabcontrol,globalState,globalUI)
			console.log("$data_user",JSON.parse(JSON.stringify(data_user)));

			if(!(statcontrol.mode)){
				console.log("useProduceEvents skips b/c we're in custom mode");
			}
				//testing: what?
			// || data_guest.length ===0
			else if(data_user.length ===0 ){
				var events = jstr(tables['events']);
				console.log("$$events init",events.length);
				EVENTS_VAR(events)
			}
			else{
				var events = jstr(tables['events']);

				//console.log("$$events previous",events);
				console.log("$$events previous",events.length);

				//todo: filter on this later
				var cids = control.metro.map( i => i.id);

				//note: chooose data based on tab
				//todo: used above, should combine

				//console.log("$$data_user",data_user);
				//console.log("$$data_guest",data_guest);

				var dataset = null;

				//note: if single user, skip
				// with valid guest_data from chooseData, use friendscontrol.compare to create dataset

				//testing:
				var artists_user = data_user; var artists_guest = data_guest;

				if(data_guest.length === 0){
					dataset = data_user
					console.log("$$dataset is just data_user");
				}
				else{


					//todo: CHOOSEDATA ALREADY MARKED OWNER/SHARED
					//so wtf is any of this for?

					//note: REF1 produce <genre>:{artists:[]} maps
					//let {map_user,map_guest} = getFriendsMaps(data_user,data_guest)

					//note: REF2 (from what I can tell): use maps to make data w/ shared/owner
					//let {artists_user,artists_guest} = getFriendsArtists(map_user,map_guest)


					//note: REF3 filter dataset based on compare mode

					//testing: force all
					// switch (friendscontrol.compare) {
					switch ('all') {
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
					//console.log("$$dataset set for friends",dataset);
				}


				//todo: preserve data we've already produced (move to before chooseData so it can check this cache)
				//testing: make chooseData produce array n users in length
				var userMapStore = {};
				var chooseDataEx = [{id:"dacandyman01",artists:artists_user}]
				if(data_guest.length > 0){chooseDataEx.push({id:"123028477#2",artists:artists_guest})}

				chooseDataEx.forEach(r =>{
					userMapStore[r.id] = {id:r.id,artists:r.artists}
				})

				// var familyArtist = {};
				// var genreArtist  = {};

				//todo: noooo hold on you can't compare folks if your always in SHARED mode duh
				//need to restore friendscontrol.compare == all versus shared
				//for all, dataset for events filtering stays the same, but now
				//we need to produce a 2nd set of family/genre (pie/drill) values

				// var familyArtistGuest = {};
				// var genreArtistGuest  = {};
				// var familyArtistUser= {};
				// var genreArtistUser  = {};
				// var targets = {
				// 	'user_family':familyArtistUser,
				// 	'user_genre':genreArtistUser,
				// 	'guest_family':familyArtistGuest,
				// 	'guest_genre':genreArtistGuest,
				//
				// }

				//id of every primary artist's related_artist, mapped to the primary
				var relatedArtist = {};
				var allArtist = {};
				var genres = [];

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

				//todo:REFACTOR: I am not understanding what I was doing with targets AT ALL??
				//todo: okkkaay so I really don't remember wtf I was thinking here...

				//note:REF4: create maps
				//note: changed this to also (silently) populate always-shared genres,allArtist

				//dataset is either all (so can be split into users) or just shared
				//I guess idea is to avoid doing this for each user seperately? but why??

				var produceMaps = (dataset) =>{
					var familyArtist = {};
					var genreArtist = {};
					dataset.forEach(r =>{
						if(r.type === 'artist') {
							familyArtist[r.familyAgg] ? familyArtist[r.familyAgg].push(r):familyArtist[r.familyAgg] = [r]
							// if(r.shared){
							// 	debugger;
							// 	targets["user" + "_family"][r.familyAgg] ?	targets["user" + "_family"][r.familyAgg].push(r):	targets["user" + "_family"][r.familyAgg] = [r]
							// 	targets["guest" + "_family"][r.familyAgg] ? 	targets["guest" + "_family"][r.familyAgg].push(r):	targets["guest" + "_family"][r.familyAgg] = [r]
							// }else{
							// 	targets[r.owner + "_family"][r.familyAgg] ? targets[r.owner + "_family"][r.familyAgg].push(r):targets[r.owner + "_family"][r.familyAgg] = [r]
							//
							// }

							if(!(r.genres)){
								debugger;
							}
							r.genres.forEach(g =>{
								genreArtist[g.name] ? genreArtist[g.name].push(r):genreArtist[g.name] = [r]
								// if(r.shared){
								// 	targets["user" + "_genre"][g.name] ? 	targets["user" + "_genre"][g.name].push(r):targets["user" + "_genre"][g.name] = [r]
								// 	targets["guest" + "_genre"][g.name] ? 	targets["guest" + "_genre"][g.name].push(r):targets["guest" + "_genre"][g.name] = [r]
								// }else{
								// 	targets[r.owner + "_genre"][g.name] ? 	targets[r.owner + "_genre"][g.name].push(r):targets[r.owner + "_genre"][g.name] = [r]
								//
								// }

								// if(g.id===88){
								// }
								genres.push(g)
							})
							//allArtist[r] ? allArtist[r] = r:allArtist[r]
							allArtist[r.id] = r
							//processRelated(r)
						}
						//testing: add targets
						else if(r.type === 'playlist' || r.type === 'track' || r.type === 'album'){
							//todo: we're not doing any weighting on the artist's ratio of tracks here
							//so just one song from one genre from one family get in
							r.artists.forEach(a =>{
								familyArtist[a.familyAgg] ? familyArtist[a.familyAgg].push(r):familyArtist[a.familyAgg] = [r]

								//todo: someone is coming back without genres:[] when it has none
								if(!a.genres){console.warn("problem record:",a)}
								else{
									a.genres.forEach(g =>{
										genreArtist[g.name] ? genreArtist[g.name].push(r):genreArtist[g.name] = [r]
										genres.push(g)
									})
								}
								//processRelated(r)
								allArtist[r.id] = r
							})
						}
					});
					return {genreArtist,familyArtist}
				}

				//note: genres, allArtist are needed for events filtering
				//todo: so don't need to be in this loop, recalcing for each user;
				//note: while the genre/family maps for graph data are per user (if compare=all)

				var total = []
				Object.keys(userMapStore).forEach(k =>{
					total = total.concat(userMapStore[k].artists)

					var {genreArtist:uga,familyArtist:fga} = produceMaps(userMapStore[k].artists)
					userMapStore[k]['genreArtist'] = uga;
					userMapStore[k]['familyArtist'] = fga;

				})

				//testing: all together
				var {genreArtist,familyArtist} = produceMaps(total)


				//note:REF5: produce various UI abstractions
				function makeGenreRank(genres){
					//note: think I overmapped this guy but its fine!
					var rankGenresMap = {};
					var rankFamiliyMap = {};
					genres.forEach(gob =>{

						if(friendscontrol.families.length > 0){

							// var f = friendscontrol.families.find(f =>{return f.id === gob.family_id})
							if(friendscontrol.families.indexOf(gob.family_name) !== -1){
								!(rankGenresMap[gob.id]) ? rankGenresMap[gob.id] = [1,gob] :rankGenresMap[gob.id][0]++
							}else{
								//skip this genre which is not in the selected family
							}

						}else{
							!(rankGenresMap[gob.id]) ? rankGenresMap[gob.id] = [1,gob] :rankGenresMap[gob.id][0]++
						}
						!(rankFamiliyMap[gob.family_name]) ? rankFamiliyMap[gob.family_name] = 1 :rankFamiliyMap[gob.family_name]++
						//!(rankGenresMap[gob.id]) ? rankGenresMap[gob.id] = [1,gob] :rankGenresMap[gob.id][0]++
					})

					var arrGenresSorted = []
					var arrFamiliesSorted = []
					if (!(_.isEmpty(rankGenresMap))) {
						//convert map to array and find the max
						var arr = [];
						Object.entries(rankGenresMap).forEach(tup => {
							var r = { occurred:tup[1][0],genre: tup[1][1]};
							arr.push(r);
						});
						arrGenresSorted = _.sortBy(arr, function (r) {
							return r.occurred
						}).reverse()
					}
					if (!(_.isEmpty(rankFamiliyMap))) {
						//convert map to array and find the max
						var arr = [];
						Object.keys(rankFamiliyMap).forEach(k =>{
							arr.push({family_name:k,occurred:rankFamiliyMap[k]});
						})
						arrFamiliesSorted = _.sortBy(arr, function (r) {return r.occurred}).reverse()
					}

					return {arrGenresSorted,arrFamiliesSorted}
				};

				let {arrGenresSorted:newRank,arrFamiliesSorted:newFamRank} = makeGenreRank(genres)
				//console.log("makeGenreRank",newRank);
				CHIPGENRESRANKED(newRank)
				//console.log("makeFamRank",newFamRank);
				CHIPFAMILIESRANKED(newFamRank)

				genres = _.uniqBy(genres,'id')
				console.log("CHIPGENRES",genres);
				//console.log("CHIPGENRES",genres.length);
				// console.log(relatedArtist);

				if(friendscontrol.families.length > 0){
					//console.warn("skip CHIPFAMILIES set");
				}else{
					CHIPFAMILIES(Object.keys(familyArtist))
				}

				CHIPGENRES(genres)

				//==================================================================
				//note:REF6: filter out by date/metro and sort by date

				var debugEvents = false && events.length > 0
				if(debugEvents){
					debugger;
				}
				function byDate(e){
					var validStart = new Date(e.start.datetime) >= control.startDate;
					var validEnd = control.endDate ? (new Date(e.start.datetime) <= control.endDate):true

					return validStart && validEnd
				}
				events = events.filter(e =>cids.indexOf(e.metro_id) !== -1)
					.filter(byDate)
					.sort((e1,e2) =>{return new Date(e1.start.datetime) - new Date(e2.start.datetime) })

				//todo: strange error here when ... my date result returns to little of # of results?
				//noticed when testin large cleveland pull - if my date range was real small it would start to duplicate event entries?
				events = _.sortedUniqBy(events,e =>{return e.id})

				//---------------------------------------------------------------------------------
				//note: series of different filters to apply to events set

				//note: for speed, mark the performances with all possible filtered categories using previously generated maps
				//genreArtist => genre_match
				// relatedArtist => related_match
				// allArtist => exact_match

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

						//for every event > every performance artist > every user that's a friend
						//if that user's global_state includes the artist, the event gets the friend added to an array
						globalUI.user.related_users.filter(r =>{return r.friend}).forEach(f =>{
							if(globalState[f.id + '_artists']){
								globalState[f.id + '_artists'].forEach(fa =>{
									fa.id === a.id ? e.friends.push({user:f,reason:"likes artist"}):{}
								})
							}
							//testing: object type priority short circuit
							//besides keeping the same artist from being tagged multiple times,
							//this will also stop any artist in an event from being tagged after the first

							if(e.friends.length === 0 && globalState[f.id + '_albums']){
								globalState[f.id + '_albums'].forEach(falb =>{
									falb.artists.forEach(falba =>{
										falba.id === a.id ? e.friends.push({user:f,reason:"likes artist's album"}):{}
									})

								})
							}
							if(e.friends.length === 0 && globalState[f.id + '_tracks']){
								globalState[f.id + '_tracks'].forEach(ftrack =>{
									ftrack.artists.forEach(ftracka =>{
										ftracka.id === a.id ? e.friends.push({user:f,reason:"likes artist's track"}):{}
									})
								})
							}
						})
					}
				})


				//====================================================================
				//note: REFACTOR
				//if we're in shared, we only need to produce 1 set of graph datas
				//for all, we need to produce 1 for each user
				//regardless, we would like to only be recalculating what we HAVE to
				//which really means

				//todo: change packages from tinycolor to color (tinycolor didn't have alpha adjustments)
				var getDrilldownData = (fmap,gmap) =>{
					var drilldown = {series:[]};
					Object.keys(fmap).forEach((fname,i) =>{
						var gs = genres.filter(gOb =>{return gOb.family_name === fname});
						var d = []
						var colorMap = {};
						var mult = 3;
						var offset = 20;

						//note: to go from darkest to lightest, we have to lighten 1st half and darken 2nd half
						//higher lighten value = lighter color, so we need to start with lightest color and adjust down
						//for darken, just keep adding since > # = darker color
						var lightest = (gs.length/2)*mult + offset; //largest I
						var adjust = null;
						gs.forEach((g,i) =>{
							adjust = (i*mult)+offset
							if(i <= gs.length/2){
								colorMap[g.name] = tinycolor(familyColors[fname]).lighten(lightest - adjust).toString()
							}
							else{
								//could have just broke this into 2 loops
								//instead we'll just set (i) to inc like it did in lighten clause
								var asi = i-gs.length/2
								adjust = (asi*mult)+offset
								colorMap[g.name] = tinycolor(familyColors[fname]).darken(adjust).toString()
							}
							// console.log(colorMap[g.name] );
						})
						CHIPGENRESCOLORMAP(colorMap)

						//todo: don't feel like this needs to be done for EACH Object.keys(fmap) ?
						//console.log("$colorMap",colorMap);

						gs.forEach((gOb,gi) =>{
							//because genres is the entire list for both users, it's possible
							//the inputed user's map doesn't have an entry for it
							//testing: array format instead of normal objects?? why tho
							//gmap[gOb.name] ? d.push([gOb.name,Object.keys(gmap[gOb.name]).length]):{}

							//todo: set real colors on families, then use tinyColor to set genres based on family color
							//https://github.com/bgrins/TinyColor

							gmap[gOb.name] ? d.push({name:gOb.name,y:Object.keys(gmap[gOb.name]).length,color:colorMap[gOb.name]}):{}

						})
						d.sort((a,b) =>{return  b[1] - a[1]})

						//todo: bandaid (1) (null shouldn't be here)
						//testing: prevent 0 length families
						if(fname !== 'null' && d.length !== 0){
							drilldown.series.push({name:fname,id:fname,data:d})
						}

					})
					return drilldown;
				}

				var producePieData = function(map){
					var destArr = [];
					Object.keys(map).forEach((fam,i) =>{
						//todo: bandaid (2) (null shouldn't be here)
						if(fam !== 'null'){
							destArr.push({name:fam,drilldown:fam,id:familyIdMap[fam],y:map[fam].length,color:familyColors[fam]})
						}
					});
					destArr.sort((a,b) =>{return  b.y - a.y})
					return destArr;
				}

				//todo: going to have to keep repeating this loop for each user
				//b/c all the graph data is dependent on the last :/

				Object.keys(userMapStore).forEach(k =>{
					var u = userMapStore[k];
					var drilldown = getDrilldownData(u.familyArtist,u.genreArtist)
					var pieData = producePieData(u.familyArtist)
					userMapStore[k]['drilldown'] = drilldown;
					userMapStore[k]['pieData'] = pieData;
				})

				// var tempPieDataDrilldown = {series: []}
				// var tempPieDataDrilldownGuest = {series: []}

				// Object.keys(familyArtist).forEach((fname) =>{
				// 	var gs = genres.filter(gOb =>{return gOb.family_name === fname});
				// 	var d = []
				// 	gs.forEach(gOb =>{
				// 		d.push([gOb.name,Object.keys(genreArtist[gOb.name]).length])
				// 	})
				// 	tempPieDataDrilldown.series.push({name:fname,id:fname,data:d})
				// })

				// getDrilldownData(familyArtist,genreArtist,tempPieDataDrilldown)
				// debugger
				// getDrilldownData(familyArtistGuest,genreArtistGuest,tempPieDataDrilldownGuest)
				//====================================================================

				var tempPieData  = [];
				var tempBarData  = [];
				var tempPieDataGuest  = [];

				var produceBarData = function(pieDatas){
					//console.log("produceBarData",pieDatas);
					var tempBarData = []
					//testing: really need to stop getting so ahead of myself when making prototypes!
					//var users = [];users.push(globalUI.user)
					// var friends = globalUI.user.related_users.filter(r =>{return r.friend === true})
					//
					// 	.filter(r =>{return r.id === "123028477#2"})
					// friends.forEach(f =>{
					// 	users.push({...f,...globalState[f.id]})
					// })
					// users = users.concat(globalUI.user.related_users.filter(r =>{return r.friend === true}))

					//testing: going to produce a member for each known family, regardless of whether data is present
					var point = {}
					systemFamilies.forEach(fam =>{
						point = {name:fam,color:familyColors[fam],data:[]};
						var u = {};
						var y = null;
						pieDatas.forEach(pieDob =>{
							var _y = pieDob.data.filter(r =>r.name === fam)[0]?.y;
							y = _y? _y:0
							u = {id:pieDob.id,drilldown:true,y:y}
							point.data.push(u)

						})
						tempBarData.push(point)
					})

					//testing: sorting based on USER (@0 = always USER?)
					//todo: it has come to my attention that there really CAN'T have a different order (between two users)
					//not how the series is layed out - it's like designed to be in tandem...

					tempBarData.sort((r1,r2) =>{return r1.data[0].y - r2.data[0].y})
					return tempBarData
				}

				//console.log("$familyArtist",JSON.parse(JSON.stringify(familyArtist)));
				// producePieData(familyArtist,tempPieData)
				// producePieData(familyArtistGuest,tempPieDataGuest)


				//todo: shortcircuited/hardcoded me and Dan for multiple users in future
				// var temp = [{id:"dacandyman0",data:tempPieData}]
				// tempPieDataGuest.length > 0 ? temp.push({id:"123028477#2",data:tempPieDataGuest}):{};

				//todo: I started aiming towards 'only produce 1 bar data for all users'
				//but this makes sense I think...
				//b/c the pieData would be shown on two seperate graphs versus this one bar graph

				var temp = [];

				Object.keys(userMapStore).forEach(k =>{
					var u = userMapStore[k];
					//userMapStore[k].barData =[];
					temp.push({id:u.id,data:u.pieData})
				})

				//todo: might be destroying this pieData within produceBarData
				tempBarData = produceBarData(temp)

				//testing: force one of USER's family values
				//tempBarData[tempBarData.length -1]['data'][0].y = 78

				//====================================================================

				const produceBarDrillData = (drilldatas,barDrillMap) =>{
					//testing: like families above, we'll define for both users any existing genre
					systemFamilies.forEach(fam =>{
						barDrillMap[fam] = [];
						// point = {name:fam,color:familyColors[fam],data:[]};
						var gSet = genres.filter(r =>{return r.family_name === fam})
						gSet.forEach(g =>{
							//todo: don't know shit about colors yet
							var gPoint = {name:g.name,color:null,dataLabels:
									{formatter: function() {return g.name}},data:[]}
							var ugPoint = null;
							drilldatas.forEach(userDrillOb =>{

								ugPoint= {label:g.name,y:0}
								ugPoint.name = userDrillOb.id;
								//look for this fam's series
								var fData = userDrillOb.data.series.filter(r => r.name === fam)[0]
								if(fData?.data){
									var _g = fData.data.filter(r => r.name === g.name)[0]
									if(_g){ugPoint.y = _g.y;}
								}
								gPoint.data.push(ugPoint)
							})
							barDrillMap[fam].push(gPoint)
						})
						//testing: (see above sort in produceBarData)
						barDrillMap[fam].sort((r1,r2) =>{return r1.data[0].y - r2.data[0].y})
					})
				}

				var tempBarDrillMap = {};
				//todo: shortcircuited/hardcoded me and Dan for multiple users in future
				// var temp2 = [{id:"dacandyman0",data:tempPieDataDrilldown}]
				// tempPieDataDrilldownGuest.series.length > 0 ? temp2.push({id:"123028477#2",data:tempPieDataDrilldownGuest}):{};

				var temp2 = [];

				Object.keys(userMapStore).forEach(k =>{
					var u = userMapStore[k];
					//userMapStore[k].barData =[];
					temp2.push({id:u.id,data:u.drilldown})
				})

				produceBarDrillData(temp2,tempBarDrillMap)

				//====================================================================


				//console.log("prevBarUsersNum",tempBarData[0]?.data.length + " | " + prevBarUsersNum);

				//testing: stop setting when I don't need to
				if(tempBarData[0]?.data.length !== prevBarUsersNum){

					prevBarUsersNum = tempBarData[0]?.data.length
					console.log("$tempBarData",JSON.parse(JSON.stringify(tempBarData)));
					BARDATA(tempBarData)
					console.log("$tempBarDrillMap",tempBarDrillMap);
					BARDRILLDOWNMAP(tempBarDrillMap)

				}
				prevBarUsersNum === null? prevBarUsersNum = tempBarData[0]?.data.length:{};

				//todo: why am I not producing this above?
				//like genres, allArtist

				var temp_combined_genreArtist  = {};

				if(Object.keys(userMapStore).length === 1){
					temp_combined_genreArtist = userMapStore[Object.keys(userMapStore)[0]].genreArtist;
				}
				else{
					Object.keys(userMapStore).forEach(k =>{
						var u = userMapStore[k];
						//for every user
						Object.keys(u.genreArtist).forEach(gName =>{
							//if our combined object doesn't have an entry, make an empty 1
							if(!(temp_combined_genreArtist[gName])){temp_combined_genreArtist[gName] = []}

							//for every artist @ key = gName
							u.genreArtist[gName].forEach(a =>{
								var foundArtist =_.find(temp_combined_genreArtist[gName], {id:a.id});
								!(foundArtist)? temp_combined_genreArtist[gName].push(a):{};
							})
						})

					})

					//var temp_user = JSON.parse(JSON.stringify(genreArtistUser))
					// Object.keys(genreArtistGuest).forEach(gName =>{
					//
					// 	//if temp_user doesn't have a genre that guest did, make a key entry for it
					// 	if(!(temp_user[gName])){temp_user[gName] = []}
					//
					// 	//for every artist @ key = gName
					// 	genreArtistGuest[gName].forEach(a =>{
					// 		var foundArtist =_.find(temp_user[gName], {id:a.id});
					// 		!(foundArtist)? temp_user[gName].push(a):{};
					// 	})
					// })
					// temp_combined_genreArtist = temp_user
				}

				console.log("$temp_combined_genreArtist",temp_combined_genreArtist);
				CHIPGENRESCOMBINEDMAP(temp_combined_genreArtist)


				//todo: looks like I've set the state correctly but it fucks up
				//testing: on context change, need to toggle on allowChartUpdate
				// piecontrol.setAllowUpdate(true)

				//todo: disabling all pie/drilldown data state mgmt

				// if(lastTab !== tabcontrol.tab){
				// 	lastTab = tabcontrol.tab;
				//
				// 	console.log("$CONTEXT SWITCH");
				// 	console.log("$PIEDATA",tempPieData);
				// 	PIEDATA(tempPieData)
				//
				// 	console.log("$PIEDATADRILLDOWN",tempPieDataDrilldown);
				// 	PIEDATADRILLDOWN(tempPieDataDrilldown)
				//
				// 	console.log("$PIEDATAGUEST",tempPieDataGuest);
				// 	PIEDATAGUEST(tempPieDataGuest)
				//
				// 	console.log("$PIEDATADRILLDOWNGUEST", tempPieDataDrilldownGuest);
				// 	PIEDATADRILLDOWNGUEST(tempPieDataDrilldownGuest)
				//
				// }else{
				// 	if(piedata.length === 0 ){
				// 		console.log("$INIT");
				// 		console.log("$PIEDATA",tempPieData);
				// 		PIEDATA(tempPieData)
				// 	}else{
				// 		console.log("skip tempPieData");
				// 	}
				// 	if(piedatadrilldown.series.length === 0 ){
				// 		console.log("$PIEDATADRILLDOWN",tempPieDataDrilldown);
				// 		PIEDATADRILLDOWN(tempPieDataDrilldown)
				// 	}else{
				// 		console.log("skip tempPieDataDrilldown");
				// 	}
				//
				// 	if(piedataguest.length === 0 ){
				// 		console.log("$PIEDATAGUEST",tempPieDataGuest);
				// 		PIEDATAGUEST(tempPieDataGuest)
				// 	}else{
				// 		console.log("skip tempPieData");
				// 	}
				// 	if(piedatadrilldownguest.series.length === 0 ){
				// 		console.log("$PIEDATADRILLDOWNGUEST",tempPieDataDrilldownGuest);
				// 		PIEDATADRILLDOWNGUEST(tempPieDataDrilldownGuest)
				// 	}else{
				// 		console.log("skip tempPieDataDrilldown");
				// 	}
				// }



				//todo: probably b/c of this timeout i'd imagine
				//testing: then back to normal render-ignoring state
				// setTimeout(e =>{
				// 	piecontrol.setAllowUpdate(false)
				// },1000)


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


				if(debugEvents){
					debugger;
				}

				if(friendscontrol.genres.length > 0){
					console.log("$$friendscontrol.genres overrides genreSens",friendscontrol.genres);
					events = events.filter(e =>{
						var some = false;
						for(var x = 0; x < e.performance.length;x++) {
							var a = e.performance[x].artist;
							for (var y = 0; y < a.genres.length; y++) {
								//testing: indexOf works?
								// if(e.id === 39775914){

								// }
								// if (friendscontrol.genres.indexOf(a.genres[y]) !== -1) {
								// _.find returns the FIRST element predicate returns truthy for
								//this is okay here where we just need to make sure at least one is found
								var f = _.find(friendscontrol.genres, function(o) { return o.id === a.genres[y].id });
								if (f) {
									// console.log(a.genres[y].name);
									a.useSelectedGenreMatch = true;
									some = true;
									break;
								}
							}
							if (some === true) {break;}
						}

						return some;
					})
				}
				else if(friendscontrol.families.length > 0){
					console.log("$$friendscontrol.families overrides genreSens",friendscontrol.families);
					events = events.filter(e =>{
						var some = false;
						for(var x = 0; x < e.performance.length;x++) {
							var a = e.performance[x].artist;
							if (friendscontrol.families.indexOf(a.familyAgg) !== -1) {
								//todo: where am I using this flag? is it just here for completeness
								//(like every present event should have a reason why it was matched to active dataset_
								a.useSelectedFamilyMatch = true;
								some = true;
								break;
							}
							if (some === true) {break;}
						}

						return some;
					})
				}else{
					if(debugEvents){
						debugger;
					}
					events = events.filter(e =>{
						var some = false;
						for(var x = 0; x < e.performance.length;x++) {
							var a = e.performance[x].artist;

							//todo: disabled sensitivity selection for now (defaults to 'related')
							if(control.genreSens === 'exact'){
								if(a.genre_match.length > 0){
									a.useExactGenreMatch = true;
									some = true;break;
								}
							}else if(control.genreSens === 'related'){
								//if the familyAgg of any of the performances has been alluded to in familyArtist, we keep it
								if(Object.keys(familyArtist).indexOf(a.familyAgg) !== -1) {
									a.useRelatedGenreMatch = true;
									some = true;
									break;
								}else{
									if(debugEvents){console.log("no fam match",a);}
								}
							}
						}
						return some
					})
				}

				if(debugEvents){
					debugger;
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
				if(debugEvents){
					debugger;
				}

				//---------------------------------------------------------------------------------

				//console.log("$$events",jstr(events));
				// console.log("$$events updated",events);
				console.log("$$events updated",events.length);
				EVENTS_VAR(events)

			}//else in context mode
		},
		[statcontrol.stats.name,statcontrol.mode,
			friendscontrol.compare,friendscontrol.families,friendscontrol.genres,friendscontrol.selectedTabIndex,friendscontrol.sourceFilter,friendscontrol.checkboxes,friendscontrol.query,
			control.metro,control.startDate,control.endDate,control.genreSens,control.artistSens,control.dataLoaded
		]
	)

}


//todo: pretty much cancels the drilldown animation :/

// function useTestPieEvent(){
//
// 	let friendscontrol = FriendsControl.useContainer()
// 	var piecontrol = PieControl.useContainer()
//
// 	var ignored = {value:"ignored"}
// 	return {ignored}
// }

function useTestBubbles(){
	let tabcontrol = TabControl.useContainer();
	const [data, setData] = useState(data1);
	useEffect(() => {
		console.log("useTestBubbles | setData ");
		setData(data1)
	},[tabcontrol.data]);
	return {data}
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
	familyFreq,makeRank,makeRank2,useProduceData,useProduceEvents,useTestBubbles
}
