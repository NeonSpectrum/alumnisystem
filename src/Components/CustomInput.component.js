import React, { Component } from 'react'

class CustomInput extends Component {
  render() {
    return (
      <fieldset className="form-group">
        <label className="bmd-label-floating">{this.props.label}</label>
        <input type={this.props.type} name={this.props.name} className="form-control" onChange={this.props.onChange} />
        {this.props.isInvalid ? <small className="error text-danger">{this.props.errorText}</small> : ''}
        {this.props.extra}
      </fieldset>
    )
  }
}

export default CustomInput
