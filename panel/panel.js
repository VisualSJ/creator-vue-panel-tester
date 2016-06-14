'use strict';

var Path = require('fire-path');
var Globby = require('globby');

var CreatorVuePanelTester = {

    dependencies: [
        'packages://creator-vue-panel-tester/panel/item.js'
    ],

    template: `

    <div class="fit" v-bind:style="warpStyle">
        <creator-vue-panel-tester-view></creator-vue-panel-tester-view>

        <div>
            <ui-prop name="Module">
                <ui-select v-el:module class="flex-1" v-on:confirm="switchModule">
                    <option value="app">App</option>
                    <option value="package">Package</option>
                    <option value="editor-framework" selected>Editor Framework</option>
                </ui-select>
                <ui-select v-el:packages class="flex-1" v-bind:style="pkgStyle" v-on:confirm="switchPkg">
                    <!-- 无法在现有 ui 控件内使用 v-for，因为现有控件将节点直接插入到 shadowRoot 内 -->
                    <!-- 没有 reveal 到外层，导致无法模板引擎找不到节点 -->
                    <!--<option v-for="item in pkgList" v-bind:value="item">-->
                        <!--{{ item }}-->
                    <!--</option>-->
                </ui-select>
            </ui-prop>

            <ui-prop name="File">
                <ui-select v-el:file class="flex-1"></ui-select>
                <ui-button class="tiny blue">
                    <i class="icon-arrows-cw"></i>
                </ui-button>
            </ui-prop>

            <ui-prop name="Mode">
                <ui-select class="flex-1">
                    <option value="auto">Auto</option>
                    <option value="main">Main</option>
                    <option value="renderer">Renderer</option>
                </ui-select>
            </ui-prop>

            <ui-prop name="Debug">
                <ui-checkbox class="flex-1"></ui-checkbox>
            </ui-prop>
        </div>

        <div class="layout horizontal end-justified">
            <ui-button class="transparent green">
                <i class="icon-play"></i>
            </ui-button>

            <ui-button class="transparent blue">
                <i class="icon-cw"></i>
            </ui-button>

            <ui-button class="transparent red">
                <i class="icon-cancel"></i>
            </ui-button>

            <ui-button class="transparent">
                <i class="icon-eye"></i>
            </ui-button>
        </div>
    </div>

    `,

    data: {
        warpStyle: { flex: 1, display: 'flex', flexDirection: 'column' },
        pkgStyle: { display: 'none' },

        // pkgList: []
    },

    compiled: function () {
        // 初始化 pkgList
        this.updatePkgList();
        // 初始化 file 列表
        this.updateFileList();
    },

    methods: {
        switchModule: function ( event ) {
            var target = event.target;
            this.$data.pkgStyle.display = target.value === 'package' ? '' : 'none';
            // 更新 file 列表
            this.updateFileList();
        },

        switchPkg: function () {
            // 更新 file 列表
            this.updateFileList();
        },

        updatePkgList: function () {
            Editor.Ipc.sendToMain('editor:package-query-infos', function ( err, infos ) {
                var pkgInfos = infos.map(function ( info ) {
                    return {
                        value: info.path,
                        text: Path.join(
                            Path.basename(Path.dirname(info.path)),
                            Path.basename(info.path)
                        )
                    };
                });

                pkgInfos.sort(function ( a, b ) {
                    return a.text.localeCompare(b.text);
                });

                var packagesEL = this.$els.packages;
                packagesEL.clear();

                pkgInfos.forEach(function ( info ) {
                    packagesEL.addItem(info.value, info.text);
                });

            }.bind(this));
        },

        updateFileList: function () {
            var path;
            var module = this.$els.module.value;
            var fileEL = this.$els.file;

            if (!module) return;

            fileEL.clear();

            if ( module === 'editor-framework' ) {
                path = Editor.url('editor-framework://test');
            } else if ( module === 'app' ) {
                path = Editor.url('app://test');
            } else if ( module === 'package' ) {
                var pkgPath = this.$els.packages.value;
                path = Path.join( pkgPath, 'test' );
            }

            // DISABLE: disable async method because Fireball's globby not updated.
            var files = Globby.sync([
                Path.join(path,'**/*.js'),
                '!'+Path.join(path,'**/*.skip.js'),
                '!**/fixtures/**'
            ]);

            files = files.map(function ( file ) {
                return Path.relative(path,file);
            });

            files.forEach(function ( file ) {
                fileEL.addItem( file, Path.dirname(file) + '/' + Path.basename(file) );
            });
        }
    }
};

Editor.vuePanel('creator-vue-panel-tester', CreatorVuePanelTester);