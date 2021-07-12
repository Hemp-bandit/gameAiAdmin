<template>
  <div class='wordMng'>
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
      <el-button type="info" @click="reset">重置</el-button>
      <el-button type="primary" @click="searchGame">搜索</el-button>
      <el-button type="primary" @click="showAdd = !showAdd">+新增</el-button>
    </div>
    <el-table :data="woreData" style="width: 100%">
      <el-table-column prop="name" label="词库名称" width="180">
      </el-table-column>
      <el-table-column prop="createTime" label="添加时间" width="180">
        <template #default="scope">
          {{formt( scope )}}
        </template>
      </el-table-column>
      <el-table-column prop="isDel" label="状态" width="180">
        <template #default="scop">
          <el-switch v-model="scop.row.isDel"></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" @click="wordSetting(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" @click="delGame(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增项目" v-model="showAdd">

      asdfasd
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { queryGameList }   from '@/utile/api';
import { LISTTYPE }        from '@/utile/cosnt';
import moment              from 'moment';

export default defineComponent( {
  data() {
    return { searchWord: '', showAdd: false, woreData: [] as any[] };
  },
  mounted() {
    this.queryData();
  },
  methods: {
    async queryData() {
      try {
        const { data } = await queryGameList( LISTTYPE.word );
        this.woreData = data;
      } catch ( e ) {}
    },
    reset() {},
    searchGame() {},
    formt( data: any ) {
      return moment( Number( data.row.createTime ) )
          .format( 'YYYY-MM-DD hh:mm:ss' );
    }
  }
} );
</script>

<style scoped lang="less">
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
