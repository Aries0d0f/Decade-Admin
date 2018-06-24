<template>
  <el-card class="block-card">
    <el-row :gutter="20">
      <el-col :span="preSpan" class="block-col" v-for="(item, i) in label" :key="i">
        <div class="block-title">{{item}}</div>
        <div class="block-detail">
          {{data[i]}}
          <span>{{itemLabel[i]}}</span>
        </div>
      </el-col>
    </el-row>
  </el-card>  
</template>

<script>
export default {
  props: ['label', 'data', 'itemLabel', 'preSpan']
}
</script>

<style lang="scss" scoped>
  .block-card{
    .block-title{
      color: #b27536;
      font-size: .8rem;
      margin-bottom: 1rem;
    }

    .block-detail{
      font-size: 2rem;
      color: #676767;

      span{
        font-size: .9rem;
      }
    }

    .block-col{
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      &:not(:last-child) {
        border-right: 1px solid #ccc;
      }

    }
  }
</style>
