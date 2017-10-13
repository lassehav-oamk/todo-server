'use strict';
const Datastore = require('@google-cloud/datastore');
const datastore = Datastore();

module.exports = {
    todosPost,
    todosGet
};

// todo
/*
{
    id: 1,
    description: "Get milk",
    dueDate: "2017-10-30",
    type: "chore",
    isDone: false
}*/

function todosGet(req, res) {

    const query = datastore.createQuery('Todo');

    datastore.runQuery(query)
        .then((results) => {
            let tasks = results[0];

            tasks = tasks.map((task) => {
                const taskKey = task[datastore.KEY];
                console.log(taskKey.id, task);
                task.id = taskKey.id;
                return task;
            });
            res.json(tasks);
        })
        .catch((err) => {
            console.error('ERROR:', err);
            res.sendStatus(500);
        });
}

function todosPost(req, res) {
    const postData = req.swagger.params.todo.value;
    const taskKey = datastore.key('Todo');
    const entity = {
        key: taskKey,
        data: [
            {
                name: 'description',
                value: postData.description
            },
            {
                name: 'dueDate',
                value: new Date(postData.dueDate).toJSON()
            },
            {
                name: 'type',
                value: postData.type
            },
            {
                name: 'isDone',
                value: false
            }
        ]
    };

    datastore.save(entity)
        .then(() => {
            console.log(`Task ${taskKey.id} created successfully.`);
            res.sendStatus(201);
        })
        .catch((err) => {
            console.error('ERROR:', err);
            res.sendStatus(500);
        });
}