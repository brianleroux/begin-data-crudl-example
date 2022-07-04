import data from '@begin/data'

/**
 * slightly less basic crudl;
 *
 * - [x] roughed in types
 * - [x] one-to-many relationship (one user has-many notes) 
 * - [ ] many-to-many relationship
 * - [ ] formatting
 * - [ ] validation
 * - [ ] pagination
 *
 * @typedef {Object} User - a user object
 * @property {string} key - a unique user id
 * @property {string} name - the users name
 * @property {string} password - hashed password
 */
let exampleUser = { key: 'XXXXXXX', name: 'brian', password: 'xxx' }

/**
 * @typedef {Object} Users - a data access layer to read/write User objects
 */
export default {

  /** @typedef {{ name: string, password: string }} UserCreateParams */
  async create (params) {
    return data.set({ table: 'users', ...params })
  },

  /** @param {string} key */
  async read (key) {
    return data.get({ table: 'users', key })
  },

  /** @typedef {{ name: string, key: string }} UserUpdateParams */
  async update ({ key, name }) {
    let user = await data.get({ table: 'users', key })
    user.name = name
    return data.set(user)
  },

  notes: {
    
    /** @typedef {{ userKey: string, body: string }} NotesCreateParams */
    async create ({ userKey, body }) {
      let table = `notes-${ userKey }`
      let ts = Date.now()
      return data.set({ table, body, ts })
    },

    /** @typedef {{ userKey: string, key: string }} NotesReadParams */
    async read ({ userKey, key }) {
      let table = `notes-${ userKey }`
      return data.get({ table, key })
    },

    /** @typedef {{ userKey: string, key: string, body: string }} NotesUpdateParams */
    async update ({ userKey, key, body }) {
      let table = `notes-${ userKey }`
      let old = await data.get({ table, key })
      old.body = body
      old.updated = Date.now()
      return data.set(old)
    },

    /** @typedef {{ userKey: string, key: string }} NotesDestroyParams */
    async destroy ({ userKey, key }) {
      let table = `notes-${ userKey }`
      return data.destroy({ table, key })
    },

    /** @typedef {{ userKey: string }} NotesListParams */
    async list ({ userKey }) {
      let table = `notes-${ userKey }`
      return data.get({ table })
    }
  }
}

