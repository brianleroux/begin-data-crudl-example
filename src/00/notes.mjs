import data from '@begin/data'

/**
 * bare bones crudl! no types, no joins, no pagination, and minimal validation
 */
const table = 'notes'

export default {

  async create (params) {
    return data.set({ ...params, table })
  },

  async update (params) {
    if (!params.key) throw Error('missing key')
    return data.set({ ...params, table })
  }, 

  async destroy (key) {
    return data.destroy({ table, key })
  },

  async read (key) {
    return data.get({ table, key })
  },

  async list () {
    return data.get({ table })
  }
}
