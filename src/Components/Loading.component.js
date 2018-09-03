import React, { Component } from 'react'

class Loading extends Component {
  render() {
    const { show = true } = this.props
    return <div className="loader" style={{ display: show ? 'block' : 'none' }} {...this.props} />
  }
}

export default Loading
