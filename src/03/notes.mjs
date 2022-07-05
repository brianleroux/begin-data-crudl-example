import data from '@begin/data'
import Tags from './tags.mjs'
import fmt from './_formatter.mjs'
import valid from './_validations.mjs'

/**
 * crudl take 3
 *
 * - [x] roughed in types
 * - [x] one-to-many relationship (one user has-many notes) 
 * - [x] many-to-many relationship (one note has-many tags; one tag has-many notes)
 * - [x] formatting
 * - [x] validation
 * - [x] pagination
 */

/**
 * @typedef {Object} Notes - a data access layer to read/write Note objects
 */
export default class Notes {

  /** @param {string} userKey - the key for the user these notes belong to */
  constructor (userKey) {
    this.table = `notes-${ userKey }`
  }
    
  /** @typedef {{ body: string, tags: string[] }} NotesCreateParams */
  async create ({ body, tags }) {

    // validate the note payload
    await valid.note({ body, tags })

    // looks good time to write
    let table = this.table
    let ts = Date.now()

    // need to write the record to get a noteKey
    let record = await data.set({ table, body, tags, ts })

    // now we can save the tags 
    await Tags.noteCreated({ noteKey: record.key, ts, tags })

    // finally return the formatted record
    return fmt(record)
  }

  /** @typedef {{ key: string }} NotesReadParams */
  async read ({ key }) {
    let table = this.table
    let raw = await data.get({ table, key })
    return fmt(raw)
  }

  /** @typedef {{ key: string, body: string }} NotesUpdateParams */
  async update ({ key, body }) {
    let table = this.table
    let old = await data.get({ table, key })
    old.body = body
    old.updated = Date.now()
    let raw = await data.set(old)
    return fmt(raw)
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

  /** @typedef {{ limit:number }} NotesListParams */
  async list ({ limit=5 }) {
    let table = this.table
    let raw = await data.get({ table, limit })
    let cursor = raw.cursor || false
    return { notes: raw.map(fmt), cursor }
  }
}
