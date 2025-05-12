import { LocalStorage  } from 'node-localstorage'

//  @see https://www.npmjs.com/package/node-localstorage

/**
 * Creates a new instance of LocalStorage with the specified location.
 *
 * @param   {string}       location - The location where the local storage data will be stored.
 * @returns {LocalStorage}          - A new instance of LocalStorage.
 * @example import { localStorage } from "@dovenv/utils"
 *
 * // Creates a local storage instance in the './myStorage' directory
 * const storage = localStorage('./myStorage');
 * // Sets an item in the local storage
 * storage.setItem('key', 'value');
 * // Retrieves the value of the item from the local storage
 * const value = storage.getItem('key');
 */
export function localStorage( location: string ) {

	return new LocalStorage( location )

}
