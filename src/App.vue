<template>
  <div id="app">
    <div class="noborder" ref="content" :contenteditable="true" @mousemove="onMousemove" @mouseup="onMouseup">
      <template v-for="(mark, index) in utterance.mark">
        <template v-if="mark.type != 'text'">
          <span
            v-if="mouseoverSelection === index"
            ref="marker-start"
            class="marker"
            id="marker1"
            :key="'markerstart'+index"
            @mousedown="onMousedown('start', $event)"
          >
            <span class="handle handle-start"></span>
          </span>
          <span :ref="'selection'+index" class="selection" :class="{'resizing': mouseoverSelection === index}" @mouseover="onMouseover(index, $event)" :key="index" style="background:rgb(255, 205, 246);">{{mark.text}}</span>
          <span
            v-if="mouseoverSelection === index"
            ref="marker-end"
            class="marker"
            id="marker2"
            :key="'markerend'+index"
            @mousedown="onMousedown('end', $event)"
          >
            <span class="handle handle-end"></span>
          </span>
        </template>
        
        <template v-else>{{mark.text}}</template>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return  {
      mouseoverSelection: null,
      mousedownMark: null,
      selection: null,
      utterance: {
        mark: [
          {
            type: 'else',
            text: '克昂科啊额啊送饭卡死奶粉'
          },
          {
            type: 'text',
            text: '请问你是我的额坎坷上课教案房门啊诶额那么淡蓝色发酵诶诶安分额爱抚诶安康飞机啊'
          },
          {
            type: 'else',
            text: '谁啊我' },
          {
            type: 'text',
            text: '吗哈哈哈不是啊哈哈哈哈补个吗色卡吗'
          }
        ],
        text: '请问你是我的额坎坷上课教案谁啊我吗哈哈哈不是啊哈哈哈哈补个吗色卡吗'
      }
    }
  },
  methods: {
    onMouseover(index, e) {
      e.preventDefault();
      if (this.mousedownMark) return
      this.mouseoverSelection = index
    },
    
    onMousedown(type, e) {
      e.preventDefault();
      this.mousedownMark = type
    },
    onMousemove(e) {
      if (!this.mousedownMark) return //还没点击mark
      if (typeof this.mouseoverSelection !== 'number') return
      
      let markX = e.clientX, 
          markY = e.clientY
      if (this.mousedownMark === 'start') {
        markX += 4
        markY += 10
      } else {
        markX -= 4
        markY -= 10
      }
      let point = document.caretRangeFromPoint(markX, markY) //x
      if (!point || !point.commonAncestorContainer) return
      var textNode = point.startContainer,
          offset = point.startOffset
      if (textNode.nodeType !== Node.TEXT_NODE) return

      let utterance, mark

      if (this.mousedownMark === 'start') {
        // 抓的是start的那个
        offset -= 1
        if (this.utterance.mark[this.mouseoverSelection].text === textNode.wholeText && textNode.nextSibling === null) {
          // 往右缩
          if (offset <= 0) return
          utterance = this.utterance
          mark = utterance.mark
          let subText = ''
          let selectionText = mark[this.mouseoverSelection].text
          subText = selectionText.substr(0, offset)
          selectionText = selectionText.substr(offset, selectionText.length)
          if (this.mouseoverSelection === 0) {
            mark.unshift({
              type: 'text',
              text: subText
            })
            mark[1].text = selectionText
            this.mouseoverSelection = 1
          } else {
            mark[this.mouseoverSelection - 1].text += subText
            mark[this.mouseoverSelection].text = selectionText
          }
          utterance.mark = mark
          this.utterance = utterance
        }
        if (textNode.nextSibling && textNode.nextSibling.id === 'marker1') {
          // 往左伸
          if (offset < 0) return
          utterance = this.utterance
          mark = utterance.mark
          let subText = ''
          if (mark[this.mouseoverSelection - 1].type == 'else') return
          let leftText = mark[this.mouseoverSelection - 1].text
          subText = leftText.substr(offset, leftText.length)
          mark[this.mouseoverSelection - 1].text = leftText.substr(0, offset)
          mark[this.mouseoverSelection].text = subText + mark[this.mouseoverSelection].text

          utterance.mark = mark
          this.utterance = utterance
        }
      } else {
        // 抓的是end的那个
        if (this.utterance.mark[this.mouseoverSelection].text === textNode.wholeText && textNode.previousSibling === null) {
          if (offset <= 0) return
          if (offset >= this.utterance.mark[this.mouseoverSelection].text.length) return
          utterance = this.utterance
          mark = utterance.mark
          let subText = ''
          let selectionText = mark[this.mouseoverSelection].text
          subText = selectionText.substr(offset, selectionText.length)
          selectionText = selectionText.substr(0, offset)
          if (this.mouseoverSelection === mark.length - 1) {
            mark.push({
              type: 'text',
              text: subText
            })
            mark[this.mouseoverSelection - 1].text = selectionText
            this.mouseoverSelection -= 1
          } else {
            mark[this.mouseoverSelection].text = selectionText
            mark[this.mouseoverSelection + 1].text = subText + mark[this.mouseoverSelection + 1].text
          }
          utterance.mark = mark
          this.utterance = utterance
        }
        if (textNode.previousSibling && textNode.previousSibling.id === 'marker2') {
          utterance = this.utterance
          mark = utterance.mark
          let subText = ''
          if (mark[this.mouseoverSelection + 1].type == 'else' || !mark[this.mouseoverSelection + 1].text) return
          let rightText = mark[this.mouseoverSelection + 1].text
          subText = rightText.substr(0, offset)
          mark[this.mouseoverSelection + 1].text = rightText.substr(offset, rightText.length)
          mark[this.mouseoverSelection].text = mark[this.mouseoverSelection].text + subText
          utterance.mark = mark
          this.utterance = utterance
        }
      }
    },
    onMouseup(e) {
      e.preventDefault();
      this.mousedownMark = null
    }
  }
}
</script>

<style>
* {
  outline: none;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #555;
  margin-top: 500px;
  margin-left: 300px;
  font-size: 14px;
}
.noborder {
  height: auto;
  padding: 10px 18px;
  overflow: visible;
  line-height: 18px;
  white-space: pre-wrap;
  word-break: break-word;
}

.selection {
  transition: background .1s ease-in-out;
  cursor: pointer;
  white-space: pre-wrap;
  word-break: break-word;
}

.marker {
  width: 2px;
  height: 18px;
  background-color: #36a0e1;
  position: absolute;
  cursor: pointer;
}
.handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #36a0e1;
  border-radius: 10px;
}
.handle-start {
  right: -4px;
  top: -9px;
}
.handle-end {
  left: -4px;
  bottom: -9px;
}

</style>
