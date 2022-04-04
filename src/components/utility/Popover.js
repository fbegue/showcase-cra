import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import Fab from '@material-ui/core/Fab';
// import SPW from '../utility/StopPropagationWrapper'

const useStyles = makeStyles((theme) => ({
	typography: {
		padding: theme.spacing(2),
	},
}));

export default function SimplePopover(props) {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	return (
		<div>
			{/*<Button aria-describedby={id} variant="contained" color="primary" onClick={handleClick}>*/}
			{/*	Open Popover*/}
			{/*</Button>*/}
			<div onClick={(e) => {
				e.stopPropagation();
			}}>
				<Fab color="secondary" size={'small'} aria-label="add">
					{/*todo: until there are more features here*/}
					{/*<MoreVertIcon onClick={handleClick}/>*/}
					
					<PlaylistAddIcon onClick={handleClick}/>

				</Fab>
				<Popover
					id={id}
					open={open}
					anchorEl={anchorEl}
					onClose={handleClose}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
				>
					<Typography className={classes.typography}>{props.content}</Typography>
				</Popover>
			</div>

		</div>
	);
}
