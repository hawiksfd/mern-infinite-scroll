import {Sequelize} from 'sequelize'

const db = new Sequelize('mern-infinite-scroll', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

export default db;