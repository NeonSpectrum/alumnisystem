import React, { Component } from 'react'
import { connect } from 'react-redux'
import Loading from '../Components/Loading.component'

import { fetchStudentData } from '../Controllers/Data.controller'

class Students extends Component {
  componentDidMount() {
    this.props.fetchStudentData()
  }

  render() {
    let { loading = true, data } = this.props
    return loading ? (
      <Loading />
    ) : (
      <div className="container my-5 card py-3" style={{ height: '500px' }}>
        <div className="table-responsive">
          <table className="table table-bordered table-hover" width="100%">
            <thead>
              <tr>{Object.keys(data[0]).map((x, index) => <td key={index}>{x}</td>)}</tr>
            </thead>
            <tbody>
              {data.map((x, index) => {
                return <tr key={index}>{Object.keys(x).map((y, index1) => <td key={index1}>{x[y]}</td>)}</tr>
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ DataReducer }) => {
  let { student } = DataReducer
  return student || {}
}

const mapDispatchToProps = {
  fetchStudentData
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Students)
