/* eslint-disable no-unused-expressions */
import React, {useContext, useEffect,useState} from 'react';
import api from "../api/api.js"
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR} from "../storage/withApolloProvider";
import {Context, initUser} from "../storage/Store";
import {Control, StatControl, TabControl} from "../index";
import exampleFetchEvents from '../data/example/fetchEvents'
import tables from "../storage/tables";
//import {tabMap} from "../Tabify";
// import dan2_example from '../data/example/DanielNiemiec#2'

function Dispatch(props) {

	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	const [globalState, globalDispatch] = useContext(Context);
	const [count, setCount] = useState(0);

	let control = Control.useContainer();
	let statcontrol = StatControl.useContainer();
	let tabcontrol  = TabControl.useContainer();
	let req = {auth:globalUI};

	async function asyncDispatch() {
		console.log("START DISPATCH");
		try{
			//===============================================================
			//profile and library building

			//figure out if we've seen this user before - if so this'll do a quick fetch, if not we're going to resolve and then store
			//note: param name = friend, b/c mostly used to fetch them
			var me = await api.fetchStaticUser({auth:globalUI,friend: globalUI.user})

			globalUI.user.related_users = me.related_users

			//todo go thru init user process (debug in Reducer.js to see other bits laying about)
			//mainUser,tables.users?,guest
			initUser(globalUI.user);

			// var artistsPay = [];
			// artistsPay = artistsPay.concat(r[0]).concat(r[1].artists);

			//testing: (1) replace with actual playlists call
			globalDispatch({type: 'init', payload:{playlists:[]},user: globalUI.user,context:'playlists'});

			globalDispatch({type: 'updateUser', payload:me.playlistsTracked,user: globalUI.user,context:'playlistsTracked'});

			globalDispatch({type: 'init', payload:me.tracks,user: globalUI.user,context:'tracks'});

			globalDispatch({type: 'init', payload:{artists:me.artists.artists,stats:null},user: globalUI.user,context:'artists'});



			//testing: as soon as artists is here, set it as default
			statcontrol.setStats(tabcontrol.section === 2 ? {name:'artists_friends'}:{name:'artists_saved'})

			globalDispatch({type: 'init', payload:me.albums,user: globalUI.user,context:'albums'});

			//testing: moved this to just after the (hopefully) quick loading stuff
			control.setDataLoaded(true)
			//note: to keep init payload signatures consistent, I reconstruct it below
			//followedArtists: 			{stats:null,artists:[]}
			//getTopArtists : 			[]
			//getRecentlyPlayedTracks:	[]
			//getSavedTracks:			{stats:{},tracks:[]}
			//getSavedAlbums:			{stats:{},albums:[]}

			// var fpr = await api.fetchPlaylistsResolved(req)
			// console.log("r.stat",fpr.stats);
			// globalDispatch({type: 'init', payload: fpr,user: globalUI.user,context:'playlists'});



			//testing: old individual api calls
			// var userProms = [];
			// var fake =  function(){
			// 	return new Promise(function(done, fail) {
			// 		done([])
			// 	})
			// }
			//todo: re-enable (thought I fixed in backend already?)
			// userProms.push(api.getTopArtists(req))
			// userProms.push(fake(req))
			// userProms.push(api.getMyFollowedArtists(req))
			// userProms.push(api.getMySavedAlbums(req))
			// var r = await Promise.all(userProms)


			//===============================================================
			//testing: getSavedTracks - but  not recentlyPlayed - as a separate step from fetchuser
			var userProms2 = [];
			//userProms2.push(api.getRecentlyPlayedTracks(req))
			userProms2.push(api.getSavedTracks(req))
			let r2 = await Promise.all(userProms2)

			var tracksPay = {tracks:[]};
			tracksPay.tracks = tracksPay.tracks.concat(r2[0].tracks);
			//tracksPay.tracks = tracksPay.tracks.concat(r2[1].tracks);
			tracksPay.stats = r2[0].stats

			globalDispatch({type: 'init', payload:tracksPay,user: globalUI.user,context:'tracks'});

			//===============================================================
			//events and users



			console.log("ONE TIME EVENT FETCH");
			//testing: static data to eval marking w/ friends
			var fer = await api.fetchEvents({metros:control.metro})
			//var fer = exampleFetchEvents;
			console.log(api.getEventsCoverage(fer,'hasFamily'));

			//testing:
			//fer = fer.slice(0,50)
			globalDispatch({type: 'update_events', payload: fer,context:'events', control:control});

			var metros = await api.fetchMetros()
			globalDispatch({type: 'init', payload: metros,context:'metros', control:control});
			var defaultMetro = {"displayName":"Columbus", "id":9480,abbr:"CBUS"}
			control.selectMetro(defaultMetro)



			// var NEVER =  function(){
			// 	return new Promise(function(done, fail) {
			// 		console.log("NEVER!!!!!!!");
			// 		setTimeout(e =>{
			// 			done()
			// 		},1000000000000)
			// 	})
			// }
			// await NEVER()

			//===============================================================
			//fetch friends profiles + global users

			var friendsProms = [];
			friendsProms.push(api.fetchSpotifyUsers({auth:globalUI}))

			//testing:
			//var fake =  function(){
			// 	return new Promise(function(done, fail) {
			// 		done(dan2_example)
			// 	})
			// }

			//testing: for now, anyone who is user gets fetched ahead of time
			//globalUI.user.related_users.filter(r =>{return r.friend})
			globalUI.user.related_users.filter(r =>{return r.isUser})
				//testing: Dan only
				 //.filter(r =>{return r.id === "123028477"})
				//.filter(r =>{return r.id !== "123028477"})
				// .filter(r =>{return r.id === "123028477#2"})
			 // .filter(r =>{return r.display_name !== "Dustin Reinhart"})
				.forEach(f =>{
					//testing: using example response on fetchStaticUser
					friendsProms.push(api.fetchStaticUser( {auth:globalUI,friend:f}))
					//friendsProms.push(fake())
				})
			console.log("setStatic...",friendsProms.length);
			var frpr = await Promise.all(friendsProms)

			//console.log("setStatic users fetched",fpr.length);
			globalDispatch({type: 'init', payload:frpr[0],user: globalUI.user,context:'spotifyusers'});


			var users = frpr.slice(1,frpr.length)
			//var users =[]
			users.forEach(r =>{
				initUser(r);
				//note:  have to read the type key off the tuple, which itself is a tuple w/ {typekey:[obs],stats:{stats}}
				//note: artists follows this pattern even though it has no stats
				globalDispatch({type: 'init', user:{id:r.id},payload:r.artists,context:'artists'});
				globalDispatch({type: 'init', user:{id:r.id},payload:r.tracks,context:'tracks'});
				globalDispatch({type: 'init', user:{id:r.id},payload:r.albums,context:'albums'});


				//testing: (1) replace with actual playlists call
				globalDispatch({type: 'init', payload:{playlists:[]},user:{id:r.id},context:'playlists'});
			})

			console.log("setStatic users",users.length);

			//===============================================================
			//testing: call tracks after

			// var userProms2 = [];
			// userProms2.push(api.getRecentlyPlayedTracks(req))
			// userProms2.push(api.getSavedTracks(req))
			// let r2 = await Promise.all(userProms2)
			//
			// var tracksPay = {tracks:[]};
			//
			// //todo: what is this getRecentlyPlayedTracks = {tracks:[],artists:[]} ARTISTS here?
			// tracksPay.tracks = tracksPay.tracks.concat(r2[0].tracks);tracksPay.tracks = tracksPay.tracks.concat(r2[1].tracks);
			// tracksPay.stats = r2[1].stats
			//
			// globalDispatch({type: 'init', payload:tracksPay,user: globalUI.user,context:'tracks'});
			//===============================================================

			return "asyncDispatch finished";
		}catch(e){
			console.error("asyncDispatch failure",e);
		}
	}

	useEffect(() => {

		if( !(globalState[globalUI.user.id + "_artists"]) || globalState[globalUI.user.id + "_artists"].length === 0) {
			//setCount(1)
			asyncDispatch()
				.then(r => {
					console.log(r);
					return r
				})
		}
		// if(count === 0) {
		// 	setCount(1)
		// 	asyncDispatch()
		// 		.then(r => {
		// 			console.log(r);
		// 			return r
		// 		})
		// }
		//else{console.log("SKIP DISPATCH");}
	},[]);


	return <div></div>

	// return{result:"dispatch complete"}
}
export default Dispatch;
