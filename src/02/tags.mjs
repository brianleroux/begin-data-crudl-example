import data from '@begin/data'

export default {

  async read (tag) {
    return data.get({ table: `tags-${ tag }` })
  },
  
  async list () {
    return data.get({ table: 'tags' })
  },

  async save ({ noteKey, ts, tags }) {
    // saves tag and increments tag count
    let table = 'tags' 
    let prop = 'totals'
    let ops = tags.map(key => data.incr({ table, key, prop })) 
    await Promise.all(ops)
    // saves tag -> noteID
    let ops2 = tags.map(key => data.set({ table: `tags-${ key }`, key: noteKey, ts })) 
    await Promise.all(ops2) 
  },

  async noteDestroyed({ noteKey, tags }) {

    let table = 'tags' 
    let prop = 'totals'

    // decrement from any totals
    let ops = tags.map(key => data.decr({ table, key, prop })) 
    let results = await Promise.all(ops)

    // check results for totals:0 and if so remove that tag altogether
    for (let t of results) {
      if (t.totals <= 0) {
        await data.destroy(t)
      }
    }

    // remove relationship between tag and noteKey
    let ops2 = tags.map(key => data.destroy({ table: `tags-${ key }`, key: noteKey })) 
    await Promise.all(ops2)
  }
}
