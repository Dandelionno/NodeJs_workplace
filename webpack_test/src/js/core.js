

var config = {
    default:{
        upload:{
            url:'/backend/common/upload',
            type:{
                image:{
                    extName:['jpg','jpeg','png','gif'],
                    maxSize:1024
                }
            }
        },
        form:{
            labelWidth:{
                xs:'80px',
                sm:'100px',
                med:'110px',
                lg:'125px',
            },
            size:'small'
        },
        table:{
            pageSize:20
        }
    }
};

var helper = {};
helper.openTab = function(options){
    if(parent && parent.page && parent.page.$refs && parent.page.$refs.tab)
    {
        parent.page.$refs.tab.open(options);
    }else{
        location.href = options.url;
    }
};

helper.url = {
    stringify:function(url,params){
        if(url.indexOf('?')==-1)
        {
            url += "?" ;
        }
        url += Qs.stringify(params);
        return url;
    }
};

helper.request = function(url,config){
    var headers = {};
    if(config.method && config.method.toLowerCase() == "post")
    {
        headers['Content-type'] = 'application/x-www-form-urlencoded';
        if(config.data)
        {
            config.data = Qs.stringify(config.data);
        }
    }
    var instance  = axios.create(Object.assign({
        baseURL:url,
        timeout: 8000,
        headers: headers
    },config));
    var complete = function(success,response){
        if(success)
        {
            if(config.success)
            {
                config.success(response);
            }
        }else{
            Vue.prototype.$message({
                type: "error",
                message: "服务器响应失败，请稍后再试"
            });
            if(config.error)
            {
                config.error(response);
            }
        }
        if(config.complete)
        {
            config.complete(response);
        }
    }
    instance.request().then(function(response){
        if(response.status == 200)
        {
            complete(true,response);
        }else{
            complete(false,response);
        }
    },function(error){
        complete(false,error.response);
    }).catch(function(error){
        complete(false,error.response);
    });
};

helper.message = function(result){
    if(!result.success)
    {
        Vue.prototype.$message({
            type: "error",
            message: result.message
        });
    }else{
        Vue.prototype.$alert(result.message, '提示', {
            type: 'success',
            showClose:false,
            callback: function(action){
                location.reload();
            }
        });
    }
};

helper.generateTreeListItem = function(data){
    if(!data)
    {
        return [];
    }
    var each = function(data,level)
    {
        if(!level)
        {
            level = 0;
        }
        var result = [];
        for(var i=0;i<data.length;i++)
        {
            var node = data[i];
            node._nodeLevel = level;
            result.push(node);
            if(node.children && node.children.length>0)
            {
                result = result.concat(each(node.children,level+1));
            }
        }
        return result;
    }
    var result = each(data);
    return result;
}



