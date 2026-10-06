const bcrypt = require('bcryptjs');
const { getStore } = require('../config/db');
const { ROLES, BADGES } = require('../config/constants');

const seedData = async () => {
  const store = getStore();

  // Clear existing mock store
  store.users = [];
  store.contents = [];
  store.quizzes = [];
  store.quizAttempts = [];
  store.assignments = [];
  store.submissions = [];
  store.progresses = [];

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Seed Users
  const student = {
    id: 'usr_student_01',
    name: 'Aarav Sharma',
    email: 'student@learnsphere.ai',
    password: hashedPassword,
    role: ROLES.STUDENT,
    className: 'Class 7',
    createdAt: new Date().toISOString()
  };

  const teacher = {
    id: 'usr_teacher_01',
    name: 'Priya Verma (Science & Math Lead)',
    email: 'teacher@learnsphere.ai',
    password: hashedPassword,
    role: ROLES.TEACHER,
    subjects: ['Science', 'Mathematics'],
    createdAt: new Date().toISOString()
  };

  const parent = {
    id: 'usr_parent_01',
    name: 'Rajesh Sharma',
    email: 'parent@learnsphere.ai',
    password: hashedPassword,
    role: ROLES.PARENT,
    studentId: 'usr_student_01',
    createdAt: new Date().toISOString()
  };

  const admin = {
    id: 'usr_admin_01',
    name: 'System Administrator',
    email: 'admin@learnsphere.ai',
    password: hashedPassword,
    role: ROLES.ADMIN,
    createdAt: new Date().toISOString()
  };

  store.users.push(student, teacher, parent, admin);

  // 2. Seed Educational Content (Class 6 - 8)
  const chapters = [
    {
      id: 'ch_sci_c7_01',
      class: 'Class 7',
      subject: 'Science',
      chapterNumber: 1,
      title: 'Nutrition in Plants',
      description: 'Learn how plants make their own food through photosynthesis and autotrophic nutrition.',
      lessons: [
        {
          id: 'les_c7_s1_01',
          title: 'Modes of Nutrition & Autotrophs',
          videoUrl: 'https://www.youtube.com/embed/UPBMG5EYydo',
          summary: 'Living organisms require food for growth, energy, and repair. Plants are autotrophs as they synthesize food.',
          contentText: 'Nutrients are components of food necessary for our body. Green plants prepare their food using inorganic raw materials: Carbon dioxide, water, and minerals in the presence of sunlight and chlorophyll.'
        },
        {
          id: 'les_c7_s1_02',
          title: 'Photosynthesis & Stomata',
          videoUrl: 'https://www.youtube.com/embed/g78utcLQrJ4',
          summary: 'Leaves are the food factories of plants. Water and minerals are absorbed by roots and transported to leaves.',
          contentText: 'Carbon dioxide from air is taken in through tiny pores called stomata located on leaf surfaces. Guard cells control stomatal opening and closing.'
        }
      ]
    },
    {
      id: 'ch_sci_c7_02',
      class: 'Class 7',
      subject: 'Science',
      chapterNumber: 2,
      title: 'Nutrition in Animals',
      description: 'Explore the human digestive system, digestion steps, and nutrient absorption.',
      lessons: [
        {
          id: 'les_c7_s2_01',
          title: 'Human Digestive System',
          videoUrl: 'https://www.youtube.com/embed/zbQ1n1h4mS8',
          summary: 'Digestion involves ingestion, digestion, absorption, assimilation, and egestion.',
          contentText: 'The alimentary canal consists of the buccal cavity, oesophagus, stomach, small intestine, large intestine, and rectum.'
        }
      ]
    },
    {
      id: 'ch_math_c7_01',
      class: 'Class 7',
      subject: 'Mathematics',
      chapterNumber: 1,
      title: 'Integers',
      description: 'Master positive and negative integers, properties of addition, subtraction, and multiplication.',
      lessons: [
        {
          id: 'les_c7_m1_01',
          title: 'Properties of Addition & Subtraction of Integers',
          videoUrl: 'https://www.youtube.com/embed/5aLh7cM_Gbg',
          summary: 'Integers are closed under addition and subtraction. Closure, Commutative, and Associative properties apply.',
          contentText: 'Commutative property: a + b = b + a. Associative property: (a + b) + c = a + (b + c). Multiplicative identity for integers is 1.'
        }
      ]
    },
    {
      id: 'ch_sci_c6_01',
      class: 'Class 6',
      subject: 'Science',
      chapterNumber: 1,
      title: 'Components of Food',
      description: 'Discover carbohydrates, proteins, fats, vitamins, minerals, and balanced diet fundamentals.',
      lessons: [
        {
          id: 'les_c6_s1_01',
          title: 'What Do Different Nutrients Do For Our Body?',
          videoUrl: 'https://www.youtube.com/embed/28116b47x4g',
          summary: 'Carbohydrates and fats give energy. Proteins help in growth and body building.',
          contentText: 'Deficiency of nutrients can cause diseases. Iodine test is used to detect starch in food samples.'
        }
      ]
    },
    {
      id: 'ch_sci_c8_01',
      class: 'Class 8',
      subject: 'Science',
      chapterNumber: 1,
      title: 'Crop Production and Management',
      description: 'Study Kharif and Rabi crops, soil preparation, irrigation methods, and harvesting.',
      lessons: [
        {
          id: 'les_c8_s1_01',
          title: 'Agricultural Practices & Crop Classification',
          videoUrl: 'https://www.youtube.com/embed/0G6L3aQz2J0',
          summary: 'Crops sown in rainy season are Kharif crops. Crops grown in winter are Rabi crops.',
          contentText: 'Soil preparation is the first step. Ploughing turns and loosens the soil to allow deep root penetration and aeration.'
        }
      ]
    }
  ];

  store.contents = chapters;

  // 3. Seed Quizzes
  const quizzes = [
    {
      id: 'qz_sci_c7_01',
      chapterId: 'ch_sci_c7_01',
      title: 'Nutrition in Plants Mastery Quiz',
      subject: 'Science',
      className: 'Class 7',
      timeLimitMinutes: 10,
      passingScore: 70,
      questions: [
        {
          id: 'q1',
          type: 'mcq',
          questionText: 'Which pigment is responsible for capturing solar energy during photosynthesis?',
          options: ['Hemoglobin', 'Chlorophyll', 'Carotene', 'Xanthophyll'],
          correctAnswer: 1,
          explanation: 'Chlorophyll is the green pigment in plant leaves that absorbs sunlight for photosynthesis.'
        },
        {
          id: 'q2',
          type: 'true_false',
          questionText: 'Stomata are surrounded by guard cells that control their opening and closing.',
          options: ['True', 'False'],
          correctAnswer: 0,
          explanation: 'True. Guard cells regulate gas exchange and transpiration through stomata.'
        },
        {
          id: 'q3',
          type: 'mcq',
          questionText: 'What are the main raw materials required for photosynthesis?',
          options: ['Oxygen and Glucose', 'Carbon dioxide and Water', 'Nitrogen and Sunlight', 'Soil and Fertilizer'],
          correctAnswer: 1,
          explanation: 'Plants use Carbon dioxide from the air and Water from the soil to prepare food.'
        }
      ]
    },
    {
      id: 'qz_math_c7_01',
      chapterId: 'ch_math_c7_01',
      title: 'Integers Basics Quiz',
      subject: 'Mathematics',
      className: 'Class 7',
      timeLimitMinutes: 10,
      passingScore: 70,
      questions: [
        {
          id: 'mq1',
          type: 'mcq',
          questionText: 'What is the product of (-5) × (-4)?',
          options: ['-20', '20', '-9', '9'],
          correctAnswer: 1,
          explanation: 'The product of two negative integers is always a positive integer: (-5) × (-4) = 20.'
        },
        {
          id: 'mq2',
          type: 'mcq',
          questionText: 'Which integer is its own additive inverse?',
          options: ['1', '-1', '0', '100'],
          correctAnswer: 2,
          explanation: '0 + 0 = 0, so 0 is its own additive inverse.'
        }
      ]
    }
  ];

  store.quizzes = quizzes;

  // 4. Seed Assignments
  const assignments = [
    {
      id: 'asg_sci_c7_01',
      title: 'Photosynthesis Diagram & Explanation Activity',
      subject: 'Science',
      className: 'Class 7',
      chapterId: 'ch_sci_c7_01',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      maxMarks: 20,
      instructions: 'Draw a labelled diagram of Photosynthesis showing sunlight, carbon dioxide intake, water absorption, and oxygen release. Write a 5-line summary explaining the role of stomata.'
    }
  ];

  store.assignments = assignments;

  // 5. Seed Submissions
  const submissions = [
    {
      id: 'sub_01',
      assignmentId: 'asg_sci_c7_01',
      studentId: 'usr_student_01',
      studentName: 'Aarav Sharma',
      submissionText: 'I have drawn the photosynthesis diagram. Sunlight is absorbed by chlorophyll in leaves, water is taken from roots, and oxygen is released into atmosphere through stomata.',
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      marksGiven: 18,
      feedback: 'Excellent work Aarav! Clear diagram and accurate description of stomatal gas exchange.',
      status: 'Graded'
    }
  ];

  store.submissions = submissions;

  // 6. Seed Progress & Streaks
  const progress = {
    studentId: 'usr_student_01',
    xp: 350,
    streakDays: 4,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessons: ['les_c7_s1_01', 'les_c7_s1_02'],
    badges: ['first_step', 'quiz_whiz', 'streak_3'],
    quizHistory: [
      {
        quizId: 'qz_sci_c7_01',
        title: 'Nutrition in Plants Mastery Quiz',
        score: 100,
        xpEarned: 80,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  };

  store.progresses.push(progress);

  console.log('[Seed Service] Mock data successfully initialized for LearnSphere AI.');
  console.log('--------------------------------------------------');
  console.log('Sample Logins (Password for all: password123):');
  console.log('  Student: student@learnsphere.ai');
  console.log('  Teacher: teacher@learnsphere.ai');
  console.log('  Parent:  parent@learnsphere.ai');
  console.log('  Admin:   admin@learnsphere.ai');
  console.log('--------------------------------------------------');

  return true;
};

module.exports = { seedData };
