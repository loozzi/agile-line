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
