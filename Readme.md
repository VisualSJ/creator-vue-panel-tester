# Vue Tester

这个插件只是为了 vue 框架整合进入 Creator 而做的测试，并不具备完整的功能。

![image](https://cloud.githubusercontent.com/assets/7113508/15996500/972e52ce-315a-11e6-81e9-b0b42f47e772.png)

## 问题

构建这个简单的 panel 期间所遇到的一些问题

### 无法在 ui 控件内使用 v-for 循环其子节点

- 创建一个 ui-select
- 在其内部创建一个 options, 并且绑定 v-for ( <option v-for="item in pkgList" v-bind:value="item">{{item}}</option> ) 

表现：
> 正常情况下，应该会根据定义好的 pkgList 循环出一系列的 option，但是实际情况却是 v-for 被当成属性直接赋值给目标 option 了，没有去解析。

原因：
> 因为现有的 ui 组件包含有 shadowRoot，并且插入的节点会被插入到这个 shadowRoot 中。而不是作为子节点。模板引擎因为找不到这个节点所以没有去解析。
