<template>
  <FullScreenMask
    class="create_config_mask"
    @click="$emit('close')"
  >
    <div
      class="main_card"
      @click.stop="e=>e.preventDefault()"
    >
      <div class="header">Create Data</div>
      <div class="main_form">
        <!--Key-->
        <div class="form_item">
          <div class="item_label">Key</div>
          <div class="item_body">
            <input
              v-model="key"
              type="text"
              class="com-input"
              :disabled="keyDisabled"
            >
          </div>
        </div>
        <!--类型-->
        <div class="form_item">
          <div class="item_label">Type</div>
          <div class="item_body">
            <SelectList
              v-model="type"
              placeholder="Select Data Type"
              :options="supportedTypes"
              :disabled="typeDisabled"
            ></SelectList>
          </div>
        </div>
        <!--按照不同类型显示不同的添加表单-->
        <div class="child_form no-scroll-bar">
          <!--string-->
          <template v-if="type==='string'">
            <div class="form_item">
              <div class="item_label">Value</div>
              <div class="item_body">
                <input
                  v-model="stringValue"
                  type="text"
                  class="com-input"
                >
              </div>
            </div>
          </template>
          <!--/string-->
          <!--hash-->
          <template v-if="type==='hash'">
            <div
              class="hash_group"
              v-for="(hashItem,hashIdx) in hashData"
              :key="hashItem.id"
            >
              <div class="form_item">
                <div class="item_label">Hash Key</div>
                <div class="item_body">
                  <input
                    v-model="hashData[hashIdx].key"
                    type="text"
                    class="com-input"
                  >
                  <div
                    class="del_hash_key_btn com-btn com-btn-danger"
                    @click="hashData.splice(hashIdx,1)"
                  >
                    <span class="fa fa-close"></span>
                  </div>
                </div>
              </div>
              <div class="form_item">
                <div class="item_label">Hash Value</div>
                <div class="item_body">
                  <input
                    v-model="hashData[hashIdx].value"
                    type="text"
                    class="com-input"
                  >
                </div>
              </div>
            </div>
            <div class="add_btn_wrapper">
              <div
                class="com-btn com-btn-primary add_btn"
                @click="hashData.push({key:'',value:'',id:Math.random()})"
              >
                <span class="fa fa-plus"></span>
                <span> Create Hash Item</span>
              </div>
            </div>
          </template>
          <!--/hash-->
          <!--list-->
          <template v-if="type==='list'">
            <div
              class="form_item"
              v-for="(listItem,listIdx) in listData"
              :key="listItem.id"
            >
              <div class="item_label">List Item</div>
              <div class="item_body">
                <input
                  v-model="listData[listIdx].value"
                  type="text"
                  class="com-input"
                >
                <div
                  class="del_hash_key_btn com-btn com-btn-danger"
                  @click="listData.splice(listIdx,1)"
                >
                  <span class="fa fa-close"></span>
                </div>
              </div>
            </div>
            <div class="add_btn_wrapper">
              <div
                class="com-btn com-btn-primary add_btn"
                @click="listData.push({value:'',id:Math.random()})"
              >
                <span class="fa fa-plus"></span>
                <span> Create List Item</span>
              </div>
            </div>
          </template>
          <!--/list-->
          <!--set-->
          <template v-if="type==='set'">
            <div
              class="form_item"
              v-for="(setItem,setIdx) in setData"
              :key="setItem.id"
            >
              <div class="item_label">Set Item</div>
              <div class="item_body">
                <input
                  v-model="setData[setIdx].value"
                  type="text"
                  class="com-input"
                >
                <div
                  class="del_hash_key_btn com-btn com-btn-danger"
                  @click="setData.splice(setIdx,1)"
                >
                  <span class="fa fa-close"></span>
                </div>
              </div>
            </div>
            <div class="add_btn_wrapper">
              <div
                class="com-btn com-btn-primary add_btn"
                @click="setData.push({value:'',id:Math.random()})"
              >
                <span class="fa fa-plus"></span>
                <span> Create Set Item</span>
              </div>
            </div>
          </template>
          <!--/set-->
          <!--zset-->
          <template v-if="type==='zset'">
            <div
              class="zset_group"
              v-for="(zsetItem,zsetIdx) in zsetData"
              :key="zsetItem.id"
            >
              <div class="form_item">
                <div class="item_label">Zset Score</div>
                <div class="item_body">
                  <input
                    v-model="zsetData[zsetIdx].score"
                    type="text"
                    class="com-input"
                  >
                  <div
                    class="del_hash_key_btn com-btn com-btn-danger"
                    @click="zsetData.splice(zsetIdx,1)"
                  >
                    <span class="fa fa-close"></span>
                  </div>
                </div>
              </div>
              <div class="form_item">
                <div class="item_label">Zset Value</div>
                <div class="item_body">
                  <input
                    v-model="zsetData[zsetIdx].value"
                    type="text"
                    class="com-input"
                  >
                </div>
              </div>
            </div>
            <div class="add_btn_wrapper">
              <div
                class="com-btn com-btn-primary add_btn"
                @click="zsetData.push({score:'',value:'',id:Math.random()})"
              >
                <span class="fa fa-plus"></span>
                <span> Create Zset Item</span>
              </div>
            </div>
          </template>
          <!--/zset-->
        </div>
      </div>
      <div class="footer">
        <div
          class="com-btn com-btn-success btn_save"
          @click="saveData"
        >
          <i class="fa fa-save"></i>
          <span> Save</span>
        </div>
      </div>
    </div>
  </FullScreenMask>
