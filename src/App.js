
import React, {useState, useEffect, useRef, useContext} from 'react';
import RedirectPage from './components/system/RedirectPage';
import { useMediaQuery } from 'react-responsive'
//todo: wtf is this shit?
// import 'brace/mode/json';
// import 'brace/theme/monokai';
import Dispatch from './api/Dispatch'
import Profile from './components/system/Profile'
import Tabify from './Tabify'
import ErrorBoundary from "./util/ErrorBoundary";
// import Stats from "./components/Stats";

import Store, {Context} from './storage/Store'
import withApolloProvider from './storage/withApolloProvider';
import api from "./api/api";
import {Control, FriendsControl, GridControl} from './index'

//todo: this EVENTS_VAR here just to push that count out is no good
import { GLOBAL_UI_VAR,EVENTS_VAR} from './storage/withApolloProvider';
import {useQuery,useReactiveVar} from "@apollo/react-hooks";
import SplitPane from "react-split-pane";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import SwipeRight from './assets/swipe-right.png'
// import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import EventIcon from '@material-ui/icons/Event';
import Badge from '@material-ui/core/Badge';
import logo from './assets/sound_found.png'
import { useDrag } from 'react-use-gesture'
import {useSpring,animated} from "react-spring";
import 'fontsource-roboto';
import './App.css'
import './components/tiles/Tiles.css'




//testing: viewpager
//import stylesViewPager from'./stylesViewPager.module.css'
//import ViewPager from "./ViewPager";

import Pager from "./components/Framer/Pager";
import {motion} from "framer-motion";
import FloatingActionButton from "./components/utility/FloatingActionButton";


//testing:
//import ControlTest from "./components/ControlTest";
// import SpotifyWebApi from 'spotify-web-api-js';
// const spotifyApi = new SpotifyWebApi();

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    appBar: {

    },
    toolbar: theme.mixins.toolbar,
    contentAndToolbar: {
        flex: 3,
        minWidth: 320,
        boxSizing: 'border-box'
    },
    content: {
        padding: 1,
        height: 'calc(100vh - 64px)',
        boxSizing: 'border-box',
    },
    storeInspectors: {
        height: '70%',
        display: 'flex',
        justifyContent: 'space-between',
        overflowX: 'auto'
    },
    storeInspector: {
        flex: 1,
        margin: 8,
        boxSizing: 'border-box'
    },
    storeInspectorHeader: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#252620',
        color: 'rgba(255, 255, 255, .8)',
        height: 48
    },
    todoDetail: {
        height: 170
    }
});

