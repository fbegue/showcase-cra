import React, {createContext, useReducer} from "react";
import Reducer from './Reducer'
import tables from './tables'

//so we got tables, and we got state, and we got the initial state of nodes


let initialState = {
	posts: [],
	// node:[{id:1,name:"agg",data:[]}],
	node:[
		{
			"id": 0,
			"name": "agg",
			"label": "Aggregate",
			"data": []
		},
		{
			"id": 1,
			"name": "saved",
			"label": "Saved Artists",
			"data":[]
		},
		{
			"id": 2,
			"name": "top",
			"label": "Top Artists",
			"data": []
		},
		{
			"id": 4,
			"name": "playlists",
			"label": "Playlists",
			"data": []
		},
		{
			"id": 9999,
			"name": "recent",
			"label": "Recently Played",
			"data": []
		}
	],
	error: null
};

//todo: not remembering what the whole idea was here
//like why did I recently remove types loop to init initialState?
//and why does only the globalUI.user get 'playlistsTracked' (assuming b/c initialState only works for me?)

var types = ["artists","playlists","tracks","albums","playlistsTracked"]
export function initUser(user){

	//note: setting these up so user record stores can load instantly (empty)
	tables['users'][user.id] = {artists:[],playlists:[],tracks:[],albums:[],playlistsTracked:[]};
	types.forEach(t =>{
		initialState[user.id + "_" + t] = []
	})
}

const Store = ({children}) => {
	const [state, dispatch] = useReducer(Reducer, initialState);
	return (
		<Context.Provider value={[state, dispatch]}>
			{children}
		</Context.Provider>
	)
};

export const Context = createContext(initialState);
export default Store;
