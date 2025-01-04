import {
	getPKG,
	getPKGVersion,
} from './main'

console.log(
	await getPKG( '@dovenv/core' ),
	await getPKGVersion( '@dovenv/core' ),
)
