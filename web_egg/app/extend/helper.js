const Helper = {
	sleep: (sec) => new Promise ((resolve) => {
		setTimeout(resolve, sec);
	}),	

}

module.exports = Helper;