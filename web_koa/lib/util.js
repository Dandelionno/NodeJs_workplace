const Util = {
	sleep: (sec) => new Promise ((resolve) => {
		setTimeout(resolve, sec);
	}),	
}

module.exports = Util;