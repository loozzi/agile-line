import { SelectMenu, SelectMenuProps } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Member } from '~/models/member'
import workspaceService from '~/services/workspace.service'

interface PopupSelectedMemberProps extends SelectMenuProps {
  children: React.ReactNode
  changeSelectedMembers: (selectedItems: any[]) => void
}

export const PopupSelectedMember = (props: PopupSelectedMemberProps) => {
  const { children, changeSelectedMembers } = props
  const params = useParams()

  const [options, setOptions] = useState<Member[]>([])

  const [search, setSearch] = useState<string>('')

  const [selectedItemsState, setSelectedItems] = useState([])

  useEffect(() => {
    changeSelectedMembers(selectedItemsState)
  }, [selectedItemsState])

  useEffect(() => {
    workspaceService.getMembers({ member_kw: search, permalink: params.permalink || '' }).then((data) => {
      if (data.status === 200) {
        setOptions(data.data?.items || [])
      } else {
        setOptions([])
      }
    })
  }, [search])

  return (
    <SelectMenu
      isMultiSelect
      title='Chọn thành viên cho dự án'
      options={options.map((member) => ({
        ...member,
        label: `${member.first_name} ${member.last_name} (${member.username})`,
        value: member.id,
        icon: member.avatar
      }))}
      selected={selectedItemsState}
      onFilterChange={(value) => {
        setSearch(value)
      }}
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
