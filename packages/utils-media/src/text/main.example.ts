
import { text2image } from './main'
import {
	asciiFont as font,
	icon,
} from '../../styles/main'
import {
	ensureDir,
	getCurrentDir,
	joinPath,
	writeFile,
} from '../../sys/main'
// import { image } from '../image/main'

const ascii = {
	1 : font( 'Hello, World!', '3-D' ),
	2 : `                                                            
          11ttttffffffffLLLLLLLLLLLLLLLLffffffffttCC        
        ttttffffffffLLLLLLLLLLLLLLLLLLLLLLLLLLffff11        
        11ffffLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLffffttii      
        ttffLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLffffttii      
        ttffLLLLLLLLGG88LLLLLLCC88LLCC00LLLLffffttttii      
        ttffLLLLLLGG@@88LLLLLL00@@LLCC@@88LLffffttttii      
        ttffLLLLGG@@88CCLLLLCC@@00LLLLGG@@88LLffttttii      
        11ffffLL88@@GGLLLLLL00@@CCLLLLff00@@GGffttttii      
        11ffffLLCC@@@@CCLLLL@@88LLffffGG@@88ffffttttii      
        11ffffLLLLGG@@88LLGG@@CCffffCC@@88ffffffttttii      
        11ttffffLLLLCC00LLCC00ffffffLL00ffffffffttttii      
        11ttffffLLLLLLLLLLffffffffffffffffffffttttttii      
        11ttffffffLLLLLLffffffffffffffttttttfftttttt11      
        iittfffffffffffffffffffffffffftttttttttttt11        
        iittttfffffftttttttttttttttttttttttttt1111          
        ii11tttttt11                                        
        ii1111ii                                            
        ;;iiii                                              
        ;;ff                                                
`,
	3 : `Hello, World! ${icon.ellipsis}`,
}

const buildDir = joinPath( getCurrentDir( import.meta.url ), '..', '..', '..', 'build' )

await ensureDir( buildDir )
for ( const key in ascii ) {

	// @ts-ignore
	const input = ascii[key] as string
	const image = await text2image( { input: input } )
	await writeFile( joinPath( buildDir, `text${key}.png` ), image )
	console.log( { input } )

}

// console.log( IMG )
