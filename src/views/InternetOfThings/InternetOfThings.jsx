import React from "react";
import { Grid, InputLabel } from "material-ui";
import axios from "axios";
import auth from 'utils/auth';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

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

const SERVER_URL = 'http://192.168.1.11:7555';
const STRAPI_URL = 'https://db.mapid.io';
//const SERVER_URL = 'https://geo.mapid.io';
const TEMP_URL = 'http://localhost';

const columns = [{
  dataField: 'sensor_id',
  text: 'Sensor ID',
  filter: textFilter(),
  sort: true,
  headerStyle: {
    backgroundColor: '#bec1ce'
  },style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  }
}, {
  dataField: 'name',
  text: 'Name',
  sort: true,
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  },
  hidden: true
}, 
{
  dataField: 'interval',
  text: 'Interval',
  filter: textFilter(),
  sort: true,
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  },
  editor: {
    type: Type.SELECT,
    options: [{
      value: '15',
      label: '15'
    }, {
      value: '30',
      label: '30'
    }, {
      value: '60',
      label: '60'
    }, {
      value: '90',
      label: '90'
    }]
  }
},  
{
  dataField: '_id',
  text: 'ID',
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  hidden: true
},
{
  dataField: 'dynamicValue',
  text: 'Dynamic Value',
  sort: true,
  headerStyle: {
    backgroundColor: '#bec1ce'
  },style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  }
},
{
  dataField: 'min_value',
  text: 'Min Value',
  sort: true,
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  },
  hidden: false
}, 
{
  dataField: 'max_value',
  text: 'Max Value',
  sort: true,
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  },
  hidden: false
}, 
{
  dataField: 'circle_color',
  text: 'Circle Color',
  sort: true,
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  },
  hidden: false
}, 
{
  dataField: 'inner_color',
  text: 'Inner Color',
  sort: true,
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  },
  hidden: false
}, 
{
  dataField: 'edit',
  text: 'Edit',
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  },
  events: {
    onClick: () => alert('Edit layer')
  }
},
{
  dataField: 'delete',
  text: 'Delete',
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  },
  events: {
    onClick: () => alert('Delete layer')
  }
},
];

const rowEvents = {
onClick: (e, row, rowIndex) => {
  alert(`Layer Deleted at: ${rowIndex}`);
}
};

let rows = [];

