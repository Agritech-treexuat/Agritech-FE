import { Tooltip, Typography } from 'antd'
import * as XLSX from 'xlsx/xlsx.mjs'
const { Paragraph } = Typography
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function formatDate(inputDate) {
  // Tạo một đối tượng Date từ chuỗi đầu vào
  const date = new Date(inputDate)

  // Lấy ngày, tháng và năm từ đối tượng Date
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Lưu ý rằng tháng bắt đầu từ 0
  const year = date.getFullYear()

  // Tạo chuỗi định dạng "dd/mm/yyyy"
  const formattedDate = `${day}/${month}/${year}`

  return formattedDate
}

export function formatDateTime(inputDateTime) {
  // Tạo một đối tượng Date từ chuỗi đầu vào
  const date = new Date(inputDateTime)

  // Lấy ngày, tháng, năm, giờ và phút từ đối tượng Date
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Lưu ý rằng tháng bắt đầu từ 0
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  // Tạo chuỗi định dạng "dd/mm/yyyy giờ:phút"
  const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`

  return formattedDateTime
}

export function formatDateToInput(dateTime) {
  const dateObj = new Date(dateTime)

  const yearData = dateObj.getFullYear()
  const monthData = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const dateData = dateObj.getDate().toString().padStart(2, '0')

  const formattedDate = `${yearData}-${monthData}-${dateData}`

  return formattedDate
}

export const formatTransactionHash = ({ str }) => {
  return (
    <a href={`https://escan.live/tx/${str}`} target="_blank" rel="noreferrer">
      <Tooltip title={str}>{str}</Tooltip>
    </a>
  )
}

export const ParagraphWithEllipsis = ({ text, rows }) => {
  return (
    <Paragraph
      ellipsis={{
        rows: rows,
        expandable: true,
        symbol: 'đọc thêm',
        tooltip: true,
        onExpand: function (event) {
          console.log('onExpand', event)
          event.stopPropagation()
          event.preventDefault()
        }
      }}
    >
      {text}
    </Paragraph>
  )
}

export function formatTransactionHashTable({ str, a, b }) {
  if (a < 0 || b < 0 || a >= str.length || b >= str.length || a + b > str.length) {
    return 'Invalid input'
  }
  const prefix = str.slice(0, a)
  const suffix = str.slice(-b)
  const formatedFormatTransactionHash = prefix + '...' + suffix
  return (
    <a href={`https://escan.live/tx/${str}`} target="_blank" rel="noreferrer">
      <Tooltip title={str}>{formatedFormatTransactionHash}</Tooltip>
    </a>
  )
}

export function exportExcel(data, nameSheet, nameFile) {
  return new Promise((resolve, reject) => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, nameSheet)
    XLSX.writeFile(wb, nameFile)
    resolve()
  })
}
