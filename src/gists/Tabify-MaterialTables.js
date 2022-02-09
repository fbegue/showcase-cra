import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "../components/utility/CustomTabPanel";
import Home from "../components/Home";
import MaterialTable from "material-table";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import util from "../util/util";
import DiscreteSlider from "../components/utility/Slider";
import GenreChipsSmart from "../components/chips/ChipsArray";
import React from "react";

<div className={classes.root} >
	<AppBar position="static">
		<Tabs value={tabcontrol.section} onChange={handleSectionSelect} >
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
	<TabPanel value={tabcontrol.section} index={0}>
		<AppBar position="static">
			<Tabs value={tab} onChange={handleTabSelect}>
				<Tab label="Home"/>
				<Tab label="Recently Played"/>
				<Tab label="Your Top Artists"/>
			</Tabs>
		</AppBar>
		<TabPanel value={tab} index={0}>
			<Home data={globalState[ globalUI.user.id + "_artists"].filter(i =>{return i.term})} />
		</TabPanel>
		<TabPanel value={tab} index={1}>
			<MaterialTable
				title=""
				columns={[
					{
						field: 'album.images[0]',
						title: '',
						render: rowData => <img src={rowData.album.images[0].url} style={{width: 50, borderRadius: '50%'}}/>,
						filtering:false,
						//width:"5em"
					},
					{ title: 'Name', field: 'name', filtering:false,
						render: rowData =>
							<div>
												<span><PlayCircleOutlineIcon
													fontSize={'small'} onClick={() => handlePlay(rowData)}>
												</PlayCircleOutlineIcon></span>
								<span>{rowData.name}</span>
								<div style={{fontSize:".9em",color:"#a4a4a4"}}>
									by {rowData.artists.map((item,i) => (
									<span  key={item.id}>
													<span>{item.name}</span>
										{rowData.artists.length - 1 > i && <span>,{'\u00A0'}</span>}
												</span>
								))}
								</div>
							</div>},
					{
						field: 'genres',
						title: 'genres',
						//ender: rowData => getChips(rowData.genres),
						render: rowData => util.prepTracks(rowData),
						filtering:false,
						//width:"20em"
					},

				]}
				data={globalState[ globalUI.user.id + "_tracks"]}
				options={{...options,selection:!(statcontrol.mode)}}
				icons={icons}
				onSelectionChange={(rows) => handleSelectRecent(rows,'recent')}
			/>
		</TabPanel>
		<TabPanel value={tab} index={2}>
			<DiscreteSlider defaultValue={1} handleChange={(v) =>{setTerm(v)}}/>
			<MaterialTable
				title=""
				columns={[
					{
						field: 'images[0]',
						title: '',
						render: rowData => <img src={rowData.images[0].url} style={{width: 50, borderRadius: '50%'}}/>,
						filtering:false,
						//width:"5em"
					},
					{ title: 'Name', field: 'name', filtering:false},
					{
						field: 'genres',
						title: 'genres',
						//ender: rowData => getChips(rowData.genres),
						render: rowData => <GenreChipsSmart chipData={rowData.genres}/>,
						filtering:false,
						//width:"20em"
					},

				]}
				data={globalState[ globalUI.user.id + "_artists"].filter(i =>{return i.term === term})}
				options={{...options,selection:!(statcontrol.mode)}}
				onSelectionChange={(rows) => handleSelectSaved(rows,'top')}
			/>
		</TabPanel>
	</TabPanel>
	<TabPanel value={tabcontrol.section} index={1}>
		<AppBar position="static">
			<Tabs value={tab} onChange={handleTabSelect}>
				<Tab label="Artists"/>
				<Tab label="Playlists"/>
				<Tab label="Tracks"/>
				<Tab label="Albums"/>
			</Tabs>
		</AppBar>
		<TabPanel value={tab} index={0}>
			<MaterialTable
				title=""
				columns={[
					{
						field: 'name',
						title: '',
						render: rowData =>
							<div>
								<img src={rowData.images[0].url} style={{width: 50, borderRadius: '50%'}}/>
								<div>{rowData.name}</div>
							</div>,
						sorting:false,
						width:"5em"
					},
					{
						field: 'genres',
						title: 'genres',
						//ender: rowData => getChips(rowData.genres),
						render: rowData => {return <div style={{display:"flex",flexDirection:"column",flexWrap:"nowrap"}}>
							<div><GenreChipsSmart limit={true} chipData={rowData.genres}/></div>
							<div>active: {rowData['release_range'].earliest.release_date} - {rowData['release_range'].latest.release_date}</div>
						</div>},
						filtering:false,
						width:"10em"
					},

				]}
				data={globalState[ globalUI.user.id + "_artists"].filter(i =>{return i.source === 'saved'})}
				options={{...options,selection:!(statcontrol.mode)}}
				onSelectionChange={(rows) => handleSelectSaved(rows,'saved')}
			/>
		</TabPanel>
		<TabPanel value={tab} index={1}>
			{/*			/!*note: customizing material table*/}
			{/*			- the default search works on text provided by the column's 'field' attribute*/}
			{/*			- thinking 'customFilterAndSearch' can be used to setup searches for custom rendered columns*/}
			{/*			  https://github.com/mbrn/material-table/issues/67*/}
			<MaterialTable
				icons={icons}
				title=""
				columns={[
					{
						field: 'name',
						title: '',
						render: rowData =>
							<div>
								<img src={rowData.images[0].url} style={{width: 50, borderRadius: '50%'}}/>
								<div>{rowData.name}</div>
								<div style={{fontSize:".7em",color:"#a4a4a4"}}>{rowData.owner.display_name}</div>
							</div>,
						// sorting:false,
						// width:"10em"
					},
					//testing: not sure where to put this yet
					//was thinking maybe under 'Top Genres' could have 'see families' which would expose
					//how those genres map up into famlilies

					// {
					// 	field: 'families',
					// 	title: 'families',
					// 	//ender: rowData => getChips(rowData.genres),
					// 	render: rowData => prepPlay(rowData,'families'),
					// 	filtering:false,
					// 	width:"20em"
					// },
					{
						field: 'artists',
						title: 'Top Artists',
						render: rowData => prepPlay(rowData,'artists'),
						// customFilterAndSearch: (value, rowData) => {
						// 	//todo:
						// },
						sorting:false,
						// width:"20em"
					},
					{
						field: 'genres',
						title: 'Top Genres',
						//ender: rowData => getChips(rowData.genres),
						render: rowData => prepPlay(rowData,'genres'),
						sorting:false,
						// width:"15em"
					},
					{
						field: 'tracks.total',
						title: 'Length',
						//ender: rowData => getChips(rowData.genres),
						render: rowData =>
							<div>
								{rowData.tracks.total}
							</div>,
						sorting:true,
						customSort: (a, b) => a.tracks.total - b.tracks.total,
						// width:"15em"
					},
				]}
				data={globalState[ globalUI.user.id + "_playlists"]}
				options={{...options,selection:!(statcontrol.mode)}}
				onSelectionChange={(rows) => handleSelectPlaylist(rows)}
			/>
		</TabPanel>
		<TabPanel value={tab} index={2}>
			<MaterialTable
				title=""
				columns={[
					{
						field: 'name',
						title: 'Name',
						//ender: rowData => getChips(rowData.genres),
						render: rowData => <div key={rowData.id} style={{display:"flex"}}>
							<div>
								<img height={70} src={rowData.album.images[0].url} />
							</div>
							<div>
								<div>{rowData.name}</div>
								<div style={{fontSize:".9em",color:"#a4a4a4"}}>
									by {rowData.artists.map((artist,i) => (
									<span  key={artist.id}>
														<span>{artist.name}</span>
										{rowData.artists.length - 1 > i && <span>,{'\u00A0'}</span>}
													</span>
								))}
								</div>
								{/*<div>{styleAddedAt(rowData.added_at)}</div>*/}
							</div>
						</div>,
						filtering:false,
						//width:"20em"
					},
					{
						field: 'genres',
						title: 'genres',
						//ender: rowData => getChips(rowData.genres),
						render: rowData => util.prepTracks(rowData),
						filtering:false,
						//width:"20em"
					},

				]}
				data={globalState[ globalUI.user.id + "_tracks"].filter(i =>{return i.source === 'saved'})}
				options={{...options,selection:!(statcontrol.mode)}}
				onSelectionChange={(rows) => handleSelectSaved(rows,'saved')}
			/>
		</TabPanel>
	</TabPanel>
	<TabPanel value={tabcontrol.section} index={2}>
	</TabPanel>
</div>
