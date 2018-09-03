import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Stage, Layer, Image, Rect } from 'react-konva'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { API_URL } from '../Global'
import Loading from '../Components/Loading.component'

import { fetchTemplates } from '../Controllers/Data.controller'
import { saveTemplate } from '../Controllers/Template.controller'

class IDGeneratorEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      image: null,
      picture: null,
      details: null
    }
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  componentWillMount() {
    this.props.fetchTemplates(this.props.match.params.id)
  }

  componentDidMount() {
    let self = this

    const { id } = this.props.match.params
    const image = new window.Image()
    image.src = API_URL + '/templates/' + id + '/image'

    image.onload = function() {
      self.setState({
        image: image,
        height: this.height,
        width: this.width
      })
    }
  }

  componentWillReceiveProps(props) {
    if (this.props.saving !== props.saving) {
      if (props.error) {
        alert(props.error)
      } else if (props.success) {
        props.history.push('/id-generator/' + this.props.match.params.id)
      }
    } else if (props.data) {
      let { PictureX, PictureY, DetailsX, DetailsY } = props.data[0]
      this.setState({
        picture: {
          x: PictureX,
          y: PictureY
        },
        details: {
          x: DetailsX,
          y: DetailsY
        }
      })
    }
  }

  handleSave() {
    if (window.confirm('Are you sure do you want to save?')) {
      const { picture, details } = this.state
      const { id } = this.props.match.params
      this.props.saveTemplate(id, {
        picture,
        details
      })
    }
  }

  handleDragEnd(e) {
    const name = e.target.name()
    this.setState({
      [name]: {
        x: e.target.x(),
        y: e.target.y()
      }
    })
  }

  render() {
    const { image, height, width, picture, details } = this.state
    const { loading = true, data } = this.props
    return loading || !image ? (
      <Loading />
    ) : (
      <div>
        <div className="container my-5 card py-3" style={{ width: width + 30 }}>
          <Stage width={width} height={height}>
            <Layer>
              <Image image={image} />
              <Rect
                name="picture"
                x={picture.x}
                y={picture.y}
                width={300}
                height={300}
                draggable={true}
                stroke="black"
                onDragEnd={this.handleDragEnd}
              />
              <Rect
                name="details"
                x={details.x}
                y={details.y}
                width={600}
                height={300}
                draggable={true}
                stroke="black"
                onDragEnd={this.handleDragEnd}
              />
            </Layer>
          </Stage>
        </div>
        <button className="btn btn-icon" style={{ position: 'fixed', bottom: 10, right: 10 }} onClick={this.handleSave}>
          <FontAwesomeIcon icon="edit" size="lg" />
        </button>
      </div>
    )
  }
}

const mapStateToProps = ({ DataReducer, TemplateReducer }) => {
  return { ...DataReducer.template, ...TemplateReducer.template } || {}
}

const mapDispatchToProps = {
  fetchTemplates,
  saveTemplate
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IDGeneratorEdit)
