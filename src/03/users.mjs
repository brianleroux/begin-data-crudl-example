import data from '@begin/data'
import fmt from './_formatter.mjs'
import valid from './_validations.mjs'

const table = 'users'

/**
 * @typedef {Object} Users - a data access layer to read/write users
 */
export default {

  /** @typedef {{ name: string, password: string }} UsersCreateParams */
  async create (params) {
    await valid.user(params)
    let raw = await data.set({ table, ...params })
    return fmt(raw)
  },

  /** @param {string} key */
  async read (key) {
    let raw = await data.get({ table, key })
    return fmt(raw)
  },

  /** @typedef {{ name: string, key: string }} UsersUpdateParams */
  async update ({ key, name }) {
    let user = await data.get({ table, key })
    user.name = name
    let raw = await data.set(user)
    return fmt(raw)
  },

  /** @typedef {key: string} UsersDestroyParams */
  async destroy (key) {
    await data.destroy({ table, key })
  }
}
