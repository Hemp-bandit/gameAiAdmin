<template>
  <div class="msg">
    <div class="searchGroup">
      <el-form :model="searchOpt" label-width="80px" size="mini" :inline="true">
        <el-form-item label="文本内容">
          <el-input v-model="searchOpt.content" />
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
              :value="ele.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="info">重置</el-button>
          <el-button type="primary">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="dataList">
      <el-table-column prop="content" label="文本内容" />
      <el-table-column label="文本类型">
        <template #default="scoped">
          {{ conveType(scoped.row.type, 'word') }}
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="ip" />
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
            @change="handChange"
          ></el-cascader>
          <el-button type="primary" size="mini">确认修改</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { queryGameList, queryMsgList } from '@/utile/api';
import { CHECKRESULT, CHECKTYPE, LISTTYPE, WORDTYPES } from '@/utile/cosnt';
import { defineComponent } from '@vue/runtime-core';
import { ElMessage } from 'element-plus';
//@ts-ignore
import vueIp from 'ip-input-vue';

export default defineComponent({
  components: { vueIp },
  data() {
    return {
      searchOpt: {
        content: '',
        wordType: '',
        date: '',
        ip: '',
        gameUserId: '',
        checkType: '',
        checkResult: '',
      },
      wordTypes: [{ name: '聊天', value: '0' }],
      checkType: [
        { name: 'ai', value: '0' },
        { name: '人工', value: '1' },
        { name: '词库', value: '2' },
      ],
      checkResults: [
        { name: '成功', value: '0' },
        { name: '失败', value: '1' },
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
        const opt = [{ name: '通过' }];
        data = data.concat(opt);
        this.dataList = this.dataList.map(ele => {
          Reflect.set(ele, 'opts', data);
          return ele;
        });
      } catch (error) {
        ElMessage.error(error.message);
      }
    },
    handChange(value: any) {
      console.log(value);
    },
  },
});
</script>

<style scoped lang="less"></style>
