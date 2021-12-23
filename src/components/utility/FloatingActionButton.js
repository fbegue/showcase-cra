import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

//src:https://v4.mui.com/components/floating-action-button/#floating-action-button-2

const useStyles = makeStyles((theme) => ({
	root: {
		'& > *': {
			margin: theme.spacing(1),
		},
	}
}));

export default function FloatingActionButton(props) {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<Fab size="large" color="primary" aria-label="add">
				{props.icon}
			</Fab>
		</div>
	);
}
