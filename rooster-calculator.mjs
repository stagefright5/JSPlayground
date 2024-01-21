import { writeFile } from 'node:fs/promises';
const peopleInOrder = ['Bobby', 'Meghana', 'Suchith'];
const daysInAWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const formatToddMMyyyy = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${d.getFullYear()}`;
};

const compute = (people) => {
    const lines = [];
    let noOfCelebrations = 0;
    const start = new Date();
    for (let i = 0; i < 100; i++) {
        for (const p of people) {
            const celebrate = p === 'Meghana' && start.getDay() === 5 ? '=> 🥳🥳🥳🥳' : '';
            if (celebrate) {
                noOfCelebrations++;
            }
            lines.push(`${p} => ${formatToddMMyyyy(start)} => ${daysInAWeek[start.getDay()]} ${celebrate}`);
            start.setDate(start.getDate() + 1);
        }
    }
    // lines.unshift(`No of Good Fridays: ${noOfCelebrations}`);
    return lines;
};

const lines = compute(peopleInOrder);

writeFile('MDS_PG_Rooster.txt', lines.join('\n'), 'utf-8');
