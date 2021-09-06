import React, {useContext, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import App from './App'
import _ from 'lodash'
import { DateTime } from "luxon";
import './index.css'
import { createContainer } from "unstated-next"

//todo: should probably break out play control here...

function useControl(initialState = 0) {
    let [id, _setId] = useState(null);
    let [play, _togglePlay] = useState(false);

    //testing: just ohio for now
    var states = {"OH":[
            {"displayName":"Columbus", "id":9480},
            {"displayName":"Cleveland", "id":14700},
            {"displayName":"Cincinnati", "id":22040},
            // {"displayName":"Dayton", "id":3673},
            {"displayName":"Toledo", "id":5649}
        ]};

    let [metro, _selectMetro] = useState([{"displayName":"Columbus", "id":9480}]);
    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };

    // let [startDate, setStartDate] = useState(new Date());
    let [startDate, setStartDate] = useState(DateTime.now());
    //testing:
    let [endDate, setEndDate] = useState(null);
    // let [endDate, setEndDate] = useState(new Date().addDays(30));

    let togglePlay = (play) => _togglePlay(play)
    let setId = (id) => _setId(id);
    let selectMetro = (metroSel) => {
        //so this is new territory...
        //init thought was that someone is listening for this value to change and then sends new events req?
        //but is that like reacty? idk. for now just going to rely on the events list updating based on its
        //new value set by the req

        //this feels like a slightly different problem - I'm really forcing this 'component' here so I can use hooks,
        //when I really just want to call some javascript.
        if(_.find(metro, { 'id': metroSel.id })){
            console.log('remove', metroSel);
            _selectMetro(metro.filter((e) =>(e.id !==  metroSel.id)));
        }else{
            console.log('add',metroSel);
            _selectMetro([...metro,metroSel]);
        }

    }

    let [playArtist, setPlayArtist] = useState(null);

    let [genreSens, setGenreSens] = useState('related');
    let [artistSens, setArtistSens] = useState('off');
    let [dataLoaded, setDataLoaded] = useState(false);
    let map = {0:"selected",1:"exact",2:"related"}
    let rmap = {"selected":0,"exact":1,"related":2}
    let mapArtist = {0:"exact",1:"off",2:"related"}
    let rmapArtist = {"exact":0,"off":1,"related":2}
    return { play,id, togglePlay, setId,metro,selectMetro,playArtist,setPlayArtist,
        startDate,endDate,setStartDate,setEndDate,
        genreSens,setGenreSens, artistSens, setArtistSens,map,rmap,mapArtist,rmapArtist,
        dataLoaded,setDataLoaded}
}


let Control  = createContainer(useControl);

function useHighlighter(initialState = 0) {
    //testing:
    let [hoverState, setHoverState] = useState([]);
    return { hoverState,setHoverState}
}
let Highlighter  = createContainer(useHighlighter);

//testing: storing value from here is fine, right?
//todo: should be aware of current tab (after refresh)

var paneSettings = {default:{tabs:"30em",stats:"60em"},friends:{tabs:"20em",stats:"70em"}}
function usePane(initialState = 0) {
    // let [pane, setPane] = useState(paneSettings['default'] );
    let [pane, setPane] = useState(paneSettings['friends'] );

    return { pane,setPane,paneSettings}
}
let PaneControl  = createContainer(usePane);

function useGrid(initialState = 0) {
     const [gridClass, setGridClass] = useState('defaultGrid');
    const [statCollapse, setStatCollapse] = useState(false);
    const [eventsView, setEventsView] = useState(false);
    const [tileFilterOpen, setTileFilterOpen] = useState(false);
    // const [gridClass, setGridClass] = useState('friendsGrid');
    return { gridClass,setGridClass,setStatCollapse,statCollapse,eventsView,setEventsView,tileFilterOpen,setTileFilterOpen}
}
let GridControl  = createContainer(useGrid);


