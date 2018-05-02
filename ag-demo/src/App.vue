<template>
<div>
  <ag-grid-vue
    style="width: 500px; height: 500px;"
    class="ag-theme-balham"
    :gridOptions="gridOptions"
    :columnDefs="columnDefs"
    :rowData="rowData"
    :gridReady="onGridReady"
    rowSelection="multiple">
  </ag-grid-vue>
  <span v-for="li in myarr" :key="li.make">{{li.make}}</span>
</div>

</template>

<script>
import {AgGridVue} from 'ag-grid-vue'

export default {
  name: 'App',
  data () {
    return {
      gridOptions: {
        rowSelection: 'multiple',
        // onSelectionChanged: this.onSelectionChanged,
        onRowSelected: this.onRowSelected,
        rowMultiSelectWithClick: true
        // onCellClicked: this.onSelectionChanged
      },
      columnDefs: null,
      rowData: null,
      gridApi: null,
      myarr: []
    }
  },
  components: {
    'ag-grid-vue': AgGridVue
  },
  computed: {

  },
  watch: {

  },
  methods: {
    onGridReady (params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
    },
    getSelectedRows () {
      const selectedNodes = this.gridApi.getSelectedNodes()
      const selectedData = selectedNodes.map(node => node.data)
      return selectedData
    },
    onSelectionChanged (e) {
      // console.log(e)
      let a = this.gridApi.getSelectedNodes()

      this.myarr = a
      if (a.length > 2) {
        a[0].setSelected(false)
        // this.gridApi.forEachNode((node) => {
        //   console.log(node)
        //   console.log(a)
        //   node.setSelected(false)
        // })
      }
    },
    onRowSelected (e) {
      console.log(e.node)
      let a = this.gridApi.getSelectedNodes()

      this.myarr = a
      if (a.length > 2) {
        a[0].setSelected(false)
        // this.gridApi.forEachNode((node) => {
        //   console.log(node)
        //   console.log(a)
        //   node.setSelected(false)
        // })
      }
    }
  },
  beforeMount () {
    this.columnDefs = [
      {headerName: 'Make', field: 'make'},
      {headerName: 'Model', field: 'model'},
      {
        headerName: 'Price',
        field: 'price',
        cellStyle: function (params) {
          if (params.value > 50000) {
            return {
              color: '#ff0000'
            }
          }
        },
        checkboxSelection: function (rowNode) {
          console.log(rowNode)
          return true
        }
      }
    ]

    this.rowData = [
      {make: '0', model: 'Celica', price: 35000},
      {make: '1', model: 'Mondeo', price: 36000},
      {make: '2', model: 'Boxter', price: 37000},
      {make: '3', model: 'Mondeo3', price: 38000},
      {make: '4', model: 'Boxter4', price: 39000},
      {make: '5', model: 'Mondeo5', price: 40000},
      {make: '6', model: 'Boxter6', price: 41000}
    ]
  }
}
</script>
