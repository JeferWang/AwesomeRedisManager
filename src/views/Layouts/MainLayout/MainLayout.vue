<template>
  <div class="main_layout">
    <Toolbar
      class="tool_bar"
      @show-create-config="showCreateConfig=true"
    ></Toolbar>
    <div class="page_main">
      <Left
        class="left"
        @start-connect="loading=true"
        @end-connect="loading=false"
        @show-create-config="showCreateConfig=true"
      ></Left>
      <Right class="right">
        <Tabs class="tabs"></Tabs>
        <TabViews class="tab_views"></TabViews>
      </Right>
    </div>
    <StatusBar class="status_bar"></StatusBar>
    <CreateConfig
      v-if="showCreateConfig"
      @close="showCreateConfig=false"
    ></CreateConfig>
  </div>
</template>

<script>
import Toolbar from './components/Toolbar'
import Left from './components/Left'
import Right from './components/Right'
import Tabs from './components/Tabs'
import TabViews from './components/TabViews'
import StatusBar from './components/StatusBar'
import CreateConfig from './components/Dialog/CreateRedisConfig'

export default {
  name: 'MainLayout',
  data () {
    return {
      loading: false,
      showCreateConfig: false
    }
  },
  components: {
    Toolbar,
    Left,
    Right,
    Tabs,
    TabViews,
    StatusBar,
    CreateConfig
  }
}
</script>

<style scoped lang="scss">
  .main_layout {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    position: absolute;

    .tool_bar {
      height: 60px;
      width: 100vw;
      position: absolute;
      left: 0;
      top: 0;
    }

    .status_bar {
      width: 100vw;
      height: 25px;
      position: absolute;
      left: 0;
      bottom: 0;
    }

    .page_main {
      position: absolute;
      top: 60px;
      width: 100vw;
      height: calc(100vh - 60px - 25px);
      display: flex;
      flex-direction: row;

      .left {
        width: 20vw;
        height: 100%;
      }

      .right {
        width: 80vw;
        height: 100%;

        .tabs {
          height: $grid-height-normal;
        }

        .tab_views {
          width: 80vw;
          height: calc(100% - #{$grid-height-normal});
        }
      }
    }
  }
</style>
