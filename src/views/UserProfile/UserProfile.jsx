import React from "react";
import { Grid, InputLabel } from "material-ui";
import axios from "axios";
import auth from 'utils/auth';

import {
  ProfileCard,
  RegularCard,
  Button,
  CustomInput,
  ItemGrid
} from "components";

import avatar from "assets/img/faces/marc.jpg";

const SERVER_URL = 'http://192.168.1.13';
//const SERVER_URL = 'http://54.245.202.137';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [1],
      layers: [],
      firstname: " ",
      lastname: " ",
      email: " ",
      address: " ",
      postcode: " ",
      country: " ",
      organization: " ",
      storage: 0
    };
    this.loadUserProfile = this.loadUserProfile.bind(this);
  }

  async componentDidMount() {
    console.log("User Info", auth.getUserInfo());
    this.createFolderOnClick();
  }

  componentWillMount(){
    this.loadUserProfile();
  }

  loadUserProfile() {
    axios
      .get(SERVER_URL + ":1337/userdetail", {
        params: {
          username: auth.getUserInfo().username
        }
      })
      .then(response => {
        // handle success
        if (response) {
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
            default:
          }
          this.setState({
            firstname: userdetails[0].firstname,
            lastname: userdetails[0].lastname,
            email: auth.getUserInfo().email,
            address: userdetails[0].address,
            postcode: userdetails[0].postcode,
            country: userdetails[0].country,
            organization: userdetails[0].organization
          });
        }
      });
  }

  updateUserProfile() {
    var userid = auth.getUserInfo()._id;
    var promise = new Promise(function(resolve, reject) {
      axios
        .put(
          `http://192.168.1.12:1337/userdetail/${userid}` /*{
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

  createFolderOnClick() {
    // Setelah selesai upload, baru insert data di strapi
    console.log("User yang akan dibuatkan folder", auth.getUserInfo().username);
    axios
      //.post("http://192.168.1.2:7555/createfolder", {
      .post("http://54.245.202.137:7555/createfolder", {
        username: auth.getUserInfo().username
      })
      .then(function(response) {
        console.log(response);
        console.log("Create Folder Success");
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={8}>
            <RegularCard
              headerColor="blue"
              cardTitle="Edit Profile"
              cardSubtitle={auth.getUserInfo().username}
              content={
                <div>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={11}>
                      <CustomInput
                        labelText={this.state.firstname}
                        id="first-name"
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={1} />
                  </Grid>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={11}>
                      <CustomInput
                        labelText={this.state.lastname}
                        id="last-name"
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={1} />
                  </Grid>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={11}>
                      <CustomInput
                        labelText={this.state.email}
                        id="email"
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={1} />
                  </Grid>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={11}>
                      <CustomInput
                        labelText={this.state.address}
                        id="address"
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={1} />
                  </Grid>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={11}>
                      <CustomInput
                        labelText={this.state.postcode}
                        id="postcode"
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={1} />
                  </Grid>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={11}>
                      <CustomInput
                        labelText={this.state.country}
                        id="country"
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={1} />
                  </Grid>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={11}>
                      <CustomInput
                        labelText={this.state.organization}
                        id="organization"
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={1} />
                  </Grid>
                </div>
              }
              footer={<Button color="bluemapid">Update Profile</Button>}
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={4}>
            <Grid container>
              <ProfileCard
                avatar={avatar}
                subtitle={auth.getUserInfo().role.name}
                title={auth.getUserInfo().username}
                description={auth.getUserInfo().email}
              />
            </Grid>
            <Grid container>
              <ItemGrid xs={12} sm={12} md={4} />
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
              </ItemGrid>
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
