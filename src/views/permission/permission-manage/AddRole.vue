/* 权限配置 */
<template>
  <div class="addEditRole">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>配置权限</span>
      </div>
      <el-form status-icon
               label-width="100px"
               class="demo-ruleForm seachInput">
        <el-form-item label="角色：">
          <el-input type="text"
                    disabled
                    placeholder="请输入角色名称"
                    clearable
                    v-model="role"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-card class="box-card"
               :key="index"
               v-for="(items,index) in aythData">
        <div slot="header"
             class="clearfix textLeft">
          <span>{{index}}</span>
          <el-checkbox :indeterminate="isIndeterminate"
                       @click.native="clickChenk(index)"
                       v-model="checkAll[index]"
                       @change="handleCheckAllChange"></el-checkbox>
        </div>
        <table :key="i"
               class="tableBox"
               v-for="(value,i) in items">
          <tr>
            <td class="tableName">{{i}}</td>
            <td :key="v"
                v-for="(item,v) in value">
              <el-checkbox-group v-model="privilege"
                                 @change="handleCheckedChange">
                <el-checkbox :label="item"
                             :name="index">
                  <template>
                    {{v}}
                  </template>
                </el-checkbox>
              </el-checkbox-group>
            </td>
          </tr>
        </table>
      </el-card>
      <div class="editSaveBtn">
        <el-button @click="editSave"
                   type="primary"
                   class="saveUpdate">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import privilegeJson from '@/store/privilege';

export default {
  name: 'AddRole',
  data() {
    return {
      account: localStorage.getItem('currentUser_name'),
      login_token: localStorage.getItem('currentUser_token'),
      // 权限数据-
      aythData: [],
      // 判断是新增角色还是配置权限
      parameter: '',
      role: '',
      // 选中的权限(id)
      privilege: [],
      roleData: [],
      name: '',
      isIndeterminate: false,
      checkAll: {
        用户权限管理: false,
        充值权限管理: false,
        运营权限管理: false,
        推广权限管理: false,
        控制权限管理: false,
        账户权限管理: false
      }
    };
  },
  created() {
    this.privilege = [];
    this.aythData = privilegeJson.data;
    this.parameter = this.$route.query.parameter;
    this.roleData = this.$route.query.row.privilege;
    this.role = this.$route.query.row.name;
  },
  methods: {
    // 保存配置权限
    editSave() {
      let privilegeData = privilegeJson.setData;
      // 初始化数据
      for (let j in privilegeData) {
        privilegeData[j] = false;
      }
      // 选中的数据改变状态
      this.privilege.forEach((item) => {
        privilegeData[item] = true;
      });
      let obj = {
        account: this.account,
        login_token: this.login_token,
        role: this.role,
        privilege: JSON.stringify(privilegeData)
      };
      this.$axios.postFormData(this.API.SET_PRIVILEGE_API, obj)
        .then((res) => {
          if (res.success === true) {
            this.$message({
              message: res.message,
              type: 'success'
            });
            this.$router.push({ path: '/permission/permission_set' });
          } else {
            this.$message.error(res.message);
            return false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 选中的新增
    handleCheckedChange(value) {
      for (let i in this.checkAll) {
        let dom = document.getElementsByName(i);
        for (let j = 0; j < dom.length; j++) {
          // 没有全部选中取消全选
          if (this.privilege.indexOf(dom[j].value) == -1) {
            this.checkAll[i] = false;
            break;
          } else {
            // 全部选中
            this.checkAll[i] = true;
          }
        }
      }
      this.privilege = value;
    },
    clickChenk(val) {
      this.name = val;
    },
    // 全选
    handleCheckAllChange(val) {
      for (let i in this.checkAll) {
        let dom = document.getElementsByName(i);
        for (let j = 0; j < dom.length; j++) {
          if (this.checkAll[i] == true) {
            this.privilege.push(dom[j].value);
            this.privilege = Array.from(new Set(this.privilege));
          }
          if (this.checkAll[i] == false && i == this.name) {
            this.privilege.forEach((item, l) => {
              if (dom[j].value == item) {
                this.privilege.splice(l, 1);
              }
            });
          }
        }
      }
    }
  },
  watch: {
    roleData(newVal, oldVal) {
      for (let i in newVal) {
        if (newVal[i] == true) {
          this.privilege.push(i);
        }
      }
      for (let k in this.checkAll) {
        let dom = document.getElementsByName(k);
        for (let j = 0; j < dom.length; j++) {
          if (this.privilege.indexOf(dom[j].value) == -1) {
            this.checkAll[k] = false;
            break;
          } else {
            this.checkAll[k] = true;
          }
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.addEditRole {
  width: 100%;
  height: 100%;
  .demo-ruleForm {
    padding: 10px;
  }
  .textLeft {
    justify-content: left;
  }
  .el-checkbox {
    padding-left: 10px;
  }
  //表格样式
  .tableBox {
    padding: 10px 10px 0 40px;
    font-size: 14px;
    .tableName {
      padding-right: 10px;
      width: 120px;
    }
  }
  .editSaveBtn {
    padding: 20px 0;
    text-align: center;
  }
}
</style>
<style lang="scss">
.addEditRole {
  .demo-ruleForm {
    .el-form-item__content {
      width: 300px;
    }
  }
  .tableBox {
    .el-checkbox__label {
      padding: 0 6px !important;
    }
  }
  .saveUpdate {
    padding: 8px 30px;
  }
}
</style>