</template>

<script>
import SelectList from '../../../../../components/Form/SelectList'
import FullScreenMask from '../../../../../components/FullScreenMask'

export default {
  name: 'CreateMainKey',
  props: {
    tab: {
      type: Object,
      default: null
    },
    lockKey: {
      type: String,
      default: ''
    },
    lockType: {
      type: String,
      default: ''
    }
  },
  components: { SelectList, FullScreenMask },
  data () {
    return {
      key: '',
      keyDisabled: false,
      type: '',
      typeDisabled: false,
      stringValue: '', // string类型的value
      hashData: [],
      listData: [],
      setData: [],
      zsetData: [],
      supportedTypes: {
        string: 'String',
        hash: 'HashMap',
        list: 'List',
        set: 'Set',
        zset: 'SortedSet'
      }
    }
  },
  methods: {
    async saveData () {
      try {
        if (!this.key.length) throw new Error('Please input a key')
        if (!this.type.length) throw new Error('Please select data type')
        switch (this.type) {
          case 'string':
            await this.saveStringData()
            break
          case 'hash':
            await this.saveHashData()
            break
          case 'list':
            await this.saveListData()
            break
          case 'set':
            await this.saveSetData()
            break
          case 'zset':
            await this.saveZsetData()
            break
          default:
            return false
        }
        this.$msg.msgBox({ type: 'success', msg: 'Save Successfully' })
        this.$emit('save') // 抛出保存数据的事件
      } catch (e) {
        this.$msg.msgBox({ type: 'warning', msg: e.message })
      }
    },
    async saveZsetData () {
      let conn = this.tab.connect
      if (!this.zsetData.length) {
        throw new Error('Please input zset data')
      }
      let args = []
      // 验证zsetData的有效性
      for (let i = 0; i < this.zsetData.length; i++) {
        if (!this.zsetData[i].score.length || !this.zsetData[i].value.length) {
          throw new Error('Please input zset full data')
        }
        args.push(this.zsetData[i].score, this.zsetData[i].value)
      }
      await conn.zadd(this.key, ...args)
    },
    async saveSetData () {
      let conn = this.tab.connect
      if (!this.setData.length) {
        throw new Error('Please input set data')
      }
      let args = []
      // 验证hashData的有效性
      for (let i = 0; i < this.setData.length; i++) {
        if (!this.setData[i].value.length) {
          throw new Error('Please input set full data')
        }
        args.push(this.setData[i].value)
      }
      await conn.sadd(this.key, ...args)
    },
    async saveListData () {
      let conn = this.tab.connect
      if (!this.listData.length) {
        throw new Error('Please input list data')
      }
      let args = []
      // 验证listData的有效性
      for (let i = 0; i < this.listData.length; i++) {
        if (!this.listData[i].value.length) {
          throw new Error('Please input list full data')
        }
        args.push(this.listData[i].value)
      }
      await conn.rpush(this.key, ...args)
    },
    async saveHashData () {
      let conn = this.tab.connect
      if (!this.hashData.length) {
        throw new Error('Please input hash map data')
      }
      let args = []
      // 验证hashData的有效性
      for (let i = 0; i < this.hashData.length; i++) {
        if (!this.hashData[i].key.length || !this.hashData[i].value.length) {
          throw new Error('Please input hash map full data')
        }
        args.push(this.hashData[i].key, this.hashData[i].value)
      }
      await conn.hmset(this.key, ...args)
    },
    async saveStringData () {
      let conn = this.tab.connect
      if (!this.stringValue.length) {
        throw new Error('Please input Value')
      }
      await conn.set(this.key, this.stringValue)
    }
  },
  mounted () {
    if (this.lockKey.length) {
      this.key = this.lockKey
      this.keyDisabled = true
    }
    if (this.lockType.length) {
      this.type = this.lockType
      this.typeDisabled = true
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

        .item_label {
          line-height: $grid-height-normal;
          width: 100px;
          text-align: right;
        }

        .item_body {
          padding: 0 10px;
          flex-grow: 1;
          display: flex;
          flex-direction: row;
          align-items: center;

          .com-input {
            display: block;
            height: $grid-height-small;
            width: 100%;
            padding: 0 10px;
          }

          .com-select {
            height: $grid-height-small;
          }

          .del_hash_key_btn {
            width: $grid-height-small;
            height: $grid-height-small;
            line-height: $grid-height-small;
            text-align: center;
            flex-shrink: 0;
          }
        }
      }

      .child_form {
        background-color: $background-color-dark;
        max-height: 300px;
        overflow: hidden;
        overflow-y: auto;

        .add_btn_wrapper {
          height: $grid-height-normal;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 0 10px;

          .add_btn {
            display: block;
            width: fit-content;
            height: $grid-height-small;
            line-height: $grid-height-small;
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
