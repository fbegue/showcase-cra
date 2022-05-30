/* eslint-disable no-unused-expressions */
import React, {useContext, useEffect, useState,useRef,forwardRef } from 'react';

//todo: this shit is outdated AF but was so simple I couldn't refuse
//https://github.com/mikechabot/react-tabify#color-theme
//specifically it uses glamorous which has been ditched for emotion as a theme provider
//not sure if I could rip that dependency out myself and just make this my thing or not...

// import { Tab, Tabs } from "react-tabify";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";

//import MaterialTable from "material-table";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClearIcon from '@material-ui/icons/Clear';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import {Context} from "./storage/Store";
import api from "./api/api.js"
// import ChipsArray from "./components/utility/ChipsArray";
import util from "./util/util";
import tables from "./storage/tables";
import _ from "lodash";
import {Control, FriendsControl, GridControl, StatControl,TabControl} from "./index";
import { GLOBAL_UI_VAR } from './storage/withApolloProvider';
import {useQuery,useReactiveVar} from "@apollo/react-hooks";
//testing:
import Home from './components/Home';
import TabPanel from './components/utility/CustomTabPanel'
import Social from "./components/Social/Social";
//import MatTableTreeTest from './components/deprecated/MatTableTreeTest'
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import InfoPanel from "./components/InfoPanel";

import './Tabify.css'
import PulseSpinnerSpring from './components/springs/PulseSpinnerSpring'
import useMeasure from "react-use-measure";
import {useSpring,a} from "react-spring";
import { useMediaQuery } from 'react-responsive'
import Accordion from "./components/Framer/Accordion";


// const styles = {
// 	fontFamily: "sans-serif",
// 	textAlign: "center"
// };

//todo: also this shit doesn't even work?
//whatever fuck it for now
var color = "#000000";
var materialColor = "#3f51b5";

const theme = {
	tabs: {
		color: color,
		borderBottomColor: color,
		active: {
			borderBottomColor: color,
			color: "#3273dc"
		},
		hover: {
			borderBottomColor: color,
			color: color
		}
	},
	menu: {
		color: color,
		borderRight: color,
		active: {
			backgroundColor: color,
			color: color
		},
		hover: {
			color: color,
			backgroundColor: color
		}
	}
};

function getChips(genres){

	var t = ""
	genres.forEach(g =>{
		t =t + g.name + ", "
	})
	return <span>{t}</span>

};


const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		backgroundColor: "grey"
	}
}));

const tabMap = {
	0: {
		0: {"home": "Home"},
		1: {"artists_top": "Top Artists"},
		2: {"tracks_top": "Top Tracks"},
		3: {"tracks_recent": "Recently Played Tracks"}
	},
	1:{
		0:{"artists_saved":"Artists"},
		// 1:{"playlists":"Playlists"},
		1:{"tracks_saved":"Tracks"},
		2:{"albums_saved":"Albums"}
	},2:{
		0:{"artists_friends":"Artists"},
		1:{"albums_friends":"Albums"},
		2:{"tracks_friends":"Tracks"},
		// 3:{"playlists_friends":"Playlists"},
	}}
