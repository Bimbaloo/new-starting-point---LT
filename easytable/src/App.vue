<template>
    <div>
        <v-table
             :width="1100"
             :height="430"
             :columns="tableConfig.columns"
             :table-data="tableConfig.tableData"
             even-bg-color="#f4f4f4"
             row-hover-color="#eee"
             row-click-color="#edf7ff"
             :cell-merge="cellMerge"
        ></v-table>
    </div>
</template>

<script>
    import Vue from 'vue'

    export default{
        name: 'frozen-title-columns',
        data(){
            return {
                tableConfig: {
                    tableData: [],
                    columns:[
                           {field: 'name', title:'姓名', width: 150, titleAlign: 'center',columnAlign:'center'},
                           {field: 'gender', title:'性别', width: 150, titleAlign: 'center',columnAlign:'center'},
                           {field: 'tel', title: '手机号码', width: 180, titleAlign: 'center',columnAlign:'center'},
                           {field: 'birthday', title: '出生日期', width: 180, titleAlign: 'center',columnAlign:'center'},
                           {field: 'hobby', title: '爱好', width: 380, titleAlign: 'center',columnAlign:'center'},
                           {field: 'address', title: '地址', width: 430, titleAlign: 'center',columnAlign:'left'}
                         ]
                },
                odata: [
                        {"name":"赵伟","img":"1.jpg","gender":"男","nickname":"赵","birthday":'1963-7-9',"height":"183","email":"zhao@gmail.com","tel":"156*****1987","hobby":"钢琴、书法、唱歌","address":"上海市黄浦区金陵东路569号17楼","job":"码农"},
                        {"name":"李伟","img":"1.jpg","gender":"男","nickname":"李","birthday":'2003-12-7',"height":"166","email":"li@gmail.com","tel":"182*****1538","hobby":"钢琴、书法、唱歌","address":"上海市奉贤区南桥镇立新路12号2楼","job":"码农"},
                        {"name":"孙伟","img":"1.jpg","gender":"女","nickname":"孙","birthday":'1993-12-7',"height":"186","email":"sun@gmail.com","tel":"161*****0097","hobby":"钢琴、书法、唱歌","address":"上海市崇明县城桥镇八一路739号","job":"码农"},
                        {"name":"周伟","img":"1.jpg","gender":"女","nickname":"周","birthday":'1993-12-7',"height":"188","email":"zhou@gmail.com","tel":"197*****1123","hobby":"钢琴、书法、唱歌","address":"上海市青浦区青浦镇章浜路24号","job":"码农"},
                        {"name":"吴伟","img":"1.jpg","gender":"男","nickname":"吴","birthday":'1993-12-7',"height":"160","email":"wu@gmail.com","tel":"183*****6678","hobby":"钢琴、书法、唱歌","address":"上海市松江区乐都西路867-871号","job":"码农"},
                        {"name":"冯伟","img":"1.jpg","gender":"女","nickname":"冯","birthday":'1993-12-7',"height":"168","email":"feng@gmail.com","tel":"133*****3793","hobby":"钢琴、书法、唱歌","address":"上海市金山区龙胜路143号一层","job":"码农"},
                        {"name":"褚伟","img":"1.jpg","gender":"男","nickname":"褚","birthday":'1993-12-7',"height":"170","email":"zhu@gmail.com","tel":"189*****2345","hobby":"钢琴、书法、唱歌","address":"上海市闵行区都市路2988号2楼","job":"码农"},
                        {"name":"蒋伟","img":"1.jpg","gender":"女","nickname":"蒋","birthday":'1993-12-7',"height":"178","email":"jiang@gmail.com","tel":"166*****2267","hobby":"钢琴、书法、唱歌","address":"上海市浦东新区惠南镇人民西路85号建行大楼2楼","job":"码农"},
                        {"name":"韩伟","img":"1.jpg","gender":"女","nickname":"韩","birthday":'1993-12-7',"height":"166","email":"han@gmail.com","tel":"177*****2222","hobby":"钢琴、书法、唱歌","address":"上海市浦东新区东方路818号建行一楼","job":"码农"},
                        {"name":"秦伟","img":"1.jpg","gender":"男","nickname":"秦","birthday":'1893-12-6',"height":"175","email":"qin@gmail.com","tel":"187*****9999","hobby":"钢琴、书法、唱歌","address":"上海市浦东新区浦城路812号2楼","job":"码农"},
                      ]
            }
        },
        methods: {
            // 模拟获取数据
            getTableData(){
                var self = this

                setTimeout(function () {
                    self.tableConfig.tableData = self.odata
                }, 100)
            },
            cellMerge(rowIndex,rowData,field){
                if (field === 'name' && rowData[field] === '李伟') {
                    return {
                        colSpan: 2,
                        rowSpan: 1,
                        content: '<span style="color:red">单元格 colSpan</span>',
                        componentName: ''

                    }
                } else if (rowIndex === 3 && field === 'gender') {

                    return {
                        colSpan: 1,
                        rowSpan: 3,
                        content: '<span style="color:red">单元格 rowSpan</span>',
                        componentName: ''
                    }

                }else if (rowIndex === 2 && field === 'birthday') {

                        return {
                            colSpan: 2,
                            rowSpan: 3,
                            content:'',
                            componentName:'table-cell-merge',
                        }
                }
            }
        },
        created(){
            this.getTableData()
        }
    }

        // 自定义列组件
        Vue.component('table-cell-merge',{
            template:`<span style="color:red">
               单元格 rowSpan 和 colSpan 同时使用
            </span>`,
            props:{
                rowData:{
                    type:Object
                },
                field:{
                    type:String
                },
                index:{
                    type:Number
                }
            }
        })
</script>