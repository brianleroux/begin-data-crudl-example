import sandbox from '@architect/sandbox'
import test from 'tape'
import Users from '../src/03/users.mjs'
import Notes from '../src/03/notes.mjs'
import Tags from '../src/03/tags.mjs'

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
  t.ok(!!userKey, 'got a new user')
  console.log(user)
})

/** create 20 notes, and 20 total tags */
test('Notes.create', async t => {
  t.plan(1)
  let notes = new Notes(userKey)
  let tags = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
  let ops = []
  for (let i = 0; i < 20; i++) {
    ops.push(notes.create({ 
      body: 'hi i am note ' + i, 
      tags:  tags.slice(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10) + 1)
    }))
  }
  let result = await Promise.all(ops)
  t.ok(result.length === 20, 'created')
})

test('paginate notes', async t => {
  t.plan(1)
  let notes = new Notes(userKey)
  let result = await notes.list({ limit: 5 })
  t.ok(result.notes.length === 5 && result.cursor, 'got notes')
  console.log(result)
})

test('paginate tags', async t => {
  t.plan(1)
  let result = await Tags.list()
  t.ok(result.tags, 'got tags')
  console.log(result)
})

test('paginate notes for a given tag', async t => {
  t.plan(1)
  let result = await Tags.read({ tag: 'one' })
  t.ok(result, 'one')
  console.log(result)
})

test('end', async t => {
  t.plan(1)
  await sandbox.end()
  t.pass('successfully shut down sandbox')
})
