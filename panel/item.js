'use strict';

Editor.vueElement('creator-vue-panel-tester-view', {

    template: `<div class="flex-1"></div>`,

    data: function () {
        return {
            message: '点击次数',
            count: 0,

            divStyle: {
                marginTop: 10
            }
        };
    },
    methods: {

        onClick: function () {
            this.total += 1;
            this.count += 1;
        }
    }
});