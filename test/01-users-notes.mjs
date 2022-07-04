import sandbox from '@architect/sandbox'
import test from 'tape'
import Users from '../src/01/users.mjs'

test('start', async t => {
  t.plan(1)
  await sandbox.start({ quiet: true })
  t.pass('successful started sandbox')
})

// use these between tests
let userKey = false
let noteKey = false

test('Users.create', async t => {
  t.plan(1)
  let user = await Users.create({ name: 'brian', password: 'xxx' })
  userKey = user.key
  t.ok(user, 'got a new user')
  console.log(user)
})

test('Users.read', async t => {
  t.plan(1)
  let user = await Users.read(userKey)
  t.ok(user, 'got user')
  console.log(user)
})

test('Users.update', async t => {
  t.plan(1)
  let result = await Users.update({ key: userKey, name: 'brian1' })
  t.ok(result.name === 'brian1', 'got user')
  console.log(result)
})

test('Users.notes.list === 0', async t => {
  t.plan(1)
  let result = await Users.notes.list({ userKey })
  t.ok(Array.isArray(result) && result.length === 0, 'it worked')
  console.log(result)
})

test('Users.notes.create', async t => {
  t.plan(1)
  let result = await Users.notes.create({ userKey, body: 'coo note' })
  noteKey = result.key
  t.pass('it worked')
  console.log(result)
})

test('Users.notes.list === 1', async t => {
  t.plan(1)
  let result = await Users.notes.list({ userKey })
  t.ok(Array.isArray(result) && result.length === 1, 'it worked')
  console.log(result)
})

test('Users.notes.read', async t => {
  t.plan(1)
  let result = await Users.notes.read({ userKey, key: noteKey })
  t.pass('it worked')
  console.log(result)
})

test('Users.notes.update', async t => {
  t.plan(1)
  let result = await Users.notes.update({ userKey, key: noteKey, body: 'new note body here' })
  t.ok(result.updated, 'has updated property')
  console.log(result)
})

test('Users.notes.destroy', async t => {
  t.plan(1)
  let result = await Users.notes.destroy({ userKey, key: noteKey })
  t.pass('destroyed')
  console.log(result)
})

test('end', async t => {
  t.plan(1)
  await sandbox.end()
  t.pass('successfully shut down sandbox')
})
