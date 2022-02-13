import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles((theme) => ({
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		// width: 400,
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1,
	},
	iconButton: {
		padding: 10,
	},
	divider: {
		height: 28,
		margin: 4,
	},
}));

export default function CustomizedInputBase(props) {
	const classes = useStyles();
	return (
		<Box width={props.width || '20em'}>
			<Paper component="form" className={classes.root}>
				<IconButton className={classes.iconButton}>
					<SearchIcon />
				</IconButton>
				<InputBase
					className={classes.input}
					placeholder={props.placeholder}
					value={props.value} onChange={props.onChange} onClick={props.onClick}
					fullWidth={true}
					size={'medium'}
				/>
				<Divider className={classes.divider} orientation="vertical" />
				<IconButton onClick={props.clearForm} color="primary" className={classes.iconButton} >
					<ClearIcon />
				</IconButton>
			</Paper>
		</Box>
	);
}
