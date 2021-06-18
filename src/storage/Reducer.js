/* eslint-disable no-unused-expressions */
import _ from "lodash";
import tables from './tables'

//------------------------------------------------------
//utilities

function jstr(a){return JSON.parse(JSON.stringify(a))}

var art_gen = [{id:1,genres:[{id:1,name:'pop'}]},{id:2,genres:[{id:3,name:'rock'}]},{id:3,genres:[{id:2,name:'rap'}]}];

//testing:
//bj
art_gen.push({id:"07d5etnpjriczFBB8pxmRe",genres:[{id:1,name:'pop'},{id: 5, name: "indie pop"}]});



//we have 3 events:
//popArtist will be filtered in once we add {id:1} from artists
//we'll see rockArtist once we add {id:2} from albums
//we never see country b/c none of our input to noder has a country genre

var eventsCollection = [{artist_id:1,name:"popArtist",genres:[{id:1,name:'pop'}]}
	,{artist_id:2,name:"countryArtist",genres:[{id:4,name:'country'}]}
	,{artist_id:3,name:"rockArtist",genres:[{id:3,name:'rock'}]}
]


//todo: this is called twice in succession
// because getJoin action on node and events call it

//v1: produce an array which is the combination of all selected table values across all contexts
//v2: maintain an array of node objects and update the objects based on the nodeContext field
//the nodes themselves are simply filtered table data which are updated when asked to be


//testing: 'nodes' is the data object for the state object 'node'
//which itself just returns what noder calculates with 'nodes'

//todo: these don't mean much rn
// tells node spawns what id they should have
//when we do users, we're going to have to come up with some other kind of system..

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

//testing: who are guests?
var guest = {id:123028477,name:"Dan"};
//testing:'main' user
var mainUser = {id:'dacandyman01',name:"Franky"};
//testing:
sources_subset.forEach(s =>{
	//todo: add new id
	nodes.push({id:idmap[s] + 99,name:guest.id + "_" + s,data:[]})
})

//-----------------------------------------------------

/** @func noder
 *  Recalculate node values in globalState.node based on the action that is taking place
 *  and the current state of statcontrol - context ignores all 'selected' values and custom = opposite
 *  Then always recalc agg node
 *
 * */
