/* eslint-disable no-unused-expressions */
//import $ from 'jquery';
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR} from "../storage/withApolloProvider";
import _ from 'lodash'
import React from "react";
import {api_address }from '../components/Profile'
//testing:
//let api_address = "http://localhost:8888"
// let api_address = "https://api.soundfound.io/api"
// let api_address = "https://api.soundfound.io"

let counter = 0
const fakeDatabase = {
    todos: [
        {
            id: counter++,
            text: 'Buy milk',
            completed: true
        },
        {
            id: counter++,
            text: 'Do laundry',
            completed: false
        },
        {
            id: counter++,
            text: 'Clean bathroom',
            completed: false
        },
    ]
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// const fetchTodos = filter =>
//     delay(1000).then(() => {
//         switch (filter) {
//             case 'all':
//                 return fakeDatabase.todos;
//             case 'active':
//                 return fakeDatabase.todos.filter(t => !t.completed);
//             case 'completed':
//                 return fakeDatabase.todos.filter(t => t.completed);
//             default:
//                 throw new Error(`Unknown filter: ${filter}`);
//         }
//     });

/*const fetchTodo = id =>
    delay(500).then(() => {
        return fakeDatabase.todos.find(t => t.id === id);
    });*/


var fakeFetch1 = function(){
    return new Promise(function(done, fail) {
        //fetch(host + '/getUserPlaylists', {method: "POST", mode: "no-cors"})


    })
};

// var fakeFetch2 = function(){
//     return new Promise(function(done, fail) {
//         done(getArtistGenres)
//     })
// };
//
// var fakeFetch3 = function(){
//     return new Promise(function(done, fail) {
//         done(getMetroEvents)
//     })
// };

//user methods

var fetchPlaylists =  function(){
    return new Promise(function(done, fail) {
        //testing: must turn cors off in browser
        //todo: replace with fetch
        // $.ajax({
        //     url: api_address + '/getUserPlaylists',
        //     type:"POST"
        // }).done(function(payload){
        //     //console.log("$retrieved: ",payload);
        //     done(payload.items)
        // })
        // fakeFetch2()
    })
};

var fetchPlaylistsResolved =  function(req){
    return new Promise(function(done, fail) {
        //console.log("fetchPlaylistsResolved",req.user);

        fetch(api_address + '/resolvePlaylists', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify({auth:req.auth,user:req.user})
            body: JSON.stringify({auth:req.auth,user:req.user,madeForYou:true})
        }).then(res => res.json())
            .then(function(playlistOb){
                var playlists = [];
                playlistOb.playlists.forEach(ob =>{
                    var p = Object.assign({},ob.playlist)
                    p.artistFreq = ob.artistFreq;
                    p.artists = ob.resolved;
                    playlists.push(p);
                })
                //console.log("fetchPlaylistsResolved", playlists);
                done({playlists:playlists,stats:playlistOb.stats})
                // done(res)
            })

        // fakeFetch2()
    })
};

var getMyFollowedArtists =  function(req){
    return new Promise(function(done, fail) {
        //testing: must turn cors off in browser
        fetch(api_address + '/getFollowedArtists', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req)
        }).then(res => res.json())
            .then(function(payload){
                //console.log("retrieved: ",payload);
                done(payload)
            })
    })
}

var getRecentlyPlayedTracks =  function(req){
    return new Promise(function(done, fail) {
        fetch(api_address + '/getRecentlyPlayedTracks', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({auth:req.auth,user:req.user})
        }).then(res => res.json())
            .then(function(payload){
                //console.log("retrieved: ",payload);
                done(payload)
            })
    })
}

var getSavedTracks =  function(req){
    return new Promise(function(done, fail) {

        fetch(api_address + '/getMySavedTracks', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(req)
        }).then(res => res.json())
            .then(function(res){
                //console.log("retrieved: ",res);
                done(res)
            })
    })
}


var getMySavedAlbums =  function(req){
    return new Promise(function(done, fail) {

        fetch(api_address + '/getMySavedAlbums', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(req)
        }).then(res => res.json())
            .then(function(res){
                //console.log("retrieved: ",res);
                done(res)
            })
    })
}


var getMySavedTracksLast =  function(req){
    return new Promise(function(done, fail) {

        fetch(api_address + '/getMySavedTracksLast', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {'Content-Type': 'application/json'},
            body: null
        }).then(res => res.json())
            .then(function(res){
                //console.log("retrieved: ",res);
                done(res)
            })
    })
}

var getTopArtists =  function(req){

    return new Promise(function(done, fail) {

        fetch(api_address + '/getTopArtists', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req)
        }).then(res => res.json())
            .then(function(res){
                //console.log("retrieved: ",res);
                done(res)
            })
    })
}

