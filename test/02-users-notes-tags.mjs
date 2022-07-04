import sandbox from '@architect/sandbox'
import test from 'tape'
import Users from '../src/02/users.mjs'
import Notes from '../src/02/notes.mjs'
import Tags from '../src/02/tags.mjs'

test('start', async t => {
  t.plan(1)
  await sandbox.start({ quiet: true })
  t.pass('successful started sandbox')
})

// use these between tests
let userKey = false

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

test('Users.destroy', async t => {
  t.plan(2)
  await Users.destroy(userKey)
  t.pass('destroyed old user')
  let user = await Users.create({ name: 'fakebrian', password: 'xxx' })
  userKey = user.key
  t.ok(user, 'created new user')
  console.log(user)
})

test('Notes.list === 0', async t => {
  t.plan(1)
  let notes = new Notes(userKey)
  let result = await notes.list()
  t.ok(result.length === 0, 'got none')
  console.log(result)
})

let noteKey = false

test('Notes.create', async t => {
  t.plan(2)
  let notes = new Notes(userKey)
  let result = await notes.create({ 
    body: 'hi i am a note', 
    tags:  ['neat', 'cool', 'fun']
  })
  t.ok(result, 'got result')
  console.log(result)
  noteKey = result.key
  await notes.create({ 
    body: 'hi i am also a note', 
    tags:  ['neat', 'cool']
  })
  t.pass('created two notes with some shared tags')
})

test('Notes.list === 2', async t => {
  t.plan(1)
  let notes = new Notes(userKey)
  let result = await notes.list()
  t.ok(result.length === 2, 'got two notes')
  console.log(result)
})

test('Tags.list === 3', async t => {
  t.plan(2)
  let result = await Tags.list()
  t.ok(result.length === 3, 'got three tags')
  t.ok(result.filter(t => t.totals > 1).length === 2, 'two w higher totals')
  console.log(result)
})

test("Tags.read('cool')", async t => {
  t.plan(1)
  let result = await Tags.read('cool')
  t.ok(result, 'got notes for cool tag')
  console.log(result)
})

test('Notes.destroy', async t => {
  t.plan(1)
  let notes = new Notes(userKey)
  let result = await notes.destroy(noteKey)
  t.pass('note destroyed')
  console.log(result)
})
  
test('Notes.list === 1', async t => {
  t.plan(1)
  let notes = new Notes(userKey)
  let result = await notes.list()
  t.ok(result.length === 1, 'got one note')
  console.log(result)
})

test('Tags.list ', async t => {
  t.plan(1)
  let result = await Tags.list()
  t.ok(result, 'got tags')
  console.log(result)
})

test("Tags.read('cool') === 1", async t => {
  t.plan(1)
  let result = await Tags.read('cool')
  t.ok(result.length === 1, 'got notes for cool tag')
  console.log(result)
})

test('end', async t => {
  t.plan(1)
  await sandbox.end()
  t.pass('successfully shut down sandbox')
})
