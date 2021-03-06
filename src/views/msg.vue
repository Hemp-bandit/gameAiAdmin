<template>
  <div class="msg">
    <div class="searchGroup">
      <el-form :model="searchOpt" label-width="80px" size="mini" :inline="true">
        <el-form-item label="文本内容">
          <el-input v-model="searchOpt.content" />
        </el-form-item>
        <el-form-item label="文本类型">
          <el-select v-model="searchOpt.type">
            <el-option
              v-for="(ele, index) in wordTypes"
              :key="index"
              :label="ele.name"
              :value="ele.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="命中类型">
          <el-select v-model="searchOpt.checkType">
            <el-option
              v-for="(ele, index) in checkType"
              :key="index"
              :label="ele.name"
              :value="ele.value"
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
          <vueIp :set_ip="searchOpt.ip" @get-ip="onIpChange" />
        </el-form-item>
        <el-form-item label="角色id">
          <el-input v-model="searchOpt.gameUserId" />
        </el-form-item>
        <el-form-item label="处理结果">
          <el-select v-model="searchOpt.checkResult">
            <el-option
              v-for="(ele, index) in checkResults"
              :key="index"
              :label="ele.name"
              :value="ele.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="info">重置</el-button>
          <el-button type="primary" @click="searchMsg">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="dataList" height="600">
      <el-table-column prop="content" label="文本内容" />
      <el-table-column label="文本类型">
        <template #default="scoped">
          {{ conveType(scoped.row.type, 'word') }}
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="ip" />
      <el-table-column prop="gameName" label="游戏名称" />
      <el-table-column prop="result" label="命中类型" />
      <el-table-column prop="result" label="审核依据">
        <template #default="scoped">
          {{ conveType(scoped.row.checkType, 'ckt') }}
        </template>
      </el-table-column>
      <el-table-column prop="gameUserId" label="角色id" />
      <el-table-column label="处理结果">
        <template #default="scoped">
          {{ conveType(scoped.row.checkResult, 'chr') }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-cascader
            v-model="scope.row.opt"
            :options="scope.row.opts"
            :props="{
              checkStrictly: false,
              multiple: true,
              value: 'name',
              label: 'name',
            }"
            :clearable="true"
            @change="handChange(scope.row, scope.$index)"
          ></el-cascader>
          <el-button type="primary" size="mini" @click="changeMsg(scope.row)"
            >确认修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { queryGameList, queryMsgList, updateMsg } from '@/utile/api';
import { CHECKRESULT, CHECKTYPE, LISTTYPE, WORDTYPES } from '@/utile/cosnt';
import { defineComponent } from '@vue/runtime-core';
import { ElMessage } from 'element-plus';

import _ from 'lodash';
import vueIp from '@/components/ip.vue';
export default defineComponent({
  components: { vueIp },
  data() {
    return {
      searchOpt: {
        content: '',
        type: '',
        date: '',
        ip: '',
        gameUserId: '',
        checkType: '',
        checkResult: '',
      },
      wordTypes: [{ name: '聊天', value: '0' }],
      checkType: [
        { name: '全部', value: undefined },
        { name: 'ai', value: '0' },
        { name: '人工', value: '1' },
        { name: '词库', value: '2' },
      ],
      checkResults: [
        { name: '全部', value: undefined },
        { name: '通过', value: '0' },
        { name: '拦截', value: '1' },
      ],
      dataList: [],
      optRes: '',
    };
  },
  mounted() {
    this.queryData().then(() => {
      this.queryWord();
    });
  },
  methods: {
    onIpChange(ip: string) {
      this.searchOpt.ip = ip;
    },
    async queryData(req: any = {}) {
      try {
        const { data } = await queryMsgList(req);
        this.dataList = data;
      } catch (error) {
        ElMessage.error(error.message);
      }
    },
    conveType(row: string, tp: 'word' | 'ckt' | 'chr') {
      switch (tp) {
        case 'word':
          return WORDTYPES[Number(row)];
        case 'ckt':
          return CHECKTYPE[Number(row)];
        case 'chr':
          return CHECKRESULT[Number(row)];
      }
    },
    async queryWord() {
      try {
        let { data } = await queryGameList(LISTTYPE.word);
        const opt = [{ name: '通过' }].concat(data);
        this.dataList = this.dataList.map(ele => {
          Reflect.set(ele, 'opts', opt);
          return ele;
        });
      } catch (error) {
        ElMessage.error(error.message);
      }
    },
    handChange({ opt, opts }: any, index: number) {
      const fltOpt = _.flatten(opt);
      if (fltOpt.includes('通过')) {
        //@ts-ignore
        this.dataList[index].opt = [['通过']];
        let i = 1;
        while (i < opts.length) {
          Reflect.set(opts[i], 'disabled', true);
          i++;
        }
      } else {
        let i = 1;
        while (i < opts.length) {
          Reflect.set(opts[i], 'disabled', false);
          i++;
        }
      }
    },
    async changeMsg(scop: any) {
      const { opt } = scop;
      const fltOpt = _.flatten(opt);
      Reflect.deleteProperty(scop, 'opt');
      Reflect.deleteProperty(scop, 'opts');
      if (fltOpt.includes('通过')) {
        scop.checkType = '1';
        scop.checkResult = '0';
        scop.result = `人工审核通过`;
      } else {
        scop.checkType = '2';
        scop.checkResult = '1';
        scop.result = `词库 ${fltOpt.join(' | ')} 审核不通过`;
      }

      // console.log(JSON.stringify(scop, null, 2));

      try {
        const { msg } = await updateMsg(scop);
        ElMessage.success(msg);
        await this.queryData();
      } catch (error) {
        ElMessage.error(error.message);
      }
    },
    async searchMsg() {
      const { searchOpt } = this;
      if (searchOpt.ip !== '') {
        if (searchOpt.ip.split('.').includes('')) {
          ElMessage.warning('ip 不正确');
          return;
        }
      }

      if (searchOpt.date !== '' && _.isArray(searchOpt.date)) {
        const [startTime, endTime] = searchOpt.date;
        Reflect.set(searchOpt, 'startTime', new Date(startTime).getTime());
        Reflect.set(searchOpt, 'endTime', new Date(endTime).getTime());
        Reflect.deleteProperty(searchOpt, 'date');
      }

      const keys = Object.keys(searchOpt);
      const req = {};
      keys.forEach(key => {
        //@ts-ignore
        if (searchOpt[key] !== '') {
          //@ts-ignore
          req[key] = searchOpt[key];
        }
      });
      await this.queryData(req);
    },
  },
});
</script>

<style scoped lang="less"></style>
