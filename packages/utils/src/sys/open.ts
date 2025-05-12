import * as o from 'open'

/**
 * Opens a system file or URL.
 *
 * @param {string} target - The file path or URL to open.
 * @example import { open } from "@dovenv/utils"
 *
 * // Opens the image in the default image viewer.
 * await open('pigeon.png', {wait: true});
 */
export const open = o.default

/**
 * Open an app. Cross-platform.
 *
 * @param {string} name - The app you want to open. Can be either builtin supported apps names or other name supported in platform.
 * @example import { openApp } from "@dovenv/utils"
 *
 * // Open Xcode
 * await openApp('xcode');
 */
export const openApp = o.openApp