class InternetOfThings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      column: [],
      rowData: [],
      url: '',
      name: '',
      interval: '30',
      dynamicValue: '',
      min_value:'',
      max_value:'',
      circle_color:'#1a66ff',
      inner_color:'#6699ff',
      username: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.loadSensorList = this.loadSensorList.bind(this);
  }

  async componentDidMount() {
    console.log("User Info", auth.getUserInfo());
    this.setState({
      username: auth.getUserInfo().username
    });
    this.loadSensorList();
  }

  componentWillMount(){
    
  }

  loadSensorList() {
    // Make a request for a user with a given ID
    rows = [];

    axios.get(STRAPI_URL + '/sensor', {
      params: {
        username: auth.getUserInfo().username
      }
    }).then(response => {
      // handle success
      console.log(response);
      const sensorList = response.data
      console.log(sensorList);

      var i;
      var total = 0;
      for (i = 0; i < sensorList.length; i++) {
        var modifiedDate = new Date(sensorList[i].created_at);
        rows.push({
          sensor_id: sensorList[i].sensor_id,
          name: sensorList[i].name,
          interval: sensorList[i].interval,
          dynamicValue: sensorList[i].dynamicValue,
          min_value: sensorList[i].min_value,
          max_value: sensorList[i].max_value,
          circle_color: sensorList[i].circle_color,
          inner_color: sensorList[i].inner_color,
          _id: sensorList[i]._id,
          delete: "Delete",
          edit: "Edit"
        });
      }
      this.setState({ rowData: rows, showModal: false });
    });
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
    if (event.target.id == 'min_value'){
      this.setState({min_value: event.target.value});
    }
    if (event.target.id == 'max_value'){
      this.setState({max_value: event.target.value});
    }
    if (event.target.id == 'circle_color'){
      this.setState({circle_color: event.target.value});
    }
    if (event.target.id == 'inner_color'){
      this.setState({inner_color: event.target.value});
    }
    
  }

  handleSubmit(event) {
    //alert('URL: ' + this.state.url +' Name: '+ this.state.name +' Interval: '+ this.state.interval +' Dynamic Value: '+ this.state.dynamicValue);
    console.log('Handle Submit New Internet Of Things');
    axios.post(SERVER_URL+'/generatesensor', {
      url: this.state.url,
      name: this.state.name,
      interval: this.state.interval,
      dynamicValue: this.state.dynamicValue,
      min_value: this.state.min_value,
      max_value: this.state.max_value,
      circle_color: this.state.circle_color,
      inner_color: this.state.inner_color,
      username: this.state.username
    })
    .then(function (response) {
      console.log(response);
      if(response.data == 'success'){
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

    const rowStyle2 = (row, rowIndex) => {
      const style = {};
      style.backgroundColor = rows[rowIndex].color;
      style.borderStyle = 'none';
    
      return style;
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
                            <option value='30'>30 detik</option>
                            <option value='60'>1 menit</option>
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
                    <Grid container>
                      <ItemGrid xs={12} sm={12} md={11}>
                        <FormGroup
                          controlId="formBasicText"
                          validationState={this.getValidationState()}
                        >
                          <ControlLabel>Enter Minimum Value Number</ControlLabel>
                          <FormControl
                            id="min_value"
                            type="text"
                            value={this.state.min_value}
                            placeholder="Enter Number"
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
                          <ControlLabel>Enter Maximum Value Number</ControlLabel>
                          <FormControl
                            id="max_value"
                            type="text"
                            value={this.state.max_value}
                            placeholder="Enter Number"
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
                          <ControlLabel>Circle Color</ControlLabel>
                          <FormControl
                            id="circle_color"
                            type="text"
                            value={this.state.circle_color}
                            placeholder="#1a66ff"
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
                          <ControlLabel>Inner Indicator Color</ControlLabel>
                          <FormControl
                            id="inner_color"
                            type="text"
                            value={this.state.inner_color}
                            placeholder="#6699ff"
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
        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              headerColor="blue"
              plainCard
              cardTitle="Current Active Sensors"
              cardSubtitle={'Active ioT Sensors'}
              content={
                <BootstrapTable
                  keyField="id"
                  data={this.state.rowData}
                  columns={columns}
                  striped
                  hover
                  condensed
                  bordered={true}
                  rowStyle={rowStyle2}
                  noDataIndication="No ioT Layer is Uploaded"
                  filter={filterFactory()}
                  cellEdit={cellEditFactory({
                    mode: 'click',
                    blurToSave: true,
                    beforeSaveCell: (oldValue, newValue, row, column) => { console.log('Before Saving Cell!!'); },
                    afterSaveCell: (oldValue, newValue, row, column) => {
                      console.log('After Saving Cell!!', ' row ', row._id);
                      console.log('After saving cell column: ', column);
                      if (column.dataField == "delete") {
                        console.log("Delete activated!");
                        //this.deleteRemoteData(row._id);
                        //this.testGeojsonUpdate(row._id, row.location, row.color, row.icon, row.filename, row._id)
                      }
                      if (column.dataField == "edit") {
                        console.log("Edit Layer activated!");
                        //this.editRemoteData(row.location);
                        /*this.setState({
                          selectedLocation: row.location,
                          selectedFilename: row.filename,
                          geojsonModal: true
                        });*/
                      }
                    }
                  })}
                />
              }
            />
          </ItemGrid>
        </Grid>
      </div>
    );
  }
}

<InternetOfThings />;

export default InternetOfThings;
