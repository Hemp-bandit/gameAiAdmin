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
      <el-table-column prop="name" label="词库名称">
      </el-table-column>
      <el-table-column prop="createTime" label="添加时间">
        <template #default="scope">
          {{formt( scope )}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" @click="wordSetting(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" @click="delWord(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增词库" v-model="showAdd">
      <el-form :model="newWord">
        <el-form-item label="词库名称">
          <el-input v-model="newWord.name"></el-input>
        </el-form-item>
        <el-form-item label="添加新关键字">
          <el-input v-model="currrConent" :clearable="true" :maxlength="30">
            <template #append>
              <el-button type="primary" @click="append">添加</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="删除新关键字">
          <el-input v-model="currDele" :clearable="true" :maxlength="30">
            <template #append>
              <el-button type="primary" @click="delWor">删除</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="词库内容">
          <el-input type="textarea" v-model="newWord.content" :disabled="true">
          </el-input>
        </el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="addNew">确定</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent }                       from '@vue/runtime-core';
import { createWord, queryGameList, updateWord } from '@/utile/api';
import { LISTTYPE }                              from '@/utile/cosnt';
import moment                                    from 'moment';
import { ElMessage }                             from 'element-plus';
import _                                         from 'lodash';

export default defineComponent( {
  data() {
    return {
      searchWord : '',
      showAdd    : false,
      woreData   : [] as any[],
      currrConent: '',
      currDele   : '',
      contents   : [] as string[],
      newWord    : {
        name   : '',
        content: ''
      }
    };
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
    },
    cancel() {
      this.newWord = {
        name   : '',
        content: ''
      };
      this.currrConent = '';
      this.currDele = '';
      this.contents = [];
      this.showAdd = false;
    },
    async addNew() {
      const { newWord } = this;
      if ( newWord.name === '' || newWord.content === '' ) {
        ElMessage.warning( '内容错误' );
        return;
      }
      try {
        const { msg } = await createWord( newWord );
        ElMessage.success( msg );
        await this.queryData();
        this.showAdd = false;
      } catch ( e ) {
        ElMessage.error( e.message );
      }
    },
    append() {
      const { currrConent } = this;
      if ( currrConent === '' ) {
        ElMessage.warning( '关键字不能为空' );
        return;
      }
      this.contents.push( currrConent );
      this.newWord.content = this.contents.join( '|' );
      this.currrConent = '';
    },
    delWor() {
      const { currDele, contents } = this;
      if ( currDele === '' ) {
        ElMessage.warning( '关键字不能为空' );
        return;
      }
      const index = _.indexOf( this.contents, currDele );
      contents.splice( index, 1 );
      this.contents = contents;

      this.newWord.content = contents.join( '|' );
      this.currDele = '';
    },
    async delWord( word: any ) {
      word.isDel = true;
      try {
        const { msg } = await updateWord( word );
        ElMessage.success( msg );
        await this.queryData();
      } catch ( e ) {
        ElMessage.error( e.message );
      }

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
