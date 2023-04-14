let express = require("express");
let cors = require("cors");
let mysql = require('mysql')


let app = express();
app.use(cors());
const PORT = 8081;
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"todo_db"
})
app.use(express.json());

db.connect(function(err){
    if(err){
        throw err;
    }
    console.log("Database connected Succesfully on XAMPP on its default PORT 3306")
})

//Api request to add/create todo
app.post("/todo_db", async (req, res) => {
    const { todo_name } = req.body;
    const sql = `INSERT INTO todo_tb (todo_name) VALUES (?);`;
    db.query(sql, [todo_name], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        console.log("saved data");
        res.status(200).json(result);
    });
});

app.get("/todo_db/get", (req, res) => {
    const sqlSelect = "SELECT * FROM todo_tb";
    db.query(sqlSelect, (err, result, fields) => {
        console.log("Data received");
        console.log(result);
        return res.json({ data: result });
    });
});

//API request to delete by id method to get todo based on id
app.delete("/todo_db/delete/:todo_id", (req,res)=>{
    const todo_id= req.params.todo_id;
    const sql = `DELETE FROM todo_tb WHERE todo_id=?`
    db.query(sql,todo_id ,(err,result)=>{
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.json({ success:true, result });
    })
})

app.listen(PORT, () => {
    console.log(`Server started on the localhost at PORT ${PORT}`);
});

