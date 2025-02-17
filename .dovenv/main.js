import core                         from './const.js'
import { defineConfig }             from '../packages/core/dist/main.mjs'
import { pigeonposseMonorepoTheme } from '../packages/theme/pigeonposse/dist/main.mjs'

export default defineConfig(
	pigeonposseMonorepoTheme( { core } ),
)
