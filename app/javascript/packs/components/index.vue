<template>
  <div>
    <!-- 新規作成部分 -->
    <div class="row">
      <div class="col s10 m11">
        <input v-model="newTask" v-on:change="createTask" class="form-control" placeholder="Add your task!!">
      </div>
      <div class="col s2 m1">
        <div class="btn-floating waves-effect waves-light red">
          <i class="material-icons">add</i>
        </div>
      </div>
    </div>
    <!-- リスト表示部分 -->
    <div>
      <ul class="collection">
        <li v-for="(task, index) in tasks" v-if="!task.is_done" v-bind:id="'row_task_'
          + task.id" class="collection-item">
         <label v-bind:for="'task_' + task.id">{{ task.name }}</label>
         <button type="button" v-on:click="doneTask(task.id, index)" v-bind:id="'task_' + task.id" >done</button>
        </li>
      </ul>
    </div>
    <!-- 完了済みタスク表示ボタン -->
    <div class="btn" v-on:click="displayFinishedTasks">Display finished tasks</div>
    <!-- 完了済みタスク一覧 -->
    <div id="finished-tasks" class="display_none">
      <ul class="collection">
        <li v-for="(task, index) in finishedTasks" v-if="task.is_done" v-bind:id="'row_task_'
          + task.id" class="collection-item">
          <label v-bind:for="'task_' + task.id"  class="line-through">{{ task.name }}</label>
          <button type="button" v-on:click="removeTask(task.id, index)" v-bind:id="'task_' + task.id">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    data: function (){
      return {
        tasks: [],
        finishedTasks: [],
        newTask: ''
      }
    },
    mounted: function () {
      this.fetchTasks();
    },
    methods: {
      fetchTasks: function (){
        axios.get('/api/tasks').then((response) => {
          for(var i = 0; i < response.data.tasks.length; i++) {
            if(response.data.tasks[i].is_done != 1){
              this.tasks.push(response.data.tasks[i]);
            }else{
              this.finishedTasks.push(response.data.tasks[i]);
            }
          }
        }, (error) => {
          console.log(error);
        });
      },
      displayFinishedTasks: function() {
        document.querySelector('#finished-tasks').classList.toggle('display_none');
      },
      createTask: function () {
        if (!this.newTask) return;
        axios.post('/api/tasks', { task: { name: this.newTask } }).then((response) => {
          this.tasks.unshift(response.data.task);
          this.newTask = '';
        }, (error) => {
          console.log(error);
        });
      },
      doneTask: function (task_id, idx) {
        axios.put('/api/tasks/' + task_id, { task: { is_done: 1 } }).then((response) => {
           this.tasks.splice(idx, 1);
           this.finishedTasks.unshift(response.data.task);
        }, (error) => {
          console.log(error);
        });
      },
      removeTask: function(task_id, idx){
        axios.delete('/api/tasks/' + task_id).then((response) => {
          this.finishedTasks.splice(idx, 1);
        }, (error) => {
           console.log(error);
        });
      }
    }
  }
</script>

<style scoped>
  [v-cloak] {
    display: none;
  }
  .display_none {
    display: none;
  }
  .line-through {
    text-decoration: line-through;
  }
</style>
