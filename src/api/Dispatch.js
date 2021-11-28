import React, {useContext, useEffect,useState} from 'react';
import api from "../api/api.js"
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR} from "../storage/withApolloProvider";
import {Context, initUser} from "../storage/Store";
import {Control} from "../index";
import exampleFetchEvents from '../data/example/fetchEvents'
import dan2_example from '../data/example/DanielNiemiec#2'

function Dispatch(props) {

	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	const [globalState, globalDispatch] = useContext(Context);
	const [count, setCount] = useState(0);

	let control = Control.useContainer();

	let req = {auth:globalUI};

	async function asyncDispatch() {
		console.log("START DISPATCH");
		try{

			//===============================================================
			//events and users



			console.log("ONE TIME EVENT FETCH");
			//testing: wtf is wrong with this now
			//var fer = await api.fetchEvents({metros:control.metro})
			var fer = exampleFetchEvents;
			//testing:
			//fer = fer.slice(0,50)
			globalDispatch({type: 'update_events', payload: fer,context:'events', control:control});

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
			//library

			// var fpr = await api.fetchPlaylistsResolved(req)
			// console.log("r.stat",fpr.stats);
			// globalDispatch({type: 'init', payload: fpr,user: globalUI.user,context:'playlists'});


			var userProms = [];
			userProms.push(api.getTopArtists(req))
			userProms.push(api.getMyFollowedArtists(req))
			//userProms.push(api.getRecentlyPlayedTracks(req))
			// userProms.push(api.getSavedTracks(req))

			//testing: why the fuck is everything so slow / bombing again? :(
			 userProms.push(api.getMySavedAlbums(req))
			var r = await Promise.all(userProms)

			//all these artist's have 'sources' so they all end up in here together
			//note: to keep init payload signatures consistent, I reconstruct it below
			//note: stats:
			//followedArtists: 			{stats:null,artists:[]}
			//getTopArtists : 			none
			//getRecentlyPlayedTracks:	none
			//getSavedTracks:			{stats:{},tracks:[]}
			//getSavedAlbums:			{stats:{},albums:[]}
			var artistsPay = [];
			artistsPay = artistsPay.concat(r[0]).concat(r[1].artists);


			globalDispatch({type: 'init', payload:{artists:artistsPay,stats:null},user: globalUI.user,context:'artists'});
			 globalDispatch({type: 'init', payload:r[2],user: globalUI.user,context:'albums'});
			//control.setDataLoaded(true)


			//===============================================================
			//testing: call tracks before staticFetch

			var userProms2 = [];
			userProms2.push(api.getRecentlyPlayedTracks(req))
			userProms2.push(api.getSavedTracks(req))
			let r2 = await Promise.all(userProms2)

			var tracksPay = {tracks:[]};

			//todo: what is this getRecentlyPlayedTracks = {tracks:[],artists:[]} ARTISTS here?
			tracksPay.tracks = tracksPay.tracks.concat(r2[0].tracks);tracksPay.tracks = tracksPay.tracks.concat(r2[1].tracks);
			tracksPay.stats = r2[1].stats

			globalDispatch({type: 'init', payload:tracksPay,user: globalUI.user,context:'tracks'});

			//===============================================================
			//fetch friends profiles + global users

			var friendsProms = [];
			friendsProms.push(api.fetchSpotifyUsers({auth:globalUI}))

			var fake =  function(){
				return new Promise(function(done, fail) {
					done(dan2_example)
				})
			}

			globalUI.user.related_users.filter(r =>{return r.friend})
				//testing: Dan only
				 //.filter(r =>{return r.id === "123028477"})
				//.filter(r =>{return r.id !== "123028477"})
				.filter(r =>{return r.id === "123028477#2"})
			 // .filter(r =>{return r.display_name !== "Dustin Reinhart"})
				.forEach(f =>{
					//testing: using example response on fetchStaticUser
					//friendsProms.push(api.fetchStaticUser( {auth:globalUI,friend:f}))
					friendsProms.push(fake())
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
		//todo: somehow still don't understand how to call functional code w/out linkage to fucking render state

		if(globalState[globalUI.user.id + "_artists"].length === 0) {
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
