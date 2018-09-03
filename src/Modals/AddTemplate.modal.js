import React, { Component } from 'react'
import { connect } from 'react-redux'

import Modal from '../Components/Modal.component'

import { fetchTemplates } from '../Controllers/Data.controller'
import { addTemplate } from '../Controllers/Template.controller'

class AddTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null,
      error: null
    }
    this.handleImage = this.handleImage.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillReceiveProps(props) {
    if (props.error) {
      this.setState({
        error: props.error
      })
    } else if (props.success) {
      this.props.fetchTemplates()
      window
        .$('#addTemplateModal')
        .find('form')
        .trigger('reset')
      window.$('#addTemplateModal').modal('hide')
      alert('Template Added!')
    }
  }

  handleImage(e) {
    this.setState({ file: e.target.files[0] })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.addTemplate(e.target.name.value, this.state.file)
  }

  render() {
    const { error } = this.state
    const { adding = false } = this.props
    return (
      <Modal
        id="addTemplateModal"
        header={'Add Template'}
        onSubmit={this.handleSubmit}
        submitText="Add"
        submitDisabled={adding}
      >
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" className="form-control" />
        </div>
        <div className="form-group">
          <label>File</label>
          <input type="file" name="image" className="form-control" onChange={this.handleImage} />
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = ({ DataReducer, TemplateReducer }) => {
  let { modal } = TemplateReducer
  return modal || {}
}

const mapDispatchToProps = {
  addTemplate,
  fetchTemplates
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTemplate)
