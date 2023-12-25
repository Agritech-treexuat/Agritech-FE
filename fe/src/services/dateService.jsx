function formatDate(date) {
  var ngay = date.getDate()
  var thang = date.getMonth() + 1
  var nam = date.getFullYear()

  ngay = ngay < 10 ? '0' + ngay : ngay
  thang = thang < 10 ? '0' + thang : thang

  return ngay + '-' + thang + '-' + nam
}

module.exports = {
  formatDate: formatDate
}
