import React from "react";
import { Grid, InputLabel } from "material-ui";
import axios, { post } from "axios"
import auth from 'utils/auth';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import Dropzone from 'react-dropzone';

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
  HelpBlock,
  Radio
} from "react-bootstrap";

import avatar from "assets/img/faces/marc.jpg";

//const SERVER_URL = 'http://192.168.1.11:7555';
const STRAPI_URL = 'https://db.mapid.io';
const SERVER_URL = 'https://geo.mapid.io';
const TEMP_URL = 'http://localhost';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
}

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

const columns = [{
  dataField: 'username',
  text: 'Username',
  headerStyle: {
    backgroundColor: '#bec1ce'
  },style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  }
}, {
  dataField: 'fullname',
  text: 'Full Name',
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  }
}, 
{
  dataField: 'user_bank',
  text: 'Payment Source',
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  }
},  
{
  dataField: 'amount',
  text: 'Amount',
  headerStyle: {
    backgroundColor: '#bec1ce'
  }
},
{
  dataField: 'payment_date',
  text: 'Payment Date',
  headerStyle: {
    backgroundColor: '#bec1ce'
  },style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  }
},
{
  dataField: 'expired_date',
  text: 'Expired Date',
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
  dataField: 'status',
  text: 'Payment Status',
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
  dataField: '_id',
  text: 'ID',
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  hidden: true
}
];

const rowEvents = {
onClick: (e, row, rowIndex) => {
  alert(`Layer Deleted at: ${rowIndex}`);
}
};

let rows = [];

class BankForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      files: [],
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
      username: '',
      fullname: '',
      bank: 'bca',
      amount: 0,
      payment_date: '',
      expired_date: '',
      trial:'',
      etc:'',
      license:'lite',
      account_number: '',
      bank_source:'bca',
      status:'',
      formData: null,
      id: "",
      firstname: "",
      lastname: "",
      email: "",
      address: "",
      postcode: "",
      country: "",
      organization: "",
      account_type: ""
    };
    this.fileUpload = this.fileUpload.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.loadSensorList = this.loadSensorList.bind(this);
    this.loadUserProfile = this.loadUserProfile.bind(this);
  }

  async componentDidMount() {
    console.log("User Info", auth.getUserInfo());
    console.log("User ID ", auth.getUserInfo()._id);
    this.setState({
      username: auth.getUserInfo().username
    });
    this.loadSensorList();
    this.loadUserProfile();
  }

  componentWillMount(){
    
  }

  onDrop(files) {
    /*this.setState({
      files: files.map(file => ({
        ...file,
        preview: URL.createObjectURL(file)
      }))
    });*/

    this.setState({
      files,
      file:files[0]
    });
    console.log('File Dropped: ', this.state.file);
  }

  componentWillUnmount() {
    // Make sure to revoke the data uris to avoid memory leaks
    const {files} = this.state;
    for (let i = files.length; i >= 0; i--) {
      const file = files[0];
      URL.revokeObjectURL(file.preview);
    }
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
          const userdetails = response.data;
          this.setState({
            id: userdetails[0]._id,
            firstname: userdetails[0].firstname,
            lastname: userdetails[0].lastname,
            email: auth.getUserInfo().email,
            address: userdetails[0].address,
            postcode: userdetails[0].postcode,
            country: userdetails[0].country,
            organization: userdetails[0].organization,
            account_type: userdetails[0].account_type,
          });
        }
      })
      .catch(function(error) {
        // handle error
        console.log(error);
        //setTimeout(this.loadUserProfile(),3000);
      })
      .then(function() {
        // always executed
        //setTimeout(this.loadUserProfile(),3000);
      });
  }

  loadSensorList() {
    // Make a request for a user with a given ID
    rows = [];

    axios.get(STRAPI_URL + '/manualpayment', {
      params: {
        username: auth.getUserInfo().username
      }
    }).then(response => {
      // handle success
      console.log(response);
      const paymentList = response.data
      console.log(paymentList);

      var i;
      var total = 0;
      for (i = 0; i < paymentList.length; i++) {
        rows.push({
          username: paymentList[i].username,
          fullname: paymentList[i].fullname,
          user_bank: paymentList[i].user_bank,
          amount: paymentList[i].amount,
          payment_date: paymentList[i].payment_date,
          expired_date: paymentList[i].expired_date,
          status: paymentList[i].status
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
    if (event.target.id == 'fullname'){
      this.setState({fullname: event.target.value});
    }
    if (event.target.id == 'bank'){
      this.setState({bank: event.target.value});
    }
    if (event.target.id == 'amount'){
      this.setState({amount: event.target.value});
    }
    if (event.target.id == 'bank_source'){
      this.setState({bank_source: event.target.value});
    }
    if (event.target.id == 'account_number'){
      this.setState({account_number: event.target.value});
    }
    if (event.target.id == 'etc'){
      this.setState({etc: event.target.value});
    }
    if (event.target.id == 'license1'){
      this.setState({license: event.target.value});
    }
    if (event.target.id == 'license2'){
      this.setState({license: event.target.value});
    }
    if (event.target.id == 'license3'){
      this.setState({license: event.target.value});
    }
    
  }

  handleSubmit = e => {
    e.preventDefault();

    if (!this.state.file || !this.state.fullname || !this.state.bank || !this.state.amount || !this.state.bank_source || !this.state.account_number){
      alert('Silahkan Lengkapi Data Pembayaran Dengan Bukti Pembayaran');
    }
    else{
      this.fileUpload(this.state.file).then(response => {
        console.log("Respon dari sebuah data: ", response.data);
        if(response.data === 'success'){
          
        }
        else if(response.data === 'extension'){
  
        }
        else{
  
        }
      });
    }
  };

  fileUpload(file) {
    var FormData = require('form-data');

    var formData = new FormData();

    formData.append("file", file);
    formData.append("username", auth.getUserInfo().username);
    formData.append("userid", this.state.id);
    formData.append("filekey", file.name);
    formData.append("fullname", this.state.fullname);
    formData.append("bank", this.state.bank);
    formData.append("account_number", this.state.account_number);
    formData.append("bank_source", this.state.bank_source);
    formData.append("amount", this.state.amount);
    formData.append("etc", this.state.etc);
    formData.append("license", this.state.license);
    console.log("Filekey: ", file.name);

    const url = SERVER_URL+'/api-paymentupload';
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'content-language': auth.getUserInfo().username
      }
    }
    return post(url, formData, config)
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

    const { files } = this.state;

    const thumbs = files.map(file => (
      <div style={thumb}>
        <div style={thumbInner}>
          <img
            src={file.preview}
            style={img}
          />
        </div>
      </div>
    ));

    return (

      <div>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={11}>
            <form onSubmit={this.handleSubmit}>
              <Grid container>
                <ItemGrid xs={12} sm={12} md={8}>
                  <RegularCard
                    headerColor="blue"
                    cardTitle="Insert your payment information"
                    cardSubtitle="Please insert your payment detail"
                    content={
                      <div>
                        <Grid container>
                          <ItemGrid xs={12} sm={12} md={12}>
                            <FormGroup
                              controlId="formBasicText"
                              validationState={this.getValidationState()}
                            >
                              <ControlLabel>Full Name</ControlLabel>
                              <FormControl
                                id="fullname"
                                type="text"
                                value={this.state.fullname}
                                placeholder="Enter text"
                                onChange={this.handleChange}
                              />
                              <FormControl.Feedback />
                              <HelpBlock></HelpBlock>
                            </FormGroup>
                          </ItemGrid>
                        </Grid>
                        <Grid container>
                          <ItemGrid xs={12} sm={12} md={12}>
                            <FormGroup controlId="formControlsSelect">
                              <ControlLabel>Bank Asal</ControlLabel>
                              <FormControl componentClass="select" placeholder="select" id="bank_source" value={this.state.bank_source} onChange={this.handleChange}>
                                <option value='bca'>Bank BCA</option>
                                <option value='mandiri'>Bank Mandiri</option>
                                <option value='bni'>Bank BNI</option>
                                <option value='bni_syariah'>Bank BNI Syariah</option>
                                <option value='bri'>Bank BRI</option>
                                <option value='syariah_mandiri'>Bank Syariah Mandiri</option>
                                <option value='cimb_niaga'>Bank CIMB NIAGA</option>
                                <option value='cimb_niaga_syariah'>Bank CIMB NIAGA SYARIAH</option>
                                <option value='muamalat'>Bank MUAMALAT</option>
                                <option value='btpn'>Bank Tabungan Pensiunan Nasional (BTPN)</option>
                                <option value='jenius'>JENIUS</option>
                                <option value='bri_syariah'>Bank BRI Syariah</option>
                                <option value='btn'>Bank Tabungan Negara (BTN)</option>
                                <option value='permata'>PERMATA BANK</option>
                                <option value='danamon'>Bank DANAMON</option>
                                <option value='bii_maybank'>Bank BII MAYBANK</option>
                                <option value='mega'>Bank Mega</option>
                                <option value='sinarmas'>Bank Sinarmas</option>
                                <option value='commonwealth'>Bank COMMONWEALTH</option>
                                <option value='ocbc_nisp'>Bank OCBC NISP</option>
                                <option value='bukopin'>Bank BUKOPIN</option>
                                <option value='bca_syariah'>Bank BCA Syariah</option>
                                <option value='lippo'>Bank LIPPO</option>
                                <option value='citibank'>Bank CITIBANK</option>
                              </FormControl>
                            </FormGroup>
                          </ItemGrid>
                        </Grid>
                        <Grid container>
                          <ItemGrid xs={12} sm={12} md={12}>
                            <FormGroup
                              controlId="formBasicText"
                              validationState={this.getValidationState()}
                            >
                              <ControlLabel>Nomer Rekening</ControlLabel>
                              <FormControl
                                id="account_number"
                                type="text"
                                value={this.state.account_number}
                                placeholder="Enter text"
                                onChange={this.handleChange}
                              />
                              <FormControl.Feedback />
                              <HelpBlock></HelpBlock>
                            </FormGroup>
                          </ItemGrid>
                        </Grid>
                        <Grid container>
                          <ItemGrid xs={12} sm={12} md={12}>
                            <FormGroup controlId="formControlsSelect">
                              <ControlLabel>Bank Tujuan</ControlLabel>
                              <FormControl componentClass="select" placeholder="select" id="bank" value={this.state.bank} onChange={this.handleChange}>
                                <option value='bca'>BCA</option>
                                <option value='mandiri'>Bank Mandiri</option>
                              </FormControl>
                            </FormGroup>
                          </ItemGrid>
                        </Grid>
                        <Grid container>
                          <ItemGrid xs={12} sm={12} md={12}>
                            <FormGroup
                              controlId="formBasicText"
                              validationState={this.getValidationState()}
                            >
                              <ControlLabel>Jumlah Transfer</ControlLabel>
                              <FormControl
                                id="amount"
                                type="number"
                                value={this.state.amount}
                                placeholder="Enter Amount"
                                onChange={this.handleChange}
                              />
                              <FormControl.Feedback />
                              <HelpBlock></HelpBlock>
                            </FormGroup>
                          </ItemGrid>
                        </Grid>
                        <Grid container>
                          <ItemGrid xs={12} sm={12} md={12}>
                            <FormGroup
                              controlId="formBasicText"
                              validationState={this.getValidationState()}
                            >
                              <ControlLabel>Keterangan</ControlLabel>
                              <FormControl
                                id="etc"
                                type="text"
                                value={this.state.etc}
                                placeholder="Enter Text"
                                onChange={this.handleChange}
                              />
                              <FormControl.Feedback />
                              <HelpBlock></HelpBlock>
                            </FormGroup>
                          </ItemGrid>
                        </Grid>
                        <Grid container>
                          <ItemGrid xs={12} sm={12} md={12}>
                            <FormGroup>
                            <Radio name="radioGroup" defaultChecked defaultValue id="license1" value="lite" onChange={this.handleChange} inline>
                              Lite
                            </Radio>{' '}
                            <Radio name="radioGroup" id="license2" value="pro" onChange={this.handleChange} inline>
                              Pro
                            </Radio>{' '}
                            <Radio name="radioGroup" id="license3" value="enterprise" onChange={this.handleChange} inline>
                              Enterprise
                            </Radio>
                          </FormGroup>
                          </ItemGrid>
                        </Grid>
                        <Grid container>
                          <ItemGrid xs={12} sm={12} md={12}>
                            <RegularCard
                              headerColor="blue"
                              plainCard
                              cardTitle="Upload Payment Image"
                              cardSubtitle={'Drag your photos here '}
                              content={<section>
                                <div className="dropzone">
                                  <Dropzone
                                    accept="image/*"
                                    onDrop={this.onDrop.bind(this)}
                                  />
                                </div>
                                <aside style={thumbsContainer}>
                                  {thumbs}
                                </aside>
                              </section>}
                            />
                          </ItemGrid>
                        </Grid>
                      </div>
                    }
                    footer={<Button color="bluemapid" type="submit" value="Submit">Submit Payment</Button>}
                  />
                </ItemGrid>
                <ItemGrid xs={12} sm={12} md={4}>

                </ItemGrid>
              </Grid>
            </form>

          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={1}>
          </ItemGrid>
        </Grid>

        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>

          </ItemGrid>
        </Grid>

        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              headerColor="blue"
              plainCard
              cardTitle="Current Active Payment"
              cardSubtitle={'Your Active Subscription'}
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

<BankForm />;

export default BankForm;
