import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles,withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import WarningIcon from '@material-ui/icons/Warning';

import {  } from '@material-ui/core/styles';

const useRowStyles = makeStyles({
	tableRow: {
		height: 30
	},
});


function Row(props) {
	const { row } = props;
	const [open, setOpen] = React.useState(false);
	const classes = useRowStyles();




	var handleDelete = (row) =>{
		console.log("handleDelete",row);

	}

	return (
		<React.Fragment>
			<TableRow onClick={() => setOpen(!open)} className={classes.tableRow}>
				<TableCell component="th" scope="row">
					{row.name}
				</TableCell>
				<TableCell align="left">{row.myUpdated}</TableCell>
				{/*<TableCell align="right">{row.fat}</TableCell>*/}
				{/*<TableCell align="right">{row.carbs}</TableCell>*/}
				<TableCell align="left">
					<div onClick={() =>{handleDelete(row)}}><DeleteIcon/></div>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					{/*<Collapse in={open} timeout="auto" unmountOnExit>*/}
					{/*	<Box margin={1}>*/}
					{/*		<Typography variant="h6" gutterBottom component="div">*/}
					{/*			History*/}
					{/*		</Typography>*/}
					{/*		<Table size="small" aria-label="purchases">*/}
					{/*			<TableHead>*/}
					{/*				<TableRow>*/}
					{/*					<TableCell>Date</TableCell>*/}
					{/*					<TableCell>Customer</TableCell>*/}
					{/*					<TableCell align="right">Amount</TableCell>*/}
					{/*					<TableCell align="right">Total price ($)</TableCell>*/}
					{/*				</TableRow>*/}
					{/*			</TableHead>*/}
					{/*			<TableBody>*/}
					{/*				{row.history.map((historyRow) => (*/}
					{/*					<TableRow key={historyRow.date}>*/}
					{/*						<TableCell component="th" scope="row">*/}
					{/*							{historyRow.date}*/}
					{/*						</TableCell>*/}
					{/*						<TableCell>{historyRow.customerId}</TableCell>*/}
					{/*						<TableCell align="right">{historyRow.amount}</TableCell>*/}
					{/*						<TableCell align="right">*/}
					{/*							{Math.round(historyRow.amount * row.price * 100) / 100}*/}
					{/*						</TableCell>*/}
					{/*					</TableRow>*/}
					{/*				))}*/}
					{/*			</TableBody>*/}
					{/*		</Table>*/}
					{/*	</Box>*/}
					{/*</Collapse>*/}
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

export default function PlaylistSubMuiTable(props) {

	return (
		<TableContainer component={Paper}>
			<Table  style={{minHeight:"20em"}} aria-label="collapsible table">
				<TableHead>
					<TableRow>
						<TableCell >Title</TableCell>
						{/*<TableCell>Dessert (100g serving)</TableCell>*/}
						<TableCell align="left">Updated</TableCell>
						<TableCell align="left">&nbsp;</TableCell>
						{/*<TableCell align="right">Created</TableCell>*/}
						{/*<TableCell align="right">Carbs&nbsp;(g)</TableCell>*/}
						{/*<TableCell align="right">Protein&nbsp;(g)</TableCell>*/}
					</TableRow>
				</TableHead>
				<TableBody>
					{props.playlists.map((row) => (
						<Row key={row.id} row={row} />
					))}
				</TableBody>
			</Table>
			<div style={{height:"1em"}}> &nbsp;</div>
		</TableContainer>
	);
}

//testing: when I couldn't get column widths working (just b/c everything was so small)

const StyledTableRow = withStyles((theme) => ({
	root: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.action.hover,
		},
	},
}))(TableRow);
const StyledTableHeaderCell = withStyles((theme) => ({
	head: {
		// backgroundColor: theme.palette.common.black,
		// color: theme.palette.common.white,
	},
	body: {
		width:'10em',
		fontSize: 14,
		color:'blue'
	},
}))(TableCell);

//testing: example row collapse
// function RowCollapseEx(props) {
// 	const { row } = props;
// 	const [open, setOpen] = React.useState(false);
// 	const classes = useRowStyles();
// 	return (
// 		<React.Fragment>
// 			<TableRow onClick={() => setOpen(!open)} className={classes.root}>
// 				<TableCell component="th" scope="row">
// 					{row.name}
// 				</TableCell>
//
// 				<TableCell align="right">{row.calories}</TableCell>
// 				<TableCell align="right">{row.fat}</TableCell>
// 				{/*<TableCell align="right">{row.carbs}</TableCell>*/}
// 				{/*<TableCell align="right">{row.protein}</TableCell>*/}
// 				<TableCell>
// 					<IconButton aria-label="expand row" size="small" >
// 						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
// 					</IconButton>
// 				</TableCell>
// 			</TableRow>
// 			<TableRow>
// 				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
// 					<Collapse in={open} timeout="auto" unmountOnExit>
// 						<Box margin={1}>
// 							<Typography variant="h6" gutterBottom component="div">
// 								History
// 							</Typography>
// 							<Table size="small" aria-label="purchases">
// 								<TableHead>
// 									<TableRow>
// 										<TableCell>Date</TableCell>
// 										<TableCell>Customer</TableCell>
// 										<TableCell align="right">Amount</TableCell>
// 										<TableCell align="right">Total price ($)</TableCell>
// 									</TableRow>
// 								</TableHead>
// 								<TableBody>
// 									{row.history.map((historyRow) => (
// 										<TableRow key={historyRow.date}>
// 											<TableCell component="th" scope="row">
// 												{historyRow.date}
// 											</TableCell>
// 											<TableCell>{historyRow.customerId}</TableCell>
// 											<TableCell align="right">{historyRow.amount}</TableCell>
// 											<TableCell align="right">
// 												{Math.round(historyRow.amount * row.price * 100) / 100}
// 											</TableCell>
// 										</TableRow>
// 									))}
// 								</TableBody>
// 							</Table>
// 						</Box>
// 					</Collapse>
// 				</TableCell>
// 			</TableRow>
// 		</React.Fragment>
// 	);
// }

