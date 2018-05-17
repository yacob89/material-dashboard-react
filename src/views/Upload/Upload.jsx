import React from "react";
import axios, { post } from "axios";

// Utils
import auth from 'utils/auth';
import request from 'utils/request';

const strapi_url = 'http://192.168.1.4:7555';
const backend_url = 'http://192.168.1.4:7555';
const server_url = 'http://192.168.1.4:7555/geojson/';

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }
  async componentDidMount(){
    console.log("Pengguna saat ini: ", auth.getToken());

    // This is Example using AXIOS with custom header = User Token Authentication. Good Example!

    const token = auth.getToken();

    var config = {
      headers: {Authorization: `Bearer ${token}`}
    };

    axios.get('http://192.168.1.4:1337/fileuploads?username='+auth.getUserInfo().username,config).then(res => {
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
  onFormSubmit(e) {
    e.preventDefault(); // Stop form submit
    this.fileUpload(this.state.file).then(response => {
      console.log("Respon dari sebuah data: ", response.data);
      alert("Upload success!");
    });
        
  }
  onChange(e) {
    this.setState({
      file: e.target.files[0]
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
    console.log("Nama filenya adalah: ", formData);
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

    ////////////////////////////////////////////////////////
    
    ////////////////////////////////////////////////////////
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
    return (
      <form onSubmit={this.onFormSubmit}>
        <h1>File Uploadss</h1>
        <input type="file" onChange={this.onChange} />
        <button type="submit">Upload</button>
      </form>
    );
  }
}

export default Upload;
