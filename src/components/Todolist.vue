<template>
  
  <div class="todolist">
    <h3>Lista de Tarefas</h3>
    <div class="input-group mb-3">
      <input
        type="text"
        class="form-control"
        placeholder="Tarefas"
        aria-label="Tarefas"
        aria-describedby="button-addon2"
        v-model="todoInput"
      >
      <div class="input-group-append">
        <button
          class="btn btn-outline-secondary"
          type="button"
          id="button-addon2"
          @click="addTodo"
        >Adicionar</button>
      </div>
    </div>
    <!-- {{todoList}} -->
    <ul class="list-group">
      <li
        v-for="(todo,index) in todoList"
        :key="index"
        :class="{
          'list-group-item': true,
          'list-group-item-info': todo.checked 
          }"
        @click="checkedTodo(todo)"
      >
        {{todo.todo}}
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close"
          @click.stop="delTodo(todo)"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as firebase from "firebase/app";
import "firebase/firestore";

import firebaseConfig from "@/firebaseConfig";
firebase.initializeApp(firebaseConfig);

class Todo {
  id?: string;
  todo: string;
  checked: boolean;

  constructor(todo: string) {
    this.todo = todo;
    this.checked = false;
  }

  toggleCkecked() {
    this.checked = !this.checked;
  }
}
@Component
export default class Todolist extends Vue {
  todoInput: string = "";
  todoList: Todo[] = [];

  addTodo() {
    console.log("todoInput:", this.todoInput);
    let todo = new Todo(this.todoInput);

    firebase

      .firestore()
      .collection("todolists")
      .add({
        todo: todo.todo,
        checked: todo.checked
      })
      .then(result => {
        console.log("result:", result);
      })
      .catch(error => {
        console.log("error:", error);
      });
  }

  checkedTodo(todo: Todo) {
    todo.toggleCkecked();
    firebase

      .firestore()
      .collection("todolists")
      .doc(todo.id)
      .set({
        todo: todo.todo,
        checked: todo.checked
      })
      .then(result => {
        console.log("result:", result);
      })
      .catch(error => {
        console.log("error:", error);
      });
  }

  delTodo(todo: Todo) {
    console.log("deltodo:", todo);
    // this.todoList = this.todoList.filter((todoItem) => {
    //   return todoItem !== todo;
    // })

    firebase
      .firestore()
      .collection("todolists")
      .doc(todo.id)
      .delete();
  }

  mounted() {
    firebase
      .firestore()
      .collection("todolists")
      .onSnapshot(snapshot => {
        const todolists = snapshot.docs.map(_doc => {
          const data = _doc.data();
          let todo = new Todo(data.todo);
          todo.id = _doc.id;
          todo.checked = data.checked;
          return todo;
          // data["id"] = _doc.id;
          // return data as Todo;
        });
        console.log("firebase todolists:", todolists);
        this.todoList = todolists;
      });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-group-item-info {
  text-decoration: line-through;
}
</style>