//static user methods

var fetchStaticUser =  function(req){
    return new Promise(function(done, fail) {

        //console.log("$user",req);
        fetch(api_address + '/fetchStaticUser', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req)

        }).then(res => res.json())
            .then(function(res){
                //console.log("retrieved: ",res);
                done(res)
            })
    })
}

var getUserPlaylistFriends =  function(req){
    return new Promise(function(done, fail) {

        fetch(api_address + '/getUserPlaylistFriends', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req)
        }).then(res => res.json())
            .then(function(res){
                //console.log("retrieved: ",res);
                done(res)
            })
    })
}

var fetchSpotifyUsers =  function(req){
    return new Promise(function(done, fail) {

        fetch(api_address + '/fetchSpotifyUsers', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req)
        }).then(res => res.json())
            .then(function(res){
                //console.log("retrieved: ",res);
                done(res)
            })
    })
}


//event methods

function coverageFilterEvents(events){
    var c_familyAgg,c_genres,c_eventsWithGenre,c_eventsWithFam,ptotal;
    c_familyAgg=c_genres=c_eventsWithGenre=c_eventsWithFam=ptotal = 0;

    var genreNoFam = [];
    var eventsLen = JSON.parse(JSON.stringify(events))
    var pruned = [];
    var noSpotify = [];
    //var toSplice = []

    events.forEach((e,i,arr) =>{

        var ec = 0;
        //note: only here b/c I'm lazy and won't update cached events fetch example!
       // new Date(e.start.datetime) <= new Date() ? arr.splice(i, 1):{}

        var flag = null;
        e.performance.forEach(p =>{
           if(p.artist.familyAgg){
               ec++;
               //flag === null? flag = 'hasFamily':{}
           }
           if(!(p.artist.id)){
               noSpotify.push(p.artist)
           }
            p.artist.genres.length > 0 ? c_genres++ :{};
            !( p.artist.familyAgg) && p.artist.genres.length > 0 ? genreNoFam.push(p):{}
            ptotal++
        })
        //flag === 'hasFamily'? c_eventsWithFam++:{};
        ec > 0 ? c_eventsWithGenre++:{};
        c_familyAgg = c_familyAgg + ec
        if(ec === 0 ){
            pruned.push(arr[i])
            arr.splice(i, 1);
        }

    })
    // toSplice = _.uniqBy(toSplice,'id')
    // // console.log("toSplice",toSplice);
    // events = _.difference(events, toSplice);
    //todo: what is this?
    //flag === 'hasFamily' ? console.log("pruned",eventsLen - events.length):{};

    //console.log("$genreNoFam",genreNoFam);
   return {perfArtistWithFamilyAgg:c_familyAgg + "/" + ptotal, perfArtistWithGenre:c_genres+ "/" + ptotal,
       perfArtistNoSpotify:noSpotify,
        eventWithAtLeastOneGenre: c_eventsWithGenre + "/" + eventsLen.length,pruned:pruned}

}

var fetchEvents =  function(req){
    return new Promise(function(done, fail) {

        //testing: dateFilter
        var t = {start:"2020-03-11T16:36:07.100Z",end:"2020-03-16T16:36:07.100Z"};
        req.dateFilter = t;

        //example req
        // req = {
        //     metro:{displayName:"Columbus", id:9480},
        //     dateFilter:t};

        //note: cors bullshit
        //ended up going back to using the extension to allow requests to be made w/out cors
        //b/c if you change the mode here, you can't send fucking json? ffs
        //https://stackoverflow.com/questions/54016068/empty-body-in-fetch-post-request

        fetch(api_address + '/resolveEvents', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req)
        }).then(res => res.json())
            .then(function(res){
                //console.log("retrieved: ",res);

                console.log("getCoverage (events init):",coverageFilterEvents(res));

                done(res)
            })

        // $.ajax({
        //     url: api_address + '/resolveEvents',
        //     type:"POST",
        //     data: {data:JSON.stringify(param)}
        //     //todo:[Object: null prototype] when trying to read
        //     //data: JSON.stringify(param)
        //     //data: param
        // }).then(function(payload){
        //     console.log("retrieved: ",payload);
        //     done(payload)
        // })

        //testing:
        // fakeFetch3().then(r =>{done(r)})
    })
}

//methods

var createPlaylist =  function(req){
    return new Promise(function(done, fail) {

        fetch(api_address + '/createPlaylist', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req)
        })
            .then(res => res.json())
            .then(function(res){
                console.log("playlist created",res);
                done(res)
            })
    })
}

