<template>
  <v-dialog
    v-model="dialogVisible"
    persistent
    max-width="600"
    overlay-opacity="100"
    overlay-color="grey"
  >
    <v-card>
      <v-toolbar color="sky blue lighten-1" dark flat>
        <v-icon class="mx-2" large>
          $vuetify.icons.MatrixAIIcon
        </v-icon>
        <v-toolbar-title>PolyKey Secure Login</v-toolbar-title>
      </v-toolbar>
      <v-form v-model="valid">
        <v-container>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                label="Passphrase"
                hint="At least 8 characters"
                counter
                @click:append="showPassword = !showPassword"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn color="blue" @click="isLoggedIn = true" fab dark>
          <v-icon large>fab fa-keybase</v-icon>
        </v-btn>
        <v-spacer></v-spacer>

        <v-btn color="info" @click="isLoggedIn = true">
          Forgot Password
        </v-btn>

        <v-btn color="success" @click="isLoggedIn = true">
          New
        </v-btn>

        <v-btn color="success" @click="isLoggedIn = true">
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    showPassword: false,
    isLoggedIn: false,
    valid: true,
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+/.test(v) || 'E-mail must be valid',
    ],
    password: '',
    passwordRules: [
      (v) => console.log(v.length) || true,
      (v) => v.length >= 8 || 'At least 8 characters',
    ],
  }),
  computed: {
    dialogVisible: {
      set(val) {
        this.isLoggedIn = !val;
      },
      get() {
        return !this.isLoggedIn;
      },
    },
  },
  methods: {
    showDialog() {
      return !this.isLoggedIn;
    },
  },
};
</script>

<style scoped>
.v-dialog {
  transition: none;
}
</style>
