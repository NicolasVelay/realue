import test from 'ava'
import render from 'react-test-renderer'
import { compose } from 'recompose'

import { $ } from '../tools'
import { waitFor, promisedProp } from '../promises'

const Promised = compose(promisedProp('value'))(({ value }) =>
  $('pre', JSON.stringify(value, null, 2)),
)

test('waitFor', async (assert) => {
  const time = Date.now()
  const duration = 1000
  await waitFor(duration)
  assert.true(Date.now() - time >= duration, 'waits for given duration')
})

test('decorates component', async (assert) => {
  assert.snapshot(
    render.create($(Promised, { value: 'Non-promised value' })).toJSON(),
  )
  const promise = waitFor(1000).then(() => 'Promised value')
  const rendering = render.create($(Promised, { value: promise }))
  assert.snapshot(rendering.toJSON(), 'first render')
  await promise
  assert.snapshot(rendering.toJSON(), 'resolved render')
})