function noder(action){

	console.log("noder started",action);
	//console.log("current nodes",jstr(nodes.length));
	//console.log("current tables",jstr(tables));
	//set tableContext based on action.context
	//if its a user = selection, the data is already set
	//otherwise we need to filter on it to prepare it for aggregation update


	//todo: this guy doesn't have multiple 'users' to keep track of
	//not sure why it would belong here exactly..


	//have to look in ALL the user tables now for selections
	//we'll set the tableContext to all applicable objects from all users?

	//note: used to make new nodes based on the context being passed
	//now I'm looking at combining multiple of what I considered to be 'contexts' together
	//for now we're getting these from a type I'm assigining straight to the object:
	// playlists
	// artists > saved | term | term

	//still I had this vision of putting all this contextual identity information in relational tables,
	//making sure I was passing around only standarized artist objects. hhmmmm
	//technically this SHOULD be allowed b/c I will also want to have more than 1 instance of an artist
	//if it gets added from multiple locations, right?

	//==================================================================
	//note: UPDATE redesign this structure so that primary user tables are handled
	//with a 'select from all applicable tables' but secondary user stuff has its own nodes

	//==================================================================
	//note: UPDATE yeah wtf am I doing here again? this looks crazy wasteful

	//todo: infer proper types
	//we use a mix of 'source' and the spotify provided object 'type' rn

	//every one of these node updates has to go over multiple users
	//except selection based ones

	//filter either implements a custom filter based on a key, or just returns all checked with that filter
	//basically: context still needs to do custom filters, but custom needs to also check for checked.

	var contextFilter = function(key,rec){
		// console.log("contextFilter",key);
		// console.log("mode",action.stats.mode);
		// console.log("tab",action.stats.stats.name);
		//set a flag that, for each type of node, filters the correct artists back
		var t = false;
		//todo: (1) don't have source on top stuff yet
		//should just be teeing off that here completely

		//if key === top, the artist is valid if it has ANY 'term' value
		//otherwise artist is only valid if it has a source = input key (saved,recent)
		if(key === 'top'){t = rec['term'] !== null}
		else{t = rec['source'] === key}
		// console.log("t",t);
		// console.log("r",rec['source']);
		//testing: playlists
		if(key === null){t = true;}

		var tabMap = {
			saved:"artists_saved",
			top:"artists_top",
			recent:"artists_recent"
		}

		if(action.stats.mode){
			//in context mode, we need to know which tab, but ignore checked status
			if(key === 'saved' || key === 'recent'){
				return t && tabMap[key] === action.stats.stats.name
			}else if(key === 'top'){
				return t && tabMap[key] === action.stats.stats.name}
			//playlists
			else if(key === null){
				return true
			}
			return false;

		}else{
			return rec.tableData && rec.tableData.checked && t
		}
	}

	if(action.context === 'artistSearch'){
		//todo: put this on hold for now (broken everywhere else)
		console.warn("skipped artistSearch");
		//tableContext = tables["users"][action.user.id][action.context];
	}
	else if(action.context === 'home' ||  action.context === 'friends'){
		console.warn("skipped tab node recalc",action.context);
	}
	else{
		Object.keys(tables["users"]).forEach(uid =>{
			//see: tables for ideas
			if(uid === 'selection'){
				//handled elsewhere?
				//we get away with not taking care of this here b/c we take care of it above, right?
				// not conflating the point of it...

			}else{
				var nodeName = {};

				//todo: garbage logic for guests' nodes

				if(uid === mainUser.id){
					nodeName['playlists'] = 'playlists'
					nodeName['top'] = 'top'
					nodeName['saved'] = 'saved'
					nodeName['recent'] = 'recent'
				}else{
					nodeName['playlists'] =  guest.id + "_" +'playlists'
					nodeName['top'] =  guest.id + "_" +'top'
					nodeName['saved'] =  guest.id + "_" +'saved'
					nodeName['recent'] =  guest.id + "_" +'recent'
				}
				if(action.context === 'playlists') {
					var n = _.find(nodes, {name: nodeName['playlists']})
					//console.log(uid);
					//console.log(action.context);
					//console.log(tables["users"][uid][action.context]);
					n.data = tables["users"][uid][action.context].filter(contextFilter.bind(null,null))
				}else if(action.context === 'tracks') {


					//testing: tracks as a context means I need to do something special
					//I need to access the tracks table to find selected items, and those
					//artists are then added to the node's data... I guess

					var n = _.find(nodes, {name: nodeName['recent']});

					var ts = tables["users"][uid][action.context].filter(r => {
						return r.tableData && r.tableData.checked;
					})
					var as = [];
					ts.forEach(t =>{as = as.concat(t.artists)})

					//console.log(uid);
					//console.log(action.context);
					//console.log(tables["users"][uid][action.context]);
					n.data = as
				}else{
					//note: any artist related node recalc means I recalc all of them

					//set data for each node
					// var sources = ['top','saved','agg','playlists','guest']
					var special = ['top','saved','recent']

					special.forEach(s =>{
						var n = _.find(nodes, {name: nodeName[s]});
						//console.log("current node value",jstr(n.data));

						//testing: was trying to filter in place to avoid destroying references
						//but don't think I ever got this to solve my issue

						//look at the current data
						//figure out what the new data looks like
						//make the arrays equal by adding or removing elements
						//as items get checked/unchecked, the array size will decrease and increase
						//if update > current, we added an item. so just take the difference and add
						//if update < current, we subtracted

						function filterInPlace(array,update) {

							//difference by means subtract, not just...whatever I'm looking for
							//having trouble remembering array ops this morning
							//var dif = [];
							if(array.length < update.length){
								var dif = _.differenceBy(update, array,'id');
								//console.log("$d",dif);
								dif.forEach(a =>{array.push(a)})
							}
						}

						// var update = tables["users"][uid][action.context].filter(contextFilter.bind(null,s))
						// console.log("update",s);
						// console.log(update);
						n.data = tables["users"][uid][action.context].filter(contextFilter.bind(null,s))

						//testing: think I stopped destroying refs, but no luck solving transitions issue :(
						//also, after implementing CONTEXT mode, this filterinPlace won't filter OUT correctly?

						//console.log("$update",jstr(update));
						//filterInPlace(n.data,update)
						//console.log("next node value",jstr(n.data));

						//testing: apollo reactive
						//console.log("$action",action.state);
						//var test =_.find(action.state.node, {name:"saved"});
						//var i = _.findIndex(action.state.node, {name:"saved"});
						//console.log(i);

						// var copy = jstr(action.state.node)
						// var test =_.find(copy, {name:"saved"});
						// test.data = n.data;
						// GLOBAL_STATE_VAR({...action.state,node:copy})


						// n.data = tables["users"][uid][action.context].filter(r => {
						// 	var t = false;
						// 	//todo: (1) don't have source on top stuff yet
						// 	//should just be teeing off that here completely
						// 	if(s === 'top'){t = r['term']}
						// 	else{t = r['source'] === s}
						// 	return r.tableData && r.tableData.checked && t
						// })
					})
				}
			}//todo: selection
		})//iterate over users
	}//todo: selection


	//------------------------------------------------------------------
	//calculate agg based on available nodes

	//just union all the nodes' data right?
	//this works for artists but not playlists
	//setup agg nodes right here

	//testing: in all cases except artist-related to artist-related tabs,
	//I need to kill all other nodes if in context mode

	var tabMapReverse = {
		artists_saved:"saved",
		artists_top:"top",
		artists_recent:"recent"
	}

	if(action.stats.mode){
		if(action.context === 'artists'){
			//clear everything except the one that was just activated
			var keepKey = tabMapReverse[action.stats.stats.name]
			nodes.forEach(n =>{
				n.name !== keepKey  ? n.data = []:{};
			})
		}else{
			nodes.forEach(n =>{
				n.name !== action.context  ? n.data = []:{};
			})
		}
	}

	var u = [];
//&& n.name !== 'playlists'
	nodes.forEach(n =>{
		n.name !== 'agg'  ? u = u.concat(n.data):{};
	})

	var n =_.find(nodes, {name:"agg"});
	n.data = u;


//------------------------------------------------------------------
//todo: abandoning ala for now until I get a straighter data model/switch state mgmt method

//note: not sure what the deal with * is here but it ends up with empty {}s - idk
// var r1 = alasql('SELECT * from ? a union select * from ? b',[art,sel]);
//todo: skipping using union here for now?
//need good way of generating these selection with nodes.length -1 unions..
//var r1 = alasql('SELECT id, genres from ? a union select id, genres from ? b',[art,sel]);
//console.log("r1",r1);

//todo: what is this all about anyways (art_gen)
//the whole idea of preserving the artist's genre info outside of the data objects I'm passing around?
//testing: for now literally just going to ignore the sql stuff I was setting up

// //------------------------------------------
// //todo: not sure what I'm doing wrong here
// //instead split into two steps
// // r = alasql('SELECT id from ? a union select id from ? b join ? art_gen on art_gen.id = b.id',[art,alb, art_gen]);
// var r1 = alasql('SELECT id from ? a union select id from ? b',[art,sel]);
// console.log("r1",r1);
//
// //todo: thought outer join would make empty genres rows
// //- something else I'm thinking of or no?
// var r2 = alasql('SELECT * from ? a join ? art_gen on art_gen.id = a.id',[r1,art_gen]);
// r2.forEach(r =>{if(!(r.genres)){r.genres = []}})
// //------------------------------------------


	//make sure agg is always on top
	nodes = nodes.sort((n1,n2) => {return n1.id - n2.id})
	console.log(action.type + " node recalc:",nodes);
	return nodes;
//return r2;
}

