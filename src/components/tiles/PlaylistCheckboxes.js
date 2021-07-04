import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	formControl: {
		margin: theme.spacing(3),
	},
}));

export default function PlaylistCheckboxes(props ) {
	const classes = useStyles();



	const { collaborative, me, spotify } = props.state;

	return (
		<div className={classes.root}>
			<FormControl component="fieldset" className={classes.formControl}>
				<FormLabel component="legend">Owner</FormLabel>
				<FormGroup>

					<FormControlLabel
						control={<Checkbox checked={me} onChange={props.handleChange} name="me" />}
						label="Created by Me"
					/>
					<FormControlLabel
						control={<Checkbox checked={spotify} onChange={props.handleChange} name="spotify" />}
						label="Created by Spotify"
					/>
					<FormControlLabel
						control={<Checkbox checked={collaborative} onChange={props.handleChange} name="collab" />}
						label="Collaborative"
					/>
				</FormGroup>
			</FormControl>
		</div>
	);
}
