// React Class

import React, { Component } from "react";
import { RegularCard, Table, ItemGrid } from "components";
import { Grid } from "material-ui";
import axios from "axios";

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';

// Utils
import auth from 'utils/auth';
import request from 'utils/request';

const columns = [{
    dataField: 'filename',
    text: 'File Name'
  }, {
    dataField: 'location',
    text: 'Location'
  }, {
    dataField: 'type',
    text: 'Geojson Type'
  }, {
    dataField: 'active',
    text: 'Active',
    editor: {
      type: Type.SELECT,
      options: [{
        value: 'true',
        label: 'true'
      }, {
        value: 'false',
        label: 'false'
      }]
    }
  },
  {
    dataField: '_id',
    text: 'ID'
  }
];

class UploadList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      column: [],
      rowData: []
    }
  }

  componentDidMount() {

    /*axios.get('http://192.168.1.2:1337/fileuploads?username='+auth.getUserInfo().username).then(res => {
      const layers = res.data;
      this.setState({ layers });

      const converted = Object.keys(layers).map(function(key) {
        var layer = layers[key];
        layer.name = key;
        return layer;
      });

      console.log("Layers ", converted);
    });*/

    this.loadFileList();
  }

  loadFileList() {
    // Make a request for a user with a given ID
    let rows = [];

      axios.get('http://localhost:1337/fileuploads', {
          params: {
            username: auth.getUserInfo().username
          }
        }).then(response => {
        // handle success
        console.log(response);
        const fileList = response.data
        console.log(fileList);

        var i;
        for (i = 0; i < fileList.length; i++) {
          var modifiedDate = new Date(fileList[i].created_at);
          rows.push({
            filename:fileList[i].filename,
            location: fileList[i].server_url,
            type:fileList[i].type,
            active: fileList[i].active,
            _id: fileList[i]._id
          });
        }
        this.setState({ rowData:rows });
      });
  }

  updateRemoteData(id, activevalue){
    console.log("Row ID: ", id);
    console.log("Row Active Value: ", activevalue);

    axios.put(`http://192.168.1.14:1337/fileuploads/${id}`, /*{
        params: {
          _id:id
        }
      },*/ {
        active: activevalue
      })
      .then(function (response) {
        console.log(response.data);
        if (response.data == 'success') {
          alert('Success!');
        }
      })
      .catch(function (error) {
        console.log(error);
        alert(error);
      });
  }

  render() {
    return (
      <Grid container>
        <ItemGrid xs={12} sm={12} md={12}>
          <RegularCard
            plainCard
            cardTitle="Layers"
            cardSubtitle="Uploaded by user"
            content={
              <BootstrapTable
                keyField="id"
                data={ this.state.rowData }
                columns={ columns }
                cellEdit={ cellEditFactory({
                  mode: 'click',
                  blurToSave: true,
                  beforeSaveCell: (oldValue, newValue, row, column) => { console.log('Before Saving Cell!!'); },
                  afterSaveCell: (oldValue, newValue, row, column) => {
                     console.log('After Saving Cell!!',' row ', row); 
                     this.updateRemoteData(row._id, newValue);
                    }
                }) }
              />
            }
          />
        </ItemGrid>
      </Grid>
    );
  }
}

<UploadList />;

export default UploadList;
