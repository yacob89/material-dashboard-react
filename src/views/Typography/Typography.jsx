// React Class

import React, { Component } from "react"
import { RegularCard, ItemGrid } from "components"
import { Grid } from "material-ui"
import Dropzone from 'react-dropzone'
import {Button} from "components"
import axios, { post } from "axios"
import auth from 'utils/auth'
// Material UI
import Loader from 'react-loader-advanced';
import Spinner from 'react-spinkit';

// Components
import FileBrowser, { BaseFileConnectors, FileRenderers } from 'react-keyed-file-browser'
import 'views/Typography/react-keyed-file-browser.css'
import 'views/Typography/typography.css'
import Moment from 'moment'

const customMessageElement = (
  <div>custom message element</div>
);

const spinner = (
  <Spinner name="line-scale"/>
);

const STRAPI_URL = 'https://db.mapid.io';
const SERVER_URL = 'https://geo.mapid.io';
//const SERVER_URL = 'http://192.168.1.11:7555';

class Typography extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      file: null,
      multifile:null,
      filesDrop:[],
      multifilesDrop:[],
      files:[],
      showModal: false,
      errormessage:'',
      totalUploaded:0,
      account_type:''
    };
    this.loadUploadList = this.loadUploadList.bind(this);
    this.loadUserProfile = this.loadUserProfile.bind(this);
    this.loadFileList = this.loadFileList.bind(this);
    this.deleteObject = this.deleteObject.bind(this);
    this.createFolder = this.createFolder.bind(this);
    this.handleFileClick = this.handleFileClick.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidMount(){
    console.log("User info: ", auth.getUserInfo().username);
    this.loadFileList();
    this.loadUploadList();
    this.loadUserProfile();
  }

  loadUploadList() {
    // Make a request for a user with a given ID

      axios.get(STRAPI_URL+'/fileuploads', {
          params: {
            username: auth.getUserInfo().username
          }
        }).then(response => {
        // handle success
        console.log(response);
        const fileList = response.data
        console.log(fileList.length);
        this.setState({ totalUploaded: fileList.length });
      });
  }

  loadUserProfile() {
    axios
      .get(STRAPI_URL + "/userdetail", {
        params: {
          username: auth.getUserInfo().username
        }
      })
      .then(response => {
        // handle success
        if (response.data) {
          console.log(response);
          const userdetails = response.data;
          console.log(userdetails);
          this.setState({
            account_type: userdetails[0].account_type
          });
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        //setTimeout(this.loadUserProfile(),3000);
      })
      .then(function () {
        // always executed
        //setTimeout(this.loadUserProfile(),3000);
      });
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

      axios.get(SERVER_URL+'/api/filelist', {
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

    if(this.state.account_type === 'free' && this.state.totalUploaded >= 5){
      alert("The Limit for free user is 5 layer");
    }
    else{
      if(this.state.file){
        this.setState({
          showModal: true
        });
    
        this.fileUpload(this.state.file).then(response => {
          console.log("Respon dari sebuah data: ", response.data);
          if(response.data === 'success'){
            this.setState({
              showModal: false,
              errormessage: 'File Uploaded successfully'
            });
            this.loadFileList();
          }
          else if(response.data === 'extension'){
            this.setState({
              showModal: false
            });
            alert("File extension error make sure you uploaded .geojson file!");
          }
          else{
            this.setState({
              showModal: false,
              errormessage: 'Upload error, please try again'
            });
          }
        });
      }
      else{
        alert('There is no file selected!');
      }
    }

  }

  fileUpload(file) {
    var FormData = require('form-data');

    var formData = new FormData();

    formData.append("file", file);
    formData.append("username", auth.getUserInfo().username);
    formData.append("filekey", file.name);
    console.log("Filekey: ", file.name);

    const url = SERVER_URL+'/apiuploads';
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'content-language': auth.getUserInfo().username
      }
    }
    return post(url, formData, config)
  }

  deleteObject(fileKey){
    axios.post(SERVER_URL+'/api/deleteobject', {
      bucket: auth.getUserInfo().username,
      key: fileKey
    })
    .then(function (response) {
      console.log(response.data);
      if(response.data === 'success'){
        alert(fileKey+ ' Deleted!');
      }
    })
    .catch(function (error) {
      console.log(error);
      alert(error);
    });
  }

  createFolder(fileKey){
    axios.post(SERVER_URL+'/api/createfolder', {
      bucket: auth.getUserInfo().username,
      key: fileKey
    })
    .then(function (response) {
      console.log(response.data);
      if(response.data === 'success'){
        alert("Folder Created");
      }
    })
    .catch(function (error) {
      console.log(error);
      alert(error);
    });
  }

  handleOpenModal () {
    this.setState({ showModal: true });
  }
  
  handleCloseModal () {
    this.setState({ showModal: false });
  }

  render() {
    /* Style */

    return (
      <div>
        <Loader show={this.state.showModal} message={spinner}>
          <Grid container>
            <RegularCard
              headerColor="blue"
              cardTitle="Uploads"
              cardSubtitle={'Total Uploaded Layer: ' + this.state.totalUploaded + " / 5" }
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
                                this.state.filesDrop.map(f => <li key={f.name}>{f.name} - {f.size / 1000000} MB</li>)
                              }
                            </ul>
                          </aside>
                        </section>
                        <Button color="bluemapid" type="submit" round>Upload</Button>
                      </form>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={4}>
                      <section>

                      </section>
                    </ItemGrid>
                  </Grid>
                  <Grid container>
                  <span><p>{this.state.errormessage}</p></span>
                  </Grid>
                </div>
              }
            />
          </Grid>
        </Loader>
      </div>
    );
  }
}

<Typography />;

export default Typography;
