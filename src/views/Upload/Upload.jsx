import React from "react";
import axios, { post } from "axios";
import Dropzone from 'react-dropzone';
import {Button} from "components";
import CustomTabs from "components/CustomTabs/CustomTabs.jsx";

// Utils
import auth from 'utils/auth';
import request from 'utils/request';
var shp = require('gtran-shapefile');

const Uppy = require('uppy/lib/core')
const Tus = require('uppy/lib/plugins/Tus')
const GoogleDrive = require('uppy/lib/plugins/GoogleDrive')
const { Dashboard, DashboardModal, DragDrop, ProgressBar } = require('uppy/lib/react')

const AWS = require('aws-sdk/dist/aws-sdk-react-native');

const strapi_url = 'http://54.245.202.137:1337';
const backend_url = 'http://54.245.202.137:7555';
const server_url = 'http://54.245.202.137:7555/geojson/';

/*const strapi_url = 'http://192.168.1.8:1337';
const backend_url = 'http://192.168.1.8:7555';
const server_url = 'http://192.168.1.8:7555/geojson/';*/

const styles = {
  textCenter: {
    textAlign: "center"
  }
};

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      multifile:null,
      filesDrop:[],
      multifilesDrop:[],
      showInlineDashboard: false,
      open: false
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.handleModalClick = this.handleModalClick.bind(this)
  }
  async componentDidMount(){
    console.log("Pengguna saat ini: ", auth.getToken());

    // This is Example using AXIOS with custom header = User Token Authentication. Good Example!

    const token = auth.getToken();

    var config = {
      headers: {Authorization: `Bearer ${token}`}
    };

    axios.get(strapi_url+'/fileuploads?username='+auth.getUserInfo().username,config).then(res => {
      const persons = res.data;
      this.setState({ persons });

      const converted = Object.keys(persons).map(function(key) {
        var person = persons[key];
        person.name = key;
        return person;
      });
      console.log("Uploads ", converted);
    });
  }
  componentWillMount () {
    this.uppy = new Uppy({ autoProceed: false })
      .use(Tus, { endpoint: 'http://54.245.202.137:7555' })
      .use(GoogleDrive, { host: 'https://server.uppy.io' })

    this.uppy2 = new Uppy({ autoProceed: false })
      .use(Tus, { endpoint: 'http://54.245.202.137:7555' })
  }
  componentWillUnmount () {
    this.uppy.close()
    this.uppy2.close()
  }

  handleModalClick () {
    this.setState({
      open: !this.state.open
    })
  }
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
  onDrop(filesDrop) {
    this.setState({
      filesDrop,
      file:filesDrop[0]
    });
  }
  onMultipleDrop(multifilesDrop) {
    this.setState({
      multifilesDrop,
      multifile:[]
    });
  }
  fileUpload(file) {
    var FormData = require('form-data');
    const token = auth.getToken();
    const url = backend_url + "/upload";

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
    
    /*var post_config = {
      headers: {Authorization: `Bearer ${token}`}
    };
    axios
      .post("http://192.168.1.4:1337/fileuploads", {
        username: auth.getUserInfo().username,
        filename: file.name,
        media_uploaded: this.state.file,
        server_url: server_url+file.name
      },post_config)
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });*/

    return post(url, formData, config);
  }

  render() {
    const { classes } = this.props;
    return (
      <CustomTabs
          headerColor="primary"
          tabs={[
            {
              tabName: "Geojson",
              tabContent: (
                <form onSubmit={this.onFormSubmit}>
                  <h1>Geojson Upload</h1>
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
                        this.state.filesDrop.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                      }
                    </ul>
                    </aside>
                 </section>
                  <Button color="primary" type="submit" round>Upload</Button>
                </form>
              )
            },
            {
              tabName: "Shapefile",
              tabContent: (
                <form onSubmit={this.onFormSubmit}>
                  <h1>Shapefile Upload</h1>
                  <section>
                    <div className="dropzone">
                      <Dropzone multiple={true} onDrop={this.onMultipleDrop.bind(this)}>
                        <p>Drop shp, dbf, and shx file here, or click to select files to upload.</p>
                      </Dropzone>
                    </div>
                    <aside>
                      <h2>Accepted file</h2>
                    <ul>
                      {
                        this.state.multifilesDrop.map(g => <li key={g.name}>{g.name} - {g.size} bytes</li>)
                      }
                    </ul>
                    </aside>
                 </section>
                  <Button color="primary" type="submit" round>Upload</Button>
                </form>
              )
            },
            {
              tabName: "Settings",
              tabContent: (
                <div>
        <h1>React Examples</h1>

        <h2>Inline Dashboard</h2>
        <label>
          <input
            type="checkbox"
            checked={this.showInlineDashboard}
            onChange={(event) => {
              this.setState({
                showInlineDashboard: event.target.checked
              })
            }}
          />
          Show Dashboard
        </label>
        {this.showInlineDashboard && (
          <Dashboard
            uppy={this.uppy}
            plugins={['GoogleDrive']}
            metaFields={[
              { id: 'name', name: 'Name', placeholder: 'File name' }
            ]}
          />
        )}

        <h2>Modal Dashboard</h2>
        <div>
          <button onClick={this.handleModalClick}>
            {this.state.open ? 'Close dashboard' : 'Open dashboard'}
          </button>
          <DashboardModal
            uppy={this.uppy2}
            open={this.state.open}
            target={document.body}
            onRequestClose={() => this.setState({ open: false })}
          />
        </div>

        <h2>Drag Drop Area</h2>
        <DragDrop
          uppy={this.uppy}
          locale={{
            strings: {
              chooseFile: 'Boop a file',
              orDragDrop: 'or yoink it here'
            }
          }}
        />

        <h2>Progress Bar</h2>
        <ProgressBar
          uppy={this.uppy}
        />
      </div>
              )
            }
          ]}
        />

      
    );
  }
}

export default Upload;
