import data from '@begin/data'
import Tags from './tags.mjs'

/**
 * crudl take 2
 *
 * - [x] roughed in types
 * - [x] one-to-many relationship (one user has-many notes) 
 * - [x] many-to-many relationship (one note has-many tags; one tag has-many notes)
 * - [ ] formatting
 * - [ ] validation
 * - [ ] pagination
 */

/**
 * @typedef {Object} Notes - a data access layer to read/write Note objects
 */
export default class Notes {

  constructor (key) {
    this.table = `notes-${ key }`
  }
    
  /** @typedef {{ body: string, tags: string[] }} NotesCreateParams */
  async create ({ body, tags }) {
    let table = this.table
    let ts = Date.now()
    // need to write the record to get a noteKey
    let record = await data.set({ table, body, tags, ts })
    // now we can save the tags 
    await Tags.save({ noteKey: record.key, ts, tags })
    return record
  }

  /** @typedef {{ key: string }} NotesReadParams */
  async read ({ key }) {
    let table = this.table
    return data.get({ table, key })
  }

  /** @typedef {{ key: string, body: string }} NotesUpdateParams */
  async update ({ key, body }) {
    let table = this.table
    let old = await data.get({ table, key })
    old.body = body
    old.updated = Date.now()
    return data.set(old)
  }

  /** @typedef {{ key: string }} NotesDestroyParams */
  async destroy (key) {
    let table = this.table
    // read the record back
    let old = await data.get({ table, key })
    // remove it
    await data.destroy({ table, key })
    // notify the tags data access layer to cleanup
    await Tags.noteDestroyed({ noteKey: key, tags: old.tags })
  }

  /** @typedef {{}} NotesListParams */
  async list (params={}) {
    let table = this.table
    return data.get({ table })
  }
}