export {tabMap}
export default function Tabify() {

	const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })

	const classes = useStyles();

	//todo: move this somewhere else higher up
	//todo: rename this instance to 'global state'
	const [globalState, globalDispatch] = useContext(Context);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);

	//prevent useeffect from triggering on first render
	//essentially adding a dependency of '2nd render = true'
	//https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render
	var slow = function(){ setTimeout(e=>{console.log("do something");},2000)}


	//------------------------------------------------------------------------------------
	let control = Control.useContainer();
	let friendscontrol = FriendsControl.useContainer()
	let tabcontrol = TabControl.useContainer()
	//-------------------------------------------------------------------------------------

	//terms


	//----------------------------------------------------------------------------
	let statcontrol = StatControl.useContainer();
	let gridControl = GridControl.useContainer()

	function handleSectionSelect(event,sectionkey){
		console.log("handleSectionSelect",sectionkey);
		tabcontrol.setActiveSection(sectionkey)

		switch (sectionkey) {
			case 1:
				statcontrol.setStats({name:"artists_saved"})
				break;
			case 2:
				statcontrol.setStats({name:"artists_friends"})
				break;
			default:
		}
	}

	// const handleTabChange = (event, tabindex) => {
	//
	// 	console.log("handleTabChange",tabMap[tabcontrol.section][tabindex]);
	// 	console.log(tabcontrol.tab);
	// 	debugger
	// 	tabcontrol.setActiveTab(tabindex);
	// 	statcontrol.setStats({name:Object.keys(tabMap[tabcontrol.section][tabindex])[0]})
	//
	// };

	const height = "20em";
	const width = "100%";
	//const [expanded, setExpanded] = React.useState(false);

	const mapNum = [0,1,2];
	return(
		// style={styles}
		<div>
			{!isTabletOrMobile && <div>
				<AppBar position="static">
					<Tabs className={classes.root} value={tabcontrol.section} onChange={handleSectionSelect} >
						{/*todo: disabled for now (broke in multiple places)*/}
						{/*<Tab label="Search">*/}
						{/*	<Search></Search>*/}
						{/*</Tab>*/}
						<Tab label="My Profile"/>
						<Tab label="My Library"/>
						<Tab label="My Friends"/>
						{/*todo:*/}
						{/*<Tab label="Billboards">*/}
						{/*	<Tabs>*/}
						{/*		<Tab label="Subtab 2.1">*/}
						{/*			Tab 2 Content 1*/}
						{/*		</Tab>*/}
						{/*		<Tab label="Subtab 2.2">Tab 2 Content 2</Tab>*/}
						{/*		<Tab label="Subtab 2.3">Tab 2 Content 3</Tab>*/}
						{/*	</Tabs>*/}
						{/*</Tab>*/}
					</Tabs>
				</AppBar>
				<div>
					{/*todo: disabled for now*/}
					{/*<InfoPanel setInfoBound={gridControl.setInfoBound} setInfoCollapse={setInfoCollapse}/>*/}

					{/*todo: further parameterize to allow for "My Profile" content*/}
					{mapNum.map((index) =>
						<TabPanel key={index}   className={'tabs' + index} value={tabcontrol.section} index={index}>
							{/*testing:*/}
							{/*{getTabs()}*/}

							<Social />
							{/*ref={ref}*/}
							{/*{gridControl.collapse &&*/}
							{/*<div style={{marginTop:"4em"}}>content</div>*/}
							{/*}*/}

						</TabPanel>
					)}


					{/*<TabPanel   className={'tabs1'} value={tabcontrol.section} index={1}>*/}
					{/*	{getTabs()}*/}
					{/*	{*/}
					{/*		infoCollapse &&*/}
					{/*		<div id={'handle'} style={{background:'#f53177',height:30,zIndex:500,position:"relative",width:"100%"}}>*/}
					{/*			<button onClick={() =>{setInfoCollapse(prev => !(prev))}}>expand summary</button>*/}
					{/*		</div>*/}
					{/*	}*/}
					{/*	<InfoPanel setInfoBound={setInfoBound} setInfoCollapse={setInfoCollapse}/>*/}
					{/*</TabPanel>*/}
					{/*<TabPanel value={tabcontrol.section} index={2}>*/}
					{/*	<Social/>*/}
					{/*</TabPanel>*/}
				</div>
			</div>}
			{isTabletOrMobile &&
			<div>
				<div>
					<Accordion  i={0} setCollapse={gridControl.setCollapse}
								collapse={gridControl.collapse}
								content={
									mapNum.map((index) =>
										<TabPanel key={index}   className={'tabs' + index} value={tabcontrol.section} index={index}>
											<div style={{
												// background: 'pink',
												width: width}}>
													<Social />
												{/*{index === 2 ?*/}
												{/*	<Social />*/}
												{/*}*/}
											</div>
										</TabPanel>
									)}
					/>
				</div>
			</div>}
		</div>
	)
}
