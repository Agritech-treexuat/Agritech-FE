export const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}

export const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16
  }
}

export const normFile = (e) => {
  console.log('Upload event:', e)
  if (Array.isArray(e)) {
    return e
  }
  return e?.fileList
}
