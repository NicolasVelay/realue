import { compose, branch, withHandlers, withProps } from 'recompose'

import { setItem, insertItem, hasProp, hasNotProp, EMPTY_ARRAY } from './tools'

export const array = compose(
  /*
  Provides `item(index, key = index)` that returns the props for the child element responsible of the item `index`.
  Also provides `onChangeItem(value, index, payload?)` that sets the item `index` to the provided `value`, and `onAddItem(value, index, payload?)` that inserts an item with the provided `value` at `index`.
  Sets `value` to `[]` if not set.

  Example:

    const List = array(({ value, item, onAdd }) => (
      <ul>
        {map(value, (_, index) => <li>{item(index)}</li>)}
        <li>
          <button onClick={() => onAdd('New')}>Add</button>
        </li>
      </ul>
    ))
  */
  branch(hasNotProp('value'), withProps({ value: EMPTY_ARRAY })),
  branch(
    hasProp('onChange'),
    withHandlers({
      onChangeItem: ({ value, name, onChange }) => (item, index, payload) =>
        onChange(setItem(value, index, item), name, payload),
      onAddItem: ({ value, name, onChange }) => (item, index, payload) =>
        onChange(insertItem(value, item, index), name, payload),
    }),
  ),
  withHandlers({
    item: ({ onChangeItem: onChange, value }) => (name, key = name) => ({
      key,
      value: value[name],
      name,
      onChange,
    }),
  }),
)

export const removable = branch(
  /*
  Provides `onRemove(payload?)`, which sets the value to `undefined` and results in removing the item or property.
  */
  hasProp('onChange'),
  withHandlers({
    onRemove: ({ name, onChange }) => payload =>
      onChange(undefined, name, payload),
  }),
)
