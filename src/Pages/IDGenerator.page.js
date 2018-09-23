import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, NavLink, Switch } from 'react-router-dom'
import ImageLoader from 'react-load-image'
import moment from 'moment'

import { API_URL } from '../Global'
import Loading from '../Components/Loading.component'
import AddTemplate from '../Modals/AddTemplate.modal'

import { fetchTemplates } from '../Controllers/Data.controller'
import { deleteTemplate } from '../Controllers/Template.controller'

class IDGenerator extends Component {
  constructor(props) {
    super(props)
    this.state = { data: [] }

    this.handleDeleteTemplate = this.handleDeleteTemplate.bind(this)
  }

  componentWillMount() {
    this.props.fetchTemplates()
  }

  componentWillReceiveProps(props) {
    if (props.data) {
      this.setState({ data: props.data })
    }
  }

  handleDeleteTemplate(id) {
    var { data } = this.state
    data.forEach((item, index) => {
      if (item.ID === +id) {
        delete data[index]
      }
    })
    console.log(data)
    this.setState({ data })
  }

  render() {
    const { data } = this.state
    const { loading = true, match } = this.props
    return loading ? (
      <Loading />
    ) : (
      <div className="container-fluid h-100">
        <div className="row h-100">
          <nav className="col-md-2 d-none d-md-block bg-light sidebar h-100 p-0">
            <div className="sidebar-sticky h-100 pt-1" style={{ overflow: 'auto' }}>
              <ul className="nav flex-column">
                {data.map((x, index) => (
                  <NavLink key={index} className="sidebar-item" to={`${match.url}/${x.ID}`} activeClassName="active">
                    <li title={x.Name}>{x.Name}</li>
                  </NavLink>
                ))}
              </ul>
            </div>
          </nav>
          <main className="col-md-10 pt-3 pb-3" style={{ overflow: 'auto' }}>
            <Switch>
              {data.length > 0 && (
                <Redirect
                  from={match.url}
                  to={`${match.url}${match.url[match.url.length - 1] !== '/' ? '/' : ''}${data[0].ID}`}
                  exact
                />
              )}
              <Route
                path={`${match.url}/:id`}
                render={props => <ImagePage {...this.props} {...props} onDelete={this.handleDeleteTemplate} />}
              />
            </Switch>
          </main>
        </div>
        <AddTemplate />
        <button
          className="btn btn-icon"
          style={{ position: 'absolute', bottom: 5, right: 5 }}
          data-toggle="modal"
          data-target="#addTemplateModal"
        >
          <i className="fa fa-plus fa-lg" />
        </button>
      </div>
    )
  }
}

const ImagePage = props => {
  let { match, history, fetchTemplates, deleteTemplate, data, onDelete } = props
  let idExists = false

  let datum = []

  data.forEach(item => {
    if (item.ID === +match.params.id) {
      idExists = true
      datum = item
    }
  })

  return !idExists ? (
    <Redirect to={`/id-generator/`} />
  ) : (
    <div className="h-100">
      <div className="h-100">
        <ImageLoader
          src={API_URL + '/templates/' + match.params.id + '/sample?t=' + moment(datum.TimeStamp).format('x')}
        >
          <img alt={match.params.id + ' picture'} />
          <div>Can't fetch the image</div>
          <Loading style={{ backgroundPosition: '40% 40%' }} />
        </ImageLoader>
      </div>
      <button
        className="btn btn-icon"
        style={{ position: 'fixed', bottom: 5, right: 60 }}
        onClick={() => {
          history.push('/id-generator/' + match.params.id + '/edit')
        }}
      >
        <i className="fa fa-edit fa-lg" />
      </button>
      <button
        className="btn btn-icon"
        style={{ position: 'absolute', bottom: 5, right: 115 }}
        onClick={() => {
          if (window.confirm('Are you sure do you want to delete this template?')) {
            deleteTemplate(match.params.id)
            onDelete(match.params.id)
          }
        }}
      >
        <i className="fa fa-trash fa-lg" />
      </button>
    </div>
  )
}

const mapStateToProps = ({ DataReducer }) => {
  let { template } = DataReducer
  return template || {}
}

const mapDispatchToProps = {
  fetchTemplates,
  deleteTemplate
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IDGenerator)
