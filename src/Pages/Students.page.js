import React, { Component } from 'react'
import { DataTable } from 'react-data-components'
import { connect } from 'react-redux'
import Loading from '../Components/Loading.component'

import { fetchStudentData } from '../Controllers/Data.controller'

class Students extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: true }
  }

  componentDidMount() {
    this.props.fetchStudentData()
  }

  componentWillReceiveProps(props) {
    if (props.loading === false) {
      this.setState({ loading: false })
      window.initDataTable()
    }
  }

  render() {
    let { loading } = this.state
    let { data } = this.props
    return loading ? (
      <Loading />
    ) : (
      <div className="container my-5 card py-3">
        <table className="table table-bordered table-hover dataTable" width="100%" style={{ display: 'none' }}>
          <thead>
            <tr>{Object.keys(data[0]).map((x, index) => <th key={index}>{x}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((x, index) => {
              return <tr key={index}>{Object.keys(x).map((y, index1) => <td key={index1}>{x[y]}</td>)}</tr>
            })}
          </tbody>
        </table>
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
