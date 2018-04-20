import React from "react";
import axios, { post } from "axios";

// Utils
import auth from 'utils/auth';
import request from 'utils/request';

const strapi_url = 'http://192.168.1.2:1337';
const backend_url = 'http://192.168.1.2:7555';
const server_url = 'http://192.168.1.2:7555/geojson/';

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

    /*const requestURL = 'http://192.168.1.2:1337/user?username='+auth.getUserInfo().username;

    const userinfo = await request(requestURL, { method: 'GET' });
    //this.setState({ products });
    console.log("User Info: ", userinfo);*/

    const token = auth.getToken();

    var config = {
      headers: {Authorization: `Bearer ${token}`}
    };

    axios.get('http://192.168.1.2:1337/fileuploads?username='+auth.getUserInfo().username,config).then(res => {
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
      console.log(response.data);
      alert("Upload success!");
    });
    //this.fileUpload(this.state.file);
  }
  onChange(e) {
    this.setState({
      file: e.target.files[0]
    });
  }
  fileUpload(file) {
    const url = backend_url + "/upload";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", auth.getUserInfo().username);
    console.log("Nama filenya adalah: ", formData);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      },
      body:{
        "username": auth.getUserInfo().username
      }
    };

    // Update to database
    console.log("Kondisi file: ",this.state.file);
    axios
      .post("http://192.168.1.2:1337/fileuploads", {
        username: auth.getUserInfo().username,
        filename: file.name,
        media_uploaded: this.state.file,
        server_url: server_url+file.name
      })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });

    return post(url, formData, config);
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <h1>File Upload</h1>
        <input type="file" onChange={this.onChange} />
        <button type="submit">Upload</button>
      </form>
    );
  }
}

export default Upload;
