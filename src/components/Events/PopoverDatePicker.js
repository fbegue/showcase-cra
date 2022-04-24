import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
// import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import DateRangeIcon from '@material-ui/icons/DateRange';
import Fab from '@material-ui/core/Fab';
import DatePicker from "./DatePicker";
const useStyles = makeStyles((theme) => ({
	typography: {
		padding: theme.spacing(2),
	},
}));

export default function PopoverDatePicker(props) {
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
				<Fab component={'div'} color="secondary" size={'small'} aria-label="add">
					{/*todo: until there are more features here*/}
					{/*<MoreVertIcon onClick={handleClick}/>*/}
					<DateRangeIcon onClick={handleClick}/>
					{/*<PlaylistAddIcon onClick={handleClick}/>*/}

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

						<DatePicker/>

				</Popover>
			</div>

		</div>
	);
}
