import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { daysInAWeek, monthsInAYear } from './consts.mjs';

const peopleInOrder = ['Souvik', 'Meghana', 'Nishmitha', 'Suchith', 'Bobby'];
/**
 * @description DayPresentationType is a map of day to the presentation type.
 */
const DayPresentationType = {
	1: 'Seminar',
	3: 'JC',
	6: 'Case Presentation'
};

const compute = (people, startIndex = 0, startDate = new Date()) => {
	console.log('Starting the roster from:', people[startIndex]);
	startIndex = process.argv[2] ? parseInt(process.argv[2]) : startIndex;
	const lines = [`Date,Student,Day,Presentation Type`];
	console.log('Starting the roster on:', startDate);
	let pi = startIndex;
	for (let i = 0; i < 100; i++) {
		// This will make sure that the roster is generated in a round robin fashion.
		const day = startDate.getDay();
		if (DayPresentationType[day]) {
			const p = people[pi % people.length];
			pi++;
			lines.push(`${formatToddMMyyyy(startDate)},${p},${daysInAWeek[day]},${DayPresentationType[day]}`);
		}
		startDate.setDate(startDate.getDate() + 1);
	}
	return lines;
};

const formatToddMMyyyy = date => {
	const d = new Date(date);
	const f = `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
		.toString()
		.padStart(2, '0')}-${d.getFullYear()}`;
	return f;
};

const startDate = new Date();
startDate.setMonth(monthsInAYear.indexOf('July'));
startDate.setDate(2);
const lines = compute(peopleInOrder, 0, startDate);
console.log(lines);
writeFile(join('./MDS_Presentation_Rooster.csv'), lines.join('\n'), {
	encoding: 'utf-8',
	flag: 'w'
});
