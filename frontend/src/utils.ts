export function getContrastColor(hexColor: string) {
  // Convert hexColor to RGB components
  const r = parseInt(hexColor.slice(1, 3), 16) / 255
  const g = parseInt(hexColor.slice(3, 5), 16) / 255
  const b = parseInt(hexColor.slice(5, 7), 16) / 255

  // Calculate luminance
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b

  // Determine black or white contrast
  const threshold = 0.5
  return l >= threshold ? '#000000' : '#ffffff'
}

export function reformatDate(dateString: string) {
  // Create a Date object by parsing the input string
  const date = new Date(dateString)

  // Use the toLocaleDateString method with desired format options
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export const compareDates = (date1: string, date2: string) => {
  const dateObj1 = new Date(date1)
  const dateObj2 = new Date(date2)

  const time1 = dateObj1.getTime()
  const time2 = dateObj2.getTime()

  if (time1 < time2) {
    return -1 // date1 is earlier
  } else if (time1 > time2) {
    return 1 // date1 is later
  } else {
    return 0 // dates are equal
  }
}

export function convertTimestamp(dateString: string) {
  var originalTime = new Date(dateString).getTime()
  var currentTime = new Date().getTime()

  var differenceInSeconds = Math.floor((currentTime - originalTime) / 1000)

  if (differenceInSeconds < 60) {
    return 'vài giây trước'
  } else if (differenceInSeconds < 3600) {
    var minutes = Math.floor(differenceInSeconds / 60)
    return minutes + ' phút trước'
  } else if (differenceInSeconds < 86400) {
    var hours = Math.floor(differenceInSeconds / 3600)
    return hours + ' giờ trước'
  } else {
    var days = Math.floor(differenceInSeconds / 86400)
    return days + ' ngày trước'
  }
}

export function transLabel(label: string) {
  switch (label) {
    case 'Workspace':
      return 'Không gian làm việc'
    case 'backlog':
      return 'Tồn đọng'
    case 'todo':
      return 'Cần làm'
    case 'inprogress':
      return 'Đang thực hiện'
    case 'completed':
      return 'Hoàn thành'
    case 'canceled':
      return 'Đã hủy'
    case 'paused':
      return 'Tạm dừng'
    case 'planned':
      return 'Đã kế hoạch'
    case 'done':
      return 'Đã hoàn thành'
    case 'cancelled':
      return 'Đã hủy'
    case 'duplicate':
      return 'Trùng lặp'
    case 'nopriority':
      return 'Không ưu tiên'
    case 'low':
      return 'Thấp'
    case 'medium':
      return 'Trung bình'
    case 'high':
      return 'Cao'
    case 'urgen':
      return 'Khẩn cấp'
    case 'critical':
      return 'Quan trọng'
    case 'leader':
      return 'Trưởng nhóm'
    case 'member':
      return 'Thành viên'
    default:
      return label
  }
}
