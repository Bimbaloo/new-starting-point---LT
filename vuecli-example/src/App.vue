<template>
  <div id="app">
    <div class="playground">
        <div class="color-list">
            <div
            class="color-item" 
            v-for="color in colors" 
            v-dragging="{ list: colors, item: color, group: 'color' }"
            :key="color.text">
            {{color.text}}
            </div>
        </div>
        <div class="color-show">
            <div 
            v-for="color in colors"
            v-dragging="{ list: colors, item: color, group: 'color' }"
            class="color-box" 
            :style="{'background-color': color.text}"
            :key="color.text">
            {{color.text}}
            </div>
        </div>
        <button @click="test">test-bug</button>
        <div class="color-show" v-if="colorShow">
            <div
            v-for="color in colors2"
            v-dragging="{ list: colors2, item: color, group: 'color2' }"
            class="color-box"
            :style="{'background-color': color.text}"
            :key="color.text">
            {{color.text}}
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      colors: [
        {
          text: "Aquamarine"
        },
        {
          text: "Hotpink"
        },
        {
          text: "Gold"
        },
        {
          text: "Crimson"
        },
        {
          text: "Blueviolet"
        },
        {
          text: "Lightblue"
        },
        {
          text: "Cornflowerblue"
        },
        {
          text: "Skyblue"
        }
      ],
      colors2: [
        {
          text: "Aquamarine"
        },
        {
          text: "Hotpink"
        },
        {
          text: "Gold"
        },
        {
          text: "Crimson"
        },
        {
          text: "Blueviolet"
        },
        {
          text: "Lightblue"
        }
      ],
      colorShow: true
    };
  },

  created() {},
  mounted() {
    this.$dragging.$on("dragged", function(data) {
      console.log("开始");
      console.log("dragged", data);
    });
    this.$dragging.$on("dragend", function(data) {
      console.log("结束");
      console.log("dragend", data);
    });
  },
  methods: {
    test: function() {
      this.colors = [
        {
          text: "Aquamarine"
        },
        {
          text: "Hotpink"
        },
        {
          text: "Gold"
        },
        {
          text: "Crimson"
        },
        {
          text: "Blueviolet"
        },
        {
          text: "Lightblue"
        },
        {
          text: "Cornflowerblue"
        },
        {
          text: "Skyblue"
        },
        {
          text: "Burlywood"
        }
      ];
      this.colorShow = !this.colorShow;
    }
  }
};
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
.playground {
  display: flex;
  margin-top: 4rem;
}
.color-item {
  background: #f5f5f5;
  padding: 0.5rem;
  color: #5f5f5f;
  transition: transform 0.3s;
}
.color-item.dragging {
  background-color: #fff;
}
.color-show {
  display: flex;
  flex-wrap: wrap;
  width: 30rem;
}
.color-box {
  width: 33%;
  height: 6rem;
  background: #efefef;
  line-height: 6rem;
  text-align: center;
  color: #fff;
  transition: transform 0.3s;
}
.color-box.dragging {
  transform: scale(1.1);
}
.in-out-translate-fade-enter-active,
.in-out-translate-fade-leave-active {
  transition: all 0.5s;
}
.in-out-translate-fade-enter,
.in-out-translate-fade-leave-active {
  opacity: 0;
}
.in-out-translate-fade-enter {
  transform: translate3d(100%, 0, 0);
}
.in-out-translate-fade-leave-active {
  transform: translate3d(-100%, 0, 0);
}
</style>
