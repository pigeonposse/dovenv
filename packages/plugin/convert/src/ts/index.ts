
// import {
// 	md2html,
// 	process,
// 	relativePath,
// } from '@dovenv/core/utils'
// import {
// 	buildDocumentation,
// 	documentationToMarkdown,
// } from 'tsdoc-markdown'
// import {
// 	BuildOptions,
// 	MarkdownOptions,
// } from 'tsdoc-markdown/dist/types/types'

// import { ConvertSuper } from '../_shared/main'

// import type {
// 	ConvertPropsSuper,
// 	ConvertResponse,
// 	ConvertSuperInterface,
// } from '../_shared/types'

// type TsProps = {
// 	build? : BuildOptions
// 	md?    : MarkdownOptions
// 	title? : string | false
// }
// export type Typescript2MarkdownProps = ConvertPropsSuper & { opts?: TsProps }

// export type Typescript2HtmlProps = ConvertPropsSuper & { opts?: TsProps }

// export class Typescript2Markdown extends ConvertSuper<Typescript2MarkdownProps> implements ConvertSuperInterface {

// 	props

// 	constructor( props: Typescript2MarkdownProps ) {

// 		super( props )
// 		this.props = props

// 	}

// 	async run(): Promise<ConvertResponse> {

// 		const inputFiles = ( typeof this.props.input === 'string' ? [ this.props.input ] : this.props.input )
// 		// .map( i => relativePath( process.cwd(), i ) )

// 		const doc = ( await buildDocumentation( {
// 			inputFiles,
// 			options : {
// 				explore : true,
// 				types   : true,
// 				...this.props.opts?.build,
// 			},
// 		} ) )
// 			.map( i => ( {
// 				...i,

// 				jsDocs : i.jsDocs?.map( j => ( j.name === 'example'
// 					? {
// 						...j,
// 						text : j.text?.map( t => t.kind === 'text' && ( !t.text.startsWith( '```' ) && !t.text.endsWith( '```' ) )
// 							? {
// 								...t,
// 								text : '```js\n' + t.text + '\n```',
// 							}
// 							: j,
// 						),
// 					}
// 					: j ) ),
// 			} ) )
// 		console.dir( doc, { depth: null } )
// 		let content = await documentationToMarkdown( {
// 			// @ts-ignore
// 			entries : doc,
// 			options : {

// 				emoji : null,
// 				...this.props.opts?.md,
// 			},
// 		} )
// 		if ( this.props.opts?.title !== false ) content = `# ${this.props?.opts?.title || 'Documentation'}\n\n${content}`
// 		const res: ConvertResponse = []
// 		await this._forEachContent( this.props.input, async i => {

// 			// console.log( this.props.output, i.id + '.md' )
// 			if ( this.props.output ) await this._writeOutput( this.props.output, i.id + '.md', content )

// 			res.push( {
// 				id : i.id,
// 				content,
// 			} )

// 		} )

// 		return res

// 	}

// }
// export class Typescript2Html extends Typescript2Markdown {

// 	async run(): Promise<ConvertResponse> {

// 		const output      = this.props.output
// 		this.props.output = undefined
// 		const htmlRes     = await super.run()

// 		return await Promise.all( htmlRes.map( async i => {

// 			if ( output ) await this._writeOutput( output, i.id + '.html', i.content )
// 			return {
// 				...i,
// 				content : await md2html( i.content ),
// 			}

// 		} ) )

// 	}

// }

