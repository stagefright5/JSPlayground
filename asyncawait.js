function syncf() {
	let x = 0;
	// while (x < 5) { console.log('x', x++); };
	while (x < 3) asyncf(x++);
	return 'sync done'
}
function p() {
	return new Promise((resolve) => setTimeout(() => resolve('sto'), 1000 * Math.random()))
}
async function asyncf() {
	i = 0;
	console.log('async started')
	while (i < 3) { console.log('i'); console.log(await p(), `async ${i++} end`) }
}

// 1.
// syncf();
// Output
/**
 async started
i
async started
i
async started
i
sto async 0 end
i
sto async 1 end
i
sto async 2 end
sto async 3 end
sto async 4 end
*/


// 2.
y = 0; while (y++ < 3) syncf();
/*
async started
i
async started
i
async started
i
async started
i
async started
i
async started
i
async started
i
async started
i
async started
i
sto async 0 end
i
sto async 1 end
i
sto async 2 end
sto async 3 end
sto async 4 end
sto async 5 end
sto async 6 end
sto async 7 end
sto async 8 end
sto async 9 end
sto async 10 end
*/