import mapboxgl from 'mapbox-gl';
import React from "react";
import ReactDataGrid from 'react-data-grid';
import axios, { post } from "axios";
import auth from 'utils/auth';
import Dropzone from 'react-dropzone'
import {Button} from "components";

const selectedRows = [];

class Maps extends React.Component {

  constructor(props) {
    super(props);
    this._columns = [
      {
        key: 'size',
        name: 'Size'
      },
      {
        key: 'name',
        name: 'File Name'
      },
      {
        key: 'url',
        name: 'URL'
      }
    ];

    let rows = [];

    axios.get('http://192.168.1.8:7555/api/filelist')
      .then(function (response) {
        console.log(response.data.Contents[0]);

        for (let i = 0; i < response.data.Contents.length; i++) {
          rows.push({
            size: response.data.Contents[i].Size + " bytes",
            name: response.data.Contents[i].Key,
            url: 'https://s3-us-west-2.amazonaws.com/'+auth.getUserInfo().username+'/'+response.data.Contents[i].Key
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    this.state = { rows, selectedIndexes: [], selectedRows: [], file: null, files:[] };

    this.rowGetter = this.rowGetter.bind(this);
    this.onRowsSelected = this.onRowsSelected.bind(this);
    this.onRowsDeselected = this.onRowsDeselected.bind(this);
    this.getFileList = this.getFileList.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount(){
    
  }

  componentDidMount() {
    this.getFileList();
  }

  getFileList(){
    axios.get('http://192.168.1.8:7555/api/filelist').then(response => {
      const persons = response.data.Contents;
      
      this.setState({ persons });

      const converted = Object.keys(persons).map(function(key) {
        var person = persons[key];
        person.name = key;
        return person;
      });
      console.log("Uploads ", converted);
    });
  }

  rowGetter = (i) => {
    return this.state.rows[i];
  };

  onRowsSelected = (rows) => {
    let rowIndexes = rows.map(r => r.rowIdx);
    console.log("Row selected: ", rowIndexes[0]);
    this.setState({selectedIndexes: this.state.selectedIndexes.concat(rows.map(r => r.rowIdx))});
    console.log("Rows Selected: ", rows[0].row.name);

    selectedRows.push({
      size: rows[0].row.size,
      name: rows[0].row.name,
      url: rows[0].row.url
    });

    console.log("Current stack: ", selectedRows);

    this.setState({ selectedRows: selectedRows });
  };

  onRowsDeselected = (rows) => {
    let rowIndexes = rows.map(r => r.rowIdx);
    console.log("Row deleted: ", rowIndexes[0]);
    this.setState({selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1 )});
    selectedRows.splice(rowIndexes[0],1);
    this.setState({ selectedRows: selectedRows });
  };

  onFormSubmit(e) {
    e.preventDefault(); // Stop form submit
    this.fileUpload(this.state.file).then(response => {
      console.log("Respon dari sebuah data: ", response.data);
      if(response.data == 'success'){
        alert("Upload success!");
      }
      else if(response.data == 'extension'){
        alert("File extension error make sure you uploaded correct file!");
      }
    });
  }

  onChange(e) {
    this.setState({
      file: e.target.files[0]
    });
  }
  onDrop(files) {
    this.setState({
      files,
      file:files[0]
    });
  }

  fileUpload(file) {
    var FormData = require('form-data');
    const token = auth.getToken();
    const url = 'http://192.168.1.8:7555/api/upload';

    var formData = new FormData();
    formData.append("file", file);
    formData.append("username", auth.getUserInfo().username);
    formData.append("token", auth.getToken());
    console.log("Nama filenya adalah: ", file.name);
    var config = {
      headers: {
        "content-type": "multipart/form-data"
      },
      body: {"username":auth.getUserInfo().username}
    };

    config.body = {"user_name":auth.getUserInfo().username};
    //config.body.append("user_name", auth.getUserInfo().username);

    console.log("Requestnya: ",config);
    console.log("Kondisi config: ",config);

    return post(url, formData, config);
  }

  render() {

    const rowText = this.state.selectedIndexes.length === 1 ? 'row' : 'rows';
    return  (
      <div>
        <span>{this.state.selectedIndexes.length} {rowText} selected</span>
        <ReactDataGrid
          rowKey="size"
          columns={this._columns}
          rowGetter={this.rowGetter}
          rowsCount={this.state.rows.length}
          minHeight={500}
          rowSelection={{
            showCheckbox: true,
            enableShiftSelect: true,
            onRowsSelected: this.onRowsSelected,
            onRowsDeselected: this.onRowsDeselected,
            selectBy: {
              indexes: this.state.selectedIndexes
            }
          }} />
          <section>
              <form onSubmit={this.onFormSubmit}>
              <section>
                <div className="dropzone">
                  <Dropzone multiple={false} onDrop={this.onDrop.bind(this)}>
                    <p>Drop a geojson file here, or click to select files to upload.</p>
                  </Dropzone>
                </div>
                <aside>
                  <h2>Accepted file</h2>
                <ul>
                  {
                    this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                  }
                </ul>
                </aside>
            </section>
              <Button color="primary" type="submit" round>Upload</Button>
            </form>
          </section>
      </div>);
  }
}

<Maps />

export default Maps;
