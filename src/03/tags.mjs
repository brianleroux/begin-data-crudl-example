import data from '@begin/data'
import fmt from './_formatter.mjs'

/**
 * @typedef {Object} Tags - a data access layer to read/write tags
 */
export default {

  /** @typedef {{ tag: string, cursor: string }} ReadTagParams - paginate notes by tag */
  async read (params={}) {
    let tag = params.tag
    let raw = await data.get({ table: `tags-${ tag }`, ...params })
    let notes = raw.map(fmt).map(r => ({ noteKey: r.key, ts: r.ts }))
    let cursor = raw.cursor || false
    return { notes, cursor }
  },
  
  /** @typedef {{cursor: string}} TagListParams - paginate tags */
  async list (params={}) {
    let raw = await data.get({ table: 'tags', ...params })
    let tags = raw.map(fmt).map(r => ({ name: r.key, count: r.totals }))
    let cursor = raw.cursor || false
    return { tags, cursor }
  },

  /** @typedef {{ noteKey: string, ts: number, tags: string[] }} NoteCreatedParams - update tags after note created */
  async noteCreated ({ noteKey, ts, tags }) {

    // saves tag and increments tag count
    let table = 'tags' 
    let prop = 'totals'
    let ops = tags.map(key => data.incr({ table, key, prop })) 
    await Promise.all(ops)

    // saves tag -> noteID
    let ops2 = tags.map(key => data.set({ table: `tags-${ key }`, key: noteKey, ts })) 
    await Promise.all(ops2) 
  },

  /** @typedef {{ noteKey: string, tags: string[] }} NoteDestroyedParams - update tags after note destroyed */
  async noteDestroyed ({ noteKey, tags }) {

    let table = 'tags' 
    let prop = 'totals'

    // decrement from any totals
    let ops = tags.map(key => data.decr({ table, key, prop })) 
    let results = await Promise.all(ops)

    // check results for totals:0 and if so remove that tag altogether
    let ops2 = [] 
    for (let t of results) {
      if (t.totals <= 0) {
        ops2.push(data.destroy(t))
      }
    }
    await Promise.all(ops2)

    // remove relationship between tag and noteKey
    let ops3 = tags.map(key => data.destroy({ table: `tags-${ key }`, key: noteKey })) 
    await Promise.all(ops3)
  }
}
