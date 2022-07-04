import data from '@begin/data'

/**
 * bare bones crudl! no types, no joins, no validation, nor pagination
 */
const table = 'notes'

export default {

  async create (params) {
    return data.set({ ...params, table })
  },

  async update (params) {
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
