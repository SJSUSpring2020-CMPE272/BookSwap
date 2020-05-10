import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

//Based on https://github.com/google-map-react/google-map-react#rendering-in-a-modal

const AnyReactComponent = ({ text }) => <div class="circle">{text}</div>;

class SimpleMap extends Component {

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '50vh', width: '50%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyCBMXP0aZzf-ic_0t0EWEF0LCN2C5YbQAE" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent
            lat={this.props.loc0.lat}
            lng={this.props.loc0.lng}
            text={this.props.loc0.text}
          />

          <AnyReactComponent
            lat={this.props.loc1.lat}
            lng={this.props.loc1.lng}
            text={this.props.loc1.text}
          />

          <AnyReactComponent
            lat={this.props.loc2.lat}
            lng={this.props.loc2.lng}
            text={this.props.loc2.text}
          />

          <AnyReactComponent
            lat={this.props.loc3.lat}
            lng={this.props.loc3.lng}
            text={this.props.loc3.text}
          />

          <AnyReactComponent
            lat={this.props.loc4.lat}
            lng={this.props.loc4.lng}
            text={this.props.loc4.text}
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;