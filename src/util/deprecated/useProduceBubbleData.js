/* eslint-disable no-unused-expressions */
import {useContext, useEffect, useRef, useState} from "react";
import {Context} from "../../storage/Store";
import {FriendsControl, StatControl, TabControl} from "../../index";
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR, STATS, TILES} from "../../storage/withApolloProvider";
import {families as systemFamilies, familyColors, familyIdMap} from "../families";
import _ from "lodash";
import tables from "../../storage/tables";
const uuid = require('react-uuid')

//todo: ripped out of util.js after I stopped using the bubbles
//so no gurantee this still works, but abstraction logic to bubble data should always be g2g right?


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

	var queryFilter2 = (t) =>{

		if(friendscontrol.query === ""){return true}else{
			//console.log("$$user",t);
			//console.log("$q",friendscontrol.query);
			var pat = "^" + friendscontrol.query.toLowerCase();
			var re = new RegExp(pat,"g");

			var toTest = t['name'].toLowerCase().split(" ")
			// _.get(object, 'a[0].b.c');

			switch (t.type) {
				case 'track':
					t.artists.forEach(a =>{
						toTest = toTest.concat(a.name.toLowerCase().split(" "))
					})
					toTest = toTest.concat(t.album.name.toLowerCase().split(" "))
					break;
				case 'album':
					t.artists.forEach(a =>{
						toTest = toTest.concat(a.name.toLowerCase().split(" "))
					})
					break;
				case 'artist':
					break;
			}

			toTest = _.uniq(toTest)
			//console.log("toTest",toTest);
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

//todo: in every case, null familyAgg doesn't quite make sense?
// think this was a notee to myself that I was getting some nulls that shouldn't be there?

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

function useProduceBubbleData(){
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
	const [bubbleData, setBubbleData] = useState([]);



	useEffect(() => {
		//useProduceData
		var tempPieData = [];

		console.log("useProduceBubbleData",statcontrol.stats.name);
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


		let map_user= null
		let map_guest= null
		if(objectType === 'album' ||objectType === 'track'){
			let {map_user:map_userr,map_guest:map_guestr} = getFriendsItemMaps(data_user,data_guest)
			map_user = map_userr;map_guest = map_guestr
		}else{
			let {map_user:map_userr,map_guest:map_guestr} = getFriendsMaps(data_user,data_guest)
			map_user = map_userr;map_guest = map_guestr
		}


		// console.log("map_user",map_user);
		// console.log("map_guest",map_guest);

		//console.log("$assign",Object.assign(map_user,map_guest));
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
					tempPieData.push({name:fam,id:familyIdMap[fam],y:Object.keys(map[fam][key]).length})

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

		var produceBubbleDataFriendsAlbums = function(map){

			var missingFamilyAgg = 0;
			Object.keys(map).forEach(fam =>{
				missingFamilyAgg = missingFamilyAgg + Object.keys(map[fam].items).length
			})
			console.error("produceBubbleDataFriendsAlbums missingFamilyAgg:",missingFamilyAgg + "/" + _tiles.length);

			Object.keys(map).forEach(fam =>{

				var series = _.find(bubbleData, function(o) { return o.name === fam });
				series.data = []
				Object.keys(map[fam].items).forEach(aname =>{
					series.data.push({name:aname, value:scale[0], color:familyColors[fam]})

					// if(mode === 'shared'){
					// 	if(map[fam].items[aname].length > 1){
					// 		series.data.push({name:aname,
					// 			value:scale[map[fam].items[aname].length -1 ],
					// 			color:familyColors[fam]
					// 		})
					// 	}
					// }else{
					// 	series.data.push({name:aname,
					// 		value:scale[map[fam].items[aname].length -1 ],
					// 		color:familyColors[fam]
					// 	})
					// }
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

				var missingFamilyAgg = 0;
				arr.forEach(a =>{
					//todo: how many records don't have familyAgg??
					if(!(a.familyAgg)){
						missingFamilyAgg++
						//console.warn("record with no familyAgg",a)
					}else{
						var series = _.find(bubbleData, function(o) { return o.name === a.familyAgg });

						series.data.push({name:a.name, value:scale[0],
							color:familyColors[a.familyAgg],owner:a.owner
							//testing: disabled color labels based on owner
							//works only for artists rn - didn't see point in this feature so just disabled here
							// ,className:getClassName(a)
						})
					}
				});
				console.error("produceBubbleDataFriendsArtists missingFamilyAgg:",missingFamilyAgg + "/" + arr.length);
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
			case "artists_saved":
				producePieData(map_user,'artists')
				//produceBubbleDataArtists(map_user)
				// _tiles = au.filter(tileFilter)
				_tiles = au
				break;
			case "albums_saved":
			case "tracks_recent":
			case "tracks_saved":
				producePieData(map_user,'items')
				//produceBubbleDataArtists(map_user)
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


				//console.log("friendscontrol.compare",friendscontrol.compare);

				//based on friendscontrol.compare settings, provide bubble producer with sensible array to process

				const makeCombinedMap = (map_user,map_guest,mode) =>{

					//pick fams that exist in both maps
					var combinedMap = {}

					if(mode === 'shared'){
						var keys = _.intersection(Object.keys(map_user),Object.keys(map_guest));
						keys = _.uniq(keys)
						keys.forEach(k =>{
							combinedMap[k] = {items:null}
							var muobs = Object.keys(map_user[k].items).map((key) => map_user[k].items[key][0]);
							var mgobs = Object.keys(map_guest[k].items).map((key) => map_guest[k].items[key][0]);
							var comb = _.intersectionBy(muobs,mgobs,'id')
							var remap = {};
							comb.forEach(item =>{remap[item.name] =item})
							combinedMap[k].items = remap
						})
					}else{
						var keys = _.uniq(Object.keys(map_user).concat(Object.keys(map_guest)));
						keys.forEach(k =>{
							combinedMap[k] = {items:null}
							var muobs = [];
							map_user[k] ? muobs = Object.keys(map_user[k].items).map((key) => map_user[k].items[key][0]):{};
							var mgobs = [];
							map_guest[k] ? mgobs = Object.keys(map_guest[k].items).map((key) => map_guest[k].items[key][0]):{};
							var comb = _.uniqBy(muobs.concat(mgobs),'id')
							var remap = {};
							comb.forEach(item =>{remap[item.name] =item})
							combinedMap[k].items = remap
						})
					}

					console.log("combinedMap",combinedMap);

					return combinedMap;
				}

				switch (friendscontrol.compare) {
					case 'all':
						//tempPieData = [];
						// if(data_user[0].type === ('album' || 'track')){
						if(objectType === 'album' ||objectType === 'track'){

							_tiles = _.uniqBy(data_user.concat(data_guest), 'id')

							var map = makeCombinedMap(map_user, map_guest,'all');
							produceBubbleDataFriendsAlbums(map, 'all')

						} else {
							var uniqAll = _.uniqBy(au.concat(ag), 'id')
							produceBubbleDataFriendsArtists(uniqAll)
							_tiles = uniqAll
						}
						//producePieData(map_guest,'artists','all')
						break;
					//	todo:
					case 'diff':
						//var uniqAll = _.uniqBy(au.concat(ag),'id')
						break;
					case 'shared':
						tempPieData = [];

						// producePieData(_shared,'artists','shared')
						if(objectType === 'album' ||objectType === 'track'){

							_tiles = _.uniqBy(data_user.concat(data_guest), 'id').filter(r => {return r.shared})
							produceBubbleDataFriendsAlbums(makeCombinedMap(map_user, map_guest,'shared'))

						} else {
							var _shared = _.uniqBy(au.concat(ag), 'id').filter(r => {return r.shared})
							produceBubbleDataFriendsArtists(_shared)
							_tiles = _shared
						}

						break;
					case 'user':
						_tiles = au

						if(objectType === 'album' ||objectType === 'track'){
							produceBubbleDataFriendsAlbums(map_user,null)
						} else {
							produceBubbleDataFriendsArtists(au)
						}

						break;
					case 'guest':
						_tiles = ag

						if(objectType === 'album' ||objectType === 'track'){
							produceBubbleDataFriendsAlbums(map_guest,null)
						} else {
							produceBubbleDataFriendsArtists(ag)
						}
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

		//testing
		bubbleData = bubbleData.filter(r =>{return !(r.data.length === 0)})

		//bubbleData.forEach(s =>{s.animationLimit = 5})
		//console.log("$bubbleData",bubbleData);


		//================================================
		//todo: expand on stats collection concept

		var _stats = {};
		var max = null

		bubbleData.forEach(s =>{
			max === null ? max = s:{};
			s.data.length > max.data.length ? max = s:{}
		})

		_stats.max = max;
		STATS(_stats);

		setBubbleData(bubbleData);

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
		friendscontrol.selectedTabIndex,friendscontrol.sourceFilter,friendscontrol.checkboxes,friendscontrol.query]);

	//todo: add back highlighter
	//highlighter.hoverState,
	//todo: previously was detecting node changes
	//JSON.stringify(globalState.node)]



	//console.log("returns",{bubble:bubbleData,pie:pieData,genres:genres});
	return {bubbleData:bubbleData}
}

export default useProduceBubbleData
