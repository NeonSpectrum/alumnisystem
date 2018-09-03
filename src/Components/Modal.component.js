import React, { Component } from 'react'

class Modal extends Component {
  render() {
    return (
      <div id={this.props.id} className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{this.props.header}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form onSubmit={this.props.onSubmit}>
              <div className="modal-body">{this.props.children}</div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary" disabled={this.props.submitDisabled}>
                  {this.props.submitText}
                </button>
                <button type="button" className="btn btn-secondary" data-dismiss="modal">
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Modal
