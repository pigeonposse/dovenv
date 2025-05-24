import { sys } from 'creatium'

export const dataDir = sys.joinPath( sys.getDirName( sys.fileURLToPath( import.meta.url ) ) )
