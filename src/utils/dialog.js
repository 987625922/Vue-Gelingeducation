import { MessageBox, Message } from 'element-ui'

export function warningDialog(msg) {
    return  MessageBox.confirm(msg, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  }