// React Class

import React, {Component} from 'react';
import { RegularCard, Table, ItemGrid } from "components";
import { Grid } from "material-ui";

class TableList extends React.Component {

  constructor() {
    super()
    this.state = {
      selected: [1],
    }
  }

  isSelected = (index) => {
    return this.state.selected.indexOf(index) !== -1;
  };

  handleRowSelection = (selectedRows) => {
    this.setState({
      selected: selectedRows,
    });
  };

  render() {
    return (
      <Grid container>
      <ItemGrid xs={12} sm={12} md={12}>
        <RegularCard
          cardTitle="Geojson List"
          cardSubtitle="Insert <username> here"
          content={
            <Table
              tableHeaderColor="primary"
              tableHead={["Name", "Country", "City", "Salary"]}
              tableData={[
                ["Dakota Rice", "Niger", "Oud-Turnhout", "$36,738"],
                ["Minerva Hooper", "Curaçao", "Sinaai-Waas", "$23,789"],
                ["Sage Rodriguez", "Netherlands", "Baileux", "$56,142"],
                ["Philip Chaney", "Korea, South", "Overland Park", "$38,735"],
                ["Doris Greene", "Malawi", "Feldkirchen in Kärnten", "$63,542"],
                ["Mason Porter", "Chile", "Gloucester", "$78,615"]
              ]}
            />
          }
        />
      </ItemGrid>
      <ItemGrid xs={12} sm={12} md={12}>
        <RegularCard
          plainCard
          cardTitle="Table on Plain Background"
          cardSubtitle="Here is a subtitle for this table"
          content={
            <Table
              tableHeaderColor="primary"
              tableHead={["ID", "Name", "Country", "City", "Salary"]}
              tableData={[
                ["1", "Dakota Rice", "$36,738", "Niger", "Oud-Turnhout"],
                ["2", "Minerva Hooper", "$23,789", "Curaçao", "Sinaai-Waas"],
                ["3", "Sage Rodriguez", "$56,142", "Netherlands", "Baileux"],
                [
                  "4",
                  "Philip Chaney",
                  "$38,735",
                  "Korea, South",
                  "Overland Park"
                ],
                [
                  "5",
                  "Doris Greene",
                  "$63,542",
                  "Malawi",
                  "Feldkirchen in Kärnten"
                ],
                ["6", "Mason Porter", "$78,615", "Chile", "Gloucester"]
              ]}
            />
          }
        />
      </ItemGrid>
    </Grid>
    );
  }
}

<TableList />

export default TableList;
