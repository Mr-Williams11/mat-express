import{getFriends,getFriend,addFriend, updateFriend, deleteFriend, addUser} from '../models/database.js'

export default{
    getMany: async (req,res)=>{
        res.send(await getFriends())
        },
    addOne: async (req,res)=>{   
        const {name,age} = req.body
        const post = await  addFriend(name, age);
        res.send(await getFriends())
        },
    getSingle: async (req,res)=>{
        res.send(await getFriend(+req.params.id))
        },
    editSingle: async (req,res)=>{
            const [friend] = await getFriend(+req.params.id)
            let {name,age} = req.body
            name ? name=name: {name}=friend
            age ? age=age : {age}=friend
            await updateFriend(name,age,+req.params.id)
            res.json(await getFriends())
        },
    delSingle: async (req,res)=>{
            res.send(await deleteFriend(req.params.name));
        },
    addUs:async function(req,res){
        const {username,password} = req.body
        const post = await addUser(username,password)
        res.send(await addUser())
},
logIn: async(req,res,next)=>{
    const {username, password} = req.body
    const hashpassword = await checkUser(username)
    bcrypt.compare(password,hashpassword,(err, result)=>{
        if(err) throw err
        if(result === true){
            
            next()
        }
        else{
            res.send({
                msg:'Passwords doesn\'t match'})
        }
})
}
}