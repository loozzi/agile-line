import { SelectMenu } from 'evergreen-ui'
import { ReactNode, useEffect, useState } from 'react'
import { LabelResponse } from '~/models/label'
import { getContrastColor } from '~/utils'

interface PopupSelectedLabelsProps {
  labels: LabelResponse[]
  onChooseLabels: (selectedItems: LabelResponse[]) => void
  children: ReactNode
}

export const PopupSelectedLabels = (props: PopupSelectedLabelsProps) => {
  const { labels, onChooseLabels, children } = props

  const [selectedItemsState, setSelectedItems] = useState([])

  useEffect(() => {
    onChooseLabels(selectedItemsState)
  }, [selectedItemsState])
  return (
    <SelectMenu
      isMultiSelect
      title='Chọn nhãn'
      options={
        labels.map((_label) => ({
          ..._label,
          label: (
            <span
              style={{
                backgroundColor: _label.color,
                color: getContrastColor(_label.color),
                padding: 4,
                borderRadius: 4
              }}
            >
              {_label.title}
            </span>
          ),
          value: _label.id
        })) as never[]
      }
      selected={selectedItemsState}
      hasFilter={false}
      onSelect={(item) => {
        const selected = [...selectedItemsState, item.value]
        const selectedItems = selected
        setSelectedItems(selectedItems as never[])
      }}
      onDeselect={(item) => {
        const deselectedItemIndex = selectedItemsState.indexOf(item.value as never)
        const selectedItems = selectedItemsState.filter((_item, i) => i !== deselectedItemIndex)
        setSelectedItems(selectedItems)
      }}
    >
      {children}
    </SelectMenu>
  )
}
