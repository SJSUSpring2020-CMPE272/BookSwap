import React, { Component } from 'react';
import Table from 'react-bootstrap/Table'

class AddressTable extends Component {

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '50vh', width: '50%' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.props.loc0.text}</td>
              <td>{this.props.loc0.name}</td>
              <td>{this.props.loc0.address}</td>
            </tr>
            <tr>
              <td>{this.props.loc1.text}</td>
              <td>{this.props.loc1.name}</td>
              <td>{this.props.loc1.address}</td>
            </tr>
            <tr>
              <td>{this.props.loc2.text}</td>
              <td>{this.props.loc2.name}</td>
              <td>{this.props.loc2.address}</td>
            </tr>
            <tr>
              <td>{this.props.loc3.text}</td>
              <td>{this.props.loc3.name}</td>
              <td>{this.props.loc3.address}</td>
            </tr>
            <tr>
              <td>{this.props.loc4.text}</td>
              <td>{this.props.loc4.name}</td>
              <td>{this.props.loc4.address}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

export default AddressTable;