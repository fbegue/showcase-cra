import React, { useState } from 'react';

import { addDays, format } from 'date-fns';
import { DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const pastMonth = new Date(2020, 10, 15);

export default function DatePicker() {
	const defaultSelected = {
		from: pastMonth,
		to: addDays(pastMonth, 4)
	};
	const [range, setRange] = useState(defaultSelected);

	var handleSetRange = function(){}
	console.log("range",range);


	let footer = <p></p>;
	if (range?.from) {
		if (!range.to) {
			footer = <p>{format(range.from, 'PPP')}</p>;
		} else if (range.to) {
			footer = (
				<p>
					{format(range.from, 'PPP')}–{format(range.to, 'PPP')}
				</p>
			);
		}
	}
	return (
		<DayPicker
			mode="range"
			defaultMonth={pastMonth}
			selected={range}
			footer={footer}
			onSelect={setRange}
		/>
	);
}
