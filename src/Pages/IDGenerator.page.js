import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, NavLink, Switch } from 'react-router-dom'
import ImageLoader from 'react-load-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { API_URL } from '../Global'
import Loading from '../Components/Loading.component'
import AddTemplate from '../Modals/AddTemplate.modal'

import { fetchTemplates } from '../Controllers/Data.controller'

class IDGenerator extends Component {
  componentWillMount() {
    this.props.fetchTemplates()
  }

  render() {
    const { loading = true, data, match } = this.props
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
              {data.length > 0 && <Redirect from={match.url} to={`${match.url}/${data[0].ID}`} exact />}
              <Route path={`${match.url}/:id`} component={ImagePage} />
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
          <FontAwesomeIcon icon="plus" size="lg" />
        </button>
      </div>
    )
  }
}

const ImagePage = ({ match, history }) => {
  return (
    <div className="h-100">
      <ImageLoader src={API_URL + '/templates/' + match.params.id + '/sample'}>
        <img alt={match.params.id + ' picture'} />
        <div>Can't fetch the image</div>
        <Loading style={{ backgroundPosition: '40% 40%' }} />
      </ImageLoader>
      <button
        className="btn btn-icon"
        style={{ position: 'absolute', bottom: 5, right: 60 }}
        onClick={() => {
          history.push('/id-generator/' + match.params.id + '/edit')
        }}
      >
        <FontAwesomeIcon icon="edit" size="lg" />
      </button>
    </div>
  )
}

const mapStateToProps = ({ DataReducer }) => {
  let { template } = DataReducer
  return template || {}
}

const mapDispatchToProps = {
  fetchTemplates
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IDGenerator)
