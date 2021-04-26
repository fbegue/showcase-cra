import {ApolloClient, gql, InMemoryCache,createHttpLink, makeVar} from "@apollo/client";
import {ApolloProvider, useReactiveVar} from "@apollo/react-hooks";
import React from "react";
import { persistCache } from "apollo3-cache-persist";
import localforage from 'localforage'
import {DateTime} from "luxon";

//-----------------------------------------------------
//node init

var idmap = {
	agg:0,
	saved:1,
	top:2,
	artistSearch:3,
	playlists:4,
}

let nodes = [];
var sources = ['top','saved','agg','playlists','recent']
var sourceLabel = {'top':"Top Artists",
	'saved':"Saved Artists",
	'agg':"Aggregate",
	'playlists': "Playlists",
	'recent':"Recently Played"}

//subset of sources that a guest can have
var sources_subset = ['top','saved','playlists','recent']

sources.forEach(s =>{
	nodes.push({id:idmap[s],name:s,label:sourceLabel[s],data:[]})
})

//todo: get users from elsewhere / create initNodes function

var guest = {id:"123028477",name:"Dan"};
var user = {id:'dacandyman01',name:"Franky"};

sources_subset.forEach(s =>{
	nodes.push({id:idmap[s] + 99,name:guest.id + "_" + s,data:[]})
	nodes.push({id:idmap[s] + 99,name:user.id + "_" + s,data:[]})
})

//-----------------------------------------------------

//export const GLOBAL_STATE_VAR = makeVar(initialState);
export const NODES_STATE_VAR = makeVar({agg:[],saved:[]});
export const GLOBAL_UI_VAR = makeVar({access_token:false,refresh_token:false,expiryTime:null,user:null});
export const TILES = makeVar([]);
export const EVENTS_VAR = makeVar([]);
export const NODES_VAR = makeVar(nodes);



//testing: set on page refresh from localstorage
const params = JSON.parse(localStorage.getItem('params'));
const expiryTime = localStorage.getItem('expiryTime');
console.log("PROVIDER | localStorage:",params);
console.log("PROVIDER | localStorage:",expiryTime);
var validAfterNow = DateTime.fromISO(new Date().toISOString()) < DateTime.fromISO(expiryTime)
if(params && expiryTime && validAfterNow){
	console.log("PROVIDER | setting previous localStorage values");
	GLOBAL_UI_VAR({access_token:params.access_token,refresh_token:params.refresh_token,user:params.user,expiryTime:expiryTime})
}else{
	console.log("PROVIDER | found stale localStorage values, no setting occurred");
}

// console.log("getAuth:",r);
// //testing: just going to double-dose this stuff
// //would rather not be relying on local storage reads I guess?
// GLOBAL_UI_VAR({access_token:r.access_token,refresh_token:r.refresh_token,user:r.user})
// localStorage.setItem('params', JSON.stringify({access_token:r.access_token,refresh_token:r.refresh_token,user:r.user}));
// //debugger;
//
// const expiryTime = new Date(new Date().getTime() + r.expires_in * 1000);
// localStorage.setItem('expiryTime', expiryTime.toISOString());





// export const GLOBAL_STATE_VAR = makeVar({node:[{id:1,name:"agg",data:[]}]});

export const config = {};


const cacheTest = new InMemoryCache({});

//note: Gatsby issue - need to explicitly define your fetch mechanism
//also might pop up while using apollo-boost so keep an eye out on those imports
//https://stackoverflow.com/questions/64362315/gatsby-webpackerror-invariant-violation-error-with-apolloclient

let apolloClient = {};
let store = {};

async function asyncCall() {

  await localforage.ready().then(() => {
    //store = localforage.createInstance();
    //

    // console.log("clearing apollo cache");
    // localforage.clear();
    localforage.setItem("keyTest", "valueTest");
    // store.setItem("key");

    // localforage.setItem('key', 'value').then(function () {
    //   return localforage.getItem('key');
    // }).then(function (value) {
    //   // we got our value
    // }).catch(function (err) {
    //   // we got an error
    // });

    persistCache({
		cacheTest,
      storage:localforage,
    }).then(() => {
      apolloClient = new ApolloClient({
       // link,
        //uri: 'http://localhost:4000/graphql',
        //uri: "https://graphqlzero.almansi.me/api",
        cache:cacheTest,

        //typeDefs,
      })
    })
  }).catch(() => {
    // ...
  });

  // console.log("store",store);
  // await persistCache({
  //   cache,
  //   storage:store,
  // })
  // apolloClient = new ApolloClient({
  //   link,
  //   uri: 'http://localhost:4000/graphql',
  //   //uri: "https://graphqlzero.almansi.me/api",
  //   cache:cache,
  //   typeDefs,
  // })
}
asyncCall();


// .then(() => {
//   // Continue setting up Apollo as usual.
//   apolloClient = new ApolloClient({
//     link,
//     uri: 'http://localhost:4000/graphql',
//     //uri: "https://graphqlzero.almansi.me/api",
//     cache:cache,
//     typeDefs,
//   })
// })

export {apolloClient,localforage};
const withApolloProvider = (WrappedComponent) => {

	return (props) => (
		<ApolloProvider client={apolloClient}>
			<WrappedComponent {...props} wrappedBy={"withApolloProvider"} />
		</ApolloProvider>
	)
}

export default withApolloProvider
