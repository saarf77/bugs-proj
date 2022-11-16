import { userService} from '../services/user.service.js';

export default {
    template: `
        <section class="user-list">
            <h1>User List</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Id</th>
                        <th>Password</th>
                        <th>Is Admin</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody  v-for="(currUser, idx) in users" :key="currUser._id">
                    <tr>
                        <td>{{currUser.username}}</td>
                        <td>{{currUser._id}}</td>
                        <td>{{currUser.password}}</td>
                        <td>{{currUser.isAdmin}}</td>
                        <td><button v-on:click="removeUser(currUser._id)">Delete</button></td>
                    </tr>
                </tbody>
            </table>
        </section> 

        `,
    data() {
        return {
            users: [],
            loggedinUser: null
        }
    },
    created() {
        this.loadUsers()
        },
    methods: {
        loadUsers() {
            userService.query()
                .then(users => {
                    this.users = users
                })
        },
        removeUser(userId) {
            let idx = this.users.findIndx( user=>)
            if () {
                
                userService.removeUser(userId).then(() => this.loadUsers())
            }
        },
        deleteUser(userId) {
            userService.getById(userId)
                .then(user => {
                    if (user.username !== this.loggedinUser.username || user) {
                        userService.deleteUser(userId)
                            .then(res => {
                                console.log(res);
                            });
                    } else {
                        console.log('Can not delete', this.loggedinUser.username);
                    }
                });
        },
    },

}