function useStats(initialState = 0) {
    //note: stats is really tracking active tab...

    //testing: change default page
    //todo: needs to set artists_saved on login - not page load = triggers util to soon
    // let [stats, setStats] = useState({name:"Home"});
    //  let [stats, setStats] = useState({name:"artists_saved"});
    let [stats, setStats] = useState({name:"Home"});
    //the default true is context
    const [mode, setMode] = useState(true);
    //the default true is pie
    const [chart, setChart] = useState(true);
    return { stats,setStats,mode,setMode,chart,setChart }
}
let StatControl  = createContainer(useStats);

function useTabs(initialState = 0) {
    // const [section, setActiveSection] = useState(1);
    const [section, setActiveSection] = useState(2);
    const [tab, setActiveTab] = useState(0);
    const [data, setData] = useState('data1');
    return { tab,setActiveTab,section,setActiveSection,data, setData }
}
let TabControl  = createContainer(useTabs);

function useFriends(initialState = 0) {
    //testing:
    //todo: useProduceData is being called fast
    //somehow not a problem when I have a testin value?
    //otherwise friendscontrol isn't even defined?

    //let [guest, setGuest] = useState(null);
    let [guest, setGuest] = useState({id:123028477,name:"Dan"});
    //user,guest,shared,all
    let [compare, setCompare] = useState('shared');
    let [families, setFamilies] = useState([]);
    let [genres, setGenres] = useState([]);
    let [selectedTabIndex, setTabIndex] = React.useState(1);
    let [sourceFilter, setSourceFilter] = React.useState('both');
    let [checkboxes, setCheckboxes] = React.useState({
        collab: false,
        me: false,
        spotify: false,
    });
    let [query, setQuery] = React.useState("");



    return { guest,setGuest,compare,setCompare,families, setFamilies,genres,setGenres,setCheckboxes, checkboxes,query, setQuery,
        selectedTabIndex,setTabIndex,sourceFilter,setSourceFilter}
}

let FriendsControl  = createContainer(useFriends);

function useTileSelect(initialState = 0) {
    const [tile, selectTile] = useState(null);
    const [isDrawerShowing, setDrawerShowing] = useState(false);
    return { selectTile,tile,isDrawerShowing, setDrawerShowing}
}
let TileSelectControl  = createContainer(useTileSelect);

const rootElement = document.getElementById("root");
ReactDOM.render(
    <Control.Provider>
        <Highlighter.Provider>
            <StatControl.Provider>
                <FriendsControl.Provider>
                    <GridControl.Provider>
                        <TabControl.Provider>
                            <TileSelectControl.Provider>
                                <App />
                            </TileSelectControl.Provider>
                        </TabControl.Provider>
                    </GridControl.Provider>
                </FriendsControl.Provider>
            </StatControl.Provider>
        </Highlighter.Provider>
    </Control.Provider>,
    rootElement
);

export{
    Control,Highlighter,StatControl,FriendsControl,PaneControl,GridControl,TabControl,TileSelectControl
}

//=====================================================
//testing: integration with watermelondb
//import { Database } from '@nozbe/watermelondb'
//import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

//import schema from './model/schema'
// import Post from './model/Post' // ⬅️ You'll import your Models here

// First, create the adapter to the underlying database:

// const adapter = new SQLiteAdapter({
//     schema,
// })

//for web:
//import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'

// const adapter = new LokiJSAdapter({
//     schema,
//     // These two options are recommended for new projects:
//     useWebWorker: false,
//     useIncrementalIndexedDB: true,
//     //todo:
//     // It's recommended you implement this method:
//     // onIndexedDBVersionChange: () => {
//     //   // database was deleted in another browser tab (user logged out), so we must make sure we delete
//     //   // it in this tab as well
//     //   if (checkIfUserIsLoggedIn()) {
//     //     window.location.reload()
//     //   }
//     // },
// })
//
// // Then, make a Watermelon database from it!
// const database = new Database({
//     adapter,
//     modelClasses: [
//         // Post, // ⬅️ You'll add Models to Watermelon here
//     ],
//     actionsEnabled: true,
// })
//
// //watermelon
// const postsCollection = database.collections.get('posts')
// console.log("$postsCollection",postsCollection);

//=====================================================

