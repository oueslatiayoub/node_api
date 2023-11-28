const express = require('express');
const router = express.Router();

var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()


const Formation = require('../../models/formations');
const Quiz = require('../../models/quiz');
const Badges = require('../../models/badges');
const Participation = require('../../models/participation');
const Certifications = require('../../models/Certifications');
const Questions = require('../../models/questions');



//Routes
router.get('/formation' , (req,res)=>{
    res.send("Welcome to formation route");
})

router.get('/getAllformation' , (req,res , next)=>{
    Formation.find()
    .then(response=>{
        res.json(
            response
        )
    }).catch(error=>{
        res.json({
            message:'An error Occured!'
        })
    })
})


router.get('/getAllformationbyName', (req, res, next) => {
    const addedByValue = req.query.addedBy; 
    if (!addedByValue) {
        return res.status(400).json({ message: 'addedBy is required in the request query' });
    }

    const query = { addedBy: addedByValue };

    Formation.find(query)
        .then(response => {
            res.json(response);
        })
        .catch(error => {
            res.json({
                message: 'An error occurred!'
            });
        });
});




router.get('/getformation', jsonParser , (req,res,next)=>{
    let formationId = req.body.id
    Formation.findById(formationId)
    .then(response=>{
        res.json({
            response
        })
    }).catch(error=>{
        res.json({
            message:'An error Occured!'
        })
    })
})



router.post('/addFormation', jsonParser, async (req, res, next) => {
    console.log('Received request:', req.body);
    try {
        if (!req.body) {
            res.status(400).send({ message: 'Content cannot be empty' });
            return;
        }

        // Check if a formation with the same title already exists
        const existingFormation = await Formation.findOne({ title: req.body.title });
        if (existingFormation) {
            res.status(400).send({ message: 'Formation with the same title already exists' });
            return;
        }

        // If not, create a new Formation
        const formation = new Formation({
            title: req.body.title,
            description: req.body.description,
            level: req.body.level,
            category: req.body.category,
            formationUrl: req.body.formationUrl,
            imageUrl: req.body.imageUrl,
            addedBy: req.body.addedBy
        });

        await formation.save();

        res.status(200).send({ message: 'Formation added' });
    } catch (error) {
        res.status(500).send({ message: error.message || 'Some error occurred' });
    }
});


router.put('/updateFormation/:id', (req, res) => {
    const id = req.params.id;
  
    if (!req.body) {
      return res.status(400).send({ message: 'Data to update cannot be empty' });
    }
  
    Formation.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
      .then(data => {
        if (!data) {
          return res.status(404).send({ message: `Cannot update formation with ID ${id}. Maybe formation not found` });
        } else {
          res.json(data);
        }
      })
      .catch(err => {
        res.status(500).send({ message: 'Error updating formation information' });
      });
  });



