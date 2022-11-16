import { userService } from "../services/user.service.js"
import loginSignup from "./login-signup.cmp.js"

export default {
    template: `
    <header class="app-header">
        <div class="logo">
            <h1>Bugs</h1>
        </div>
        <nav>
            <router-link active-class="active-link" to="/" exact>Home</router-link> |
            <router-link to="/bug-app">Bugs App</router-link> |
            
            <!-- <router-link to="/todo-app">Todos App</router-link> | -->
            <!-- <router-link to="/about">About</router-link> -->
         </nav>
         <section v-if="user">
             <p>Welcome {{user.fullname}}</p>   
             <router-link v-if="user.isAdmin === true" to="/user-list">User List</router-link> |
             <button @click="logout">Logout</button>
        </section>
        <section v-else>
             <login-signup @onChangeLoginStatus="onChangeLoginStatus"></login-signup>
        </section>
     </header>
     `,

    data() {
        return {
            user: userService.getLoggedInUser()
        }
    },
    created() {
        console.log(this.user)
    },
    methods: {
        onChangeLoginStatus() {
            this.user = userService.getLoggedInUser()
        },
        logout() {
            userService.logout()
                .then(() => {
                    this.user = null
                })
        }
    },
    components: {
        loginSignup
    }
}
