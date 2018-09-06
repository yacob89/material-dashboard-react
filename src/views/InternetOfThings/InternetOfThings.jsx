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

import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock
} from "react-bootstrap";

import avatar from "assets/img/faces/marc.jpg";

//const SERVER_URL = 'http://192.168.1.13';
const SERVER_URL = 'http://34.219.155.147';
const TEMP_URL = 'http://localhost';

class InternetOfThings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      name: '',
      interval: '',
      dynamicValue: '',
      username: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
  }

  async componentDidMount() {
    console.log("User Info", auth.getUserInfo());
    this.setState({
      username: auth.getUserInfo().username
    });
  }

  componentWillMount(){
    
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
    const length = this.state.url.length;
    if (length > 3) return 'success';
    else if (length > 1) return 'warning';
    else if (length > 0) return 'error';
    return null;
  }

  handleChange(event) {
    console.log('URL: ', event.target.value);
    console.log('URL ID: ', event.target.id);
    if (event.target.id == 'url'){
      this.setState({url: event.target.value});
    }
    if (event.target.id == 'name'){
      this.setState({name: event.target.value});
    }
    if (event.target.id == 'interval'){
      this.setState({interval: event.target.value});
    }
    if (event.target.id == 'dynamicValue'){
      this.setState({dynamicValue: event.target.value});
    }
    
  }

  handleSubmit(event) {
    //alert('URL: ' + this.state.url +' Name: '+ this.state.name +' Interval: '+ this.state.interval +' Dynamic Value: '+ this.state.dynamicValue);
    console.log('Handle Submit New Internet Of Things');
    axios.post(SERVER_URL+':7555/generatesensor', {
      url: this.state.url,
      name: this.state.name,
      interval: this.state.interval,
      dynamicValue: this.state.dynamicValue,
      username: this.state.username
    })
    .then(function (response) {
      console.log(response);
      if(response.data === 'success'){
        alert('IoT Layer Created in Layer List!');
      }
      else{
        alert('IoT Layer Creation Error!');
      }
    })
    .catch(function (error) {
      console.log(error);
      alert(error);
    });
    event.preventDefault();
  }

  render() {

    const customInputText = {
      color: 'black'
    };

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <Grid container>
            <ItemGrid xs={12} sm={12} md={8}>
              <RegularCard
                headerColor="blue"
                cardTitle="Insert IoT Channel URL"
                cardSubtitle="Please define your IoT url and dynamic value"
                content={
                  <div>
                    <Grid container>
                      <ItemGrid xs={12} sm={12} md={11}>
                        <FormGroup
                          controlId="formBasicText"
                          validationState={this.getValidationState()}
                        >
                          <ControlLabel>Enter Channel URL</ControlLabel>
                          <FormControl
                            id="url"
                            type="text"
                            value={this.state.url}
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
                          <ControlLabel>Enter Layer Name</ControlLabel>
                          <FormControl
                            id="name"
                            type="text"
                            value={this.state.name}
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
                        <FormGroup controlId="formControlsSelect">
                          <ControlLabel>Refresh Interval</ControlLabel>
                          <FormControl componentClass="select" placeholder="select" id="interval" value={this.state.interval} onChange={this.handleChange}>
                            <option value="30">30 detik</option>
                            <option value="60">1 menit</option>
                          </FormControl>
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
                          <ControlLabel>Enter Dynamic Value Name (e.g: depth, speed, etc)</ControlLabel>
                          <FormControl
                            id="dynamicValue"
                            type="text"
                            value={this.state.dynamicValue}
                            placeholder="Enter text"
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
                footer={<Button color="bluemapid" type="submit" value="Submit">Insert Channel</Button>}
              />
            </ItemGrid>
            <ItemGrid xs={12} sm={12} md={4}>

            </ItemGrid>
          </Grid>
        </form>
      </div>
    );
  }
}

<InternetOfThings />;

export default InternetOfThings;
