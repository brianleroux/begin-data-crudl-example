export default {

  // validates a user payload
  async user (payload) {
    if (!payload.name) throw Error('missing_name')
  },

  // validates a note payload
  async note (payload) {
    if (!payload.body) throw Error('missing_body')
    if (!Array.isArray(payload.tags)) throw Error('invalid_tags')
  }
}