export default {
    init : function(Vue){
        Vue.prototype.$_core = {
            config: config,
            helper: helper,
        }


        Vue.component('widget-menu',{
            props:['menus'],
            template:`<el-menu v-bind="$attrs" v-on="$listeners">
            <template v-for="(menu1, index1) in menus">
            <el-submenu v-if="menu1.sub && menu1.sub.length>0" :index="''+index1">
            <template slot="title">
              <i :class="menu1.icon"></i>
              <span>{{menu1.name}}</span>
            </template>
            <template v-for="(menu2, index2) in menu1.sub">
                <el-submenu v-if="menu2.sub && menu2.sub.length>0" :index="index1+'_'+index2">
                  <template slot="title">{{menu2.name}}</template>
                  <el-menu-item v-for="(menu3, index3) in menu2.sub" :index="index1+'_'+index2+'_'+index3"  @click="onSelectMenu(menu3)">{{menu3.name}}</el-menu-item>
                </el-submenu>
                <el-menu-item v-else :index="index1+'_'+index2"  @click="onSelectMenu(menu2)">{{menu2.name}}</el-menu-item>
            </template>
            </el-submenu>
            <el-menu-item v-else :index="''+index1" @click="onSelectMenu(menu1)">
            <i :class="menu1.icon"></i>
            <span slot="title">{{menu1.name}}</span>
            </el-menu-item>
            </template>
            </el-menu>`,
            methods:{
                onSelectMenu : function(menu) {
                    this.$emit('select-menu',menu);
                }
            }
        });

        Vue.component('widget-page-tab', {
            template: `<div class="page-tab-container">
                             <el-tabs type="card" class="page-tab" @tab-remove="onRemove" v-model="selectTab">
                                <el-tab-pane :lazy="true" v-for="tab in tabs" :key="tab.key" :label="tab._label" :name="tab.key" :closable="!tab.hideClose">
                                    <iframe :ref="'page-tab-'+tab.key"  class="page-content" :src="tab.url" @load="onPageLoad(tab.key,this)"></iframe>
                                </el-tab-pane>
                              </el-tabs>
                              <div class="page-tab-tools">
                                <div class="page-tab-tools-btn" title="重新加载" @click="onReloadCurr">
                                <i class="el-icon-refresh"></i>
                                </div>
                                <div class="page-tab-tools-btn" title="更多">
                                 <el-dropdown @command="onSelectMore" trigger="click">
                                      <span class="el-dropdown-link">
                                        <i class="el-icon-more" slot="reference"></i>
                                      </span>
                                      <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="close">关闭标签</el-dropdown-item>
                                        <el-dropdown-item command="reload">重新加载</el-dropdown-item>
                                        <el-dropdown-item divided command="closeOther">关闭其他标签</el-dropdown-item>
                                        <el-dropdown-item command="closeAll">关闭所有标签</el-dropdown-item>
                                      </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                          </div>
                         </div>`,
            data:function(){
                return {
                    existsTabs:{},
                    keyMap:{},
                    selectTab:false,
                    loadingText:'Loading..',
                    tabs:[]
                };
            },
            methods :{
                open:function(options){
                    var label = options.label;
                    var url = options.url;
                    var hideClose = options.hideClose;
                    var key = null;
                    if(!this.existsTabs.hasOwnProperty(url))
                    {
                        key = new Date().getTime();
                        var tab = {
                            label:label,
                            _label:label?label:this.loadingText,
                            url:url,
                            hideClose:hideClose,
                            key:key
                        };
                        this.tabs.push(tab);
                        this.existsTabs[url] = tab;
                        this.keyMap[key] = tab;
                    }else{
                        key = this.existsTabs[url].key;
                    }
                    this.selectTab = key;
                    return key;
                },
                remove:function(key){
                    var nextTab = false;
                    for(var i=0;i<this.tabs.length;i++)
                    {
                        var tab = this.tabs[i];
                        if(key==tab.key)
                        {
                            if(tab.hideClose)
                            {
                                break;
                            }
                            if(this.selectTab == key)
                            {
                                nextTab = this.tabs[i + 1] || this.tabs[i - 1];
                                if(nextTab)
                                    nextTab = nextTab['key'];
                            }
                            delete this.existsTabs[tab.url];
                            delete this.keyMap[key];
                            this.tabs.splice(i,1);
                            break;
                        }
                    }
                    if(nextTab)
                        this.selectTab = nextTab;
                },
                onRemove:function(name){
                    this.remove(name)
                },
                onRemoveOther:function(){
                    var tabs = this.tabs;
                    for(var i=0;i<tabs.length;i++)
                    {
                        var tab = tabs[i];
                        if(this.selectTab!=tab.key)
                        {
                            if(tab.hideClose)
                            {
                                continue;
                            }
                            tabs.splice(i,1);
                            delete this.existsTabs[tab.url];
                            delete this.keyMap[tab.key];
                            i--;
                        }
                    }
                    this.tabs = tabs;
                },
                onRemoveAll:function(){
                    var tabs = this.tabs;
                    var select = false;
                    for(var i=0;i<tabs.length;i++)
                    {
                        var tab = tabs[i];
                        if(tab.hideClose)
                        {
                            select = tab.key;
                            continue;
                        }
                        tabs.splice(i,1);
                        delete this.existsTabs[tab.url];
                        delete this.keyMap[tab.key];
                        i--;
                    }
                    this.selectTab = select;
                },
                onReloadCurr:function(){
                    var iframe = this.$refs['page-tab-'+this.selectTab];
                    if(iframe){
                        iframe[0].contentWindow.location.reload();
                    }
                },
                onSelectMore:function(command){
                    if(command == 'reload'){
                        this.onReloadCurr();
                    }else if(command=='close')
                    {
                        this.onRemove(this.selectTab);
                    }else if(command=='closeOther')
                    {
                        this.onRemoveOther();
                    }
                    else if(command=='closeAll')
                    {
                        this.onRemoveAll();
                    }
                },
                onPageLoad:function(key){
                    var iframe = this.$refs['page-tab-'+key];
                    if(iframe){
                        var doc = iframe[0].contentWindow.document;
                        var tab = this.keyMap[key];
                        if(!tab.label)
                        {
                            var tabTitle = doc.title;
                            if(doc.querySelector('meta[name="tab-title"]'))
                            {
                                tabTitle = doc.querySelector('meta[name="tab-title"]').getAttribute('content');
                            }
                            if(tabTitle.length>25)
                            {
                                tabTitle = tabTitle.substring(0,25)+'..';
                            }
                            this.keyMap[key]._label = tabTitle;
                        }
                    }
                }
            }
        });

        Vue.component('widget-manage-panel', {
            props:['searchForm','searchLoading','size'],
            template:`<div class="manage-panel" >
                    <div class="manage-panel-main" :class="{ hasToolbar: $slots.toolbar }">
                    <div v-if="$slots.searchItem" class="manage-panel-search-panel">
                    <el-form :inline="true" ref="form" :model="searchForm" label-width="85px" size="small" @submit.native.prevent >
                        <slot name="searchItem"></slot>
                        <el-form-item>
                           <el-button type="primary" icon="el-icon-search" @click="onSearch" native-type="submit" :loading="searchLoading">搜索</el-button>
                         </el-form-item>
                    </el-form>
                    </div>
                    <div class="manage-panel-content">
                        <slot name="content"></slot>
                    </div>
                    </div>
    
                    <div v-if="$slots.toolbar" class="manage-panel-toolbar">
                        <el-button-group v-if="$slots.toolbarButtons" class="manage-panel-toolbar-buttons">
                            <slot name="toolbarButtons"></slot>
                        </el-button-group>
                        <slot name="toolbar"></slot>
                    </div>
                    </div>`,
            methods:{
                onSearch:function(){
                    this.$emit('search');
                }
            }
        });

        Vue.component('widget-oper-column', {
            props:{
                buttonCount:{
                    default:function(){
                        return 1;
                    }
                }
            },
            template:`<el-table-column label="操作" :width="width">
            <template slot-scope="scope">
                <slot v-bind="scope"></slot>
            </template>
        </el-table-column>`,
            data:function(){
                return {
                    width:(this.buttonCount * 73) + 53
                };
            }
        });

        Vue.component('widget-tree-cell', {
            props:['row'],
            template:`<div class="tree-cell" :style="{'padding-left':(row._nodeLevel*13) + 'px' }"><i v-if="row.children && row.children.length>0" class="el-icon-caret-bottom"></i><i v-else class="el-icon-minus"></i><span>{{row.name}}</span></div>`
        });

        Vue.component('widget-oper-cell', {
            template:`<div class='table-oper-cell'><el-button-group v-if="$slots.default">
                    <slot></slot>
               </el-button-group>
            <template v-else><i class="empty el-icon-minus"></i></template></div>`,
            data:function(){
                return {
                };
            }
        });

        Vue.component('widget-gridview-panel', {
            props:['url','params','isTree','paginationAttrs','paginationListeners','hasPagination','managePanelAttrs','managePanelListeners','tableAttrs','tableListeners'],
            template : `<widget-manage-panel v-bind="MANAGE_PANEL_ATTRS" v-on="MANAGE_PANEL_LISTENERS">
                     <el-table class="gridview-panel-table" slot="content" v-bind="TABLE_ATTRS" v-on="TABLE_LISTENERS" v-loading="loading">
                     <slot></slot>
                    </el-table>
                    <slot name="toolbar" slot="toolbar"></slot>
                    <slot name="toolbarButtons" slot="toolbarButtons"></slot>
                    <div slot="toolbar" class="gridview-panel-pagination-container">
                        <el-pagination class="gridview-panel-pagination" v-bind="PAGINATION_ATTRS" v-on="PAGINATION_LISTENERS" :disabled="loading">
                        </el-pagination>
                        <el-button class="gridview-panel-pagination-reload" size="small" type="text" @click="onReload" :disabled="loading">刷新</el-button>
                    </div>
                    <slot name="searchItem" slot="searchItem"></slot>
                    </div>
                    </widget-manage-panel>`,
            watch:{
                paginationAttrs:function(value){
                    this.PAGINATION_ATTRS = Object.assign(this.PAGINATION_ATTRS,value);
                },
                paginationListeners:function(value){
                    this.PAGINATION_LISTENERS = this.generatePaginationListeners(this.PAGINATION_LISTENERS ,value);
                },
                managePanelAttrs:function(value){
                    this.MANAGE_PANEL_ATTRS = Object.assign(this.MANAGE_PANEL_ATTRS,value);
                },
                managePanelListeners:function(value){
                    this.MANAGE_PANEL_LISTENERS = this.generateManagePanelListeners(this.MANAGE_PANEL_LISTENERS,value);
                },
                tableAttrs:function(value){
                    this.TABLE_ATTRS = Object.assign(this.TABLE_ATTRS,value);
                },
                tableListeners:function(value){
                    this.TABLE_LISTENERS = this.generateTableListeners(this.TABLE_LISTENERS,value);
                },
            },
            data:function(){
                var _this = this;
                var PAGINATION_ATTRS = Object.assign({
                    'page-size':config.default.table.pageSize,
                    'layout':'total, prev, pager, next, jumper',
                    'total':0,
                    'current-page':1
                },this.paginationAttrs);
                var PAGINATION_LISTENERS = this.generatePaginationListeners({},this.paginationListeners);
                var HAS_PAGINATION = this.hasPagination == undefined?true:this.hasPagination;
                if(this.isTree)
                {
                    HAS_PAGINATION = false;
                }
                if(!HAS_PAGINATION)
                {
                    PAGINATION_ATTRS.layout = 'total';
                }
                var MANAGE_PANEL_ATTRS = Object.assign({
                    'search-form':{}
                },this.managePanelAttrs);
                var MANAGE_PANEL_LISTENERS = this.generateManagePanelListeners({},this.managePanelListeners);
                var TABLE_ATTRS = Object.assign({
                    data:[]
                },this.tableAttrs);
                var TABLE_LISTENERS =  this.generateTableListeners({},this.tableListeners);
                return {
                    loading:false,
                    selectRows:[],
                    searchParams:{},
                    PAGINATION_ATTRS:PAGINATION_ATTRS,
                    PAGINATION_LISTENERS:PAGINATION_LISTENERS,
                    HAS_PAGINATION:HAS_PAGINATION,
                    MANAGE_PANEL_ATTRS:MANAGE_PANEL_ATTRS,
                    MANAGE_PANEL_LISTENERS:MANAGE_PANEL_LISTENERS,
                    TABLE_ATTRS:TABLE_ATTRS,
                    TABLE_LISTENERS:TABLE_LISTENERS
                };
            },
            mounted : function() {
                this.loadData();
            },
            methods : {
                generatePaginationListeners:function(newObj,useObj){
                    var _this = this;
                    return Object.assign(newObj,useObj,{
                        'update:currentPage':function(value){
                            _this.PAGINATION_ATTRS['current-page'] = value;
                            if(useObj && useObj['update:currentPage'])
                            {
                                useObj['update:currentPage'](value);
                            }
                        },
                        'current-change': function(value){
                            _this.loadData(value);
                            if(useObj && useObj['current-change'])
                            {
                                useObj['current-change'](page);
                            }
                        }
                    });
                },
                generateManagePanelListeners:function(newObj,useObj){
                    var _this = this;
                    return Object.assign(newObj,useObj,{
                        'search':function(){
                            _this.onSearch();
                            if(useObj && useObj['search'])
                            {
                                useObj['search']();
                            }
                        }
                    });
                },
                generateTableListeners:function(newObj,useObj){
                    var _this = this;
                    return Object.assign(newObj,useObj,{
                        'selection-change':function(rows){
                            _this.onSelect(rows);
                            if(useObj && useObj['selection-change'])
                            {
                                useObj['selection-change'](rows);
                            }
                        }
                    });
                },
                loadData:function(){
                    if(!this.url)
                    {
                        return;
                    }
                    if(this.loading)
                    {
                        return;
                    }
                    var _this = this;
                    this.loading = true;
                    var params = Object.assign(this.HAS_PAGINATION?{
                        page:_this.PAGINATION_ATTRS['current-page'],
                        size:_this.PAGINATION_ATTRS['page-size']
                    }:{},this.searchParams,this.params);
                    helper.request(this.url,{
                        params:params,
                        success:function(response)
                        {
                            if(_this.isTree)
                            {
                                var data = helper.generateTreeListItem(response.data);
                                _this.TABLE_ATTRS.data = data;
                                _this.PAGINATION_ATTRS.total = data.length;
                            }else{
                                _this.TABLE_ATTRS.data = response.data.rows;
                                _this.PAGINATION_ATTRS.total = response.data.total;
                            }
                        },
                        complete:function(response){
                            _this.loading = false;
                        }
                    });
                },
                onSelect:function(rows){
                    this.selectRows = rows;
                },
                onSearch:function(){
                    if(this.loading)
                    {
                        return;
                    }
                    this.PAGINATION_ATTRS['current-page'] = 1;
                    this.searchParams = Object.assign({},this.MANAGE_PANEL_ATTRS['search-form']);
                    this.loadData();
                },
                onReload:function(){
                    if(this.loading)
                    {
                        return;
                    }
                    this.loadData();
                },
                submit:function(url,options){
                    if(this.loading || this.selectRows.length<=0)
                    {
                        this.$message({
                            type: "warning",
                            message: '请选择一条记录'
                        });
                        return;
                    }
                    var _this = this;
                    options = options ? options: {};
                    if(!options.name)
                    {
                        options.name = 'id';
                    }
                    if(!options.column)
                    {
                        options.column = 'id';
                    }
                    if(options.confirm)
                    {
                        this.$confirm(options.confirm, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(function(){
                            var data = {};
                            var columnData = [];
                            for(var i=0;i<_this.selectRows.length;i++)
                            {
                                columnData.push(_this.selectRows[i][options.column]);
                            }
                            data[options.name] = columnData;
                            if(options.before)
                            {
                                options.before(data);
                            }
                            helper.request(url,{
                                method:'post',
                                data:data,
                                success:function(response){
                                    if(options.success)
                                    {
                                        options.success(response);
                                    }
                                    if(response.data.success)
                                    {
                                        _this.loadData();
                                        _this.$message({
                                            type: "success",
                                            message: response.data.message
                                        });
                                    }
                                },
                                error:function(response){
                                    if(options.error)
                                    {
                                        options.error(response);
                                    }
                                },
                                complete:function(response){
                                    if(options.complete)
                                    {
                                        options.complete(response);
                                    }
                                }
                            });
                        });
                    }
                }
            }
        });

        Vue.component('widget-form-panel', {
            props:['formAttrs','submitUrl','initDataUrl','initDataCallback','showMessage','submitButtonText','size'],
            template:`<div class="form-panel" :class="{ hasToolbar: submitUrl }">
                    <el-form ref="form" v-bind="FORM_ATTRS" @submit.native.prevent>
                    <div class="form-panel-container">
                    <slot></slot>
                    </div>
                    <div v-if="submitUrl || $slots.button" class="form-panel-toolbar">
                        <div class="form-panel-toolbar-button-group-container">
                        <el-button-group>
                            <el-button v-if="submitUrl" :size="SIZE" type="primary" icon="el-icon-check" native-type="submit" @click="onSubmit" :loading="loading">{{SUBMIT_BUTTON_TEXT}}</el-button>
                            <slot name="button"></slot>
                          </el-button-group>
                        </div>
                    </div>
                    </el-form>
                </div>`,
            watch:{
                formAttrs:function(value){
                    this.FORM_ATTRS = Object.assign(this.FORM_ATTRS,value);
                    console.log(value)
                },
                submitButtonText:function(value){
                    this.SUBMIT_BUTTON_TEXT = value;
                },
                size:function(value)
                {
                    this.SIZE = value;
                }
            },
            mounted:function(){
                if(this.initDataUrl)
                {
                    this.initData();
                }
            },
            created:function(){
                if(this.$slots.button)
                {
                    for(var i=0;i<this.$slots.button.length;i++)
                    {
                        var button = this.$slots.button[i];
                        button.componentOptions.propsData.size = this.SIZE;
                    }
                }
            },
            data:function(){
                var FORM_ATTRS = Object.assign({
                    'size':config.default.form.size
                },this.formAttrs);
                if(FORM_ATTRS.hasOwnProperty('label-width'))
                {
                    if(config.default.form.labelWidth.hasOwnProperty(FORM_ATTRS['label-width']))
                    {
                        FORM_ATTRS['label-width'] = config.default.form.labelWidth[FORM_ATTRS['label-width']];
                    }
                }else{
                    FORM_ATTRS['label-width'] = config.default.form.labelWidth.xs;
                }
                var SUBMIT_BUTTON_TEXT = this.submitButtonText == undefined?'保存':this.submitButtonText;
                var SIZE = this.size == undefined?'small':this.size;
                return {
                    loading:false,
                    FORM_ATTRS:FORM_ATTRS,
                    SUBMIT_BUTTON_TEXT:SUBMIT_BUTTON_TEXT,
                    SIZE:SIZE
                };
            },
            methods:{
                onSubmit:function(){
                    var _this = this;
                    this.$refs.form.validate(function(valid){
                        if(valid)
                        {
                            var form = Object.assign({},_this.FORM_ATTRS.model);
                            _this.$emit('before-submit',form);
                            _this.loading = true;
                            helper.request(_this.submitUrl,{
                                method:'post',
                                data:form,
                                success:function(response)
                                {
                                    _this.$emit('success',response);
                                    if(_this.showMessage){
                                        helper.message(response.data);
                                    }
                                },
                                error:function(response)
                                {
                                    _this.$emit('error',response);
                                },
                                complete:function(response){
                                    _this.$emit('complete',response);
                                    _this.loading = false;
                                }
                            });
                        }
                    });
                },
                initData:function(){
                    var callback = {};
                    if(this.initDataCallback)
                    {
                        callback = this.initDataCallback();
                    }
                    helper.request(this.initDataUrl,{
                        success:function(response){
                            if(callback.success)
                            {
                                callback.success(response);
                            }
                        },
                        error:function(response){
                            if(callback.error)
                            {
                                callback.error(response);
                            }
                            Vue.prototype.$message({
                                type: "error",
                                message: '表单数据加载失败，请刷新页面后重试'
                            });
                        },
                        complete:function(response){
                            if(callback.complete)
                            {
                                callback.complete(response);
                            }
                        }
                    });
                }
            }
        });

        Vue.component('widget-select', {
            props:['options','value'],
            model:{
                prop: 'value',
                event: 'changeValue'
            },
            template:`<el-select v-model="value" v-bind="$attrs" v-on="$listeners" @change="onChange">
            <el-option
            v-for="(label, value) in options"
            :key="value"
            :label="label"
            :value="value">
          </el-option>
        </el-select>`,
            methods:{
                onChange:function(value)
                {
                    this.$emit('changeValue', this.value);
                }
            }
        });

        Vue.component('widget-select-tree', {
            props:['options','value', 'change', 'subData'],
            model:{
                prop: 'value',
                event: 'changeValue'
            },
            template:`<el-select v-model="value" class="select-tree" v-bind="$attrs" v-on="$listeners" @change="onChange">
            <el-option
            v-for="option in OPTIONS"
            :key="option.value"
            :label="option.selectLabel"
            :value="option.value">
            <div class="tree-node" :style="{'padding-left':(option._nodeLevel*13) + 'px' }"><i v-if="option.children && option.children.length>0" class="el-icon-caret-bottom"></i><i v-else class="el-icon-minus"></i><span>{{option.label}}</span></div>
          </el-option>
        </el-select>`,
            data:function(){
                var OPTIONS = this.generateTreeListItem(this.options);
                return {
                    "OPTIONS":OPTIONS,
                    SUBDATA: this.subData,
                };
            },
            watch:{
                options:function(value){
                    this.OPTIONS = this.generateTreeListItem(value);
                },
                subData: function(value){
                    this.SUBDATA = value;
                }
            },
            methods:{
                generateTreeListItem:function(data){
                    var generateLabel = function(data,lastLabel){
                        for(var i=0;i<data.length;i++)
                        {
                            var node = data[i];
                            var label = lastLabel==null?node.label:lastLabel+ " / " + node.label;
                            node.selectLabel = label;
                            if(node.children && node.children.length>0)
                            {
                                generateLabel(node.children,label);
                            }
                        }
                    };
                    generateLabel(data);
                    data = helper.generateTreeListItem(data);
                    return data;
                },
                onChange: function(value){
                    if(typeof this.change == 'function'){
                        this.change(value, this.SUBDATA)
                    }
                    this.$emit('changeValue', value)
                },
            }
        });

        Vue.component('widget-uploadbox-image', {
            props:['extName','maxSize','value'],
            model:{
                prop: 'value',
                event: 'changeValue'
            },
            template:`<div class="upload-box">
                <div class="upload-preview" v-show="showPreview" @mouseover="onPreviewHover" @mouseleave="onPreviewLeave">
                    <img v-if="src" class="upload-preview-img" :src="src" @error="onError"/>
                    <transition name="fade">
                    <div class="upload-preview-shade" v-show="showShade">
                        <div class="upload-preview-action">
                        <i class="upload-preview-zoom el-icon-zoom-in" @click="onPreviewZoom"></i>
                        <i class="upload-preview-delete el-icon-delete" @click="onDelete"></i>
                        </div>
                    </div>
                    </transition>
                </div>
                <span v-if="error" class="upload-preview-error">图片链接失效，请重新上传</span>
                <el-upload v-bind="attrs" v-on="$listeners" limit="1" :show-file-list="false" v-show="!showPreview" :file-list="fileList" :disabled="loading">
                    <el-button size="small" type="primary" :loading="loading">选择文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传 {{EXT_NAME.join('/')}} 文件，且不超过 {{MAX_SIZE}} kb</div>
              </el-upload></div>`,
            watch:{
                extName:function(value){
                    this.EXT_NAME = value;
                },
                maxSize:function(value){
                    this.MAX_SIZE = value;
                },
                '$attrs':function(value){
                    this.attrs = this.generateAttrs(value);
                }
            },
            data:function(){
                var EXT_NAME = null;
                var MAX_SIZE = null;
                var MAX_SIZE = this.maxSize;
                if(!MAX_SIZE)
                {
                    MAX_SIZE = config.default.upload.type["image"].maxSize;
                }
                var EXT_NAME = this.extName;
                if(!EXT_NAME)
                {
                    EXT_NAME =  config.default.upload.type["image"].extName;
                }
                var attrs = this.generateAttrs(this.$attrs);
                return {
                    error:false,
                    showPreview:false,
                    showShade:false,
                    src:'',
                    attrs:attrs,
                    EXT_NAME:EXT_NAME,
                    MAX_SIZE:MAX_SIZE,
                    fileList:[],
                    loading:false
                };
            },
            created:function(){
                this.setValue(this.value);
            },
            methods:{
                setValue:function(value){
                    if(value)
                    {
                        this.showPreview = true;
                        this.src = value.url;
                        this.$emit('changeValue', value.file);
                    }else{
                        this.showPreview = false;
                        this.src = "";
                        this.fileList = [];
                        this.$emit('changeValue', '');
                    }
                },
                onError:function(){
                    this.error = true;
                    this.setValue();
                },
                generateAttrs:function(attrs){
                    var _this = this;
                    attrs = Object.assign({},attrs);
                    var beforeUpload = attrs['before-upload'];
                    var onSuccess = attrs['on-success'];
                    var onError = attrs['on-error'];
                    if(attrs.action == undefined)
                    {
                        attrs['action'] = config.default.upload.url;
                    }
                    attrs.data = Object.assign({type:"image"},attrs.data);
                    attrs['before-upload'] = function(file){
                        if(_this.EXT_NAME && _this.EXT_NAME.indexOf(file.name.split('.').pop())<0)
                        {
                            _this.$alert('上传失败：图片扩展名无效', '提示', {
                                type: 'error'
                            });
                            return false;
                        }
                        if(_this.MAX_SIZE && file.size>_this.MAX_SIZE * 1024)
                        {
                            _this.$alert('上传失败：图片大小超出最大限制', '提示', {
                                type: 'error'
                            });
                            return false;
                        }
                        _this.loading = true;
                        if(beforeUpload)
                        {
                            beforeUpload(file);
                        }
                    };
                    attrs['on-success'] = function(response, file, fileList){
                        _this.loading = false;
                        if(response.success)
                        {
                            _this.error = false;
                            _this.setValue(response.info);
                            if(onSuccess)
                            {
                                onSuccess(response, file, fileList);
                            }
                        }else{
                            _this.setValue(null);
                            _this.$alert('上传失败：'+response.message, '提示', {
                                type: 'error'
                            });
                        }
                    };
                    attrs['on-error'] = function(response, file, fileList){
                        _this.loading = false;
                        _this.$alert('上传失败：服务器发生错误', '提示', {
                            type: 'error'
                        });
                        if(onError)
                        {
                            onError(response, file, fileList);
                        }
                    };
                    return attrs;
                },
                onPreviewHover:function(){
                    this.showShade = true;
                },
                onPreviewLeave:function(){
                    this.showShade = false;
                },
                onPreviewZoom:function(){
                    window.open(this.src)
                },
                onDelete:function(){
                    this.setValue();
                }
            }
        });

        Vue.component('widget-editor', {
            props:['value','name'],
            template:`<div class="editor-container">
          <script :id="name" :name="name" type="text/plain">{{value}}</script>
         </div>`,
            mounted:function(){
                this.instance = UE.getEditor(this.name,{
                    initialFrameWidth:'100%',
                    initialFrameHeight:520
                });
            },
            methods:{
                getInstance:function(){
                    return this.instance;
                },
                getValue:function(){
                    return this.instance.getContent();
                },
                setValue:function(value){
                    this.instance.setContent(value);
                }
            }
        });

        Vue.component('widget-form-item-img', {
            props:['src'],
            data:function(){
                return {
                    error:false
                };
            },
            template:`<div v-if="error" class='form-item-text form-item-error'>图片链接失效</div><a v-else :href='src' target='_blank'><img class='form-item-img' :src='src' @error="onError"/></a>`,
            methods:{
                onError:function(){
                    this.error = true;
                }
            }
        });


        Vue.component('widget-form-item-img', {
            props:['src'],
            data:function(){
                return {
                    error:false
                };
            },
            template:`<div v-if="error" class='form-item-text form-item-error'>图片链接失效</div><a v-else :href='src' target='_blank'><img class='form-item-img' :src='src' @error="onError"/></a>`,
            methods:{
                onError:function(){
                    this.error = true;
                }
            }
        });
    }
}
