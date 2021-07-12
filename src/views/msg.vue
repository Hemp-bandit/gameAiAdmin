<template>
  <div class='msg'>
    <div class="searchGroup">
      <el-form :model="searchOpt" label-width="80px" size="mini" :inline="true">
        <el-form-item label="文本内容">
          <el-input v-model="searchOpt.content"/>
        </el-form-item>
        <el-form-item label="文本类型">
          <el-select v-model="searchOpt.wordType">
            <el-option
                v-for="(ele, index) in wordTypes"
                :key="index"
                :label="ele.name"
                :value="ele.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="命中类型">
          <el-select v-model="searchOpt.checkType">
            <el-option
                v-for="(ele, index) in checkType"
                :key="index"
                :label="ele.name"
                :value="ele.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
              v-model="searchOpt.date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="ip">
          <vueIp :set_ip="searchOpt.ip" @get-ip="onIpChange"/>
        </el-form-item>
        <el-form-item label="角色id">
          <el-input v-model="searchOpt.gameUserId"/>
        </el-form-item>
        <el-form-item label="处理结果">
          <el-select v-model="searchOpt.checkResult">
            <el-option
                v-for="(ele, index) in checkResults"
                :key="index"
                :label="ele.name"
                :value="ele.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';

import vueIp from 'ip-input-vue';

export default defineComponent(
    {
      components: { vueIp },
      name      : 'msg',
      data() {
        return {
          searchOpt   : {
            content    : '',
            wordType   : '',
            date       : '',
            ip         : '',
            gameUserId : '',
            checkType  : '',
            checkResult: ''
          },
          wordTypes   : [ { name: 'asdf' } ],
          checkType   : [ { name: '123123' } ],
          dataList    : [],
          checkResults: [ { name: '123123' } ]
        };
      },
      methods: {
        onIpChange( ip: string ) {
          this.searchOpt.ip = ip;
        }
      }
    }
);
</script>

<style scoped lang="less">

</style>
