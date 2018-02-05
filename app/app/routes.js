var PhotoInfo = require('./models/photoInfo');
var path = require('path');
const { exec } = require('child_process');
const uuidv1 = require('uuid/v1');

function getTodos(res) {
    PhotoInfo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(todos); // return all todos in JSON format
    });
};


function runScript(uniqFilename, fileInfo) {
    var filePath = path.join(__dirname, '..', 'public', 'images', uniqFilename);
    var scriptPath = '/home/ubuntu/git_projects/offline-photos/darkflow/run.py';

    exec('python3 ' + scriptPath + '  ' + filePath, (err, stdout, stderr) => {
        if (err) {
            // node couldn't execute the command
            console.log(err.message);
            return;
        }

        var start = stdout.lastIndexOf('[');
        var end = stdout.lastIndexOf(']') + 1;
        var result = stdout.substring(start, end);
        
        result = result.replace(new RegExp('\'', 'g'), '\"');
        var jsonResult = JSON.parse(result);

        var photoInfo = {
            uniqueFilename : uniqFilename,
            path : filePath,
            realName : fileInfo.name,
            info : jsonResult,
            mimetype : fileInfo.mimetype
        }

        saveInfo(photoInfo);

        // console.dir(jsonResult, {depth: null, colors: true})        
    });
}

function saveInfo(photoInfo) {
    PhotoInfo.create(photoInfo, function (err, todo) {
        if (err)
            res.send(err);
        console.log(todo);
        // get and return all the todos after you create another
        // getTodos(res);
        console.log("Created a ok todo");
    });
}

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function (req, res) {
        // use mongoose to get all todos in the database
        getTodos(res);
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function (req, res) {

        // create a todo, information comes from AJAX request from Angular
        PhotoInfo.create({
            text: req.body.text,
            done: false
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            getTodos(res);
        });

    });

    app.get('/api/photos/:label', function(req, res) {
        PhotoInfo.find({
            'info' : {
                $elemMatch : {
                    label : req.params.label,
                    confidence : { $gte: 0.5 }
                }
            }
        }, function(err, data) {
            if (err) 
                return res.status(400).send('No files were found.');

            res.json(data);
        })
    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function (req, res) {
        PhotoInfo.remove({
            _id: req.params.todo_id
        }, function (err, todo) {
            if (err)
                res.send(err);

            getTodos(res);
        });
    });

    app.post('/upload', function(req, res) {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');
        
        console.log(req.files);

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    
        let sampleFile = req.files.file;
        console.log(req.files.file);
        var uniqFilename = uuidv1();
        var jsonPath = path.join(__dirname, '..', 'public', 'images', uniqFilename);
        
        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(jsonPath, function(err) {
            if (err)
                return res.status(500).send(err);
            runScript(uniqFilename, req.files.file);
            res.send('File uploaded!');
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
