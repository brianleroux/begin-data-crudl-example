import test from 'tape'
import data from '@begin/data'
import sandbox from '@architect/sandbox'
import Notes from '../src/00/notes.mjs'

let mynote = {
  body: 'cool note',
  created: Date.now(),
}

test('start', async t=> {
  t.plan(1)
  await sandbox.start({ quiet: true })
  t.pass('successfully started sandbox')
})

test('create note', async t=> {
  t.plan(1)
  mynote = await Notes.create(mynote)
  t.pass('wrote note')
})

test('read note', async t=> {
  t.plan(1)
  let result = await Notes.read(mynote.key)
  t.pass('found note')
  console.log(result)
})

test('update note', async t=> {
  t.plan(1)
  let body = 'some different stuff now'
  mynote.body = body
  let result = await Notes.update(mynote)
  t.ok(result.body === body, 'updated note')
  console.log(result)
})

test('destroy note', async t=> {
  t.plan(1)
  await Notes.destroy(mynote.key)
  let notes = await data.get({ table: 'notes' })
  t.ok(notes.length === 0, 'perfect, no notes')
  console.log(notes)
})

test('list notes', async t=> {
  t.plan(1)
  let table = 'notes'
  let body = new Date(Date.now()).toISOString()
  await data.set([
    {table, body}, 
    {table, body}, 
    {table, body}, 
    {table, body}
  ])
  let notes = await Notes.list()
  t.ok(notes.length === 4, 'perfect, no notes')
  console.log(notes)
})

test('end', async t=> {
  t.plan(1)
  await sandbox.end()
  t.pass('successfully shut down sandbox')
})
