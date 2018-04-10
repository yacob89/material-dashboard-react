import React from "react";
import Button from 'material-ui/Button';
import Dropzone from 'react-dropzone';
import {
    RegularCard
  } from "components";

class Upload extends React.Component {
    constructor() {
      super()
      this.state = {
        accepted: [],
        rejected: []
      }
    }
  
    render() {
      return (
        <RegularCard
        cardTitle="Upload your geospatial files"
        cardSubtitle="Only .geojson will be accepted"
        content={
            <section>
          <div className="dropzone">
            <Dropzone
              accept="application/geojson"
              onDrop={(accepted, rejected) => { this.setState({ accepted, rejected }); }}
            >
              <p>Try dropping some files here, or click to select files to upload.</p>
              <p>Only *.jpeg and *.png images will be accepted</p>
            </Dropzone>
          </div>
          <aside>
            <h2>Accepted files</h2>
            <ul>
              {
                this.state.accepted.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
              }
            </ul>
            <h2>Rejected files</h2>
            <ul>
              {
                this.state.rejected.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
              }
            </ul>
          </aside>
        </section>
        }/>
        
      );
    }
  }
  
  <Upload />

export default Upload;
