<template>
  <div class="main">
    <KeyBox
      :tab="tab"
      :main-key="tmpKey"
      @delete-key="onDelete"
      @rename-key="onRename"
    ></KeyBox>
    <TypeString
      v-if="keyType==='string'"
      :tab="tab"
      :main-key="tmpKey"
    ></TypeString>
    <TypeHash
      v-if="keyType==='hash'"
      :tab="tab"
      :main-key="tmpKey"
    ></TypeHash>
    <TypeList
      v-if="keyType==='list'"
      :tab="tab"
      :main-key="tmpKey"
    ></TypeList>
    <TypeSet
      v-if="keyType==='set'"
      :tab="tab"
      :main-key="tmpKey"
    ></TypeSet>
    <TypeZset
      v-if="keyType==='zset'"
      :tab="tab"
      :main-key="tmpKey"
    ></TypeZset>
  </div>
</template>

<script>
import KeyBox from './KeyBox'
import TypeString from './DataType/TypeString'
import TypeHash from './DataType/TypeHash'
import TypeList from './DataType/TypeList'
import TypeSet from './DataType/TypeSet'
import TypeZset from './DataType/TypeZset'

const supportedTypes = ['string', 'hash', 'list', 'set', 'zset']

export default {
  name: 'DataView',
  props: {
    tab: {
      type: Object,
      default: null
    },
    mainKey: {
      type: String,
      default: null
    }
  },
  components: {
    KeyBox,
    TypeString,
    TypeHash,
    TypeList,
    TypeSet,
    TypeZset
  },
  data () {
    return {
      keyType: '', // mainKey的数据类型
      tmpKey: '' // 用作缓冲，keyType和tmpKey需要同时进行修改
    }
  },
  methods: {
    async onDelete () {
      this.$emit('delete-key')
    },
    async onRename (e) {
      this.$emit('rename-key', e)
    },
    async initData () {
      let keyType = await this.tab.connect.type(this.mainKey)
      if (keyType === 'none') {
        this.$emit('error', { code: -1, message: `${this.mainKey} not exists` })
        return false
      }
      if (!supportedTypes.includes(keyType)) {
        this.$emit('error', { code: -2, message: `Not Support ${keyType}` })
        return false
      }
      this.keyType = keyType
      this.tmpKey = this.mainKey
    }
  },
  watch: {
    mainKey: {
      handler (newVal, oldVal) {
        this.initData()
      },
      deep: true
    }
  },
  async mounted () {
    await this.initData()
  }
}
</script>

<style scoped lang="scss">
  .main {
    height: 100%;
  }
</style>
