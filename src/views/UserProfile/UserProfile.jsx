import React from "react";
import { Grid, InputLabel } from "material-ui";
import axios from "axios";
import Dropzone from 'react-dropzone';
import auth from 'utils/auth';

import {
  ProfileCard,
  RegularCard,
  Button,
  CustomInput,
  ItemGrid
} from "components";

import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock
} from "react-bootstrap";

import avatar from "assets/img/faces/marc.jpg";
import 'views/UserProfile/userprofile.css'

//const SERVER_URL = 'http://192.168.1.11:7555';
const STRAPI_URL = 'https://db.mapid.io';
const SERVER_URL = 'https://geo.mapid.io';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [1],
      layers: [],
      id:'',
      firstname: " ",
      lastname: " ",
      email: " ",
      address: " ",
      postcode: " ",
      country: " ",
      organization: " ",
      account_type: " ",
      storage: 0,
      accepted: [],
      rejected: []
    };
    this.loadUserProfile = this.loadUserProfile.bind(this);
    this.createFolderOnClick = this.createFolderOnClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.pembayaran = this.pembayaran.bind(this);
  }

  componentDidMount() {
    console.log("User Info", auth.getUserInfo());
    this.createFolderOnClick();
    setTimeout(this.loadUserProfile(),2000);
    //this.loadUserProfile();
  }

  async componentWillMount(){
    //this.loadUserProfile();
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
          switch (userdetails) {
            case userdetails[0].firstname == null:
              userdetails[0].firstname = "-";
              break;
            case userdetails[0].lastname == null:
              userdetails[0].lastname = "-";
              break;
            case userdetails[0].email == null:
              userdetails[0].email = "-";
              break;
            case userdetails[0].address == null:
              userdetails[0].address = "-";
              break;
            case userdetails[0].postcode == null:
              userdetails[0].postcode = "-";
              break;
            case userdetails[0].country == null:
              userdetails[0].country = "-";
              break;
            case userdetails[0].organization == null:
              userdetails[0].organization = "-";
              break;
            case userdetails[0].account_type == null:
              userdetails[0].organization = "-";
              break;
            default:
          }
          this.setState({
            id:userdetails[0]._id,
            firstname: userdetails[0].firstname,
            lastname: userdetails[0].lastname,
            email: auth.getUserInfo().email,
            address: userdetails[0].address,
            postcode: userdetails[0].postcode,
            country: userdetails[0].country,
            organization: userdetails[0].organization,
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

  pembayaran(){
    axios.post('https://my.ipaymu.com/payment.htm', {
      params: {
        key: 'IyFyPYQBU9BZoUqJ1Dp3ZymUaGGkK.',
      action: 'payment',
      product: 'Peta Buta',
      price: '1000',
      quantity: 1,
      comments: 'Keterangan Produk',
      ureturn: 'https://flow.mapid.io',
      unotify: 'https://www.microsoft.com/id-id',
      ucancel: 'https://www.apple.com/id/',
      format: 'json'
      }
    })
    .then(function (response) {
      console.log('iPayMu Response: ',response);
    })
    .catch(function (error) {
      console.log('iPayMu request error',error);
    });

    /*axios.post('https://my.ipaymu.com/payment.htm', {
      key: 'IyFyPYQBU9BZoUqJ1Dp3ZymUaGGkK.',
      action: 'payment',
      product: 'Peta Buta',
      price: '1000',
      quantity: 1,
      comments: 'Keterangan Produk',
      ureturn: 'https://flow.mapid.io',
      unotify: 'https://www.microsoft.com/id-id',
      ucancel: 'https://www.apple.com/id/',
      format: 'json'
    })
    .then(function (response) {
      console.log('iPayMu Response: ',response);
    })
    .catch(function (error) {
      console.log('iPayMu request error',error);
    });*/
  }

  updateUserProfile() {
    var userid = auth.getUserInfo()._id;
    var promise = new Promise(function(resolve, reject) {
      axios
        .put(
          `https://db.mapid.io/userdetail/${userid}` /*{
    //axios.put(`http://192.168.1.2:1337/fileuploads/${id}`,
        /*{
               params: {
                 _id:id
               }
             },*/,
          {
            //active: activevalue
          }
        )
        .then(function(responses) {
          console.log("Respon Data: ", responses.data);
          if (responses.data.ok == 1) {
            alert("Success!");
          }
          resolve("true");
        })
        .catch(function(error) {
          console.log(error);
          alert(error);
        });
      // call resolve if the method succeeds
    });
    promise.then(bool => this.loadFileList());
  }

  isSelected = index => {
    return this.state.selected.indexOf(index) !== -1;
  };

  handleRowSelection = selectedRows => {
    this.setState({
      selected: selectedRows
    });
  };

  getValidationState() {
    /*const length = this.state.firstname.length;
    if (length > 3) return 'success';
    else if (length > 1) return 'warning';
    else if (length > 0) return 'error';*/
    return null;
  }

  handleChange(event) {
    console.log('URL: ', event.target.value);
    console.log('URL ID: ', event.target.id);
    if (event.target.id == 'firstname'){
      this.setState({firstname: event.target.value});
    }
    if (event.target.id == 'lastname'){
      this.setState({lastname: event.target.value});
    }
    if (event.target.id == 'address'){
      this.setState({address: event.target.value});
    }
    if (event.target.id == 'postcode'){
      this.setState({postcode: event.target.value});
    }
    if (event.target.id == 'country'){
      this.setState({country: event.target.value});
    }
    if (event.target.id == 'organization'){
      this.setState({organization: event.target.value});
    }
  }

  handleSubmit(event) {
    //alert('URL: ' + this.state.url +' Name: '+ this.state.name +' Interval: '+ this.state.interval +' Dynamic Value: '+ this.state.dynamicValue);
    console.log('Handle Submit New Internet Of Things');
    axios.post(SERVER_URL+'/updateuser', {
      id: this.state.id,
      username: auth.getUserInfo().username,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email: this.state.email,
      address: this.state.address,
      postcode: this.state.postcode,
      country: this.state.country,
      organization: this.state.organization
    })
    .then(function (response) {
      console.log(response);
      if(response.data == 'success'){
        alert('Successfully Update User Profile!');
      }
      else{
        alert('Update User Profile Error!');
      }
    })
    .catch(function (error) {
      console.log(error);
      alert(error);
    });
    event.preventDefault();
  }

  createFolderOnClick() {
    // Create Folder
    console.log("User yang akan dibuatkan folder", auth.getUserInfo().username);
    axios.post(SERVER_URL + '/createfolder', {
      username: auth.getUserInfo().username
    })
      .then(function (response) {
        console.log("Create Folder Success ", response);
        // Setelah create folder sukses, create config
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={8}>
            <form onSubmit={this.handleSubmit}>
              <RegularCard
                headerColor="blue"
                cardTitle="My Profile"
                cardSubtitle={auth.getUserInfo().username}
                content={
                  <div>

                    <Grid container>
                      <ItemGrid xs={12} sm={12} md={11}>
                        <FormGroup
                          controlId="formBasicText"
                          validationState={this.getValidationState()}
                        >
                          <ControlLabel>First Name</ControlLabel>
                          <FormControl
                            id="firstname"
                            type="text"
                            value={this.state.firstname}
                            placeholder="Enter text"
                            onChange={this.handleChange}
                          />
                          <FormControl.Feedback />
                          <HelpBlock></HelpBlock>
                        </FormGroup>
                      </ItemGrid>
                      <ItemGrid xs={12} sm={12} md={1} />
                    </Grid>

                    <Grid container>
                      <ItemGrid xs={12} sm={12} md={11}>
                        <FormGroup
                          controlId="formBasicText"
                          validationState={this.getValidationState()}
                        >
                          <ControlLabel>Last Name</ControlLabel>
                          <FormControl
                            id="lastname"
                            type="text"
                            value={this.state.lastname}
                            placeholder="Enter text"
                            onChange={this.handleChange}
                          />
                          <FormControl.Feedback />
                          <HelpBlock></HelpBlock>
                        </FormGroup>
                      </ItemGrid>
                      <ItemGrid xs={12} sm={12} md={1} />
                    </Grid>

                    <Grid container>
                      <ItemGrid xs={12} sm={12} md={11}>
                        <FormGroup
                          controlId="formBasicText"
                          validationState={this.getValidationState()}
                        >
                          <ControlLabel>Email Address</ControlLabel>
                          <FormControl
                            id="email"
                            type="email"
                            value={this.state.email}
                            placeholder="Email Address"
                            onChange={this.handleChange}
                            disabled="true"
                          />
                          <FormControl.Feedback />
                          <HelpBlock></HelpBlock>
                        </FormGroup>
                      </ItemGrid>
                      <ItemGrid xs={12} sm={12} md={1} />
                    </Grid>

                    <Grid container>
                      <ItemGrid xs={12} sm={12} md={11}>
                        <FormGroup
                          controlId="formBasicText"
                          validationState={this.getValidationState()}
                        >
                          <ControlLabel>Street Address</ControlLabel>
                          <FormControl
                            id="address"
                            type="text"
                            value={this.state.address}
                            placeholder="Enter Street Address"
                            onChange={this.handleChange}
                          />
                          <FormControl.Feedback />
                          <HelpBlock></HelpBlock>
                        </FormGroup>
                      </ItemGrid>
                      <ItemGrid xs={12} sm={12} md={1} />
                    </Grid>

                    <Grid container>
                      <ItemGrid xs={12} sm={12} md={11}>
                        <FormGroup
                          controlId="formBasicText"
                          validationState={this.getValidationState()}
                        >
                          <ControlLabel>Post Code</ControlLabel>
                          <FormControl
                            id="postcode"
                            type="text"
                            value={this.state.postcode}
                            placeholder="Enter Post Code"
                            onChange={this.handleChange}
                          />
                          <FormControl.Feedback />
                          <HelpBlock></HelpBlock>
                        </FormGroup>
                      </ItemGrid>
                      <ItemGrid xs={12} sm={12} md={1} />
                    </Grid>

                    <Grid container>
                      <ItemGrid xs={12} sm={12} md={11}>
                        <FormGroup
                          controlId="formBasicText"
                          validationState={this.getValidationState()}
                        >
                          <ControlLabel>Country</ControlLabel>
                          <FormControl
                            id="country"
                            type="text"
                            value={this.state.country}
                            placeholder="Enter Country"
                            onChange={this.handleChange}
                          />
                          <FormControl.Feedback />
                          <HelpBlock></HelpBlock>
                        </FormGroup>
                      </ItemGrid>
                      <ItemGrid xs={12} sm={12} md={1} />
                    </Grid>

                    <Grid container>
                      <ItemGrid xs={12} sm={12} md={11}>
                        <FormGroup
                          controlId="formBasicText"
                          validationState={this.getValidationState()}
                        >
                          <ControlLabel>Organization</ControlLabel>
                          <FormControl
                            id="organization"
                            type="text"
                            value={this.state.organization}
                            placeholder="Enter Organization"
                            onChange={this.handleChange}
                          />
                          <FormControl.Feedback />
                          <HelpBlock></HelpBlock>
                        </FormGroup>
                      </ItemGrid>
                      <ItemGrid xs={12} sm={12} md={1} />
                    </Grid>

                  </div>
                }
                footer={<Button color="bluemapid" type="submit" value="Submit">Update Profile</Button>}
              />
            </form>
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={4}>
          <Grid container>
          <ProfileCard
            avatar={avatar}
            subtitle={this.state.account_type + " Membership"}
            title={auth.getUserInfo().username}
            description={auth.getUserInfo().email}
          />
        </Grid>
        <Grid container>
        <ItemGrid xs={12} sm={12} md={4}>
        <Button
          color="danger"
          onClick={() => {
            auth.clearAppStorage();
            this.props.history.push("/auth/login");
          }}
          round
        >
          Logout
      </Button>
      <Button
          color="danger"
          onClick={() => {
            var win = window.open('https://my.ipaymu.com/process.htm?product=3896&member=BagusID@me.com&action=subscription&send=yes', '_blank');
          }}
          round
        >
          Upgrade
      </Button>
      </ItemGrid>
          <ItemGrid xs={12} sm={12} md={4} />
          <ItemGrid xs={12} sm={12} md={4} />
        </Grid>
          </ItemGrid>
        </Grid>
      </div>
    );
  }
}

<UserProfile />;

export default UserProfile;
