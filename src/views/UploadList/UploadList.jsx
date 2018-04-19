// React Class

import React, { Component } from "react";
import { RegularCard, Table, ItemGrid } from "components";
import { Grid } from "material-ui";
import axios from "axios";

const JsonTable = require("ts-react-json-table");
var userColumns = ["username", "created_at", "updated_at"];
var userExcludeColumns = ["encrypted_password"];
var layerColumns = ["username", "filename", "created_at", "updated_at"];

class UploadList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [1],
      layers: []
    };
  }

  componentDidMount() {
    axios.get(`http://192.168.1.2:7555/getUpload`).then(res => {
      const layers = res.data;
      this.setState({ layers });

      const converted = Object.keys(layers).map(function(key) {
        var layer = layers[key];
        layer.name = key;
        return layer;
      });

      console.log("Layers ", converted);
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

  render() {
    return (
      <Grid container>
        <ItemGrid xs={12} sm={12} md={12}>
          <RegularCard
            plainCard
            cardTitle="Layers"
            cardSubtitle="Uploaded by user"
            content={
              <JsonTable
                theadClassName={"thead-light"}
                className="table table-sm table-bordered"
                rows={this.state.layers}
                columns={layerColumns}
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
