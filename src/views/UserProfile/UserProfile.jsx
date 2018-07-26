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

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [1],
      layers: []
    };
  }

  async componentDidMount() {
    console.log("User Info", auth.getUserInfo());
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
      .then(function (response) {
        console.log(response);
        console.log("Create Folder Success");
        alert("Create folder success!");
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {

    return (
      <div>
        <Button color="danger"
          onClick={() => {
            auth.clearAppStorage();
            this.props.history.push('/auth/login');
          }} round>
          Logout
              </Button>
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
                        labelText="First Name"
                        id="first-name"
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={1}></ItemGrid>
                  </Grid>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={11}>
                      <CustomInput
                        labelText="Last Name"
                        id="last-name"
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={1}></ItemGrid>
                  </Grid>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={11}>
                      <CustomInput
                        labelText="Your Email"
                        id="email"
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={1}></ItemGrid>
                  </Grid>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={11}>
                      <CustomInput
                        labelText="Street Address"
                        id="address"
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={1}></ItemGrid>
                  </Grid>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={11}>
                      <CustomInput
                        labelText="Post Code"
                        id="postcode"
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={1}></ItemGrid>
                  </Grid>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={11}>
                      <CustomInput
                        labelText="Country"
                        id="country"
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={1}></ItemGrid>
                  </Grid>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={11}>
                      <CustomInput
                        labelText="Your Organization"
                        id="organization"
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={1}></ItemGrid>
                  </Grid>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={12}>
                      <InputLabel style={{ color: "#AAAAAA" }}>
                        About me
                </InputLabel>
                      <CustomInput
                        labelText="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
                        id="about-me"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          multiline: true,
                          rows: 5
                        }}
                      />
                    </ItemGrid>
                  </Grid>
                </div>
              }
              footer={<Button color="bluemapid">Update Profile</Button>}
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={4}>
            <ProfileCard
              avatar={avatar}
              subtitle={auth.getUserInfo().role.name}
              title={auth.getUserInfo().username}
              description={auth.getUserInfo().email}
              footer={
                <Button color="bluemapid" round onClick={this.createFolderOnClick}>
                  Create Folder
              </Button>
              }
            />
          </ItemGrid>
        </Grid>
      </div>
    );
  }
}

<UserProfile />;

export default UserProfile;
