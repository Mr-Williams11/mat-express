import mysql from 'mysql2'
import { config } from 'dotenv';
config();

const  pool = mysql.createPool({    
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,  
}).promise()


const getFriends = async()=> {
    const [result] = await pool.query(`
    SELECT * 
    FROM homies
    `)
    return result
}

const getFriend = async(id)=> {
    const [result] = await pool.query(`
    SELECT * 
    FROM homies
    WHERE  id=?`
    ,[id])
    return result
}

const addFriend = async(name,age)=>{
    const [friend] = await pool.query(`
    INSERT INTO homies (name,age)
    VALUES(?,?)`, [name,age])
    return getFriend(friend.insertId)
}

const updateFriend = async (id,name,age) => {
let existFriend = await getFriend(id);
name = name || existFriend.name;
age = age || existFriend.age;

const [friend] = await pool.query(`
UPDATE homies 
SET name =?, age=? 
WHERE (id =?)`,
[name,age,id])
return getFriend(friend.updateId)
}

const deleteFriend =  async (name) =>{
    const [friend] = await pool.query(`
    DELETE FROM homies 
    WHERE name = ?`,[name])
    return getFriends(friend);
}

// functions for users

const addUser = async (username,password) => {
    const user = await pool.query(`INSERT INTO users (username, password) VALUES (?,?)`,[username,password]);
}

const checkUser = async (username) => {
    const [[{password}]] =  await pool.query(`
    Select password  
    From users 
    Where username = ?`,[username]);
    return password
} 
export{getFriends,addFriend,updateFriend,getFriend,deleteFriend,addUser,checkUser};

// console.log(await getFriends());
// console.log(await getFriend());
// console.log(await addFriend('name',age));