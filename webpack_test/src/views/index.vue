<!-- index.vue -->
<template>
    <div>
        <el-container class="index-container">
            <el-header class="index-header">Header</el-header>
            <el-container class="index-content">
                <el-aside class="index-aside" width="185px">
                    <widget-menu :default-active="avtiveMenu" :menus="menus" class="index-aside-menu" @select-menu="onSelectMenu"></widget-menu>
                </el-aside>

                <el-container>
                    <el-main class="index-main">
                        <widget-page-tab ref="tab"></widget-page-tab>
                    </el-main>
                    <el-footer class="index-footer">Beginner © 微影</el-footer>
                </el-container>
            </el-container>
        </el-container>
        <!--<h1>{{vueMsg}}</h1>-->
        <!--<navbar></navbar>-->
    </div>
</template>
<script>
    import NavBar from '../components/navbar.vue'
    export default {
        components: {
            'navbar': NavBar
        },
        data() {
            return {
                vueMsg:'Vue hello world',
                avtiveMenu:'0',
                menus: [
                    {
                        'name' : '主页',
                        'icon' : 'el-icon-menu',
                        'route' : 'site/home',
                        'allow' : true
                    }
                ],
            }
        },
        mounted() {
            console.log(this.$_core.config)
        },
        methods: {
            onSelectMenu() {

            }
        }
    }
</script>

<style scoped>
    strong{

    }
</style>