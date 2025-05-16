import { LazyLoader }   from '.'
import { dependencies } from '../../../package.json'

type LoadFunction<T = unknown> = () => Promise<T>
type Pkgs = keyof typeof dependencies
const deps                             = Object.keys( dependencies ) as Pkgs[]
const opts: Record<Pkgs, LoadFunction> = deps.reduce( ( acc, packageName ) => {

	acc[packageName as Pkgs] = async () => ( await import( packageName ) ).default
	return acc

}, {} as Record<Pkgs, LoadFunction> )

const loader = new LazyLoader(
	opts,
	{ debug: true },
)

const runTest = async ( name: Pkgs ) => {

	const x1 = await loader.get( name )
	const x2 = await loader.get( name )

	console.log( x1 === x2 )

}

deps.forEach( runTest )
