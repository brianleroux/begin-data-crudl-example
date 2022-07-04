import data from '@begin/data'

const table = 'users'

export default {

  /** @typedef {{ name: string, password: string }} UserCreateParams */
  async create (params) {
    return data.set({ table, ...params })
  },

  /** @param {string} key */
  async read (key) {
    return data.get({ table, key })
  },

  /** @typedef {{ name: string, key: string }} UserUpdateParams */
  async update ({ key, name }) {
    let user = await data.get({ table, key })
    user.name = name
    return data.set(user)
  },

  /** @typedef {key: string} UsersDestroyParams */
  async destroy (key) {
    await data.destroy({ table, key })
  }
}
