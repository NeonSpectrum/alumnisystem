import React, { Component } from 'react'

class Students extends Component {
  render() {
    return (
      <div className="container my-5 card py-3" style={{ height: '500px' }}>
        <table class="table table-bordered table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Hello</td>
              <td>Bye</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Hello</td>
              <td>Bye</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Hello</td>
              <td>Bye</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default Students
