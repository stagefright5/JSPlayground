/**
 * This script generates a roster for the MDS PG team.
 * The roster is generated for 100 * 3 days.
 * The roster is generated in the following CSV format:
 * Person,Date,Day,Yay!
 * Bobby,01-01-2021,Friday,
 * Meghana,02-01-2021,Saturday,
 * Suchith,03-01-2021,Sunday,
 * etc..
 * The script takes an optional argument to start the roster from a specific person.
 * Example: node roster-calculator.mjs 1 -- This will start the roster from Meghana.
 * As of now, it starts from current date.
 */

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const peopleInOrder = ['Bobby', 'Meghana', 'Suchith'];
const daysInAWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const formatToddMMyyyy = date => {
	const d = new Date(date);
	return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
		.toString()
		.padStart(2, '0')}-${d.getFullYear()}`;
};

// TODO: The script also takes an optional argument to start the roster from a specific date.
const compute = (people, startIndex = 0) => {
	startIndex = process.argv[2] ? parseInt(process.argv[2]) : startIndex;
	const lines = [];
	let noOfCelebrations = 0;
	const start = new Date();
	for (let i = 0; i < 100; i++) {
		for (let pi = startIndex; pi < startIndex + people.length; pi++) {
            // This will make sure that the roster is generated in a round robin fashion.
            const p = people[pi % people.length];
            // celebrate only if it is a Friday and it is Meghana's turn.
			const celebrate = p === 'Meghana' && start.getDay() === 5 ? ',🥳🥳🥳🥳' : ',';
			if (celebrate) {
				noOfCelebrations++;
			}
			lines.push(`${p},${formatToddMMyyyy(start)},${daysInAWeek[start.getDay()]}${celebrate}`);
			start.setDate(start.getDate() + 1);
		}
	}
	lines.unshift(`Student,Date,Day,Yay!`);
	return lines;
};

const lines = compute(peopleInOrder);
writeFile(join('./MDS_PG_Rooster.csv'), lines.join('\n'), {
	encoding: 'utf-8',
	flag: 'w'
});
