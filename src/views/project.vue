<template>
  <div class="project">
    <div class="serch">
      <el-input
        size="small"
        placeholder="请输入内容"
        v-model="searchWord"
        :clearable="true"
        maxlength="20"
      >
        <template #prepend>输入搜索</template>
      </el-input>
      <el-date-picker
        v-model="date"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <el-button type="info">重置</el-button>
      <el-button type="primary">搜索</el-button>
      <el-button type="primary" @click="showAdd = !showAdd">+新增</el-button>
    </div>
    <el-table :data="tbData" style="width: 100%">
      <el-table-column prop="name" label="项目名称" width="180">
      </el-table-column>
      <el-table-column prop="createTime" label="添加时间" width="180">
        <template #default="scope">
          {{ formt(scope) }}
        </template>
      </el-table-column>
      <el-table-column prop="bindWord" label="当前加载词库"> </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" @click="wordSetting(scope.row)">
            词库设置
          </el-button>
          <el-button type="primary">编辑</el-button>
          <el-button type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="pageChange"
      :total="total"
    >
    </el-pagination>

    <el-dialog title="新增项目" v-model="showAdd">
      <el-form ref="addGameFrom" :model="newGamInfo" :rules="rules">
        <el-form-item label="项目名称">
          <el-input v-model="newGamInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="聊天接口参数(pc端)">
          <el-input v-model="newGamInfo.cmd1"></el-input>
        </el-form-item>
        <el-form-item label="指令接口返回参数(pc端)">
          <el-input v-model="newGamInfo.cmd2"></el-input>
        </el-form-item>
        <el-form-item label="当前加载词库">
          <el-select v-model="newGamInfo.word" placeholder="选择词库">
            <el-option
              v-for="(ele, index) in words"
              :key="index"
              :label="ele.name"
              :value="ele.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confAddGame">确认</el-button>
      </el-form>
    </el-dialog>

    <el-dialog title="词库设置" v-model="showWrodSetting">
      <el-form ref="addGameFrom" :model="newGamInfo">
        <el-form-item label="已经加载的词库">
          <div class="items" v-for="(ele, index) in curretnBind" :key="index">
            <span>{{ ele }}</span>
            <el-button size="small" @click="undind(index)">解绑</el-button>
          </div>
        </el-form-item>

        <el-form-item label="选择要加载的词库">
          <el-select
            v-model="currentWord"
            placeholder="选择词库"
            @change="changeWord"
          >
            <el-option
              v-for="(ele, index) in words"
              :key="index"
              :label="ele.name"
              :value="ele.name"
            ></el-option>
          </el-select>
          <el-button type="primary" @click="addWord">绑定词库</el-button>
        </el-form-item>
        <el-button @click="showWrodSetting = false">取消</el-button>
        <el-button type="primary" @click="chagneWord">确认</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { createGame, queryGameList, updateGameInfo } from '@/utile/api';
import { LISTTYPE } from '@/utile/cosnt';
import { defineComponent } from '@vue/runtime-core';
import moment from 'moment';
import { ElMessage } from 'element-plus';
import _ from 'lodash';
export default defineComponent({
  data() {
    return {
      offset: 0,
      total: 0,
      tbData: [] as any[],
      date: '',
      searchWord: '',
      showAdd: false,
      showWrodSetting: false,
      newGamInfo: {
        name: '',
        cmd1: '',
        cmd2: '',
        word: '',
      },
      words: [] as any[],
      rules: {
        name: [
          { required: true, message: '请输入游戏名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        cmd1: [
          { required: true, message: '请输入聊天接口参数', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        cmd2: [
          {
            required: true,
            message: '请输入指令返回接口参数',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        word: [
          {
            type: 'string',
            required: true,
            message: '请至少选择一个活动性质',
            trigger: 'change',
          },
        ],
      },
      currentWord: '',
      currentGameInfo: {},
      curretnBind: [] as string[],
      currentOpen: [] as string[],
    };
  },
  mounted() {
    this.queryData();
  },
  methods: {
    moment,
    async queryData() {
      const [gameInfo, wordInfo] = await Promise.all([
        queryGameList(this.offset, LISTTYPE.game),
        queryGameList(this.offset, LISTTYPE.word),
      ]);
      const { data, total } = gameInfo;
      this.tbData = data;
      this.total = total;
      this.words = wordInfo.data;
    },
    formt(data: any) {
      return moment(Number(data.row.createTime)).format('YYYY-MM-DD hh:mm:ss');
    },
    pageChange(page: number) {
      this.offset = page * 10;
      this.queryData();
    },
    confAddGame() {
      //@ts-ignore
      this.$refs.addGameFrom.validate(async (isOk: boolean) => {
        if (isOk) {
          const {
            newGamInfo: { name, word, cmd1, cmd2 },
          } = this;
          const data = { name, wordName: word, cmds: `${cmd1}|${cmd2}` };
          const { msg } = await createGame(data);
          ElMessage.success({
            message: msg,
            type: 'success',
          });
          this.cancel();
          await this.queryData();
          this.showAdd = false;
        } else {
          ElMessage.error('参数不合格');
          return false;
        }
      });
    },
    cancel() {
      this.newGamInfo = { name: '', cmd1: '', cmd2: '', word: '' };
    },
    wordSetting(gameInfo: any) {
      this.showWrodSetting = !this.showWrodSetting;
      this.currentGameInfo = gameInfo;
      this.curretnBind = gameInfo.bindWord
        .split('|')
        .filter((ele: string) => ele !== '');
      this.currentOpen = gameInfo.openWord
        .split('|')
        .filter((ele: string) => ele !== '');
    },
    async chagneWord() {
      Reflect.set(
        this.currentGameInfo,
        'bindWord',
        this.curretnBind.join('|') + '|',
      );
      try {
        await updateGameInfo(this.currentGameInfo);
        this.showWrodSetting = false;
        ElMessage.success('修改成功');
      } catch (e) {
        ElMessage.error('修改失败');
      }
    },
    undind(index: number) {
      if (this.curretnBind.length === 1) {
        ElMessage.warning('最少绑定一个词库');
        return;
      }
      this.curretnBind.splice(index, 1);
    },
    addWord() {
      const { currentWord } = this;
      if (currentWord === '') {
        ElMessage.warning('词库不能为空');
        return;
      }
      if (this.curretnBind.includes(currentWord)) {
        ElMessage.error('该词库已经绑定不能重复绑定');
      } else {
        this.curretnBind.push(currentWord);
      }
    },
  },
});
</script>
<style lang="less">
.serch {
  display: flex;

  .el-input {
    width: 300px;
    margin-right: 10px;
  }

  .el-button {
    margin-left: 10px;
  }
}
</style>
