// React Class

import React, { Component } from "react"
import ReactDOM from 'react-dom'
import { RegularCard, ItemGrid } from "components"
import { Grid } from "material-ui"
import Dropzone from 'react-dropzone'
import {Button} from "components"
import axios, { post } from "axios"
import auth from 'utils/auth'
// Components
import FileBrowser, { BaseFileConnectors, FileRenderers } from 'react-keyed-file-browser'
import 'views/Typography/react-keyed-file-browser.css'
import 'views/Typography/typography.css'
import Moment from 'moment'
import shp from 'shpjs'
const AWS = require('aws-sdk');
var path = require('path');

const SERVER_URL = 'http://54.245.202.137';
//const SERVER_URL = 'http://192.168.1.2';

class Typography extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      file: null,
      multifile:null,
      filesDrop:[],
      multifilesDrop:[],
      files:[]
    };
    this.loadFileList = this.loadFileList.bind(this);
    this.deleteObject = this.deleteObject.bind(this);
    this.createFolder = this.createFolder.bind(this);
    this.handleFileClick = this.handleFileClick.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.s3Upload = this.s3Upload.bind(this);
  }

  componentDidMount(){
    console.log("User info: ", auth.getUserInfo().username);
    this.loadFileList();
  }

  /* File Browser Functions */

  handleFileClick = (event) => {
    console.log(this.props.fileKey)
  }

  handleCreateFolder = (key) => {
    this.setState(state => {
      state.files = state.files.concat([{
        key: key,
      }])
      return state
    })
    this.createFolder(key);
  }
  handleCreateFiles = (files, prefix) => {
    this.setState(state => {
      const newFiles = files.map((file) => {
        let newKey = prefix
        if (prefix !== '' && prefix.substring(prefix.length - 1, prefix.length) !== '/') {
          newKey += '/'
        }
        newKey += file.name
        return {
          key: newKey,
          size: file.size,
          modified: +Moment(),
        }
      })

      const uniqueNewFiles = []
      newFiles.map((newFile) => {
        let exists = false
        state.files.map((existingFile) => {
          if (existingFile.key === newFile.key) {
            exists = true
          }
        })
        if (!exists) {
          uniqueNewFiles.push(newFile)
        }
      })
      state.files = state.files.concat(uniqueNewFiles)
      return state
    })
  }
  handleRenameFolder = (oldKey, newKey) => {
    this.setState(state => {
      const newFiles = []
      state.files.map((file) => {
        if (file.key.substr(0, oldKey.length) === oldKey) {
          newFiles.push({
            ...file,
            key: file.key.replace(oldKey, newKey),
            modified: +Moment(),
          })
        } else {
          newFiles.push(file)
        }
      })
      state.files = newFiles
      return state
    })
  }
  handleRenameFile = (oldKey, newKey) => {
    this.setState(state => {
      const newFiles = []
      state.files.map((file) => {
        if (file.key === oldKey) {
          newFiles.push({
            ...file,
            key: newKey,
            modified: +Moment(),
          })
        } else {
          newFiles.push(file)
        }
      })
      state.files = newFiles
      return state
    })
  }
  handleDeleteFolder = (folderKey) => {
    this.setState(state => {
      const newFiles = []
      state.files.map((file) => {
        if (file.key.substr(0, folderKey.length) !== folderKey) {
          newFiles.push(file)
        }
      })
      state.files = newFiles
      return state
    })
    this.deleteObject(folderKey);
  }
  handleDeleteFile = (fileKey) => {
    console.log("Filekey: ", fileKey);
    this.setState(state => {
      const newFiles = []
      state.files.map((file) => {
        if (file.key !== fileKey) {
          newFiles.push(file)
        }
      })
      state.files = newFiles
      return state
    })
    this.deleteObject(fileKey);
  }
  /* End File Browser Functions */

  loadFileList() {
    // Make a request for a user with a given ID
    let rows = [];

      axios.get(SERVER_URL+':7555/api/filelist', {
          params: {
            username: auth.getUserInfo().username
          }
        }).then(response => {
        // handle success
        console.log(response);
        const fileList = response.data.Contents
        console.log(fileList);

        var i;
        for (i = 0; i < fileList.length; i++) {
          var modifiedDate = new Date(fileList[i].LastModified);
          rows.push({
            key: fileList[i].Key,
            modified:modifiedDate,
            size: fileList[i].Size
          });
        }
        this.setState({ files:rows });
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

  onFormSubmit(e) {
    e.preventDefault(); // Stop form submit

    /*this.fileUpload(this.state.file).then(response => {
      console.log("Respon dari sebuah data: ", response.data);
      if(response.data == 'success'){
        alert("Upload success!");
        this.loadFileList();
      }
      else if(response.data == 'extension'){
        alert("File extension error make sure you uploaded correct file!");
      }
    });*/

    this.s3Upload(this.state.file);

  }

  s3Upload(file) {
    // Due to security reasons, cannot expose user and secret key
    axios.get(SERVER_URL + ':7555/api/getsecretkey', {
      params: {
        username: auth.getUserInfo().username
      }
    }).then(response => {
      // handle success
      console.log(response);
      const userkey = response.data.user_key;
      const secretkey = response.data.secret_key;

      let s3bucket = new AWS.S3({
        accessKeyId: userkey,
        secretAccessKey: secretkey,
        Bucket: 'yacob'
      });

      var params = {
        Bucket: 'yacob',
        ACL: 'public-read',
        Key: auth.getUserInfo().username + '/' + file.name,
        Body: file
      };
      s3bucket.upload(params, function (err, data) {
        if (err) {
          console.log('error in callback');
          console.log(err);
        } else {
          console.log('success');
          console.log(data.Location);

          var filetype = path.extname(file.name);
          console.log("File Extension: ", filetype);
          //var fetchUrl = require("fetch").fetchUrl;

          if (filetype == '.zip') {
            console.log("File Path: ", data.Location);
            shp(data.Location).then(function (geojson) {
              //see bellow for whats here this internally call shp.parseZip()
              console.log("Geojsonnya: ", geojson);
              // Send request to convert shp file to geojson and upload to S3
              axios.post(SERVER_URL + ':7555/api/convertshp', {
                  username: auth.getUserInfo().username,
                  filename: file.name,
                  geojson: geojson
                })
                .then(function (response) {
                  console.log(response.data);
                  if (response.data == 'success') {
                    alert("Convert and Upload success!!");
                  }
                })
                .catch(function (error) {
                  console.log(error);
                  alert(error);
                });
            });
          }

          if (filetype == '.geojson') {
            // source file is iso-8859-15 but it is converted to utf-8 automatically

            axios.get(data.Location).then(res => {
              console.log("Masuk axios");
              const persons = res.data;
              //var jsonContent = JSON.parse(persons);

              //var geojsonType = jsonContent.features;
              if (persons) {
                var geojsonType = persons.features[0].geometry.type;
                var htmlType = '';

                if (geojsonType == 'Polygon' || geojsonType == 'MultiPolygon') {
                  htmlType = 'fill';
                }
                if (geojsonType == 'Point' || geojsonType == 'MultiPoint') {
                  htmlType = 'symbol';
                }
                if (geojsonType == 'LineString' || geojsonType == 'MultiLineString') {
                  htmlType = 'line';
                }
                console.log("GEOJSON TYPE: ", htmlType);

                // Setelah selesai upload, baru insert data di strapi
                axios
                  .post(SERVER_URL + ':1337/fileuploads', {
                    //.post("http://192.168.1.11:1337/fileuploads", {
                    username: auth.getUserInfo().username,
                    filename: file.name,
                    server_url: data.Location,
                    type: htmlType,
                    active: 'false'
                  })
                  .then(function (response) {
                    console.log(response);
                    console.log("Upload Success");
                    alert("Upload Success!");
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              } else {
                console.log("Something broke!");
              }
            });
          }
          console.log("Upload Success");
        }
      });
    });
    /* End of CORS Configuration */
  }

  fileUpload(file) {
    var FormData = require('form-data');

    var formData = new FormData();
    formData.set('file', file);
    formData.set('username', auth.getUserInfo().username);
    formData.set('filekey', file.name);

    formData.append("file", file);
    formData.append("username", auth.getUserInfo().username);
    formData.append("filekey", file.name);
    console.log("Nama filenya adalah: ", file.name);
    console.log("Filekey nya adalah: ", file.name);

    const url = SERVER_URL+':7555/api/upload';
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    return post(url, formData, config)
  }

  deleteObject(fileKey){
    axios.post(SERVER_URL+':7555/api/deleteobject', {
      bucket: auth.getUserInfo().username,
      key: fileKey
    })
    .then(function (response) {
      console.log(response.data);
      if(response.data == 'success'){
        alert(fileKey+ ' Deleted!');
      }
    })
    .catch(function (error) {
      console.log(error);
      alert(error);
    });
  }

  createFolder(fileKey){
    axios.post(SERVER_URL+':7555/api/createfolder', {
      bucket: auth.getUserInfo().username,
      key: fileKey
    })
    .then(function (response) {
      console.log(response.data);
      if(response.data == 'success'){
        alert("Folder Created");
      }
    })
    .catch(function (error) {
      console.log(error);
      alert(error);
    });
  }

  render() {
    /* Style */

    return (
      <div>
        <Grid container>
          <RegularCard
            headerColor="blue"
            cardTitle="Uploads"
            cardSubtitle={'Upload Your geojson and zipped shapefiles here'}
            content={
              <div>
                <FileBrowser
                  files={this.state.files}

                  onCreateFolder={this.handleCreateFolder}
                  onCreateFiles={this.handleCreateFiles}
                  onMoveFolder={this.handleRenameFolder}
                  onMoveFile={this.handleRenameFile}
                  onRenameFolder={this.handleRenameFolder}
                  onRenameFile={this.handleRenameFile}
                  onDeleteFolder={this.handleDeleteFolder}
                  onDeleteFile={this.handleDeleteFile}
                />
                <Grid container>
                  <ItemGrid xs={12} sm={12} md={8}>
                    <form onSubmit={this.onFormSubmit}>
                      <section>
                        <div className="dropzone">
                          <Dropzone className="dropzone" multiple={false} onDrop={this.onDrop.bind(this)}>
                            <p>Drop a geojson file here, or click to select files to upload.</p>
                          </Dropzone>
                        </div>
                        <aside>
                          <ul>
                            {
                              this.state.filesDrop.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                            }
                          </ul>
                        </aside>
                      </section>
                    </form>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={12} md={4}>
                    <section>
                      <Button color="bluemapid" type="submit" round>Upload</Button>
                    </section>
                  </ItemGrid>
                </Grid>
              </div>
            }
          />
        </Grid>
      </div>
    );
  }
}

<Typography />;

export default Typography;