//todo(1): resetting events list every time to this copy we set on init
//need to figure out how to preserve these references
//when we start updating events need to not forget this



var eventsCopy = {};

function getJoin(action){
	var r = {};
	switch (action.type) {
		case 'node':
			return noder(action)
		case 'events':
			//----------------------------------------------
			//update events w/ new payload on init
			console.log("$update events (getjoin)",action);

			if(action.payload && action.payload[0] && action.payload[0].performance){
				console.log("new events payload",action.payload);
				//todo: childKey nonsense for every payload item - don't know where to put this
				action.payload.forEach(function(e){
					e.childrenKey = "performance"
				});

				//todo: since I'm only fetching one time, payload is always empty after init fetch
				//its a collection adding/removing issue + what does a new payload really mean?
				//what size do I need to be concerned about - or do I just pull it all all the time?
				tables['events'] = tables['events'].concat(action.payload);
			}
			return tables['events'];
	}
};

//state object
var stateOb = {
	artists:"depending on what you click, this global artist store is updated",
	myArtists:"user selections of artists",
	node: "this is watching all of the user selections and making inferences based on that"
}

//note: reducer rewrite

//todo: change name from init (obviously)

const Reducer = (state, action) => {
	console.log("Reducer",action);
	console.log("tables",tables);
	switch (action.type) {
		//refilter events based on some filter change (on events itself only)
		//- changing selected metro
		//- todo: changing contextual sensivity
		case 'update_events':
			return {
				...state,
				events: getJoin(Object.assign({},action,{type:"events"})),
			}
		//normally node recalcs are triggered by a selection, but in context mode the tab is the selection
		//action has access to the tab select
		case 'update':
			return {
				...state,
				node:  getJoin(Object.assign({},action,{type:"node"})),
				events:  getJoin(Object.assign({},action,{type:"events"})),
			}
		//todo: why is it that I'm not recalcing node on these inits?
		case 'init':
			console.log('action', action);

			if(action.context === 'artists'){
				//register with global artists
				tables[action.context] = tables[action.context].concat(action.payload.artists);

				//register for user
				//todo: set up id only relations for user
				//just the whole thing for now
				//var ids = _.map(artists, function(a){return a.id;});

				//testing: maybe this should just be additive
				//tables["users"][action.user][action.context] = action.payload;
				//console.log("$context",tables["users"][action.user][action.context]);
				// console.log("$",tables);
				// console.log("$",action.user.id);
				// console.log("$",tables["users"][action.user.id]);
				tables["users"][action.user.id][action.context] = tables["users"][action.user.id][action.context].concat(action.payload.artists)

				var key = action.user.id + '_' + action.context;
				console.log("stated",key);
				return {
					...state,
					[key]: tables["users"][action.user.id][action.context]
					//node:  getJoin({type:"node"}),
				};
			}
			else if(action.context === 'playlists'){

				//register with global playlists
				tables[action.context] = tables[action.context].concat(action.payload.playlists);

				//todo: register with global artists
				//starting to get a little weird here...should we really be parsing thru each playlist here?


				// if(typeof tables["artists"] !== 'array'){
				// 	console.log("retype");tables["artists"] = [];}

				action.payload.playlists.forEach(p =>{
					//don't add repeats
					p.artists.forEach(a =>{
						if (!(tables["artists"].some(e => e.id === a.id))) {
							tables["artists"].push(a);
							// tables["artists"] = tables["artists"].concat(p.artists);
						}
					});

				})


				//register for user
				//todo: set up id only relations for user
				//just the whole thing for now
				//var ids = _.map(artists, function(a){return a.id;});
				tables["users"][action.user.id][action.context] = action.payload.playlists;


				var key = action.user.id + '_' + action.context;
				console.log("stated",key);
				return {
					...state,
					[key]: tables["users"][action.user.id][action.context],
					[key + "_stats"]:action.payload.stats
					//node:  getJoin({type:"node"}),
				};
			}
			else if(action.context === 'tracks'){

				//register with global tracks
				tables[action.context] = tables[action.context].concat(action.payload.tracks);

				console.log("$",tables);
				console.log("$",action.user.id);
				console.log("$",tables["users"][action.user.id]);
				tables["users"][action.user.id][action.context] = tables["users"][action.user.id][action.context].concat(action.payload.tracks)

				var key = action.user.id + '_' + action.context;
				console.log("stated",key);
				return {
					...state,
					[key]: tables["users"][action.user.id][action.context],
					[key + "_stats"]:action.payload.stats
					//node:  getJoin({type:"node"}),
				};
			}
			else if(action.context === 'albums'){

				//register with global tracks
				tables[action.context] = tables[action.context].concat(action.payload.albums);

				console.log("$",tables);
				console.log("$",action.user.id);
				console.log("$",tables["users"][action.user.id]);
				tables["users"][action.user.id][action.context] = tables["users"][action.user.id][action.context].concat(action.payload.albums)

				var key = action.user.id + '_' + action.context;
				console.log("stated",key);
				return {
					...state,
					[key]: tables["users"][action.user.id][action.context],
					[key + "_stats"]:action.payload.stats
					//node:  getJoin({type:"node"}),
				};
			}
			else if(action.context === 'spotifyusers'){

				//todo: keeping this as a tuple for now
				//tables[action.context] = tables[action.context].concat(action.payload);
				tables[action.context] = action.payload;

				console.log("stated",action.context);
				return {
					...state,
					[action.context]: tables[action.context]
					//node:  getJoin({type:"node"}),
				};
			}
			else{
				console.error("bad context passed to init",action);
				return {...state};
			}


		//todo: these selection cases are interesting
		//most everything is in a table which has record.tableData.checked being maintained on the records,
		//so technically we dont' really need to do any updates to them as long as noder is cognicient of this fact
		//and knows when it needs to check and update aggregate
		//on the other hand, something like artistSearchSelect needs an actual data store b/c there's no table

		//note: believe the order of getJoins is guaranteed (node before events)
		case 'select':
			if(action.context === 'artists'){

				return {
					...state,
					node:  getJoin(Object.assign({},action,{type:"node"})),
					events:  getJoin(Object.assign({},action,{type:"events"})),

				};
			}
			if(action.context === 'tracks'){
				return {
					...state,
					node:  getJoin(Object.assign({},action,{type:"node"})),
					events:  getJoin(Object.assign({},action,{type:"events"})),
				};
			}
			if(action.context === 'playlists'){

				return {
					...state,
					node:  getJoin(Object.assign({},action,{type:"node"})),
					events:  getJoin(Object.assign({},action,{type:"events"})),

				};
			}
			else if(action.context === 'artistSearchSelect' || action.context === 'artistSearchDeselect'){

				//needed to use the context to figure out which operation to do
				var tableContext= "artistSearch"

				//handle the selection mutation on collection
				if(action.context === 'artistSearchSelect'){
					tables["users"][action.user.id][tableContext].push(action.payload);
				}
				else{
					//todo: handle removal
				}

				//user and context are reduced to their table addresses
				//changing these properties here for signalling prevents us from entering with correct context
				// action.user = "selection";
				// action.context = "artistSearch";
				//console.log(action);
				return {
					...state,
					//todo: naming convention for state objects
					artistSearchSelection:tables["users"][action.user.id][tableContext],
					//type was select, now its node
					//recall events just calls noder right before, so it needs the same action
					events: getJoin(Object.assign({},action,{type:"events",context:tableContext})),
					node:  getJoin(Object.assign({},action,{type:"node",context:tableContext})),
				};

			}

		//testing: preeetty sure I just left this here by mistake
		// return {
		// 	...state,
		// 	// posts: state.posts.concat(action.payload)
		// 	artists: getJoin(action)
		// };
		case 'REMOVE_POST':
			return {
				...state,
				posts: state.posts.filter(post => post.id !== action.payload)
			};
		case 'GET_POSTS':
			return {
				...state,
				posts: getJoin(action)
			};
		default:
			console.error("default reducer used by accident!");
			return state;
	}
};

export default Reducer;