var getAuth =  function(code){
    return new Promise(function(done, fail) {
       // console.log("code for accessToken fetch",code);
        fetch(api_address + '/getAuth', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({code:code})
        })
            .then(res => res.json())
            .then(function(res){
                console.log("login response: ",res);
                done(res)
            })

    })
}

var postInfo =  function(code){
    return new Promise(function(done, fail) {
        //testing: replace getAuth with one of example gateway requests

        console.log("postinfo...");
        fetch(api_address + '/api/postinfo', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json'
            },
            //testing: idfk
            // body: JSON.stringify({code:code})
        })
            .then(res => res.json())
            .then(function(res){
                console.log("postinfo response: ",res);
                 done(res)
            })


    })
}

var postInfo2 =  function(url){
    return new Promise(function(done, fail) {
        //testing: replace getAuth with one of example gateway requests
        console.log("postinfo2...",url);
        fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json'
            },
            //testing: idfk
             body: JSON.stringify({code:"testcode"})
        })
            .then(res => res.json())
            .then(function(res){
                console.log("postinfo2 response: ",res);
                done(res)
            })


    })
}



var refreshAuth =  function(refresh_token){
    return new Promise(function(done, fail) {
        console.log("refresh token",refresh_token);

        fetch(api_address + '/refreshAuth', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({refresh_token:refresh_token})
        })
            .then(res => res.json())
            .then(function(res){
                console.log("refreshAuth response: ",res);
                done(res)
            })
    })
}

var getArtistTopTracks =  function(req){
    return new Promise(function(done, fail) {
        fetch(api_address + '/getArtistTopTracks', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req)
        }).then(res => res.json())
            .then(function(res){
                done(res)
            },e =>{console.error(e)})
    })
}


var completeArtist =  function(param){
    return new Promise(function(done, fail) {
        //todo: replace with fetch
        // $.ajax({
        //     url: api_address + '/completeArtist',
        //     type:"POST",
        //     data: {artistQuery:param}
        // }).done(function(payload){
        //     //console.log("retrieved: ",payload);
        //     done(payload.result.body.artists.items)
        // })

        //testing:
        // fakeFetch3().then(r =>{done(r)})
    })
}

//-----------------------------------------------
//deprecated vvv


var fetchArtistGenres =  function(playlists){
    return new Promise(function(done, fail) {

        //testing: must turn cors off in browser
        //todo: replace with fetch
        // $.ajax({
        //     url: api_address + '/resolvePlaylists',
        //     type:"POST",
        //     data: {playlists:JSON.stringify(playlists)}
        // }).done(function(payload){
        //     //console.log("retrieved: ",payload);
        //     done(payload)
        // })
    })
}


var getToken =  function(playlists){
    return new Promise(function(done, fail) {

        //testing: must turn cors off in browser
        //todo: replace with fetch
        // $.ajax({
        //     url: api_address + '/getToken',
        //     type:"POST",
        //     // data: {playlists:JSON.stringify(playlists)}
        // }).done(function(payload){
        //     console.log("retrieved token: ",payload);
        //     done(payload)
        // })
    })
}

//-----------------------------------------------
//todos test stuff

const addTodo = text =>
    delay(200).then(() => {
        const todo = {
            id: counter++,
            text,
            completed: false
        };
        fakeDatabase.todos.push(todo);
        return todo;
    });

const updateTodo = (id, {text, completed}) =>
    delay(200).then(() => {
        const todo = fakeDatabase.todos.find(t => t.id === id);
        todo.text = text === undefined ? todo.text : text;
        todo.completed = completed === undefined ? todo.completed : completed;
        return todo;
    });

const deleteTodo = (id) =>
    delay(200).then(() => {
        let deletedTodo = fakeDatabase.todos.find(t => t.id === id);
        fakeDatabase.todos = fakeDatabase.todos.filter(t => t.id !== id);
        return deletedTodo;
    });

export default {
    postInfo,
    postInfo2,
    // fetchTodos,
    // fetchTodo,
    addTodo,
    updateTodo,
    deleteTodo,
    fetchPlaylists,
    fetchPlaylistsResolved,
    fetchEvents,
    getEventsCoverage: coverageFilterEvents,
    getSavedTracks,
    getMySavedTracksLast,
    getMyFollowedArtists,
    getMySavedAlbums,
    completeArtist,
    getArtistTopTracks,
    getToken,
    getTopArtists,
    fetchStaticUser,
    getUserPlaylistFriends,
    fetchSpotifyUsers,
    getAuth,
    refreshAuth,
    createPlaylist,
    getRecentlyPlayedTracks
}
