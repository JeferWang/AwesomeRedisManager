<template>
  <div class="main_box">
    <div class="title">
      <div class="title_text">List Data</div>
      <div
        class="title_add_btn"
        @click="showAddDialog=true"
      >
        <i class="fa fa-plus"></i>
        <span>Add Items</span>
      </div>
    </div>
    <div class="data_box">
      <div
        class="list_box"
        @scroll="onScrollHkeyList"
      >
        <div class="list no-select">
          <div
            class="item"
            v-for="(item,idx) in dataList"
            :key="idx"
            @click="onShowDetail(item,idx)"
          >
            {{item}}
          </div>
        </div>
      </div>
      <div
        class="detail_box"
        v-if="detail.index!==-1"
      >
        <div class="val_box">
          <textarea
            class="com-input"
            v-model="detail.newVal"
          ></textarea>
          <div class="opt_group">
            <div
              class="com-btn com-btn-warning"
              @click="onFormat"
            >
              Format
            </div>
            <div
              class="com-btn com-btn-success"
              @click="onSave"
            >
              Save
            </div>
          </div>
        </div>
      </div>
    </div>
    <CreateMainKey
      v-if="showAddDialog"
      :tab="tab"
      :lock-key="mainKey"
      lock-type="list"
      @close="showAddDialog=false"
      @save="onAddDataComplete"
    ></CreateMainKey>
  </div>
</template>

<script>
import CreateMainKey from '../Dialog/CreateMainKey'

export default {
  name: 'TypeList',
  components: {
    CreateMainKey
  },
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
  data () {
    return {
      showAddDialog: false,
      dataCount: 0,
      dataList: [],
      perPage: 200,
      hasMore: true,
      detail: {
        index: -1,
        oldVal: null,
        newVal: null
      }
    }
  },
  methods: {
    onAddDataComplete () {
      this.showAddDialog = false
      this.initData()
    },
    async onSave () {
      if (this.detail.oldVal === this.detail.newVal) {
        return false
      }
      // 检查idx位置的值
      let currIdxVal = await this.tab.connect.lindex(this.mainKey, this.detail.index)
      if (currIdxVal !== this.detail.oldVal) {
        // todo 对话框提示
      }
      try {
        await this.tab.connect.lset(this.mainKey, this.detail.index, this.detail.newVal)
        this.detail.oldVal = this.detail.newVal
        this.$set(this.dataList, this.detail.index, this.detail.newVal)
        this.$msg.msgBox({ msg: 'Save Successfully', type: 'success', duration: 1000 })
      } catch (e) {
        this.$msg.msgBox({ msg: 'Save Failed', type: 'warning', duration: 1000 })
        console.warn(e)
        return false
      }
    },
    onFormat () {
      if (!this.detail.newVal) {
        return false
      }
      let val = null
      this.$popup.actionList({ actionList: ['XML', 'JSON'], tipText: 'Please choose the format' })
        .then(res => {
          switch (res.action) {
            case 'XML':
              val = this.$formatXML(this.detail.newVal)
              break
            case 'JSON':
              val = this.$formatJSON(this.detail.newVal)
              break
          }
          if (!val || !val.length) {
            // 报错提示
            this.$msg.msgBox({ msg: 'Format failure', type: 'warning' })
            return false
          }
          this.$msg.msgBox({ msg: 'Format complete', type: 'success', duration: 1000 })
          this.detail.newVal = val
        })
    },
    onShowDetail (val, idx) {
      this.detail.oldVal = val
      this.detail.newVal = val
      this.detail.index = idx
    },
    async onScrollHkeyList (e) {
      let sHeight = e.target.scrollHeight
      let boxHeight = e.target.offsetHeight
      let scrollTop = e.target.scrollTop
      if (sHeight - (boxHeight + scrollTop) < 20) {
        this.loadNextPage()
      }
    },
    async loadNextPage () {
      if (!this.hasMore) return false
      let currLen = this.dataList.length
      if (currLen < this.dataCount) {
        let nextPageData = await this.tab.connect.lrange(this.mainKey, currLen, currLen + this.perPage)
        console.log(this.mainKey, currLen, currLen + this.perPage, nextPageData)
        if (nextPageData && nextPageData.length) {
          nextPageData.forEach(item => {
            this.dataList.push(item)
          })
        }
      } else {
        this.hasMore = false
      }
    },
    async initData () {
      this.dataList = []
      this.dataCount = 0
      this.hasMore = true
      this.detail = {
        index: -1,
        oldVal: null,
        newVal: null
      }
      // 获取列表长度
      try {
        let llen = await this.tab.connect.llen(this.mainKey)
        if (!llen) throw new Error('列表长度为0')
        this.dataCount = llen
        console.log('列表长度', llen)
        if (llen) {
          this.loadNextPage()
        } else {
          this.hasMore = false
        }
      } catch (e) {
        console.warn(e)
        return false
      }
    }
  },
  async mounted () {
    await this.initData()
  },
  watch: {
    mainKey: {
      handler (newVal, oldVal) {
        this.initData()
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
  .main_box {
    padding: 10px;
    height: calc(100% - 124px);
    width: 100%;

    .title {
      font-size: 14px;
      line-height: 14px;
      display: flex;
      justify-content: space-between;

      .title_add_btn {
        color: $text-color-dark;
        cursor: pointer;

        .fa {
          margin-right: 5px;
        }

        &:hover {
          color: $text-color-light;
        }
      }
    }

    .data_box {
      width: 100%;
      height: calc(100% - 24px);
      display: flex;
      flex-direction: row;
      margin-top: 10px;

      .list_box {
        width: calc(100% / 2 - 10px / 2);
        flex-grow: 1;
        flex-shrink: 0;
        overflow: hidden;
        overflow-y: auto;
        height: 100%;
        border: 1px solid $border-color;

        .list {
          width: 100%;

          .item {
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            height: $grid-height-normal;
            line-height: $grid-height-normal;
            padding: 0 10px;
            box-sizing: border-box;
            border-bottom: 1px solid $border-color;
            cursor: pointer;

            &:hover {
              background: $background-color-highlight-blue;
            }

            &:last-child {
              /*border-bottom: none;*/
            }
          }
        }
      }

      .detail_box {
        margin-left: 10px;
        width: calc(100% / 2 - 10px / 2);

        .val_box {
          display: flex;
          height: 100%;

          textarea.com-input {
            flex-grow: 1;
            padding: 10px;
          }

          .opt_group {
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
            width: 100px;

            & > div {
              width: 100px;
              flex-grow: 1;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
    }
  }
</style>
