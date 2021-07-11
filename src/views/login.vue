<template>
  <div class='Login'>
    <div class='inputs'>
      <el-form ref='form' :model='form' :rules='rules'>
        <el-form-item label='用户名'>
          <el-input v-model='form.username'></el-input>
        </el-form-item>
        <el-form-item label='密码'>
          <el-input v-model='form.password' :show-password='true' type='password'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='handleSubmit'>登陆</el-button>
        </el-form-item>
      </el-form>
    </div
    >
  </div>
</template>
<script lang='ts'>
import { defineComponent } from '@vue/runtime-core'
import { login }           from '@/utile/api'

export default defineComponent( {
  data() {
    return {
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      form : {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    handleSubmit() {
      //@ts-ignore
      this.$refs.form.validate( async valid => {
        if ( valid ) {
          const { token } = await login( this.form )
          localStorage.setItem( 'token', token )
          await this.$router.replace( '/' )
        }
        else {
          console.log( 'error submit!!' )
          return false
        }
      } )
    }
  }
} )
</script>
<style scoped lang='less'>
.Login {
  width: 100vw;
  height: 100vh;
  background: #1550cc;

  .inputs {
    border-radius: 10px;
    width: 268px;
    background: #fff;
    position: absolute;
    right: 164px;
    top: 45%;

  }

  /deep/ .el-form-item {
    padding: 10px 14px;
  }
}
</style>