function App(props) {

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })

    const { classes } = props;
    let [filter, setFilter] = useState('active');
    let control = Control.useContainer()
    //let gridControl = GridControl.useContainer()
    //  let friendscontrol = FriendsControl.useContainer()

    const globalUI = useReactiveVar(GLOBAL_UI_VAR);
    const events = useReactiveVar(EVENTS_VAR);
    //console.log("APP | globalUI ",globalUI);

    useEffect(() => {
        var newTime = null;
        const interval = setInterval(() => {
            //todo: yeaaaaaaahh
            //so basically: first time interval check = use stored value
            //as soon as we expire for the first time, we switch to using
            //the now forever updated newTime

            var diff = 0;

            if(!(newTime)){
                // console.log('Checking expiryTime...',globalUI.expiryTime);
                diff = Math.abs(new Date() - new Date(globalUI.expiryTime));
            }else{
                // console.log('Checking newTime...',newTime);
                diff = Math.abs(new Date() - new Date(newTime));
            }

            //testing: every 20s
            // var threshold = 3580*1000;
            //when there is 15s left
            var threshold = 15*1000;
            //console.log({diff});

            if(diff < threshold){
                console.log("token is about to expire. refreshing...");
                api.refreshAuth(globalUI.refresh_token)
                    .then(r =>{
                        //console.log("refreshAuth result",r)

                        //only need to refresh the access_token value
                        console.log("previous GLOBAL_UI_VAR",globalUI);
                        const params = JSON.parse(localStorage.getItem('params'));
                        localStorage.setItem('params', JSON.stringify({access_token:r.access_token,refresh_token:params.refresh_token,user:params.user}));
                        const expiryTime = new Date(new Date().getTime() + 3600 * 1000);
                        localStorage.setItem('expiryTime', expiryTime.toISOString());

                        //todo: state set here causes rerender, but this time it will pass w/ new expiryTime
                        //this seems like a bad pattern - not sure I'm even guarantee'd sync state set here
                        //in fact as soon as this is set, we trigger rerender (console.log comes after)
                        GLOBAL_UI_VAR({...globalUI,expiryTime:expiryTime, access_token:r.access_token})
                        newTime = expiryTime;
                        console.log("refreshAuth finished");
                    }).catch(e =>{console.error(e)})
            }else{
                // console.log("APP | threshold check passed",diff);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, []);


    //todo: no idea why every variant is getting uppercased
    //https://stackoverflow.com/questions/25158435/paper-button-always-as-upper-case
    //https://material-ui.com/components/typography/
    //configing theme
    //https://material-ui.com/customization/typography/

    const muiTheme = createMuiTheme({
        typography: {
            fontFamily: [
                // '-apple-system',
                // 'BlinkMacSystemFont',
                // '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                // '"Apple Color Emoji"',
                // '"Segoe UI Emoji"',
                // '"Segoe UI Symbol"',
            ].join(','),
            subtitle2:{  textTransform: 'none',},
            body1:{  textTransform: 'none'},
            subtitle1:{  textTransform: 'none'}
        },
        overrides: {
            MuiPaper: {
                root: {
                    textTransform:'none'
                }
            },
            MuiCardContent:{
                root: {
                    padding:"6px",
                    //not sure how to go about overriding a last-child condition
                    paddingBottom:"0px !important"
                }
            },
        }
    });



    //testing:
    // const [gridClass, setGridClass] = useState('defaultGrid');
    // <button onClick={() =>{setGridClass(gridClass === 'defaultGrid' ? 'friendsGrid':'defaultGrid')}}>grid</button>

    // const height = "20em";
    // const width = "100%";
    // const [expanded, setExpanded] = React.useState(false);

    let gridControl = GridControl.useContainer()

    //=============================================================

    const [scrollTop, setScrollTop] = useState(0);
    //
    // const getScrollData = (event) =>{
    //     console.log("getScrollData",event.target.scrollTop);
    //     setScrollTop(event.target.scrollTop)
    // }
    //
    // document.addEventListener("wheel", function (e) {
    //
    //     // get the old value of the translation (there has to be an easier way than this)
    //     //var oldVal = parseInt(document.getElementById("body").style.transform.replace("translateY(","").replace("px)",""));
    //
    //     // to make it work on IE or Chrome
    //     var variation = parseInt(e.deltaY);
    //
    //     // update the body translation to simulate a scroll
    //    // document.getElementById("body").style.transform = "translateY(" + (oldVal - variation) + "px)";
    //
    //     console.log("wheel",variation);
    //     return false;
    //
    // }, true);


    //testing: so yeaaahh this is garbage...
    //drag only detects 1 'drag event' as in 1 direction - if you double back it stops updating - so this isn't ever going to function like that...
    //definitely shouldn't be using the xy end position in order to determine these bounds
    //bc scrolling up then down  won't activate
    //src (need to update to @useGesture)
    //https://use-gesture.netlify.app/docs/state/

    // {...bind()}

    // const bind = useDrag((state) =>
    // {
    //      //console.log("drag",state);
    //     // console.log("drag",state.direction[1]);
    //      if((state.direction[1] === -1  && state.xy[1] >415) ||  (state.direction[1] === 1 &&  state.xy[1] >260)){
    //          //console.log("trigger");
    //          setScrollTop(state.xy[1])
    //      }
    // }, {})

    function useOnScreen(ref) {

        const [isIntersecting, setIntersecting] = useState(false)

        const observer = new IntersectionObserver(
            ([entry]) => setIntersecting(entry.isIntersecting)
        )

        useEffect(() => {
            //eslint-disable-next-line no-unused-expressions
            ref.current  ? observer.observe(ref.current):{}
            // Remove the observer as soon as the component is unmounted
            return () => { observer.disconnect() }
        }, [])

        return isIntersecting
    }

    const ref = useRef()
    const isVisible = useOnScreen(ref)
    return (
        <ErrorBoundary>
            <MuiThemeProvider theme={muiTheme}>
                <Store>
                    {globalUI.user && <Dispatch/>}
                    {/*<TestComp/>*/}
                    <BrowserRouter>
                        <div className="main">
                            <Switch>
                                {/*<Route path="/" component={Home} exact={true} />*/}
                                <Route path="/redirect" component={RedirectPage} />
                                {/*<Route path="/dashboard" component={Dashboard} />*/}
                                {/*<Route component={NotFoundPage} />*/}
                            </Switch>
                        </div>
                    </BrowserRouter>
                    {/* style={{overflow:"scroll"}} onScroll={getScrollData}*/}

                    <div>
                        {!isTabletOrMobile && <div className={'app'} >

                            {/*<div  style={{position: "sticky",bottom: "0px", "paddingTop":"0.5em","paddingBottom":"0.5em",*/}
                            {/*    borderBottom: "1px solid black", zIndex: "20",display:'flex',background:"#f0f0f0"}}>*/}
                            {/*    <div>*/}
                            {/*       Test Content*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            <div  style={{position: "fixed",bottom:0,right:0,paddingRight:"1em",paddingLeft:"1em",zIndex:20}}>
                                {/*transform: "scaleX(-1)"*/}
                                <div><img style={{height:"3em",opacity:.5,marginTop:"2em",zIndex:25,marginLeft:"1.5em"}} src={SwipeRight}/></div>
                                <div style={{zIndex:20}}>
                                    <FloatingActionButton icon={
                                        //src: https://v4.mui.com/components/badges/
                                        <Badge color="secondary" max={999}
                                               badgeContent={events.length}
                                            // badgeContent={globalUI.user.display_name}
                                               anchorOrigin={{
                                                   vertical: 'bottom',
                                                   horizontal: 'right',
                                               }}>
                                            <EventIcon />
                                        </Badge>
                                    }/>
                                </div>
                            </div>

                            <div  style={{position: "sticky",top: "0px", "paddingTop":"0.5em","paddingBottom":"0.5em",
                                borderBottom: "1px solid black", zIndex: "20",display:'flex',background:"#f0f0f0"}}>
                                <div>
                                    {/* scrollTop={isVisible}*/}
                                    <Profile version={pjson.version}/>
                                </div>
                                {/*<div><ControlTest/></div>*/}
                                {/*<input value={code} onChange={(event) =>{setCode(event.target.value)}}  />*/}
                                {/*<button onClick={() =>{getAuth(code)}}>fake auth </button>*/}

                                {/*<div ref={containerRef} className={classnames(params)}>yeah don't work here either</div>*/}

                            </div>
                            {/* className={gridControl.gridClass}*/}
                            {globalUI.access_token ?
                                <div >
                                    {/*testing: messed up width of tabs and stats, so disabled this transition for now */}
                                    {/*- is this gridClass changing here affecting responsive collapsing?*/}
                                    {/*<div className="tabs" style={{width:gridControl.gridClass === 'defaultGrid' ? "44em":"35em"}} >*/}



                                    <div style={{background:"#808080"}} >
                                        {/*testing: not exactly what I was expecting but w/e*/}
                                        {/*outline:"1px solid blue"*/}
                                        <div ref={ref} style={{width:"10em",height:".1px"}}></div>
                                        {globalUI.access_token &&
                                        <Tabify/>
                                            // <Accordion setExpanded={setExpanded} expanded={expanded}
                                            //
                                            //            content={
                                            //                <div style={{background:'pink',height:height,width:width}}>
                                            //                    <Tabify/>
                                            //                </div>
                                            //            }
                                            // />
                                        }
                                    </div>

                                    {/*testing: trying framer instead*/}
                                    {/*<ViewPager />*/}


                                    <motion.div
                                        initial={false}
                                        // animate={{y: gridControl.collapse ? 0:gridControl.infoBound -80}}
                                        transition={{ duration: 0.3 }}
                                        style={{outline: "2px solid red"}}

                                    >
                                        {globalUI.access_token &&
                                        <Pager/>}
                                    </motion.div>

                                    {/*<div style={{marginTop:"2em"}}>*/}
                                    {/*    {globalUI.access_token &&*/}
                                    {/*    <>*/}
                                    {/*       */}
                                    {/*        <Pager/>*/}
                                    {/*    </>*/}
                                    {/*    }*/}
                                    {/*</div>*/}

                                </div>
                                : <div>splash</div>

                            }
                        </div>}
                        {isTabletOrMobile && <animated.div className={'app'} >

                            {/*<div  style={{position: "sticky",bottom: "0px", "paddingTop":"0.5em","paddingBottom":"0.5em",*/}
                            {/*    borderBottom: "1px solid black", zIndex: "20",display:'flex',background:"#f0f0f0"}}>*/}
                            {/*    <div>*/}
                            {/*       Test Content*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            <div  style={{position: "fixed",bottom:0,right:0,paddingRight:"1em",paddingLeft:"1em",zIndex:20}}>
                                {/*transform: "scaleX(-1)"*/}
                                <div><img style={{height:"3em",opacity:.5,marginTop:"2em",zIndex:25,marginLeft:"1.5em"}} src={SwipeRight}/></div>
                                <div style={{zIndex:20}}>
                                    <FloatingActionButton icon={
                                        //src: https://v4.mui.com/components/badges/
                                        <Badge color="secondary" max={999}
                                               badgeContent={events.length}
                                            // badgeContent={globalUI.user.display_name}
                                               anchorOrigin={{
                                                   vertical: 'bottom',
                                                   horizontal: 'right',
                                               }}>
                                            <EventIcon />
                                        </Badge>
                                    }/>
                                </div>


                            </div>


                            <div  style={{position: "sticky",top: "0px", "paddingTop":"0.5em","paddingBottom":"0.5em",
                                borderBottom: "1px solid black", zIndex: "20",display:'flex',background:"#f0f0f0"}}>
                                <div>
                                    {/* scrollTop={isVisible}*/}
                                    <Profile version={pjson.version}/>
                                </div>
                                {/*<div><ControlTest/></div>*/}
                                {/*<input value={code} onChange={(event) =>{setCode(event.target.value)}}  />*/}
                                {/*<button onClick={() =>{getAuth(code)}}>fake auth </button>*/}

                                {/*<div ref={containerRef} className={classnames(params)}>yeah don't work here either</div>*/}

                            </div>
                            {/* className={gridControl.gridClass}*/}
                            {globalUI.access_token ?
                                <div >
                                    {/*testing: messed up width of tabs and stats, so disabled this transition for now */}
                                    {/*- is this gridClass changing here affecting responsive collapsing?*/}
                                    {/*<div className="tabs" style={{width:gridControl.gridClass === 'defaultGrid' ? "44em":"35em"}} >*/}



                                    <div style={{background:"#808080"}} >
                                        {/*testing: not exactly what I was expecting but w/e*/}
                                        {/*outline:"1px solid blue"*/}
                                        <div ref={ref} style={{width:"10em",height:".1px"}}></div>
                                        {globalUI.access_token &&
                                        <Tabify/>
                                            // <Accordion setExpanded={setExpanded} expanded={expanded}
                                            //
                                            //            content={
                                            //                <div style={{background:'pink',height:height,width:width}}>
                                            //                    <Tabify/>
                                            //                </div>
                                            //            }
                                            // />
                                        }
                                    </div>

                                    {/*testing: trying framer instead*/}
                                    {/*<ViewPager />*/}


                                    <motion.div
                                        initial={false}
                                        // animate={{y: gridControl.collapse ? 0:gridControl.infoBound -80}}
                                        transition={{ duration: 0.3 }}
                                        style={{outline: "2px solid red"}}

                                    >
                                        {globalUI.access_token &&
                                        <Pager/>}
                                    </motion.div>

                                    {/*<div style={{marginTop:"2em"}}>*/}
                                    {/*    {globalUI.access_token &&*/}
                                    {/*    <>*/}
                                    {/*       */}
                                    {/*        <Pager/>*/}
                                    {/*    </>*/}
                                    {/*    }*/}
                                    {/*</div>*/}



                                </div>
                                : <div>splash</div>

                            }

                        </animated.div>}
                    </div>

                </Store>
            </MuiThemeProvider>
        </ErrorBoundary>
    );
}

export default withStyles(styles)(App);
var pjson = require('../package.json');
// export default withStyles(styles)(withApolloProvider(App));
