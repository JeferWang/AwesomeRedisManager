<template>
  <FullScreenMask class="create_config_mask" @click="$emit('close')">
    <div class="main_card" @click.stop="e=>e.preventDefault()">
      <div class="header">Create Redis Config</div>
      <div class="main_form">
        <!--名称-->
        <div class="form_item">
          <div class="item_label">Connect Name</div>
          <div class="item_body">
            <input v-model="formData.name" type="text" class="com-input" placeholder="127.0.0.1">
          </div>
        </div>
        <!--地址-->
        <div class="form_item">
          <div class="item_label">Host</div>
          <div class="item_body">
            <input v-model="formData.host" type="text" class="com-input" placeholder="127.0.0.1">
          </div>
        </div>
        <!--端口-->
        <div class="form_item">
          <div class="item_label">Port</div>
          <div class="item_body">
            <input v-model="formData.port" type="text" class="com-input" style="width: 100px;" placeholder="6379">
          </div>
        </div>
        <!--密码-->
        <div class="form_item">
          <div class="item_label">Password</div>
          <div class="item_body">
            <input v-model="formData.password" type="text" class="com-input" placeholder="None">
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="com-btn com-btn-primary btn_test" @click="testConfig">Test Connect</div>
        <div class="com-btn com-btn-success btn_save" @click="saveConfig">Save</div>
      </div>
    </div>
  </FullScreenMask>
</template>

<script>
import * as uuid from 'node-uuid'
import FullScreenMask from '../../../../../components/FullScreenMask'

export default {
  name: 'CreateRedisConfig',
  components: {
    FullScreenMask
  },
  data () {
    return {
      formData: {
        id: null,
        name: null,
        host: null,
        port: null,
        password: null
      }
    }
  },
  methods: {
    getConfig () {
      return {
        id: this.formData.id || uuid.v1(),
        name: this.formData.name || this.formData.host || '127.0.0.1',
        host: this.formData.host || '127.0.0.1',
        port: this.formData.port || 6379,
        password: this.formData.password || null,
        createdAt: this.formData.createdAt || Date.now(),
        isFavorite: this.formData.isFavorite || false
      }
    },
    async testConfig () {
      const config = this.getConfig()
      let client = await this.$connectRedis(config)
      try {
        await client.select(0)
        this.$msg.msgBox({ msg: 'Connect Successfully', type: 'success' })
      } catch (e) {
        this.$msg.msgBox({ msg: 'Connect Failed', type: 'warning' })
      }
      client.disconnect(false)
    },
    saveConfig () {
      const config = this.getConfig()
      this.$store.dispatch('redisConfig/saveConfig', config)
        .then(() => {
          this.$storage.local.remove('tmpEditConfig')
          this.$msg.msgBox({ msg: 'Save Successfully', type: 'success' })
          this.$emit('close')
        })
        .catch(err => {
          console.log(err)
          this.$msg.msgBox({ msg: 'Save Failed', type: 'warning' })
        })
    }
  },
  mounted () {
    const tmp = this.$storage.local.get('tmpEditConfig')
    if (tmp) {
      this.formData = tmp
    } else {
      this.formData.id = uuid.v1()
    }
  }
}
</script>

<style scoped lang="scss">
  .create_config_mask {
    display: flex;
    flex-direction: column;
    align-items: center;

    .main_card {
      margin-top: 10px;
      box-shadow: $shadow-normal;
      background: $background-color;
      width: 30%;

      .header {
        border-bottom: 2px solid $border-color;
        box-sizing: border-box;
        font-size: 16px;
        font-weight: bold;
        height: $grid-height-normal;
        line-height: $grid-height-normal;
        padding-left: 10px;
      }

      .main_form {
        /*padding: 10px;*/

        .form_item {
          box-sizing: border-box;
          height: $grid-height-normal;
          display: flex;
          flex-direction: row;
          align-items: center;
          border-bottom: 1px solid $border-color;

          &:last-child {
            border-bottom: none;
          }

          .item_label {
            line-height: $grid-height-normal;
            width: 100px;
            text-align: right;
          }

          .item_body {
            padding: 0 10px;
            flex-grow: 1;

            .com-input {
              height: $grid-height-small;
              width: 100%;
              padding: 0 10px;
            }
          }
        }
      }

      .footer {
        border-top: 2px solid $border-color;
        display: flex;
        height: $grid-height-normal;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .com-btn {
          height: $grid-height-small;
          line-height: $grid-height-small;
          padding: 0 10px;
          margin-left: 10px;
        }
      }
    }
  }
</style>
