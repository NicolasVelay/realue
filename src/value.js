import { compose, branch, withHandlers } from 'recompose'

import { hasProp } from './tools'

export const value = branch(
  hasProp('onChange'),
  compose(
    withHandlers({
      onChange: ({ value, name = value, onChange }) => (value, event) =>
        onChange(value, name, event),
    }),
  ),
)
