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
        <ItemGrid xs={12} sm={12} md={3}></ItemGrid>
        <ItemGrid xs={12} sm={12} md={6}>
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
        <ItemGrid xs={12} sm={12} md={3}></ItemGrid>
      </Grid>
    </div>
    );
  }
}

<UserProfile />;

export default UserProfile;
