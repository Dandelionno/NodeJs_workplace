<template>
    <div>
        <el-row>
            <el-button @click="show"><i class="el-icon-edit"></i>{{text}}</el-button>
            <el-button type="primary">主要按钮</el-button>
            <el-button type="success">成功按钮</el-button>
            <el-button type="info">信息按钮</el-button>
            <el-button type="warning">警告按钮</el-button>
            <el-button type="danger">危险按钮</el-button>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                text:'默认按钮'
            }
        },
        methods: {
            show() {
                this.$message('这是一条消息提示');
            },
        }
    }
</script>


<style scoped>

</style>