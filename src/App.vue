<template>
  <div id="app">
    <v-layout fill-height row justify-center class="form">
      <img alt="Vue logo" src="./assets/logo.png" class="image" />
      <div class="fields">
        <v-layout row>
          <v-flex xs12 sm12 md12 lg12>
            <v-text-field label="Nome" :maxlength="50" v-model="customer.nome"></v-text-field>
          </v-flex>
          <v-flex xs7 sm7 md7 lg7>
            <v-text-field
              label="CPF"
              :maxlength="50"
              v-mask="'###.###.###-##'"
              v-model="customer.cpf"
            ></v-text-field>
          </v-flex>
          <v-flex xs5 sm5 md5 lg5>
            <v-text-field label="e-mail" :maxlength="50" v-model="customer.email"></v-text-field>
          </v-flex>
          <v-flex xs5 sm5 md5 lg5>
            <v-text-field
              label="Telefone"
              :maxlength="50"
              v-mask="'(##)#####-####'"
              v-model="customer.telefone"
            ></v-text-field>
          </v-flex>
          <v-flex xs7 sm7 md7 lg7></v-flex>

          <v-flex xs3 sm3 md3 lg3>
            <v-btn @click="submit()" :color="submitColor">{{(isAlter ? 'Alterar' : 'Inserir')}}</v-btn>
          </v-flex>
        </v-layout>
      </div>
    </v-layout>

    <v-layout fill-height row justify-center>
      <ul class="customers">
        <li
          v-for="(customer, index) in customers"
          :key="customer.cpf"
          class="customer"
          :class="{active: customer.active}"
        >
          <img src="./assets/user.png" :alt="customer.imagemPath" class="image" />
          <div class="customer_content">
            <p class="line">
              <b>Nome:</b>
              {{customer.nome}}
            </p>
            <p class="line">
              <b>CPF:</b>
              {{customer.cpf}}
            </p>
            <p class="line">
              <b>e-mail:</b>
              {{customer.email}}
            </p>
            <p class="line">
              <b>TEL:</b>
              {{customer.telefone}}
            </p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center">
            <v-btn @click="checkActive(index)" color="#0094d8" style="font-size: 8px">Alterar</v-btn>
            <v-btn @click="deleteCustomer(index)" color="#fa5a5a" style="font-size: 8px">Excluir</v-btn>
          </div>
        </li>
      </ul>
    </v-layout>
  </div>
</template>

<script>
import axios from "axios";
import { mask } from "vue-the-mask";

const http = axios.create({
  baseURL: "http://localhost:3001"
});

export default {
  name: "App",
  directives: {
    mask
  },
  data: () => ({
    customer: {},
    isAlter: false,
    submitColor: "#91ff8e",
    customers: []
  }),
  methods: {
    checkActive(idx) {
      for (let x = 0; x <= this.customers.length - 1; x++) {
        this.customers[x].active = false;
      }

      this.customer = this.customers[idx];
      this.customer.active = true;
      this.customers[idx] = this.customer;
      this.isAlter = true;
      this.submitColor = "#0094d8";
    },
    async submit() {
      if (
        !this.customer.nome ||
        !this.customer.cpf ||
        !this.customer.email ||
        !this.customer.telefone
      ) {
        return alert("Preencha corretamente os campos.");
      }

      try {
        if (this.isAlter) {
          await http.put(`/${this.customer.cpf}`, this.customer);
        } else {
          await http.post(`/`, this.customer);
        }
      } catch (error) {
        return alert(
          "Falha na operação. Verifique os dados digitados e tente novamente."
        );
      }

      for (let x = 0; x <= this.customers.length - 1; x++) {
        this.customers[x].active = false;
      }
      this.isAlter = false;
      this.submitColor = "#91ff8e";
      this.customer = {};
      this.getAll();
    },
    async deleteCustomer(idx) {
      this.customer = this.customers[idx];
      if (confirm(`Deseja deletar CPF:${this.customer.cpf}?`)) {
        await this.delete(this.customer);
        this.isAlter = false;
        this.submitColor = "#91ff8e";
        this.customer = {};
      }
    },
    async delete(customer) {
      try {
        await http.delete(`/${customer.cpf}`);
        this.getAll();
      } catch (error) {
        alert(error);
      }
    },
    async getAll() {
      try {
        const response = await http.get("/");
        this.customers = response.data;
      } catch (error) {
        alert(error);
      }
    }
  },
  created() {
    this.getAll();
  }
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.customers {
  margin: 0px 80px 80px 20px;
  padding-top: 20px;
  display: grid;
  grid-template-columns: 1fr;
}

.customer {
  color: rgba(0, 0, 0, 0.5);
  display: grid;
  grid-template-columns: 18% 500px 1fr;
  border-style: solid;
  border-width: 0px;
  border-color: rgba(0, 0, 0, 0.05);
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.1);
  background: #fff;
  margin-left: 50px;
  margin-bottom: 12px;
  min-width: 800px;
  height: 93px;
}

.customer_content {
  padding: 10px 10px 0 10px;
}

.line {
  text-align: start;
}

.image {
  max-width: 90px;
  max-height: 90px;
  padding-left: 2px;
}

.form {
  display: flex;
  margin-left: 5px;
  padding-left: 10px;
}

.fields {
  background: #fff;
  flex: 1;
  text-align: start;
  max-width: 40%;
  margin-left: 30px;
}

.active {
  background: rgb(215, 237, 255);
}
</style>
