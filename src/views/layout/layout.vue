<template>
  <el-container>
    <el-aside width="200px">
      <el-menu
        @select="handleSelect"
        background-color="#545c64"
        style="height: 100%;"
        text-color="#fff"
        :default-active="active"
        active-text-color="#ffd04b"
      >
        <el-submenu
          v-for="(ele, index) in routes"
          :key="index"
          :index="ele.path"
        >
          <template #title>{{ ele.name }}</template>
          <el-menu-item
            v-for="(el, indd) in ele.children"
            :index="`${ele.path}/${el.path}`"
            :key="indd"
          >
            {{ el.name }}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts">
import { routes } from '@/router';
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  data() {
    return {
      breadcrumbArr: [] as string[],
      routes,
      active: this.$route.fullPath,
    };
  },
  mounted() {},
  methods: {
    handleSelect(data: string) {
      this.$router.push(data);
    },
  },
});
</script>

<style lang="less">
.el-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.title {
  color: #ffffff;
}
</style>