router.delete('/deleteformation', jsonParser, (req, res, next) => {
    console.log(req.query); 

    const title = req.query.title;

    Formation.findOneAndDelete({ title: title })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot delete formation with title ${title}. Maybe title is wrong or the formation does not exist.` });
            } else {
                res.send({
                    message: "Formation deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Could not delete formation with title: " + title });
        });
});













//Quiz

router.get('/quiz' , (req,res)=>{
    res.send("Welcome to quiz route");
})

router.get('/getAllquizes' , (req,res , next)=>{
    Quiz.find()
    .then(response=>{
        res.json(
            response
        )
    }).catch(error=>{
        res.json({
            message:'An error Occured!'
        })
    })
})

router.get('/getquiz', jsonParser  , (req,res,next)=>{
    let id = req.body.id
    Quiz.findById(id)
    .then(response=>{
        res.json({
            response
        })
    }).catch(error=>{
        res.json({
            message:'An error Occured!'
        })
    })
})

router.post('/addquiz' , jsonParser , (req,res,next)=>{
    if(!req.body){
        res.status(400).send({message:'Content cannot be empty'});
        return
    }
    const quiz = new Quiz({
        title: req.body.title,
        description : req.body.description,
        nbr_questions: req.body.questions,
        time: req.body.time,
        formations_id : req.body.formation
    })

    quiz.save(quiz).catch(err=>{
        res.status(500).send({
            message: err.message || 'some error occured'
        })
        res.status(200).send({message:'quiz added'})
    })


})

router.put('/updatequiz' , jsonParser , (req,res,next)=>{
    
    if(!req.body){
        return res
        .status(400)
        .send({message : "Data to update cannot be empty"})
    }
    const id = req.body.id;
    Quiz.findByIdAndUpdate(id , req.body ,{useFindAndModify : false})
    .then(data=>{
        if(!data){
            res.status(400).send({message : `Cannot update quiz with ${id}. Maybe badge not found`})
        }else{
            res.send(data)
        }
    })
    .catch(err=>{
        res.status(500).send({message : "Error updating quiz information"})
    })
})

router.delete('/deletequiz', jsonParser , (req,res,next)=>{
    console.log(req.body)
    const id = req.body.id

    Quiz.findByIdAndDelete(id)
    .then(data=>{
        if(!data){
            res.status(404).send({ message: `Cannot Delete with id ${id}. Maybe id is wrong`})
        }else{
            res.send({
                message : "quiz deleted successfully!"
            })
        }
    })
    .catch(err=>{
        res.status(500).send({message : "Could not delete quiz with id: "+id})
    })
})


//Participations 


router.get('/participation' , (req,res)=>{
    res.send("Welcome to quiz route");
})

router.get('/getAllparticipations' , (req,res , next)=>{
    Participation.find()
    .then(response=>{
        res.json({
            response
        })
    }).catch(error=>{
        res.json({
            message:'An error Occured!'
        })
    })
})


router.get('/getparticipation', jsonParser, (req, res, next) => {
    const userId = req.query.userId;  
    const quizId = req.query.quizId;

    if (!userId || !quizId) {
        return res.status(400).json({ message: 'userId and quizId are required as query parameters' });
    }

    const query = { utilisateurId: userId, quizId: quizId };

    Participation.findOne(query)
        .then(response => {
            if (!response) {
                return res.status(404).json({ message: `Participation not found for userId ${userId} and quizId ${quizId}` });
            }
            res.json(response);
        })
        .catch(error => {
            res.status(500).json({ message: 'An error occurred!' });
        });
});







router.post('/addparticipation', jsonParser, (req, res, next) => {
    if (!req.body) {
        res.status(400).send({ message: 'Content cannot be empty' });
        return;
    }

    const participation = new Participation({
        utilisateurId: req.body.utilisateurId,
        quizName: req.body.quizName,
        quizId: req.body.quizId,
        score: req.body.score,
        passed: req.body.passed
    });

    participation.save()
        .then(() => {
            res.status(200).send({ message: 'Participation added' });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred'
            });
        });
});




router.put('/updateparticipation' , jsonParser , (req,res,next)=>{
    
    if(!req.body){
        return res
        .status(400)
        .send({message : "Data to update cannot be empty"})
    }
    const id = req.body.id;
    Participation.findByIdAndUpdate(id , req.body ,{useFindAndModify : false})
    .then(data=>{
        if(!data){
            res.status(400).send({message : `Cannot update participation with ${id}. Maybe participation not found`})
        }else{
            res.send(data)
        }
    })
    .catch(err=>{
        res.status(500).send({message : "Error updating participation information"})
    })
})

router.delete('/deleteparticipation', jsonParser , (req,res,next)=>{
    console.log(req.body)
    const id = req.body.id

    Participation.findByIdAndDelete(id)
    .then(data=>{
        if(!data){
            res.status(404).send({ message: `Cannot Delete with id ${id}. Maybe id is wrong`})
        }else{
            res.send({
                message : "participation deleted successfully!"
            })
        }
    })
    .catch(err=>{
        res.status(500).send({message : "Could not delete participation with id: "+id})
    })
})












//Questions
router.get('/questions' , (req,res)=>{
    res.send("Welcome to quiz questions");
})

router.get('/getAllquestions' , (req,res , next)=>{
    Questions.find()
    .then(response=>{
        res.json({
            response
        })
    }).catch(error=>{
        res.json({
            message:'An error Occured!'
        })
    })
})

router.get('/getquestion', jsonParser  , (req,res,next)=>{
    let id = req.body.id
    Questions.findById(id)
    .then(response=>{
        res.json({
            response
        })
    }).catch(error=>{
        res.json({
            message:'An error Occured!'
        })
    })
})

router.post('/addQuestion' , jsonParser , (req,res,next)=>{
    if(!req.body){
        res.status(400).send({message:'Content cannot be empty'});
        return
    }
    const question = new Questions({
        title: req.body.title,
        subject : req.body.subject,
        answers: req.body.answers,
        correctAnswer: req.body.correctAnswer
    })

    question.save(question).catch(err=>{
        res.status(500).send({
            message: err.message || 'some error occured'
        })
        res.status(200).send({message:'participation added'})
    })


})

router.put('/updatequestion' , jsonParser , (req,res,next)=>{
    
    if(!req.body){
        return res
        .status(400)
        .send({message : "Data to update cannot be empty"})
    }
    const id = req.body.id;
    Questions.findByIdAndUpdate(id , req.body ,{useFindAndModify : false})
    .then(data=>{
        if(!data){
            res.status(400).send({message : `Cannot update question with ${id}. Maybe question not found`})
        }else{
            res.send(data)
        }
    })
    .catch(err=>{
        res.status(500).send({message : "Error updating question information"})
    })
})

router.delete('/deletequestion', jsonParser , (req,res,next)=>{
    console.log(req.body)
    const id = req.body.id

    Questions.findByIdAndDelete(id)
    .then(data=>{
        if(!data){
            res.status(404).send({ message: `Cannot Delete with id ${id}. Maybe id is wrong`})
        }else{
            res.send({
                message : "question deleted successfully!"
            })
        }
    })
    .catch(err=>{
        res.status(500).send({message : "Could not delete question with id: "+id})
    })
})













// async function populateQuizData() {
//     // Clear existing data
//     // await Quiz.deleteMany({});

//     // Create placeholder quiz data
//     const placeholderQuizData = [
//         {
//             title: 'Quiz 1',
//             description: 'This is the first quiz',
//             nbr_questions: 3,
//             time: 10,
//             formation_id: 'formation_1',
//             questions: [
//                 {
//                     questionText: 'What is the capital of France?',
//                     answers: [
//                         { text: 'Paris', isCorrect: true },
//                         { text: 'Berlin', isCorrect: false },
//                         { text: 'London', isCorrect: false }
//                     ],
//                     correctAnswer:
//                     [{text: 'Paris' , isCorrect: true}]
//                 },
//                 {
//                     questionText: 'Chbech na3mlou fel android',
//                     answers: [
//                         { text: 'test', isCorrect: true },
//                         { text: 'Nfothoha', isCorrect: false },
//                         { text: 'Allahou a3lem', isCorrect: false }
//                     ],
//                     correctAnswer:
//                     [{text: 'test' , isCorrect: true}]
//                 },
                
//             ]
//         },
//         {
//             title: 'Quiz 2',
//             description: 'This is the second quiz',
//             nbr_questions: 2,
//             time: 5,
//             formation_id: 'formation_2',
//             questions: [
//                 {
//                     questionText: 'What is the largest planet in our solar system?',
//                     answers: [
//                         { text: 'Earth', isCorrect: false },
//                         { text: 'Jupiter', isCorrect: true },
//                         { text: 'Mars', isCorrect: false }
//                     ],
//                     correctAnswer:
//                     [{text: 'Jupiter' , isCorrect: true}]
//                 },
//                 // Add more questions as needed
//             ]
//         }
//         // Add more quizzes as needed
//     ];

//     // Insert the placeholder data into the database
//     await Quiz.insertMany(placeholderQuizData);

//     console.log('Quiz data populated successfully');
// }


async function populateQuizData() {
    await Quiz.deleteMany({});

    const placeholderQuizData = [
        {
            title: 'Node js',
            description: 'This is the first quiz',
            nbr_questions: 10, // Update the total number of questions
            time: 10,
            formation_id: 'formation_1',
            questions: [
                {
                    questionText: 'What is Node.js?',
                    answers: [
                        { text: 'A front-end framework', isCorrect: false },
                        { text: 'A back-end framework', isCorrect: false },
                        { text: 'A JavaScript runtime', isCorrect: true }
                    ],
                    correctAnswer: [{ text: 'A JavaScript runtime', isCorrect: true }]
                },
                {
                    questionText: 'What does npm stand for?',
                    answers: [
                        { text: 'Node Package Manager', isCorrect: true },
                        { text: 'Not Provided Much', isCorrect: false },
                        { text: 'New Programming Method', isCorrect: false }
                    ],
                    correctAnswer: [{ text: 'Node Package Manager', isCorrect: true }]
                },
                // Add more questions as needed
                {
                    questionText: 'Which event loop does Node.js use?',
                    answers: [
                        { text: 'Single-threaded event loop', isCorrect: true },
                        { text: 'Multi-threaded event loop', isCorrect: false },
                        { text: 'Dual-threaded event loop', isCorrect: false }
                    ],
                    correctAnswer: [{ text: 'Single-threaded event loop', isCorrect: true }]
                },
                {
                    questionText: 'What is the purpose of the `require` function in Node.js?',
                    answers: [
                        { text: 'To include external CSS files', isCorrect: false },
                        { text: 'To include external JavaScript files', isCorrect: false },
                        { text: 'To include external modules', isCorrect: true }
                    ],
                    correctAnswer: [{ text: 'To include external modules', isCorrect: true }]
                },
            ]
        },
        
    ];

    await Quiz.insertMany(placeholderQuizData);

    console.log('Quiz data populated successfully');
}

// populateQuizData();

module.exports = router;
