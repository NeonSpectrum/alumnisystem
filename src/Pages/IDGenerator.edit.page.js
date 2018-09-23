import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Stage, Layer, Image, Rect, Transformer } from 'react-konva'

import { API_URL } from '../Global'
import Loading from '../Components/Loading.component'

import { fetchTemplates } from '../Controllers/Data.controller'
import { saveTemplate } from '../Controllers/Template.controller'

class Rectangle extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    const shape = e.target
    this.props.onTransform({
      x: shape.x(),
      y: shape.y(),
      width: shape.width() * shape.scaleX(),
      height: shape.height() * shape.scaleY()
    })
  }

  render() {
    return (
      <Rect
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        scaleX={1}
        scaleY={1}
        fill={this.props.fill}
        name={this.props.name}
        stroke={this.props.stroke}
        onDragEnd={this.handleChange}
        onTransformEnd={this.handleChange}
        draggable
      />
    )
  }
}

class TransformerComponent extends React.Component {
  componentDidMount() {
    this.checkNode()
  }

  componentDidUpdate() {
    this.checkNode()
  }

  checkNode() {
    const stage = this.transformer.getStage()
    const { selectedShapeName } = this.props

    const selectedNode = stage.findOne('.' + selectedShapeName)
    if (selectedNode === this.transformer.node()) {
      return
    }

    if (selectedNode) {
      this.transformer.attachTo(selectedNode)
    } else {
      this.transformer.detach()
    }
    this.transformer.getLayer().batchDraw()
  }

  render() {
    return (
      <Transformer
        ref={node => {
          this.transformer = node
        }}
      />
    )
  }
}

class IDGeneratorEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      image: null,
      picture: null,
      details: null,
      selectedShapeName: null
    }
    this.handleSave = this.handleSave.bind(this)
    this.handleRectChange = this.handleRectChange.bind(this)
    this.handleStageMouseDown = this.handleStageMouseDown.bind(this)
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
        this.props.fetchTemplates()
        props.history.push('/id-generator/' + this.props.match.params.id)
      }
    } else if (props.data) {
      let {
        PictureX,
        PictureY,
        PictureHeight,
        PictureWidth,
        DetailsX,
        DetailsY,
        DetailsHeight,
        DetailsWidth
      } = props.data[0]

      this.setState({
        picture: {
          x: PictureX,
          y: PictureY,
          height: PictureHeight,
          width: PictureWidth
        },
        details: {
          x: DetailsX,
          y: DetailsY,
          height: DetailsHeight,
          width: DetailsWidth
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

  handleStageMouseDown(e) {
    // clicked on stage - cler selection
    if (e.target === e.target.getStage()) {
      this.setState({
        selectedShapeName: ''
      })
      return
    }
    // clicked on transformer - do nothing
    const clickedOnTransformer = e.target.getParent().className === 'Transformer'
    if (clickedOnTransformer) {
      return
    }

    // find clicked rect by its name
    const name = e.target.name()
    const rect = this.state[name]
    if (rect) {
      this.setState({
        selectedShapeName: name
      })
    } else {
      this.setState({
        selectedShapeName: ''
      })
    }
  }

  handleRectChange(name, newProps) {
    this.setState({
      [name]: {
        ...this.state[name],
        ...newProps
      }
    })
  }

  render() {
    const { image, height, width, picture, details, selectedShapeName } = this.state
    const { loading = true, data } = this.props
    return loading || !image ? (
      <Loading />
    ) : (
      <div>
        <div className="container my-5 card py-3" style={{ width: width + 30 }}>
          <Stage width={width} height={height} onMouseDown={this.handleStageMouseDown}>
            <Layer>
              <Image image={image} />
              <Rectangle
                name="picture"
                x={picture.x}
                y={picture.y}
                height={picture.height || 300}
                width={picture.width || 300}
                draggable={true}
                stroke="black"
                text="hi"
                onTransform={newProps => {
                  this.handleRectChange('picture', newProps)
                }}
              />
              <Rectangle
                name="details"
                x={details.x}
                y={details.y}
                height={details.height || 300}
                width={details.width || 600}
                draggable={true}
                stroke="black"
                onTransform={newProps => {
                  this.handleRectChange('details', newProps)
                }}
              />
              <TransformerComponent selectedShapeName={selectedShapeName} />
            </Layer>
          </Stage>
        </div>
        <button
          className="btn btn-icon"
          style={{ position: 'fixed', bottom: 10, left: 10 }}
          onClick={() => {
            this.props.history.goBack()
          }}
        >
          <i className="fa fa-angle-left fa-2x" />
        </button>
        <button className="btn btn-icon" style={{ position: 'fixed', bottom: 10, right: 10 }} onClick={this.handleSave}>
          <i className="fa fa-edit fa-lg" />
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
